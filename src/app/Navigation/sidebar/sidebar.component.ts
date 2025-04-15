import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../../Interfaces/MenuItem';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../WatchWare/Services/auth.service';
import { Subscription } from 'rxjs';
import { CompanyService } from '../../WatchWare/Services/company.service';
import { Company } from '../../WatchWare/Interfaces/Company';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TooltipModule } from 'primeng/tooltip';
import { UserService } from '../../WatchWare/Services/user.service';
import { User } from '../../WatchWare/Interfaces/User';
import { DialogModule } from 'primeng/dialog';
import { ProfileComponent } from "../../WatchWare/Auth/profile/profile.component";
import { DrawerModule } from 'primeng/drawer';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, ToastrModule, TooltipModule, DialogModule, DrawerModule, NotificationsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  providers: [ToastrService]
})
export class SidebarComponent implements OnInit {

  showCard: boolean = false;
  showNotifications: boolean = false;

  Username: string = '';
  private usernameSubscription: Subscription | null = null;
  Companies: Company[] = [];
  CompanyLoading: boolean = false;
  user!: User;
  role: string | null = null;
  private roleSubscription!: Subscription;
  isCollapsed = false;
  @Output() collapseChange = new EventEmitter<boolean>();
  menuItems: MenuItem[] = [];

  private updateMenu() {
    if (this.role === 'Admin') {
      this.menuItems = [{
        // title: 'Dashboard', icon: 'fas fa-tachometer-alt', children: [
        //   { title: 'All Stations', icon: 'fas fa-border-all', route: '/Dashboard' },
        // ]
        title: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/Dashboard'

      },
      { title: 'Reports', icon: 'fas fa-chart-line', route: '/Reports' },
      {
        title: 'Industry', icon: 'fas fa-building', children: [
          { title: 'All Industries', icon: 'fas fa-industry', route: '/Company/All' },
          { title: 'Add Industry', icon: 'fas fa-plus-circle', route: '/Company/Add' },
        ]
      },
      {
        // title: 'Instrument', icon: 'fas fa-microchip', children: [
        //   { title: 'All Analyzers', icon: 'fas fa-flask', route: '/Instrument/All' },
        //   { title: 'Add Analyzer', icon: 'fas fa-plus-circle', route: '/Instrument/Add' },
        // ]
        title: 'Instrument', icon: 'fas fa-microchip', route: '/Instrument/All'
      },
      {
        // title: 'Standard', icon: 'fas fa-balance-scale', children: [
        //   { title: 'All Standards', icon: 'fas fa-list', route: '/Oxide/All' },
        //   { title: 'Add Standard', icon: 'fas fa-plus-circle', route: '/Oxide/Add' },
        // ]
        title: 'Standard', icon: 'fas fa-balance-scale', route: '/Oxide/All'

      },
      {
        // title: 'Scaling', icon: 'fas fa-ruler-combined', children: [
        //   { title: 'All Scaling Factors', icon: 'fas fa-list', route: '/ScalingFactor/All' },
        //   { title: 'Add Scaling Factor', icon: 'fas fa-plus-circle', route: '/ScalingFactor/Add' },
        // ]
        title: 'Scaling', icon: 'fas fa-ruler-combined', route: '/ScalingFactor/All'
      },
      {
        // title: 'Users Management', icon: 'fas fa-users-cog', children: [
        //   { title: 'Users', icon: 'fas fa-user', route: '/Users/All' },
        //   { title: 'Create', icon: 'fas fa-user-plus', route: '/Users/Add' },
        // ]
        title: 'Users', icon: 'fas fa-users-cog', route: '/Users/All'
      },
      {
        title: 'System', icon: 'fas fa-cogs', children: [
          // { title: 'Configuration', icon: 'fas fa-tools', route: '/Configurations/All' },
          { title: 'Logs', icon: 'fas fa-file-alt', route: '/System/Logs' },
          // { title: 'License', icon: 'fas fa-id-badge', route: '/reports/daily' },
          // { title: 'Site Config', icon: 'fas fa-server', route: '/reports/daily' },
          { title: 'DisplayBoard', icon: 'fas fa-tv', route: '/System/Configuration/DisplayBoard' },
          { title: 'Notifications', icon: 'fas fa-bell', route: '/System/Configuration/Notifications/Statuses' },
          { title: 'Auto Mail Reports', icon: 'fas fa-envelopes-bulk', route: '/System/Configuration/AutoMailReport/Subscriptions' },
        ]
      },
      {
        title: 'PCB Uploading', icon: 'fas fa-upload', children: [
          { title: 'CPCB-NKSS', icon: 'fas fa-smog', route: '/PCB/CPCBNKSS/Uploading/StationsStatus' },
        ]
      }
      ]
    }
    else if (this.role === 'Customer') {
      this.menuItems = this.menuItems = [{
        // title: 'Dashboard', icon: 'fas fa-tachometer-alt', children: [
        //   { title: 'All Stations', icon: 'fas fa-border-all', route: '/Dashboard' },
        // ]
        title: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/Dashboard'

      },
      { title: 'Reports', icon: 'fas fa-chart-line', route: '/Reports' },
      ]
    }

  }
  loadUsername(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.Username = username;
    } else {
      this.authService.logout();
    }
  }
  loadUserDetails() {
    // this.Loading = true;
    this.userService.GetUserProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        // this.Loading = false;
      },
      error: (error) => {
        this.toastService.error('Unable To Load Profile Data');
        // this.Loading = false;
      }
    });
  }
  constructor(private router: Router, private authService: AuthService, private userService: UserService, private companyService: CompanyService, private toastService: ToastrService) { }
  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.isCollapsed = window.innerWidth <= 768;
    });
    this.usernameSubscription = this.authService.username$.subscribe(username => {
      if (username) {
        this.Username = username;
      } else {
        this.Username = ''; // Reset if no username
      }
    });
    this.roleSubscription = this.authService.role$.subscribe(role => {
      this.role = role;
      this.updateMenu();
    });
    // Load username initially
    this.loadUsername();
    this.loadCompanies();
    this.loadUserDetails();

  }
  loadCompanies() {
    if (this.role === 'Admin') {
      this.CompanyLoading = true;
      this.companyService.GetAllCompanies().subscribe(
        (data) => {
          this.Companies = data;
          this.CompanyLoading = false;

          // Find the "Company" menu item
          const companyMenu = this.menuItems.find(item => item.title === 'Industry');
          // const dashBoardMenu = this.menuItems.find(item => item.title === 'Dashboard');
          if (companyMenu && companyMenu.children) {
            // Add companies as children under "All Industries"
            companyMenu.children = [
              { title: 'All Industries', icon: 'fas fa-industry', route: '/Company/All' },
              { title: 'Add Industry', icon: 'fas fa-plus-circle', route: '/Company/Add' },
              ...this.Companies.map(company => ({
                title: company.ShortName,
                icon: 'fas fa-industry',
                route: `/Stations/${company.Id}` // Assuming companies have an `id`
              }))
            ];
          }
          // if (dashBoardMenu && dashBoardMenu.children) {
          //   // Add companies as children under "All Industries"
          //   dashBoardMenu.children = [
          //     { title: 'All Stations', icon: 'fas fa-border-all', route: '/Dashboard' },
          //     ...this.Companies.map(company => ({
          //       title: company.ShortName,
          //       icon: 'fas fa-industry',
          //       route: `/Stations/${company.Id}` // Assuming companies have an `id`
          //     }))
          //   ];
          // }
        },
        (error) => {
          this.toastService.error('Unable to load companies', 'Error occurred');
          console.error('Error loading companies:', error);
          this.CompanyLoading = false;
        }
      );
    }

  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapseChange.emit(this.isCollapsed);
  }

  toggleDropdown(item: MenuItem) {
    this.menuItems.forEach(menuItem => {
      if (menuItem !== item) {
        menuItem.expanded = false;
      }
    });

    // Toggle the clicked parent
    item.expanded = !item.expanded;
  }

  isActive(route?: string): boolean {
    return route ? this.router.url === route : false;
  }

  isActiveParent(children: MenuItem[]): boolean {
    return children.some(child => this.isActive(child.route));
  }

  onLogout(): void {
    this.authService.logout();
  }
  onProfile() {
    this.router.navigate(['/Profile'])
  }
  onSettings() {
    this.router.navigate(['/Profile']);
    this.showCard = false;
  }
  onHelp() {
    this.toastService.info('Not implemented');
  }
}
