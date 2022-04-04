import classNames from 'classnames';
import { noop } from 'lodash';
import React, { Key } from 'react';
import type { MemoryCell, MemoryCellStatus } from './types';

type CellProps = {
  label: Key;
  status?: MemoryCellStatus;
  highlight?: boolean;
  onClick?: (cell: MemoryCell, index: number) => void;
};

const Cell: React.FC<CellProps> = ({
  label = '',
  status = 'FREE',
  highlight = false,
  onClick = noop,
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames('memory-manager-cell', {
        free: status === 'FREE',
        used: status === 'USED',
        highlight: highlight,
      })}
    >
      {label}
    </div>
  );
};

export default Cell;
