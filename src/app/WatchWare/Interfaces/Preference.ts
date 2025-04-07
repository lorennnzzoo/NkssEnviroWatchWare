export enum NotificationPreference {
    OnePerChannel = 0,     // Separate email for each channel
    GroupByStation = 1,    // One email per station (group channels by station)
    GroupAll = 2           // One email combining all notifications
}


export interface UpdatePreference {
    Preference: NotificationPreference;
}