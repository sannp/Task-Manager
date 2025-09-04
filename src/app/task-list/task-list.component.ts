import { Component, OnInit, signal, WritableSignal, ViewChild, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '@models/task';
import { TaskService } from '@services/task.service';
import { TaskStatusService } from '@services/task-status.service';
import { ListTaskItemComponent } from '../list-task-item/list-task-item.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ListTaskItemComponent, ModalComponent, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  @ViewChild('taskModal') taskModal!: ModalComponent;

  private taskService = inject(TaskService);
  private taskStatusService = inject(TaskStatusService);

  statuses = this.taskStatusService.statuses;
  tasks: WritableSignal<Task[]> = signal([]);
  selectedTask: Task | undefined;
  showTaskForm = signal(false);
  currentFilterStatus: WritableSignal<TaskStatus | null> = signal(null);

  filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filter = this.currentFilterStatus();
    if (!filter) {
      return tasks;
    }
    return tasks.filter(task => task.status === filter);
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => this.tasks.set(tasks));
  }

  onStatusFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.currentFilterStatus.set(value === '' ? null : (value as TaskStatus));
  }

  openCreateTaskModal(): void {
    this.selectedTask = undefined;
    this.showTaskForm.set(true);
    this.taskModal.open();
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = { ...task };
    this.showTaskForm.set(true);
    this.taskModal.open();
  }

  onModalClose(): void {
    this.showTaskForm.set(false);
  }

  handleTaskFormSubmit(task: Task): void {
    const taskOperation$ = task.id
      ? this.taskService.updateTask(task)
      : this.taskService.addTask(task);

    taskOperation$.subscribe(() => {
      this.loadTasks();
      this.taskModal.close();
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }
}
