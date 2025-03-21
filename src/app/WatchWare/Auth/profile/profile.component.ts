import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { User } from '../../Interfaces/User';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [ToastrModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [ToastrService]
})
export class ProfileComponent implements OnInit {

  user!: User;
  Loading: boolean = false;
  constructor(private userService: UserService, private toastService: ToastrService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
