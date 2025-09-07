import { Component, OnInit, signal, WritableSignal, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { NModalComponent } from '@components/n-modal/n-modal.component';
import { ListTableComponent } from '@components/list-table/list-table.component';
import { NTableColumn } from '@components/n-table/n-table.component'; // Import NTableColumn

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NModalComponent, UserFormComponent, ListTableComponent], // Removed NTableColumnComponent
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  @ViewChild('userModal') userModal!: NModalComponent;

  private userService = inject(UserService);

  users: WritableSignal<User[]> = signal([]);
  selectedUser: User | undefined;
  currentFormMode = signal<'add' | 'edit' | 'view'>('add'); // New signal to track form mode

  userColumns: NTableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'username', header: 'Username', sortable: true },
    { key: 'role.name', header: 'Role', sortable: true },
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => this.users.set(users));
  }

  onAddUser(): void {
    this.selectedUser = undefined;
    this.currentFormMode.set('add'); // Set mode to 'add'
    this.userModal.open();
  }

  onEditUser(user: User): void {
    this.selectedUser = { ...user };
    this.currentFormMode.set('edit'); // Set mode to 'edit'
    this.userModal.open();
  }

  onViewUser(user: User): void {
    this.selectedUser = { ...user };
    this.currentFormMode.set('view'); // Set mode to 'view'
    this.userModal.open();
  }

  onDeleteUser(user: User): void {
    // Remove the native confirm call
    this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
  }

  onModalClose(): void {
    // No need to set showUserForm to false, as the modal handles content visibility
  }

  handleUserFormSubmit(user: User): void {
    const userOperation$ = user.id
      ? this.userService.updateUser(user)
      : this.userService.addUser(user);

    userOperation$.subscribe(() => {
      this.loadUsers();
      this.userModal.close();
    });
  }
}
