import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [ToastrService]
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastrService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/Dashboard']);
    }
  }
  onLogin(): void {
    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password, 'password').subscribe({
      next: (response) => {

        if (response?.access_token) {
          this.toastService.success("Login Successfull");
          this.router.navigate(['/Dashboard']);
        } else {
          this.toastService.error(response.details?.error?.error_description, "Login failed");
        }
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.toastService.error(error.error, "Login failed");
        console.error('Login error', error);
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }
}
