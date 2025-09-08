import { TestBed } from '@angular/core/testing';
import { TaskStatusService } from './task-status.service';
import { TaskStatus } from '../models/task';

describe('TaskStatusService', () => {
  let service: TaskStatusService;
  const localStorageKey = 'task-statuses';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStatusService);
    localStorage.removeItem(localStorageKey);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load default statuses if none are in local storage', () => {
    expect(service.statuses()).toEqual(['TODO', 'IN_PROGRESS', 'DONE']);
  });

  it('should add a new status', () => {
    service.addStatus('NEW' as TaskStatus);
    expect(service.statuses()).toContain('NEW');
  });

  it('should not add a duplicate status', () => {
    service.addStatus('TODO');
    expect(service.statuses().filter(s => s === 'TODO').length).toBe(1);
  });

  it('should update a status', () => {
    service.updateStatus('TODO', 'UPDATED' as TaskStatus);
    expect(service.statuses()).not.toContain('TODO');
    expect(service.statuses()).toContain('UPDATED');
  });

  it('should not update to a duplicate status', () => {
    service.updateStatus('TODO', 'IN_PROGRESS');
    expect(service.statuses()).toContain('TODO');
  });

  it('should delete a status', () => {
    service.deleteStatus('TODO');
    expect(service.statuses()).not.toContain('TODO');
  });

  it('should load statuses from local storage', () => {
    const statuses: TaskStatus[] = ['CUSTOM1', 'CUSTOM2'];
    localStorage.setItem(localStorageKey, JSON.stringify(statuses));
    const newService = new TaskStatusService();
    expect(newService.statuses()).toEqual(statuses);
  });

  it('should save statuses to local storage on add', () => {
    service.addStatus('NEW' as TaskStatus);
    const stored = JSON.parse(localStorage.getItem(localStorageKey)!);
    expect(stored).toContain('NEW');
  });

  it('should save statuses to local storage on update', () => {
    service.updateStatus('TODO', 'UPDATED' as TaskStatus);
    const stored = JSON.parse(localStorage.getItem(localStorageKey)!);
    expect(stored).toContain('UPDATED');
  });

  it('should save statuses to local storage on delete', () => {
    service.deleteStatus('TODO');
    const stored = JSON.parse(localStorage.getItem(localStorageKey)!);
    expect(stored).not.toContain('TODO');
  });
});
