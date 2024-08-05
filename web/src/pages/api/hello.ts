import type { NextApiRequest, NextApiResponse } from "next";
import {
  initializeTasks,
  getActiveTasks,
  getCompletedTasks,
  getAllTasks,
  completeTask,
  createTask,
  updateTask,
  deleteTask
} from "@/modules/taskManager";

// Initialize tasks on server start
initializeTasks();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (req.query.status === 'completed') {
      res.status(200).json(getCompletedTasks());
    } else if (req.query.status === 'active') {
      res.status(200).json(getActiveTasks());
    } else {
      res.status(200).json(getAllTasks());
    }
  } else if (req.method === 'POST') {
    const { title, description, persona, group } = req.body;
    createTask(title, description, persona, group);
    res.status(201).json({ message: 'Task created' });
  } else if (req.method === 'PUT') {
    const { id, ...updatedTask } = req.body;
    updateTask(id, updatedTask);
    res.status(200).json({ message: 'Task updated' });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    deleteTask(id);
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
