import { User } from './user';

export interface Status {
  id: number;
  name: string;
  order: number;
  color: string;
}

export const TaskStatus: Status[] = [
  { id: 1, name: 'TODO', order: 1, color: '#FF6B6B' },
  { id: 2, name: 'IN_PROGRESS', order: 2, color: '#FFD93D' },
  { id: 3, name: 'DONE', order: 3, color: '#6BCB77' }
];

export type TaskStatus = (typeof TaskStatus)[number]['name'];

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: User[];
}
