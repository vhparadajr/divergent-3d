import React from 'react';
import { Form, Button, Select, Input, Space, TreeSelect, Typography } from 'antd';
import './App.css';
import axios from 'axios';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Paragraph } = Typography
const { TreeNode } = TreeSelect;

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
  
  let shelvesArray = new Array(12)
  for(let i=0; i<12; i++){
    shelvesArray[i] = {
      label:`Shelf ${i+1}`, 
      value:`0-${i}`,
      key:`0-${i}`,
      children: [...Array(10)].map((_,index) => (
        {
          label: `Shelf ${i+1}-${index}`,
          value: `${i+1}-${index+1}`,
          key: `${i+1}-${index+1}`,
        }
      )),
    };
  } 

  let zonesArray = [...Array(12)].map((_,index) => (
    {
      zone: index+1,
      key: index+1
    }
  ))

  const isSelected = (formValues, shelf) => (
    !!formValues.find((zone) => zone?.shelves?.includes(shelf.key))
  )

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
          A warehouse has 12 zones with a maximum of 10 shelves per zone. Zones without shelves will be marked as empty.
        </Paragraph>
        <Form.List
          name="zones"
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((key, name, ...restField) => (
                <Space key={key} direction='vertical' style={{ width:'100%'}}>
                    <Form.Item shouldUpdate>
                      {(formInstance) => (
                        <div className='zone-remove-wrapper'>
                          <Form.Item
                            {...restField}
                            label='Zone'
                            name={[name, 'zone']}
                            rules={[{ required: true, message: 'Missing Zone' }]}
                            className='zone-styling'
                          >
                            <Select>
                              {zonesArray.map((zone) => {
                                const selected = !!formInstance.getFieldValue('zones')
                                  .find((selectedZone) => selectedZone?.zone === zone.zone)
                                
                                return (
                                  <Option 
                                    value={zone.zone} 
                                    key={zone.key}
                                    disabled={selected}
                                  >
                                    {zone.zone}
                                  </Option>
                                )}
                              )}
                            </Select> 
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </div>
                      )}
                    </Form.Item>
                  <Form.Item shouldUpdate>
                    {(formInstance) => (
                      <Form.Item
                        {...restField}
                        label='Shelves'
                        name={[name, 'shelves']}
                        rules={[
                          { 
                            required: true, 
                            message: 'Missing shelves',
                          }, 
                          {
                            validator: async (_, value) => {
                              if (value?.length > 10) {
                                return Promise.reject(new Error('Cant add more than 10 shelves per zone'));
                              }
                            },
                          }
                        ]}
                      >
                        <TreeSelect
                          showSearch={false}
                          style={{ width: '100%', paddingRight:'31px' }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="Please select the shelves associated with this zone"
                          allowClear
                          multiple
                        >
                          {shelvesArray.map((parentShelf) => {
                            const formValues = formInstance.getFieldValue('zones')

                            return (
                              <TreeNode value={parentShelf.value} title={parentShelf.label} disabled={isSelected(formValues, parentShelf)}>
                                {parentShelf.children.map((childShelf) => (
                                    <TreeNode value={childShelf.value} title={childShelf.label} disabled={isSelected(formValues, childShelf)}/>
                                  )
                                )}
                              </TreeNode>
                            )
                          })}
                        </TreeSelect>
                      </Form.Item>
                    )}
                  </Form.Item>
                </Space>
              ))}
              <Form.Item style={{paddingTop: '30px'}}>
                {/* TODO disable button if all 12 zones have been selected */}
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
          <Button 
            type='primary' 
            htmlType='submit' 
            style={{ width: '100%' }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;




