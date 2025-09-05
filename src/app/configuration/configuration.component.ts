import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TaskStatusService } from '../services/task-status.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Status } from '../models/task';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigurationComponent {
  private taskStatusService = inject(TaskStatusService);
  private fb = inject(FormBuilder);

  statuses = this.taskStatusService.statuses;

  editingStatus = signal<Status | null>(null);
  editedStatusName = signal('');
  editedStatusOrder = signal(0);
  editedStatusColor = signal('#000000');

  addStatusForm = this.fb.group({
    name: ['', Validators.required],
    order: [0, Validators.required],
    color: ['#000000'],
  });

  addStatus(): void {
    if (this.addStatusForm.invalid) {
      return;
    }
    const { name, order, color } = this.addStatusForm.value;
    const newId = Math.max(...this.statuses().map(s => s.id), 0) + 1;
    this.taskStatusService.addStatus({ id: newId, name: name!.trim(), order: order!, color: color! });
    this.addStatusForm.reset({ name: '', order: 0, color: '#000000' });
  }

  deleteStatus(status: Status): void {
    this.taskStatusService.deleteStatus(status);
  }

  startEditing(status: Status): void {
    this.editingStatus.set(status);
    this.editedStatusName.set(status.name);
    this.editedStatusOrder.set(status.order);
    this.editedStatusColor.set(status.color);
  }

  updateStatus(): void {
    const editing = this.editingStatus();
    if (editing && this.editedStatusName().trim()) {
      this.taskStatusService.updateStatus(editing, {
        id: editing.id,
        name: this.editedStatusName().trim(),
        order: this.editedStatusOrder(),
        color: this.editedStatusColor()
      });
      this.cancelEditing();
    }
  }

  cancelEditing(): void {
    this.editingStatus.set(null);
    this.editedStatusName.set('');
    this.editedStatusOrder.set(0);
    this.editedStatusColor.set('#000000');
  }
}
