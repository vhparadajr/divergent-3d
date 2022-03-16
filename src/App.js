import React from 'react';
import { Form, Button, Select } from 'antd';
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
    <div className='form-body'>
      <Form
        name="basic"
        labelCol={{ span: 8, }}
        wrapperCol={{ span: 16, }}
        initialValues={{ remember: true, }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{width: '500px'}}
      >
        <Form.Item
          label="Zone"
          name="zone"
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
          label="Shelf"
          name="shelf"
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

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;