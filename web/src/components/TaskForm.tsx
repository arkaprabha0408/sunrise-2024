import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';

type TaskFormProps = {
  visible: boolean;
  onCreate: (values: { title: string; description: string }) => void;
  onCancel: () => void;
};

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCreate, onCancel }) => {
  const [form] = useForm();

  const handleCreate = () => {
    form.validateFields()
      .then(values => {
        form.resetFields();
        onCreate(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Create a new task"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleCreate}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title of the task!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description of the task!' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
