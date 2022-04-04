import { chunk, isNil, noop } from 'lodash';
import React, { Key, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Matrix from './Matrix';
import { MemoryCell, MemoryRecord } from './types';

type MemoryManagerProps = {
  size?: number; // 存储大小（单位：byte）
  disabled?: boolean; // 是否禁用
  multiplex?: boolean; // 是否多路复用
  locatingLabel?: Key; // 当前进行定位的标签
  highlightLabels?: Key[]; // 需要高亮的标签数值
  dataSource?: MemoryRecord[]; // 内存记录数据源
  onChange?: (records: MemoryRecord[]) => void; // 内存记录改变回调
};

const MemoryManager: React.FC<MemoryManagerProps> = ({
  size = 8,
  disabled = false,
  multiplex = false,
  locatingLabel = null,
  highlightLabels = [],
  dataSource = [],
  onChange = noop,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messageTextTimerRef = useRef<any>(null);
  const [messageText, setMessageText] = useState(''); // 错误信息

  const locatingRecord = useMemo(() => {
    return dataSource.find((record) => record.label === locatingLabel);
  }, [dataSource, locatingLabel]);

  /**
   * 生成内存单元组
   */
  const memoryCells = useMemo(() => {
    // 根据size生成所有内存单元
    const newMemoryCells: MemoryCell[] = Array.from({ length: size * 8 }).map((item, index) => ({
      key: index,
      status: 'FREE',
      labels: [],
    }));

    // 记录当前dataSource是否不合法
    let dirty = false;

    // 根据dataSource渲染已选内存单元
    dataSource?.forEach((record) => {
      if (isNil(record.startBit) || isNil(record.length) || isNil(record.label)) {
        return;
      }

      // 数据切片
      const cells = newMemoryCells.slice(record.startBit!, record.startBit! + record.length!);

      // startBit是否合法
      const startBitInvalid =
        record.startBit! + record.length! > size * 8 ||
        (!multiplex && cells.some((cell) => cell.status !== 'FREE'));

      if (startBitInvalid) {
        record.startBit = null;
        dirty = true;

        return;
      }

      cells.forEach((cell) => {
        cell.status = 'USED';
        cell.labels.unshift(record.label!);
      });
    });

    if (dirty) {
      onChange?.([...dataSource]);
    }

    return newMemoryCells;
  }, [size, dataSource, multiplex, onChange]);

  const renderAxises = (axisNumbers: number[]) => {
    return axisNumbers.map((axis) => (
      <div key={axis} className="axis">
        {axis}
      </div>
    ));
  };

  /**
   * 字节坐标
   */
  const ByteAxis = useMemo(() => {
    const axisNumbers = Array.from({ length: size }).map((item, index) => index + 1);

    return <div className="byte-axis">{renderAxises(axisNumbers)}</div>;
  }, []);

  /**
   * 位坐标
   */
  const BitAxis = useMemo(() => {
    const axisNumbers = [8, 7, 6, 5, 4, 3, 2, 1];

    return <div className="bit-axis">{renderAxises(axisNumbers)}</div>;
  }, []);

  /**
   * 空闲统计
   */
  const freeTotal = useMemo(() => {
    let total = 0;

    memoryCells.forEach((cell) => {
      total += cell.status === 'FREE' ? 1 : 0;
    });

    return total;
  }, [memoryCells]);

  /**
   * 已用统计
   */
  const usedTotal = useMemo(() => {
    let total = 0;

    memoryCells.forEach((cell) => {
      total += cell.status === 'USED' ? 1 : 0;
    });

    return total;
  }, [memoryCells]);

  /**
   * 当前渲染的内存单元结构转为二维数组，根据8个单元一行（div）配合实现虚拟滚动。
   */
  const originalList = useMemo(() => {
    return chunk(memoryCells, 8);
  }, [memoryCells]);

  /**
   * 显示错误信息
   */
  const toast = useCallback((text) => {
    clearTimeout(messageTextTimerRef.current);
    setMessageText(text);

    messageTextTimerRef.current = setTimeout(() => setMessageText(''), 2000);
  }, []);

  /**
   * 内存单元点击回调
   * @param targetCell 被点击的内存单元
   * @param targetIndex 点击的下标
   * @returns
   */
  const onCellClick = useCallback(
    (targetCell: MemoryCell, targetIndex: number) => {
      if (disabled) {
        return;
      }

      setMessageText('');

      if (!locatingRecord) {
        toast('请先选择需要定位的记录');
        return;
      }

      if (targetCell.status !== 'FREE' && !multiplex) {
        toast('请选择空闲的内存空间');
        return;
      }

      if (isNil(locatingRecord.label) || !locatingRecord.length) {
        toast('定位记录的格式有误');
        return;
      }

      if (targetIndex + locatingRecord.length > size * 8) {
        toast('连续内存不够，请重新选择');
        return;
      }

      if (!multiplex) {
        // 将要被覆盖的区域
        const cells = memoryCells.slice(targetIndex, targetIndex + locatingRecord.length);

        if (cells.some((cell) => cell.status !== 'FREE')) {
          toast('连续内存不够，请重新选择');
          return;
        }
      }

      locatingRecord.startBit = targetIndex;

      onChange?.([...dataSource]);
    },
    [dataSource, disabled, locatingRecord, memoryCells, multiplex, onChange, size, toast],
  );

  /**
   * 销毁延时任务
   */
  useEffect(() => {
    return () => clearTimeout(messageTextTimerRef.current);
  }, []);

  return (
    <div className="memory-manager">
      <div className="header">
        <div className="legends">
          <div className="legend free">空闲 {freeTotal}</div>
          <div className="legend used">已选 {usedTotal}</div>
        </div>
      </div>

      <div className="content">
        <div className="row">
          {/* 对角 */}
          <div className="corner">
            <div className="byte-label">字节</div>
            <div className="bit-label">位</div>
          </div>

          {/* 位坐标 */}
          {BitAxis}
        </div>

        <div className="coordinate" ref={containerRef}>
          {/* 字节坐标 */}
          {ByteAxis}

          {/* 矩阵 */}
          <Matrix
            originalList={originalList}
            onCellClick={onCellClick}
            highlightLabels={highlightLabels}
            containerRef={containerRef}
          />
        </div>
      </div>

      {/* toast */}
      {messageText && <div className="toast">{messageText}</div>}
    </div>
  );
};

export default MemoryManager;
