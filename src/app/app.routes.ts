import { Routes } from '@angular/router';
import { LoginComponent } from './WatchWare/Auth/login/login.component';
import { LiveFeedComponent } from './WatchWare/DashBoard/live-feed/live-feed.component';
import { AuthGuard } from './WatchWare/Guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'livefeed', component: LiveFeedComponent, canActivate: [AuthGuard] },
];
