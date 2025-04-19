import { Component } from '@angular/core';
import { AuthService } from '../../WatchWare/Services/auth.service';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

  constructor(private authService: AuthService) { }
  logout() {
    this.authService.logout();
  }
}
