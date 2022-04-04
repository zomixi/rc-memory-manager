import type { Key } from 'react';

// 内存记录
export type MemoryRecord = {
  label?: Key; // 显示标签
  length?: number; // 内存长度（单位：bit）
  startBit?: number | null; // 起始位
  [key: string]: any; // 支持其他多余字段，方便用户保存数据
};

export type MemoryCellStatus = 'FREE' | 'USED';

// 内存单元
export type MemoryCell = {
  key: Key; // 唯一标识
  labels: Key[]; // 展示标签数组
  status: MemoryCellStatus; // 状态
};
