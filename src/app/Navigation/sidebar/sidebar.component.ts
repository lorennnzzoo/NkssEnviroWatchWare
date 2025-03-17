import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../../Interfaces/MenuItem';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../WatchWare/Services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {



  isCollapsed = false;
  @Output() collapseChange = new EventEmitter<boolean>();
  menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: 'fas fa-home', route: '/livefeed' },
    {
      title: 'Reports', icon: 'fas fa-chart-bar', children: [
        { title: 'Daily Report', icon: 'fas fa-calendar-day', route: '/reports/daily' },
        { title: 'Monthly Report', icon: 'fas fa-calendar-alt', route: '/reports/monthly' }
      ]
    },
    { title: 'Settings', icon: 'fas fa-cog', route: '/settings' }
  ];

  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.isCollapsed = window.innerWidth <= 768;
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapseChange.emit(this.isCollapsed);
  }

  toggleDropdown(item: MenuItem) {
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
