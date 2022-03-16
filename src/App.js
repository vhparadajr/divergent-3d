import React from 'react';
import { Form, Button, Select, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './App.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const App = () => {
  const onFinish = (values) => {
    console.log(values)
    axios.post('https://divergent3d.getsandbox.com:443/warehouse', values)
    .then((response) => {
      console.log(response);
    })
    .catch((error) =>{
      console.log(error);
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const generateShelves = () => {
    let shelves = []
    for(let i=0; i<10; i++){
      shelves[i] = uuidv4();
    } 
    return shelves
  }

  let warehouseArray = new Array(12)
  for(let i=0; i<12; i++){
    warehouseArray[i] = {zone:i+1, key:i, shelves: generateShelves()};
  } 

  return (
    <div className='form-wrapper'>
      <Form
        name='warehouse_form'
        labelCol={{ span: 8, }}
        initialValues={{ remember: true, }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        layout='vertical'
      >
        <Form.Item
          label='New Warehouse Name'
          name='warehouse_name'
          rules={[
            {
              required: true,
              message: 'Please input warehouse name!',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label='Inventory'
          name='inventory'
          rules={[
            {
              required: true,
              message: 'Please select a inventory item!',
            },
          ]}
        >
          <Select 
            placeholder="Choose inventory to assign a location"
            allowClear
          >
            <Option value='fork_arm'>Fork Arm</Option>
            <Option value='actuator_valve'>Actuator Valve</Option>
            <Option value='solenoid'>Solenoid</Option>
            <Option value='conversion_kit'>Converstion Kit</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Zone'
          name='zone'
          rules={[
            {
              required: true,
              message: 'Please select zone!',
            },
          ]}
        >
          <Select>
            {warehouseArray.map((zone) => (
              <Option
              key={zone.key}
              value={zone.zone}
              >
                {zone.zone}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='Shelf'
          name='shelf'
          rules={[
            {
              required: true,
              message: 'Please select shelf',
            },
          ]}
        >
          <Select>
            {warehouseArray[0].shelves.map((shelf) => (
              <Option
              key={shelf}
              value={shelf.shelf}
            >
              {shelf.shelf}
            </Option>
            ))}
          </Select>
        </Form.Item>
        {/* TODO placeholder for add form.list */}
        <Form.Item>
          <Button
            type="dashed"
            style={{ width: '100%' }}
            icon={<PlusOutlined />}
          >
            Add Inventory
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;