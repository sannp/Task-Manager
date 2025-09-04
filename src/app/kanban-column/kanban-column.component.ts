import { Component, Input, computed, signal, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task';
import { KanbanCardComponent } from '../kanban-card/kanban-card.component';
import { SortablejsDirective } from '@worktile/ngx-sortablejs';
import { Options } from 'sortablejs';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [CommonModule, KanbanCardComponent, SortablejsDirective],
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss'
})
export class KanbanColumnComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) tasks = signal<Task[]>([]);
  @Input({ required: true }) sortableOptions!: Options;

  @Output()
  editTask = new EventEmitter<Task>();

  @Output()
  deleteTask = new EventEmitter<number>();

  // Generate a unique ID for sortablejs based on the title
  columnId = computed(() => this.title.toLowerCase().replace(/ /g, '-'));

  ngOnInit(): void {
    // Ensure sortableOptions are initialized with default values if not provided
    this.sortableOptions = {
      ...this.sortableOptions,
      ghostClass: 'kanban-ghost-card', // Explicitly set the ghost class
      onStart: (event: any) => {
        event.item.classList.add('kanban-drag-card');
      },
      onEnd: (event: any) => {
        event.item.classList.remove('kanban-drag-card');
      }
    };
  }

  onEditTask(task: Task): void {
    this.editTask.emit(task);
  }

  onDeleteTask(id: number): void {
    this.deleteTask.emit(id);
  }
}
