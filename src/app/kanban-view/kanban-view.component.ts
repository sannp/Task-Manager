import { Component, WritableSignal, signal, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../models/task';
import { TaskService } from '../services/task.service';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';
import { Options } from 'sortablejs';
import { ModalComponent } from '../shared/modal/modal.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskStatusService } from '../services/task-status.service';

interface KanbanColumn {
  title: TaskStatus;
  tasks: WritableSignal<Task[]>;
}

@Component({
  selector: 'app-kanban-view',
  standalone: true,
  imports: [CommonModule, KanbanColumnComponent, ModalComponent, TaskFormComponent],
  templateUrl: './kanban-view.component.html',
  styleUrl: './kanban-view.component.scss'
})
export class KanbanViewComponent {
  @ViewChild('taskModal') taskModal!: ModalComponent;

  private taskService = inject(TaskService);
  private taskStatusService = inject(TaskStatusService);

  columns: KanbanColumn[] = [];

  sortableOptions: Options;
  selectedTask: Task | undefined;
  showTaskForm = signal(false);
  currentFilterStatus: WritableSignal<TaskStatus | null> = signal(null);

  constructor() {
    effect(() => {
      const statuses = this.taskStatusService.statuses();
      this.columns = statuses.map(status => ({
        title: status.name,
        tasks: signal([])
      }));
      this.loadTasks();
    });

    this.sortableOptions = {
      group: 'kanban',
      ghostClass: 'kanban-ghost-card',
      dragClass: 'kanban-drag-card',
      chosenClass: 'kanban-chosen-card',
      animation: 300,
      easing: 'ease-out',
      onStart: (event: any) => {
      },
      onEnd: (event: any) => {
        const { to, newIndex, from } = event;

        const toStatus = this.getStatusFromColumnId(to.id);
        const toColumn = this.columns.find(c => c.title === toStatus);

        if (toColumn && toStatus) {
          const movedTask = toColumn.tasks()[newIndex];

          if (movedTask && movedTask.status !== toStatus) {
            this.taskService.updateTaskStatus(movedTask, toStatus).subscribe(() => {
              this.loadTasks();
            });
          }
        }
      },
    };
  }

  loadTasks(): void {
    this.taskService.getTasks()
      .subscribe(tasks => {
        const filteredTasks = this.currentFilterStatus()
          ? tasks.filter(task => task.status === this.currentFilterStatus())
          : tasks;

        for (const column of this.columns) {
          column.tasks.set(filteredTasks.filter(task => task.status === column.title));
        }
      });
  }

  onStatusFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.currentFilterStatus.set(value === '' ? null : (value as TaskStatus));
    this.loadTasks();
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

  private getStatusFromColumnId(id: string): TaskStatus | undefined {
    const statuses = this.taskStatusService.statuses();
    const foundStatus = statuses.find(s => s.name.toLowerCase().replace(/ /g, '-') === id);
    return foundStatus ? foundStatus.name : undefined;
  }
}
