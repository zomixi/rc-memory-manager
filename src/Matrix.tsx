import { useVirtualList } from 'ahooks';
import type { BasicTarget } from 'ahooks/lib/utils/domTarget';
import { Popover, Tag } from 'antd';
import { intersection } from 'lodash';
import type { Key } from 'react';
import React, { useEffect, useRef } from 'react';
import type { MemoryCell } from './types';

type MatrixProps = {
  originalList: MemoryCell[][];
  highlightLabels?: Key[];
  containerRef: BasicTarget<Element>;
  onCellClick: (cell: MemoryCell, index: number) => void;
};

const Matrix: React.FC<MatrixProps> = ({
  containerRef,
  originalList,
  highlightLabels = [],
  onCellClick = () => {
    // This is intentional
  },
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
        <div className="matrix-row" key={item.index}>
          {item.data?.map((cell) => {
            const shouldHighlightLabels = intersection(cell.labels || [], highlightLabels || []);

            return (
              <Popover
                key={cell.key}
                title={`当前位置：${(cell.key as number) + 1}`}
                content={
                  <div>
                    {cell.labels?.map((label) => (
                      <Tag key={label}>{label}</Tag>
                    ))}
                  </div>
                }
              >
                <div
                  onClick={() => onCellClick(cell, cell.key as number)}
                  className={`
                    cell
                    ${cell.status === 'DISABLED' ? 'disabled' : ''}
                    ${cell.status === 'FREE' ? 'free' : ''}
                    ${cell.status === 'USED' ? 'used' : ''}
                    ${shouldHighlightLabels.length > 0 ? 'highlight' : ''}
                  `}
                >
                  {shouldHighlightLabels.length > 0 ? shouldHighlightLabels[0] : cell.labels[0]}
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
