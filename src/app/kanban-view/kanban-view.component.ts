import { Component, WritableSignal, signal, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../models/task';
import { TaskService } from '../services/task.service';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';
import { Options } from 'sortablejs';
import { NModalComponent } from '../shared/components/n-modal/n-modal.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskStatusService } from '../services/task-status.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

interface KanbanColumn {
  title: string;
  tasks: WritableSignal<Task[]>;
}

@Component({
  selector: 'app-kanban-view',
  standalone: true,
  imports: [CommonModule, KanbanColumnComponent, NModalComponent, TaskFormComponent],
  templateUrl: './kanban-view.component.html',
  styleUrl: './kanban-view.component.scss'
})
export class KanbanViewComponent {
  @ViewChild('taskModal') taskModal!: NModalComponent;

  private taskService = inject(TaskService);
  private taskStatusService = inject(TaskStatusService);
  private userService = inject(UserService);

  columns: KanbanColumn[] = [];
  organizeBy = signal<'status' | 'user'>('status');

  sortableOptions: Options;
  selectedTask: Task | undefined;
  showTaskForm = signal(false);

  constructor() {
    effect(() => {
      this.buildColumns();
      this.loadTasks();
    });

    this.sortableOptions = {
      group: 'kanban',
      ghostClass: 'kanban-ghost-card',
      dragClass: 'kanban-drag-card',
      chosenClass: 'kanban-chosen-card',
      animation: 600,
      easing: 'ease-out',
      onEnd: (event: any) => {
        const { to, item } = event;
        const taskId = item.getAttribute('data-task-id');
        const toGroup = this.getGroupFromColumnId(to.id);

        if (taskId && toGroup) {
          this.taskService.getTaskById(Number(taskId)).subscribe(task => {
            if (task) {
              if (this.organizeBy() === 'status' && task.status !== toGroup) {
                this.taskService.updateTaskStatus(task, toGroup as TaskStatus).subscribe(() => {
                  this.loadTasks();
                });
              } else if (this.organizeBy() === 'user') {
                this.userService.getUsers().subscribe(users => {
                  const user = users.find(u => u.name === toGroup);
                  if (user) {
                    task.assignedTo = [user];
                    this.taskService.updateTask(task).subscribe(() => {
                      this.loadTasks();
                    });
                  }
                });
              }
            }
          });
        }
      },
    };
  }

  buildColumns(): void {
    if (this.organizeBy() === 'status') {
      const statuses = this.taskStatusService.statuses();
      this.columns = statuses.map(status => ({
        title: status.name,
        tasks: signal([])
      }));
    } else {
      this.userService.getUsers().subscribe(users => {
        this.columns = users.map(user => ({
          title: user.name,
          tasks: signal([])
        }));
      });
    }
  }

  loadTasks(): void {
    this.taskService.getTasks()
      .subscribe(tasks => {
        for (const column of this.columns) {
          if (this.organizeBy() === 'status') {
            column.tasks.set(tasks.filter(task => task.status === column.title));
          }
          else {
            column.tasks.set(tasks.filter(task => task.assignedTo?.some(user => user.name === column.title)));
          }
        }
      });
  }

  onOrganizeByChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.organizeBy.set(selectElement.value as 'status' | 'user');
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

  private getGroupFromColumnId(id: string): string | undefined {
    const column = this.columns.find(c => c.title.toLowerCase().replace(/ /g, '-') === id);
    return column ? column.title : undefined;
  }
}