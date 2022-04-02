# rc-memory-manager

内存管理器

### API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 内存大小（单位：byte） | `number` | `8` |
| disabled | 是否禁用 | `boolean` | `false` |
| multiplex | 是否多路复用（即内存是否可重叠） | `boolean` | `false` |
| locatingLabel | 定位标签 | `Key` | - |
| highlightLabels | 高亮标签 | `Key[]` | - |
| dataSource | 内存记录数据源 | [`MemoryRecord`](#memoryrecord)`[]` | - |
| onChange | 内存记录改变回调 | [`MemoryRecord`](#memoryrecord)`[] => void` | - |

### MemoryRecord

| 参数     | 说明                | 类型     | 默认值 |
| -------- | ------------------- | -------- | ------ |
| label    | 标识                | `Key`    | -      |
| startBit | 起始位              | `number` | -      |
| length   | 内存长度(单位：bit) | `number` | -      |
