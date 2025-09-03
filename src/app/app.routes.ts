import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { KanbanViewComponent } from './kanban-view/kanban-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: TaskListComponent, title: 'Task List' },
  { path: 'kanban', component: KanbanViewComponent, title: 'Kanban Board' },
];
