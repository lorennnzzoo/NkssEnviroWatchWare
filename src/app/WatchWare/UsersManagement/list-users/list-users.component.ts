import { Component, OnInit } from '@angular/core';
import { User, UserListView } from '../../Interfaces/User';
import { UserService } from '../../Services/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-list-users',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ToastrModule, ConfirmDialogModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class ListUsersComponent implements OnInit {
  RawUsers: User[] = [];
  Users: UserListView[] = [];
  Loading: boolean = false;

  constructor(
    private userService: UserService,
    private dialogService: ConfirmationService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.loadUsers();
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  loadUsers() {
    this.Loading = true;
    this.userService.GetAllUsers().subscribe({
      next: (data) => {
        this.RawUsers = data;
        const rolePromises = this.RawUsers.map(user => {
          return this.authService.GetRoleById(user.RoleId).toPromise()
            .then(role => {

              const Rolee = role ? role.Name : 'Unknown Role';
              const userListView: UserListView = {
                Id: user.Id,
                Username: user.Username,
                Password: user.Password,
                Email: user.Email,
                CreatedOn: user.CreatedOn,
                LastLoggedIn: user.LastLoggedIn,
                PhoneNumber: user.PhoneNumber,
                Role: Rolee,
                Active: user.Active,
              };
              return userListView;
            })
            .catch(error => {
              console.error('Error fetching role:', error);
              // If there's an error fetching the role, assign a default role
              return {
                ...user,
                Role: 'Unknown Role'
              };
            });
        });

        Promise.all(rolePromises).then(updatedUsers => {
          this.Users = updatedUsers;
          this.Loading = false;
        }).catch(error => {

          this.toastService.error('Unable To Load Roles', 'Error');
          console.error('Error loading roles:', error);
          this.Loading = false;
        });
      },
      error: (error) => {

        this.toastService.error('Unable To Load Users', 'Error');
        console.error('Error loading users:', error);
        this.Loading = false;
      }
    });
  }
  onCreate() {
    this.router.navigate(['/Users/Add'])
  }
  onActivate(user: UserListView) {
    this.dialogService.confirm({
      message: 'Are you sure you want to activate this user?',
      header: 'Confirm Activation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.userService.ActivateUser(user).subscribe
          ({
            next: (response) => {
              this.toastService.success('User activated successfully', 'Activated');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error(error.error, 'Error');
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
  onDeactivate(user: UserListView) {
    this.dialogService.confirm({
      message: 'Are you sure you want to deactivate this user?',
      header: 'Confirm Deactivation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.userService.DeleteUser(user).subscribe
          ({
            next: (response) => {
              this.toastService.success('User deactivated successfully', 'Deactivated');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error(error.error, 'Error');
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
}
