import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task';
import { TaskStatusService } from '../services/task-status.service';

@Component({
  selector: 'app-list-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-task-item.component.html',
  styleUrl: './list-task-item.component.scss',
})
export class ListTaskItemComponent {
  task = input.required<Task>();
  editTask = output<Task>();
  deleteTask = output<number>();

  private taskStatusService = inject(TaskStatusService);

  status = computed(() => {
    return this.taskStatusService.statuses().find(s => s.name === this.task().status);
  });

  onEdit(): void {
    this.editTask.emit(this.task());
  }

  onDelete(): void {
    if (this.task().id) {
      this.deleteTask.emit(this.task().id!);
    }
  }
}
