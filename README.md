# rc-memory-manager

## 📦 Install

```bash
npm install rc-memory-manager
```

```bash
yarn add rc-memory-manager
```

## 🔨 Usage

```js
import MemoryManager from 'rc-memory-manager';
import 'rc-memory-manager/style.less';

const dataSource = [
  { label: 1, startBit: 0, length: 2 },
  { label: 2, startBit: 8, length: 8 },
];

React.render(<MemoryManager dataSource={dataSource} />, mountNode);
```

### API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| size | memory size (unit: byte) | `number` | `8` |
| disabled | disabled | `boolean` | `false` |
| multiplex | multiplex | `boolean` | `false` |
| locatingLabel | the label is locating | `Key` | - |
| highlightLabels | which labels is highlight | `Key[]` | - |
| dataSource | dataSource | [`MemoryRecord`](#MemoryRecord)`[]` | - |
| onChange | onChange | [`MemoryRecord`](#MemoryRecord)`[] => void` | - |

### MemoryRecord

| Property | Description        | Type     | Default |
| -------- | ------------------ | -------- | ------- |
| label    | label              | `Key`    | -       |
| startBit | start bit          | `number` | -       |
| length   | length (unit: bit) | `number` | -       |
