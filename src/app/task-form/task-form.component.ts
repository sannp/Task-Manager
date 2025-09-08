import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject, input, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../models/task';
import { TaskStatusService } from '../services/task-status.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

import { NInputComponent } from '../shared/components/n-input/n-input.component';
import { NSelectComponent } from '../shared/components/n-select/n-select.component';
import { NButtonComponent } from '../shared/components/n-button/n-button.component'; // Import NButtonComponent

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NInputComponent, NSelectComponent, NButtonComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskStatusService = inject(TaskStatusService);
  private userService = inject(UserService);

  task = input<Task | undefined>();
  isViewMode = input<boolean>(false); // New input for view mode
  statuses = this.taskStatusService.statuses;
  users$!: Observable<User[]>;

  @Output()
  submitForm = new EventEmitter<Task>();

  @Output()
  cancel = new EventEmitter<void>(); // New cancel output

  taskForm = this.fb.group({
    id: [null],
    title: ['', Validators.required],
    description: ['', Validators.required],
    status: ['', Validators.required],
    assignedTo: [[]]
  });

  constructor() {
    effect(() => {
      if (this.task()) {
        this.taskForm.patchValue(this.task() as any);
      } else {
        const defaultStatus = this.statuses()[0]?.name || '';
        this.taskForm.reset({ status: defaultStatus });
      }

      if (this.isViewMode()) {
        this.taskForm.disable();
      } else {
        this.taskForm.enable();
      }
    });
  }

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.submitForm.emit(this.taskForm.value as Task);
    }
  }

  }