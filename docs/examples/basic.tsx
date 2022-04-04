import { AimOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Button, Card, Col, InputNumber, Row, Select, Space, Switch, Table } from 'antd';
import 'antd/dist/antd.css';
import type { MemoryRecord } from 'rc-memory-manager';
import MemoryManager from 'rc-memory-manager';
import 'rc-memory-manager/style.less';
import type { Key } from 'react';
import React, { useEffect, useState } from 'react';

export default (): React.ReactNode => {
  const [locatingLabel, setLocatingLabel] = useState<Key>();
  const [highlightLabels, setHighlightLabels] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<MemoryRecord[]>([]);
  const [size, setSize] = useState(64);
  const [multiplex, setMultiplex] = useState(false);

  useEffect(() => {
    setDataSource([
      { label: 1, startBit: 0, length: 2 },
      { label: 2, startBit: 8, length: 8 },
    ]);
  }, []);

  const columns: TableColumnsType<MemoryRecord> = [
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Length',
      dataIndex: 'length',
      key: 'length',
      width: 120,
      render: (value, record) => (
        <Select
          style={{ width: '100%' }}
          value={value}
          options={[
            { label: '2', value: 2 },
            { label: '4', value: 4 },
            { label: '8', value: 8 },
            { label: '16', value: 16 },
            { label: '24', value: 24 },
            { label: '32', value: 32 },
            { label: '40', value: 40 },
          ]}
          onChange={(length) => {
            record.length = length;
            setDataSource([...dataSource]);
          }}
        />
      ),
    },
    {
      title: 'StartBit',
      dataIndex: 'startBit',
      key: 'startBit',
      render: (value) => value,
    },
    {
      key: 'operation',
      width: 80,
      render: (value, record) => (
        <Space>
          <EnvironmentOutlined
            style={{
              color: locatingLabel === record.label ? 'red' : undefined,
            }}
            onClick={() => setLocatingLabel(record.label)}
          />
          <AimOutlined
            style={{
              color: highlightLabels.includes(record.label!) ? 'red' : undefined,
            }}
            onClick={() => setHighlightLabels([record.label!])}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" size={24}>
        <div>
          <Space>
            Size:
            <InputNumber style={{ width: 120 }} defaultValue={64} onChange={setSize} />
            Multiplex:
            <Switch checked={multiplex} onChange={setMultiplex} />
            <Button onClick={() => setDataSource([])} type="primary">
              清除记录
            </Button>
          </Space>
        </div>

        <Row gutter={24}>
          <Col>
            <Table
              rowKey="label"
              size="small"
              pagination={false}
              style={{ width: 400 }}
              scroll={{ y: 300 }}
              columns={columns}
              dataSource={dataSource}
            />
            <Button
              type="dashed"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() =>
                setDataSource([
                  ...dataSource,
                  {
                    label: dataSource.length + 1,
                    length: 8,
                  },
                ])
              }
            >
              添加
            </Button>
          </Col>

          <Col>
            <MemoryManager
              size={size}
              multiplex={multiplex}
              locatingLabel={locatingLabel}
              highlightLabels={highlightLabels}
              dataSource={dataSource}
              onChange={setDataSource}
            />
          </Col>
        </Row>

        <Card title="dataSource">
          <pre>{JSON.stringify(dataSource, null, ' ')}</pre>
        </Card>
      </Space>
    </div>
  );
};
