import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

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
          this.authService.setToken(response.access_token); // ✅ Set token

          // Wait for user role and username updates before navigating
          forkJoin([
            this.authService.getUserRole(),
            this.authService.getUserName()
          ]).subscribe(([roleResponse, usernameResponse]) => {
            const username = usernameResponse?.Username || 'User'; // Get username or default to 'User'

            this.toastService.success(`Welcome, ${username}!`); // ✅ Show welcome message

            this.router.navigate(['/Dashboard']).then(() => {
              console.log("✅ Navigation successful");
            }).catch(err => console.error("❌ Navigation error", err));
          });

        } else {
          this.toastService.error(response.error || "Invalid credentials", "Login failed");
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastService.error(error.error, "Login failed");
        console.error('❌ Login error:', error);
        this.loading = false;
      }
    });
  }

}
