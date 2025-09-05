import { Component, input, Output, EventEmitter, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task';
import { TaskStatusService } from '../services/task-status.service';

@Component({
  selector: 'app-kanban-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban-card.component.html',
  styleUrl: './kanban-card.component.scss'
})
export class KanbanCardComponent {
  task = input.required<Task>();

  @Output()
  edit = new EventEmitter<void>();

  @Output()
  delete = new EventEmitter<void>();

  private taskStatusService = inject(TaskStatusService);

  status = computed(() => {
    return this.taskStatusService.statuses().find(s => s.name === this.task().status);
  });

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }
}
