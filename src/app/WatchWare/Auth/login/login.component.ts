import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/livefeed']);
    }
  }
  onLogin(): void {
    this.loading = true;
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password, 'password').subscribe(
      (response) => {
        if (response?.access_token) {
          this.loading = false;
          this.router.navigate(['/livefeed']);
        }
      },
      (error) => {
        this.loading = false;
        console.error('Login error', error);
      }
    );
  }
}
