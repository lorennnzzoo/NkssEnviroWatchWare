import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './Navigation/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, CommonModule, ToastrModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'NkssEnviroWatchWare';
  isCollapsed = false;
  isLoginPage: boolean = false;
  isDashboard: boolean = false;
  isLicensePage: boolean = false;
  breadcrumbs: string[] = [];

  screenIsLarge = window.innerWidth >= 768; // Assume `md` breakpoint in Tailwind

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    // Update login page status and breadcrumbs when the route changes
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.isLoginPage = this.router.url === '/login'; // Update based on your login route
      this.isDashboard = this.router.url === '/Dashboard'; // Update based on your login route
      this.isLicensePage = this.router.url === '/License'; // Update based on your login route
      this.breadcrumbs = this.getBreadcrumbs(this.activatedRoute.root); // Update breadcrumbs
    });
  }

  // Function to recursively fetch breadcrumb paths
  getBreadcrumbs(route: ActivatedRoute, path: string[] = []): string[] {
    const routeConfig = route.snapshot.routeConfig;
    if (routeConfig && routeConfig.path) {
      path.push(routeConfig.path); // Add the current route's path
    }

    if (route.firstChild) {
      return this.getBreadcrumbs(route.firstChild, path); // Continue for child routes
    }

    return path;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  collapseChange() {
    this.isCollapsed = !this.isCollapsed;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenIsLarge = (event.target as Window).innerWidth >= 768;
  }

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }
}
