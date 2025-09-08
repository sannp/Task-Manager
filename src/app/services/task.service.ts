import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task, TaskStatus } from '../models/task';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly localStorageKey = 'tasks';
  private userService = inject(UserService);

  private tasks: Task[] = [];
  private defaultTasks: Task[] = [];

  constructor() {
    this.userService.getUsers().subscribe(users => {
      this.defaultTasks = [
        { id: 1, title: 'Setup project structure', description: 'Create a new Angular project and set up the basic components and services.', status: 'DONE', assignedTo: [users[0]] },
        { id: 2, title: 'Create Task List View', description: 'Develop the component to display a list of tasks.', status: 'IN_PROGRESS', assignedTo: [users[1]] },
        { id: 3, title: 'Implement Task Creation', description: 'Add a form to create new tasks.', status: 'TODO', assignedTo: [users[0], users[2]] },
        { id: 4, title: 'Add Task Editing', description: 'Allow users to edit existing tasks.', status: 'TODO' },
        { id: 5, title: 'Implement Task Deletion', description: 'Allow users to delete tasks.', status: 'TODO' }
      ];
      this.loadTasks();
    });
  }

  private loadTasks(): void {
    try {
      const storedTasks = localStorage.getItem(this.localStorageKey);
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      } else {
        this.tasks = this.defaultTasks;
      }
    } catch (e) {
      console.error('Error loading tasks from local storage', e);
      this.tasks = this.defaultTasks;
    }
  }

  private saveTasks(): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
    } catch (e) {
      console.error('Error saving tasks to local storage', e);
    }
  }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return of(this.tasks.find(task => task.id === id));
  }

  addTask(task: Task): Observable<Task> {
    const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id || 0)) + 1 : 1;
    const newTask = { ...task, id: newId };
    this.tasks.push(newTask);
    this.saveTasks();
    return of(newTask);
  }

  updateTask(updatedTask: Task): Observable<Task | undefined> {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index > -1) {
      this.tasks[index] = updatedTask;
      this.saveTasks();
      return of(updatedTask);
    }
    return of(undefined);
  }

  deleteTask(id: number): Observable<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    return of(this.tasks.length < initialLength);
  }

  updateTaskStatus(task: Task, newStatus: TaskStatus): Observable<Task> {
    const taskToUpdate = this.tasks.find(t => t.id === task.id);
    if (taskToUpdate) {
      taskToUpdate.status = newStatus;
      this.saveTasks();
      return of({ ...taskToUpdate });
    }
    return of(task);
  }

  updateTasksStatus(oldStatus: TaskStatus, newStatus: TaskStatus): void {
    this.tasks.forEach(task => {
      if (task.status === oldStatus) {
        task.status = newStatus;
      }
    });
    this.saveTasks();
  }
}
