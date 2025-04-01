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
  Loading: boolean = false;
  constructor(private userService: UserService, private fb: FormBuilder, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      newPassword: [null, Validators.required, Validators.minLength(6)],
      confirmPassword: [null, Validators.required]
    }, { validator: this.passwordMatchValidator });
    this.loadUserDetails();
  }
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
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
}
