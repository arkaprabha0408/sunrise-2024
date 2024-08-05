import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [...initialTasks];

export function initializeTasks() {
  tasks = [...initialTasks];
}

export function getActiveTasks(): Task[] {
  const activeGroup = getActiveGroup();
  return tasks.filter(task => task.group <= activeGroup && !task.completed);
}

export function getCompletedTasks(): Task[] {
  return tasks.filter(task => task.completed);
}

export function getAllTasks(): Task[] {
  return tasks;
}

export function completeTask(taskTitle: string): void {
  const task = tasks.find(t => t.title === taskTitle);
  if (task) {
    task.completed = true;
  }
}

export function createTask(title: string, description: string, persona: string, group: number): void {
  const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = new Task(id, title, description, persona, group);
  tasks.push(newTask);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex > -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
  }
}

export function deleteTask(taskId: number): void {
  tasks = tasks.filter(t => t.id !== taskId);
}

function getActiveGroup(): number {
  for (let group = 1; group <= 4; group++) {
    const groupTasks = tasks.filter(task => task.group === group);
    if (!groupTasks.every(task => task.completed)) {
      return group;
    }
  }
  return 5;
}
