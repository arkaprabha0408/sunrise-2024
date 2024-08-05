import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';
import Task from '../model/Task';
import { initialTasks } from '../utils/TaskList';
import styles from './TaskList.module.css';

const { Option } = Select;

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/hello');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const completeTask = async (taskId: number) => {
    try {
      await axios.put('/api/hello', { id: taskId, completed: true });
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const createTask = async (values: { title: string; description: string; persona: string; group: number }) => {
    try {
      await axios.post('/api/hello', values);
      fetchTasks();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (values: { title: string; description: string; persona: string; group: number }) => {
    try {
      await axios.put('/api/hello', { id: currentTask?.id, ...values });
      fetchTasks();
      setIsUpdateModalVisible(false);
      setCurrentTask(null);
      updateForm.resetFields();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete('/api/hello', { data: { id: taskId } });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const isTaskEnabled = (task: Task) => {
    const previousGroupTasks = tasks.filter(t => t.group === task.group - 1);
    const previousGroupCompleted = previousGroupTasks.every(t => t.completed);
    return task.group === 1 || previousGroupCompleted;
  };

  const getInProgressTasks = () => {
    const inProgressTasks = tasks.filter(task => !task.completed && isTaskEnabled(task));
    const additionalTasks = tasks.filter(task => !task.completed && !isTaskEnabled(task));
    return [...inProgressTasks, ...additionalTasks].slice(0, 2);
  };

  const getToDoTasks = () => {
    const inProgressTasks = getInProgressTasks();
    const completedTasks = tasks.filter(task => task.completed);
    const nextTaskIndex = completedTasks.length + inProgressTasks.length;
    return tasks.filter(task => !task.completed && task.id > nextTaskIndex);
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed);
  };

  const toDoTasks = getToDoTasks();
  const inProgressTasks = getInProgressTasks();
  const completedTasks = getCompletedTasks();

  const toDoTasksColumns = [
    toDoTasks.slice(0, Math.ceil(toDoTasks.length / 2)),
    toDoTasks.slice(Math.ceil(toDoTasks.length / 2))
  ];

  const completedTasksColumns = [
    completedTasks.slice(0, Math.ceil(completedTasks.length / 2)),
    completedTasks.slice(Math.ceil(completedTasks.length / 2))
  ];

  const showUpdateModal = (task: Task) => {
    setCurrentTask(task);
    setIsUpdateModalVisible(true);
    updateForm.setFieldsValue(task);
  };

  return (
    <div>
      <Row gutter={16} className={styles.taskBoard}>
        <Col span={24} className={styles.createButtonCol}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>Create Task</Button>
        </Col>
        <Col span={8}>
          <Row gutter={16}>
            <Col span={24}>
              <h2 className={styles.title}>
                To-Do <span className={`${styles.taskCount} ${styles.toDoCount}`}>{toDoTasks.length}</span>
              </h2>
            </Col>
          </Row>
          <Row gutter={16}>
            {toDoTasksColumns.map((column, columnIndex) => (
              <Col span={12} key={columnIndex}>
                {column.map(task => (
                  <Card key={task.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.taskLabel}>Task {task.id}</span>
                      <Button
                        type="primary"
                        disabled
                        className={styles.doneButton}
                      >
                        Done
                      </Button>
                    </div>
                    <hr className={styles.cardDivider} />
                    <div className={styles.cardTitle}>{task.title}</div>
                    <div className={styles.cardDescription}>{task.description}</div>
                    <Button type="link" onClick={() => showUpdateModal(task)}>Update</Button>
                    <Button type="link" onClick={() => deleteTask(task.id)}>Delete</Button>
                  </Card>
                ))}
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={4}>
          <h2 className={styles.title}>
            In Progress <span className={`${styles.taskCount} ${styles.inProgressCount}`}>{inProgressTasks.length}</span>
          </h2>
          {inProgressTasks.map(task => (
            <Card key={task.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.taskLabel}>Task {task.id}</span>
                <Button
                  type="primary"
                  onClick={() => completeTask(task.id)}
                  disabled={!isTaskEnabled(task) || task.completed}
                  className={styles.doneButton}
                >
                  Done
                </Button>
              </div>
              <hr className={styles.cardDivider} />
              <div className={styles.cardTitle}>{task.title}</div>
              <div className={styles.cardDescription}>{task.description}</div>
              <Button type="link" onClick={() => showUpdateModal(task)}>Update</Button>
              <Button type="link" onClick={() => deleteTask(task.id)}>Delete</Button>
            </Card>
          ))}
        </Col>
        <Col span={8}>
          <Row gutter={16}>
            <Col span={24}>
              <h2 className={styles.title}>
                Completed <span className={`${styles.taskCount} ${styles.completedCount}`}>{completedTasks.length}</span>
              </h2>
            </Col>
          </Row>
          <Row gutter={16}>
            {completedTasksColumns.map((column, columnIndex) => (
              <Col span={12} key={columnIndex}>
                {column.map(task => (
                  <Card key={task.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.taskLabel}>Task {task.id}</span>
                    </div>
                    <hr className={styles.cardDivider} />
                    <div className={styles.cardTitle}>{task.title}</div>
                    <div className={styles.cardDescription}>{task.description}</div>
                  </Card>
                ))}
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Modal
        title="Create Task"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        ]}
      >
        <Form form={form} layout="vertical" onFinish={createTask}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title of the task!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description of the task!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="persona" label="Persona" rules={[{ required: true, message: 'Please select the persona!' }]}>
            <Select>
              <Option value="Intern">Intern</Option>
              <Option value="Junior">Junior</Option>
              <Option value="Senior">Senior</Option>
            </Select>
          </Form.Item>
          <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Please select the group!' }]}>
            <Select>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={4}>4</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Update Task"
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsUpdateModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => updateForm.submit()}>
            Update
          </Button>
        ]}
      >
        <Form form={updateForm} layout="vertical" onFinish={updateTask}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title of the task!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description of the task!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="persona" label="Persona" rules={[{ required: true, message: 'Please select the persona!' }]}>
            <Select>
              <Option value="Intern">Intern</Option>
              <Option value="Junior">Junior</Option>
              <Option value="Senior">Senior</Option>
            </Select>
          </Form.Item>
          <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Please select the group!' }]}>
            <Select>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={4}>4</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskList;

