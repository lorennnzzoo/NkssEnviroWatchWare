import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Role } from '../../Interfaces/Role';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserCreate } from '../../Interfaces/User';

@Component({
  selector: 'app-add-user',
  imports: [ToastrModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
  providers: [ToastrService]
})
export class AddUserComponent {
  showPassword: boolean = false;
  Roles: Role[] = [];
  userForm!: FormGroup; // Reactive form for company creation
  Loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastrService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRoles();

    this.userForm = this.fb.group({
      UserName: [null, Validators.required],
      Password: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      PhoneNumber: [null, [Validators.required, Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]],
      RoleId: [null, Validators.required],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.router.navigate(['/Users/All'])
  }
  loadRoles() {
    this.authService.loadRoles().subscribe(
      {
        next: (data) => {
          this.Roles = data;
          this.Roles = this.Roles.filter(role => role.Name.toLowerCase() !== 'admin')
        },
        error: (error) => {

          this.toastService.error('Unable To Load Roles', 'Error');
          console.error('Error loading roles:', error);
        }
      }
    )
  }

  onSubmit() {
    this.Loading = true;

    if (this.userForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }


    const user: UserCreate = {
      Username: this.userForm.value.UserName,
      Password: this.userForm.value.Password,
      Email: this.userForm.value.Email, // Assuming country is a string, not an object
      PhoneNumber: this.userForm.value.PhoneNumber,
      RoleId: this.userForm.value.RoleId
    };


    this.authService.register(user.Username, user.Password, user.Email, user.PhoneNumber, user.RoleId).subscribe(
      {
        next: (response) => {

          this.toastService.success('User registered successfully');
          this.Loading = false;
          this.goBack();
        },
        error: (error) => {
          // Handle error response
          this.toastService.error(error.error, 'Error');
          this.Loading = false;
        },
      }
    )
  }
}
