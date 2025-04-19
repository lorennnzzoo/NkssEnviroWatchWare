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
import { EditStationComponent } from './WatchWare/Station/edit-station/edit-station.component';
import { EditChannelComponent } from './WatchWare/Channel/edit-channel/edit-channel.component';
import { EditInstrumentComponent } from './WatchWare/Instrument/edit-instrument/edit-instrument.component';
import { EditOxideComponent } from './WatchWare/Oxide/edit-oxide/edit-oxide.component';
import { EditScalingFactorComponent } from './WatchWare/ScalingFactor/edit-scaling-factor/edit-scaling-factor.component';
import { NotFoundComponent } from './Navigation/not-found/not-found.component';
import { ProfileComponent } from './WatchWare/Auth/profile/profile.component';
import { ConfigurationComponent } from './WatchWare/System/configuration/configuration.component';
import { DisplayBoardCreateTemplateComponent } from './WatchWare/System/DisplayBoard/display-board-create-template/display-board-create-template.component';
import { StatusesComponent } from './WatchWare/System/Notification/channel-statuses/statuses.component';
import { CreateSubscriptionComponent } from './WatchWare/System/Notification/create-subscription/create-subscription.component';
import { CreateConditionComponent } from './WatchWare/System/Notification/create-condition/create-condition.component';
import { EditSubscriptionComponent } from './WatchWare/System/Notification/edit-subscription/edit-subscription.component';
import { LicenseComponent } from './WatchWare/Auth/license/license.component';
import { LogsComponent } from './WatchWare/System/logs/logs.component';
import { ContactsComponent } from './WatchWare/System/Notification/contacts/contacts.component';
import { SubscriptionsComponent } from './WatchWare/System/AutoMailReport/subscriptions/subscriptions.component';
import { CreateSusbcriptionComponent } from './WatchWare/System/AutoMailReport/create-susbcription/create-susbcription.component';
import { EditSusbcriptionComponent } from './WatchWare/System/AutoMailReport/edit-susbcription/edit-susbcription.component';
import { EditConditionComponent } from './WatchWare/System/Notification/edit-condition/edit-condition.component';
import { StationsStatusComponent } from './WatchWare/PCB/CPCBNKSS/stations-status/stations-status.component';
import { CreateStationConfigComponent } from './WatchWare/PCB/CPCBNKSS/create-station-config/create-station-config.component';
import { ChannelsStatusComponent } from './WatchWare/PCB/CPCBNKSS/channels-status/channels-status.component';
import { CreateChannelConfigComponent } from './WatchWare/PCB/CPCBNKSS/create-channel-config/create-channel-config.component';
import { EditStationConfigComponent } from './WatchWare/PCB/CPCBNKSS/edit-station-config/edit-station-config.component';
import { EditChannelConfigComponent } from './WatchWare/PCB/CPCBNKSS/edit-channel-config/edit-channel-config.component';
import { DisplayBoardTemplatesComponent } from './WatchWare/System/DisplayBoard/display-board-templates/display-board-templates.component';
import { DisplayBoardEditTemplateComponent } from './WatchWare/System/DisplayBoard/display-board-edit-template/display-board-edit-template.component';
import { serviceUserBlockGuard } from './WatchWare/Guards/service-user-block.guard';
import { UnauthorizedComponent } from './Navigation/unauthorized/unauthorized.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'License', component: LicenseComponent },
    { path: 'Dashboard', component: LiveFeedComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Reports', component: SelectionComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Company/All', component: ListCompaniesComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Company/Add', component: AddCompanyComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Company/Edit/:id', component: EditCompanyComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Stations/:id', component: ListStationsComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Station/Add/:id', component: AddStationComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Station/Edit/:id', component: EditStationComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Channels/:id', component: ListChannelsComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Channel/Add/:id', component: AddChannelComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Channel/Edit/:id', component: EditChannelComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Instrument/All', component: ListInstrumentsComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Instrument/Add', component: AddInstrumentComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Instrument/Edit/:id', component: EditInstrumentComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Oxide/All', component: ListOxidesComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Oxide/Add', component: AddOxideComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Oxide/Edit/:id', component: EditOxideComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'ScalingFactor/All', component: ListScalingFactorsComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'ScalingFactor/Add', component: AddScalingFactorComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'ScalingFactor/Edit/:id', component: EditScalingFactorComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Users/All', component: ListUsersComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Users/Add', component: AddUserComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Configurations/All', component: ConfigurationComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Configurations/Add', component: ConfigurationComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Configurations/Edit/:id', component: ConfigurationComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/DisplayBoard/CreateTemplate', component: DisplayBoardCreateTemplateComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/DisplayBoard/Templates', component: DisplayBoardTemplatesComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/DisplayBoard/EditTemplate/:id', component: DisplayBoardEditTemplateComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/Notifications/Statuses', component: StatusesComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/Notification/Subscribe/:id', component: CreateSubscriptionComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/Notification/EditSubscription/:id', component: EditSubscriptionComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/Notification/CreateCondition', component: CreateConditionComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/Notification/EditCondition/:id', component: EditConditionComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/Notification/Contacts', component: ContactsComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Logs', component: LogsComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'PCB/CPCBNKSS/Uploading/StationsStatus', component: StationsStatusComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'PCB/CPCBNKSS/Uploading/CreateStationConfig', component: CreateStationConfigComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'PCB/CPCBNKSS/Uploading/EditStationConfig/:id', component: EditStationConfigComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'PCB/CPCBNKSS/Uploading/ChannelsStatus/:id', component: ChannelsStatusComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'PCB/CPCBNKSS/Uploading/CreateChannelConfig/:id', component: CreateChannelConfigComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'PCB/CPCBNKSS/Uploading/EditChannelConfig/:id/:stationId', component: EditChannelConfigComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/AutoMailReport/Subscriptions', component: SubscriptionsComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/AutoMailReport/CreateSubscription', component: CreateSusbcriptionComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'System/Configuration/AutoMailReport/EditSubscription/:id', component: EditSusbcriptionComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'Profile', component: ProfileComponent, canActivate: [AuthGuard, serviceUserBlockGuard] },
    { path: 'NotFound', component: NotFoundComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '', pathMatch: 'full', redirectTo: 'Dashboard' },
    { path: '**', redirectTo: 'NotFound' }
];
