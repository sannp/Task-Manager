import { Component, OnInit, signal, WritableSignal, ViewChild, inject, ChangeDetectionStrategy, computed, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '@models/task';
import { TaskService } from '@services/task.service';
import { TaskStatusService } from '@services/task-status.service';
import { NModalComponent } from '../shared/components/n-modal/n-modal.component';
import { User } from '@models/user';
import { ListTableComponent } from '../shared/components/list-table/list-table.component';
import { NTableColumn } from '../shared/components/n-table/n-table.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, NModalComponent, ListTableComponent, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  @ViewChild('taskModal') taskModal!: NModalComponent;
  @ViewChild('assignedToTemplate') assignedToTemplate!: TemplateRef<any>;

  private taskService = inject(TaskService);
  private taskStatusService = inject(TaskStatusService);

  statuses = this.taskStatusService.statuses;
  tasks: WritableSignal<Task[]> = signal([]);
  selectedTask: Task | undefined;
  currentFormMode = signal<'add' | 'edit' | 'view'>('add');

  taskColumns: NTableColumn[] = [
    { key: 'title', header: 'Title', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'assignedTo', header: 'Assigned To', sortable: false, template: undefined },
  ];

  filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filter = this.currentFilterStatus();
    if (!filter) {
      return tasks;
    }
    return tasks.filter(task => task.status === filter);
  });

  currentFilterStatus: WritableSignal<TaskStatus | null> = signal(null);

  ngOnInit(): void {
    this.loadTasks();
    const assignedToColumn = this.taskColumns.find(col => col.key === 'assignedTo');
    if (assignedToColumn) {
      assignedToColumn.template = this.assignedToTemplate;
    }
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
    this.currentFormMode.set('add');
    this.taskModal.open();
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = { ...task };
    this.currentFormMode.set('edit');
    this.taskModal.open();
  }

  onViewTask(task: Task): void {
    this.selectedTask = { ...task };
    this.currentFormMode.set('view');
    this.taskModal.open();
  }

  onModalClose(): void {
    // No need to set showTaskForm to false, as the modal handles content visibility
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

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id!).subscribe(() => this.loadTasks());
  }

  getAssignedUsersNames(assignedTo: User[] | undefined): string {
    return (assignedTo || []).filter((u): u is User => !!u).map(u => u.name).join(', ');
  }
}
