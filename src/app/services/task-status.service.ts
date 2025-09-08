import { effect, Injectable, signal, inject } from '@angular/core';
import { Status, TaskStatus } from '../models/task';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {
  private readonly localStorageKey = 'task-statuses';
  private readonly defaultStatuses: Status[] = TaskStatus;
  private taskService = inject(TaskService);

  statuses = signal<Status[]>([]);

  constructor() {
    this.loadStatuses();
    effect(() => this.saveStatuses());
  }

  private loadStatuses(): void {
    try {
      const storedStatuses = localStorage.getItem(this.localStorageKey);
      if (storedStatuses) {
        this.statuses.set(JSON.parse(storedStatuses));
      } else {
        this.statuses.set(this.defaultStatuses);
      }
    } catch (e) {
      console.error('Error loading task statuses from local storage', e);
      this.statuses.set(this.defaultStatuses);
    }
  }

  private saveStatuses(): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.statuses()));
    } catch (e) {
      console.error('Error saving task statuses to local storage', e);
    }
  }

  addStatus(status: Status): void {
    if (this.statuses().find(s => s.name === status.name)) {
      return;
    }
    this.statuses.update(statuses => [...statuses, status].sort((a, b) => a.order - b.order));
  }

  updateStatus(oldStatus: Status, newStatus: Status): void {
    this.statuses.update(statuses =>
      statuses.map(s => (s.id === oldStatus.id ? newStatus : s)).sort((a, b) => a.order - b.order)
    );
    this.taskService.updateTasksStatus(oldStatus.name as TaskStatus, newStatus.name as TaskStatus);
  }

  deleteStatus(statusToDelete: Status): void {
    this.statuses.update(statuses =>
      statuses.filter(s => s.id !== statusToDelete.id)
    );
  }
}
