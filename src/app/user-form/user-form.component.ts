import { Component, OnInit, input, output, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '@models/user';
import { UserService } from '@services/user.service';
import { Role } from '@models/role';
import { NInputComponent } from '../shared/components/n-input/n-input.component';
import { NSelectComponent } from '../shared/components/n-select/n-select.component';
import { NButtonComponent } from '../shared/components/n-button/n-button.component'; // Import NButtonComponent

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NInputComponent,
    NSelectComponent,
    NButtonComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  user = input<User>();
  submitForm = output<User>();
  cancel = output<void>();
  isViewMode = input<boolean>(false);

  userForm: FormGroup;
  roles: Role[] = [];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: [''],
      role: [null, Validators.required],
    });

    effect(() => {
      if (this.user()) {
        this.userForm.patchValue(this.user() as User);
      } else {
        this.userForm.reset();
      }

      if (this.isViewMode()) {
        this.userForm.disable();
      } else {
        this.userForm.enable();
      }
    });
  }

  ngOnInit(): void {
    this.userService.getRoles().subscribe(roles => (this.roles = roles));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.submitForm.emit(this.userForm.value);
    }
  }
}
