import React from 'react';
import { message,Skeleton, List, Avatar  } from 'antd';
// import Skeleton from '@ant-design/pro-skeleton';
// import ProSkeleton from '@ant-design/pro-skeleton';
import ProForm, {
  ProFormText,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import {
    UserOutlined
  } from '@ant-design/icons';
export default () => {
  return ( <div
    style={{
      background: '#fafafa',
      padding: 24,
    }}
  > 
    <Skeleton active avatar paragraph={{rows:10}}>
    <ProForm
  onFinish={async () => {
    message.success('提交成功');
  }}    
  syncToUrl={(values, type) => {
    if (type === 'get') {
      // 为了配合 transform
      // startTime 和 endTime 拼成 createTimeRanger
      return {
        ...values,
        createTimeRanger:
          values.startTime || values.endTime ? [values.startTime, values.endTime] : undefined,
      };
    }
    // expirationTime 不同步到 url
    return {
      ...values,
      expirationTime: undefined,
    };
  }}
  initialValues={{
    name: '蚂蚁设计有限公司',
    useMode: 'chapter',
  }}
>
  <ProFormText
    width="md"
    name="name"
    label="签约客户名称"
    tooltip="最长为 24 位"
    placeholder="请输入名称"
  />
   <ProFormText
     width="md"
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'}
             />,
          }}
          placeholder={'用户名: admin or user'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
             <ProFormText
     width="md"
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'}
             />,
          }}
          placeholder={'密码: '}
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
            {
                pattern: /^1\d{10}$/,
                message: '密码格式错误！',
              },
          ]}
        />
  <ProFormDateRangePicker
    transform={(values) => {
      return {
        startTime: values ? values[0] : undefined,
        endTime: values ? values[1] : undefined,
      };
    }}
    width="md"
    name="createTimeRanger"
    label="合同生效时间"
  />

  <ProFormDatePicker width="md" name="expirationTime" label="合同失效时间" />
  <ProFormSelect
    options={[
      {
        value: 'chapter',
        label: '盖章后生效',
      },
    ]}
    width="sm"
    name="useMode"
    label="合同约定生效方式"
  />
</ProForm>

              </Skeleton>
 
  </div>
   
  );
};