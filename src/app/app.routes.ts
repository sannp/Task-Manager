import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { KanbanViewComponent } from './kanban-view/kanban-view.component';
import { ConfigurationComponent } from './configuration/configuration.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: TaskListComponent, title: 'Task List' },
  { path: 'kanban', component: KanbanViewComponent, title: 'Kanban Board' },
  { path: 'config', component: ConfigurationComponent, title: 'Config' },
];
