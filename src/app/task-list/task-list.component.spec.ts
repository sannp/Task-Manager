import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TaskListComponent } from './task-list.component';
import { TaskService } from '@services/task.service';
import { Task } from '@models/task';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    // Create a mock TaskService that returns an empty array of tasks
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks']);
    mockTaskService.getTasks.and.returnValue(of([] as Task[]));

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});