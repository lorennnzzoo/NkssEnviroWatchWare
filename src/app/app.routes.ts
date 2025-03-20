import { Routes } from '@angular/router';
import { LoginComponent } from './WatchWare/Auth/login/login.component';
import { LiveFeedComponent } from './WatchWare/DashBoard/live-feed/live-feed.component';
import { AuthGuard } from './WatchWare/Guards/auth.guard';
import { SelectionComponent } from './WatchWare/Reports/selection/selection.component';
import { ListCompaniesComponent } from './WatchWare/Company/list-companies/list-companies.component';
import { AddCompanyComponent } from './WatchWare/Company/add-company/add-company.component';
import { ListStationsComponent } from './WatchWare/Station/list-stations/list-stations.component';
import { AddStationComponent } from './WatchWare/Station/add-station/add-station.component';
import { ListChannelsComponent } from './WatchWare/Channel/list-channels/list-channels.component';
import { AddChannelComponent } from './WatchWare/Channel/add-channel/add-channel.component';
import { ListInstrumentsComponent } from './WatchWare/Instrument/list-instruments/list-instruments.component';
import { AddInstrumentComponent } from './WatchWare/Instrument/add-instrument/add-instrument.component';
import { ListOxidesComponent } from './WatchWare/Oxide/list-oxides/list-oxides.component';
import { AddOxideComponent } from './WatchWare/Oxide/add-oxide/add-oxide.component';
import { ListScalingFactorsComponent } from './WatchWare/ScalingFactor/list-scaling-factors/list-scaling-factors.component';
import { AddScalingFactorComponent } from './WatchWare/ScalingFactor/add-scaling-factor/add-scaling-factor.component';
import { ListUsersComponent } from './WatchWare/UsersManagement/list-users/list-users.component';
import { AddUserComponent } from './WatchWare/UsersManagement/add-user/add-user.component';
import { EditCompanyComponent } from './WatchWare/Company/edit-company/edit-company.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'Dashboard', component: LiveFeedComponent, canActivate: [AuthGuard] },
    { path: 'Reports', component: SelectionComponent, canActivate: [AuthGuard] },
    { path: 'Company/All', component: ListCompaniesComponent, canActivate: [AuthGuard] },
    { path: 'Company/Add', component: AddCompanyComponent, canActivate: [AuthGuard] },
    { path: 'Company/Edit/:id', component: EditCompanyComponent, canActivate: [AuthGuard] },
    { path: 'Stations/:id', component: ListStationsComponent, canActivate: [AuthGuard] },
    { path: 'Station/Add/:id', component: AddStationComponent, canActivate: [AuthGuard] },
    { path: 'Channels/:id', component: ListChannelsComponent, canActivate: [AuthGuard] },
    { path: 'Channel/Add/:id', component: AddChannelComponent, canActivate: [AuthGuard] },
    { path: 'Instrument/All', component: ListInstrumentsComponent, canActivate: [AuthGuard] },
    { path: 'Instrument/Add', component: AddInstrumentComponent, canActivate: [AuthGuard] },
    { path: 'Oxide/All', component: ListOxidesComponent, canActivate: [AuthGuard] },
    { path: 'Oxide/Add', component: AddOxideComponent, canActivate: [AuthGuard] },

    { path: 'ScalingFactor/All', component: ListScalingFactorsComponent, canActivate: [AuthGuard] },
    { path: 'ScalingFactor/Add', component: AddScalingFactorComponent, canActivate: [AuthGuard] },
    { path: 'Users/All', component: ListUsersComponent, canActivate: [AuthGuard] },
    { path: 'Users/Add', component: AddUserComponent, canActivate: [AuthGuard] },
    { path: '', pathMatch: 'full', redirectTo: 'Dashboard' },
    { path: '**', redirectTo: 'Dashboard' }
];
