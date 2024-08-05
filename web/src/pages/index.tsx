import React from 'react';
import TaskList from '../components/TaskList';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.main}>
      <TaskList />
    </div>
  );
};

export default Home;
