import { useVirtualList } from 'ahooks';
import { Popover } from 'antd';
import 'antd/lib/popover/style';
import { intersection, noop } from 'lodash';
import type { Key, RefObject } from 'react';
import React, { useEffect, useRef } from 'react';
import Cell from './Cell';
import type { MemoryCell } from './types';

type MatrixProps = {
  originalList: MemoryCell[][];
  highlightLabels?: Key[];
  containerRef: RefObject<HTMLDivElement>;
  onCellClick: (cell: MemoryCell, index: number) => void;
};

const Matrix: React.FC<MatrixProps> = ({
  containerRef,
  originalList,
  highlightLabels = [],
  onCellClick = noop,
}) => {
  // 虚拟滚动支持
  const wrapperRef = useRef<any>(null);
  const [renderCells, scrollTo] = useVirtualList(originalList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 32,
  });

  useEffect(() => {
    // fix: https://github.com/alibaba/hooks/issues/1402
    scrollTo(0);
  }, [scrollTo]);

  return (
    <div className="matrix" ref={wrapperRef}>
      {renderCells.map((item) => (
        <div className="cell-row" key={item.index}>
          {item.data?.map((cell) => {
            const shouldHighlightLabels = intersection(cell.labels || [], highlightLabels || []);

            return (
              <Popover
                key={cell.key}
                title={`当前位置：${(cell.key as number) + 1}`}
                content={
                  cell.labels?.length > 0 ? (
                    <div>
                      {cell.labels?.map((label) => (
                        <Cell
                          key={label}
                          label={label}
                          status={cell.status}
                          highlight={highlightLabels?.includes(label)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="memory-manager-empty-description">暂无记录</div>
                  )
                }
              >
                <div>
                  <Cell
                    label={
                      shouldHighlightLabels.length > 0 ? shouldHighlightLabels[0] : cell.labels[0]
                    }
                    status={cell.status}
                    highlight={shouldHighlightLabels.length > 0}
                    onClick={() => onCellClick(cell, cell.key as number)}
                  />
                </div>
              </Popover>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Matrix;
