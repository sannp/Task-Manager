import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ConfigurationComponent } from './configuration/configuration.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'config', component: ConfigurationComponent, title: 'Config' },
  { path: 'task/list', component: TaskListComponent, title: 'Task List' },
  { path: 'user/list', component: UserListComponent, title: 'User List' },
];
