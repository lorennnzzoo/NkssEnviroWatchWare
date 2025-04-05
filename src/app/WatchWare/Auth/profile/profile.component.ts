import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { User, UserProfile } from '../../Interfaces/User';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ToastrModule, CommonModule, DialogModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [ToastrService]
})
export class ProfileComponent implements OnInit {

  changePasswordForm!: FormGroup;
  user!: UserProfile;
  showChangePassword: boolean = false;
  ChangePasswordLoading: boolean = false;
  Loading: boolean = false;
  constructor(private userService: UserService, private fb: FormBuilder, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.Loading = true;
    this.userService.GetUserProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.Loading = false;
      },
      error: (error) => {
        this.toastService.error('Unable To Load Profile Data');
        this.Loading = false;
      }
    });
  }

  onSubmit(): void {
    this.ChangePasswordLoading = true;
    if (this.changePasswordForm.invalid) {
      this.toastService.warning("Please enter password.")
      this.ChangePasswordLoading = false;
      return;
    };

    const { newPassword, confirmPassword } = this.changePasswordForm.value;
    if (newPassword !== confirmPassword) {
      this.toastService.warning("Passwords must match");
      this.ChangePasswordLoading = false;
      return;
    }


    this.userService.ChangePassword(newPassword).subscribe({
      next: (response) => {
        this.ChangePasswordLoading = false;
        this.showChangePassword = false;
        this.toastService.success("Password changed successfully, Please logout and login.");
      },
      error: (error) => {
        this.ChangePasswordLoading = false;
        console.error(error);
        this.toastService.warning(error.error);
      }
    })
    // Proceed with password change logic here
  }
}
