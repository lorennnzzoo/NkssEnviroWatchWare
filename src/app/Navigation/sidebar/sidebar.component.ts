import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../../Interfaces/MenuItem';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../WatchWare/Services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  Username: string = '';
  private usernameSubscription: Subscription | null = null;

  isCollapsed = false;
  @Output() collapseChange = new EventEmitter<boolean>();
  menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/Dashboard' },
    { title: 'Reports', icon: 'fas fa-chart-line', route: '/Reports' },
    {
      title: 'Company', icon: 'fas fa-building', children: [
        { title: 'All Industries', icon: 'fas fa-industry', route: '/Company/All' },
        { title: 'Add Industry', icon: 'fas fa-plus-circle', route: '/Company/Add' },
      ]
    },
    {
      title: 'Instrument', icon: 'fas fa-microchip', children: [
        { title: 'All Analyzers', icon: 'fas fa-flask', route: '/Instrument/All' },
        { title: 'Add Analyzer', icon: 'fas fa-plus-circle', route: '/Instrument/Add' },
      ]
    },
    {
      title: 'Standard', icon: 'fas fa-balance-scale', children: [
        { title: 'All Standards', icon: 'fas fa-list', route: '/Oxide/All' },
        { title: 'Add Standard', icon: 'fas fa-plus-circle', route: '/Oxide/Add' },
      ]
    },
    {
      title: 'Scaling', icon: 'fas fa-ruler-combined', children: [
        { title: 'All Scaling Factors', icon: 'fas fa-list', route: '/ScalingFactor/All' },
        { title: 'Add Scaling Factor', icon: 'fas fa-plus-circle', route: '/ScalingFactor/Add' },
      ]
    },
    {
      title: 'Users Management', icon: 'fas fa-users-cog', children: [
        { title: 'Users', icon: 'fas fa-user', route: '/Users/All' },
        { title: 'Create', icon: 'fas fa-user-plus', route: '/Users/Add' },
      ]
    },
    {
      title: 'System', icon: 'fas fa-cogs', children: [
        { title: 'Configuration', icon: 'fas fa-tools', route: '/reports/daily' },
        { title: 'Logs', icon: 'fas fa-file-alt', route: '/reports/daily' },
        { title: 'License', icon: 'fas fa-id-badge', route: '/reports/daily' },
        { title: 'Site Config', icon: 'fas fa-server', route: '/reports/daily' },
      ]
    }
  ];
  loadUsername(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.Username = username;
    } else {
      this.authService.logout();
    }
  }

  constructor(private router: Router, private authService: AuthService) { }
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

    // Load username initially
    this.loadUsername();
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
}
