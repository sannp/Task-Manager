import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task, TaskStatus } from '@models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Setup project structure', description: 'Create a new Angular project and set up the basic components and services.', status: 'Done' },
    { id: 2, title: 'Create Task List View', description: 'Develop the component to display a list of tasks.', status: 'In Progress' },
    { id: 3, title: 'Implement Task Creation', description: 'Add a form to create new tasks.', status: 'To Do' },
    { id: 4, title: 'Add Task Editing', description: 'Allow users to edit existing tasks.', status: 'To Do' },
    { id: 5, title: 'Implement Task Deletion', description: 'Allow users to delete tasks.', status: 'To Do' }
  ];

  constructor() { }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  updateTaskStatus(task: Task, newStatus: TaskStatus): void {
    const taskToUpdate = this.tasks.find(t => t.id === task.id);
    if (taskToUpdate) {
      taskToUpdate.status = newStatus;
    }
  }
}

