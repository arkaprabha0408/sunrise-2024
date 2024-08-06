import React, { ReactNode } from 'react';
import { Layout as AntLayout } from 'antd';
import Typography from '@mui/material/Typography';
import styles from './layout.module.css';

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Task Board
        </Typography>
      </Header>
      <Content className={styles.content}>
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;



