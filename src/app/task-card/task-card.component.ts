import { Component, ElementRef, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@models/task';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  task = input.required<Task>();

  constructor(private el: ElementRef) {
    effect(() => {
      this.el.nativeElement.task = this.task();
    });
  }
}
