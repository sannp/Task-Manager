import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private roles: Role[] = [
    { id: 1, name: 'Admin', enabled: true },
    { id: 2, name: 'User', enabled: true },
    { id: 3, name: 'Viewer', enabled: false },
  ];

  private users = signal<User[]>([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', username: 'johndoe', role: this.roles[0], password: 'password' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', username: 'janesmith', role: this.roles[1], password: 'password' },
    { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', username: 'peterjones', role: this.roles[1], password: 'password' },
  ]);

  constructor() { }

  getUsers(): Observable<User[]> {
    return of(this.users());
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.users().find(u => u.id === id));
  }

  addUser(user: User): Observable<User> {
    const newUser = { ...user, id: Date.now() };
    this.users.update(users => [...users, newUser]);
    return of(newUser);
  }

  updateUser(user: User): Observable<User> {
    this.users.update(users => users.map(u => u.id === user.id ? user : u));
    return of(user);
  }

  deleteUser(id: number): Observable<void> {
    this.users.update(users => users.filter(u => u.id !== id));
    return of(undefined);
  }

  getRoles(): Observable<Role[]> {
    return of(this.roles);
  }
}
