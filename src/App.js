import React, {useState} from 'react';
import { Form, Button, Select, Input, Space, TreeSelect, Typography } from 'antd';
import './App.css';
import axios from 'axios';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Paragraph } = Typography

const App = () => {
  const [value, setValue] = useState(undefined)
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
  
  let shelvesArray = new Array(12)
  for(let i=0; i<12; i++){
    shelvesArray[i] = {
      label:`Shelf ${i+1}`, 
      value:`0-${i}`,
      key:`0-${i}`,
      children: [...Array(10)].map((_,index) => (
        {
          label: `Shelf ${i}-${index}`,
          value: `${i+1}-${index+1}`,
          key: `${i+1}-${index+1}`
        }
      )),
    };
  } 

  let zonesArray = [...Array(9)].map((_,index) => (
    {
      zone: index+1,
      key: index+1
    }
  ))

  console.log('zones', zonesArray)
  console.log('shelves', shelvesArray)

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
        <Paragraph italic>
          A warehouse can only have 12 zones with a maximum of 10 shelves per zone
        </Paragraph>
        <Form.List
          name="zones"
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((key, name, ...restField) => (
                <Space key={key} direction='vertical' style={{ width:'100%'}}>
                  <div className='zone-remove-wrapper'>
                    {/* <Form.Item shouldUpdate>
                    {(formInstance) => ( */}
                      <Form.Item
                        {...restField}
                        label='Zone'
                        name={[name, 'zone']}
                        rules={[{ required: true, message: 'Missing Zone' }]}
                        className='zone-styling'
                      >
                        <Select>
                          {zonesArray.map((zone) => (
                            <Option 
                              value={zone.zone} 
                              key={zone.key}
                              // disabled={formInstance.getFieldValue('zones').includes(zone.zone)}
                            >
                              {zone.zone}
                            </Option>
                            ))}
                        </Select> 
                      </Form.Item>
                    {/* )}
                    </Form.Item> */}
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                  <Form.Item
                    {...restField}
                    label='Shelves'
                    name={[name, 'shelves']}
                    rules={[{ required: true, message: 'Missing number of Shevles'}]}
                  >
                    <TreeSelect
                      treeData={shelvesArray}
                      showSearch
                      style={{ width: '100%', paddingRight:'31px' }}
                      value={value}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="Please select"
                      allowClear
                      multiple
                      onChange={setValue(value)}
                    />
                  </Form.Item>
                </Space>
              ))}
              <Form.Item style={{paddingTop: '30px'}}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%' }}
                  icon={<PlusOutlined />}
                >
                  Add Zone
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
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




