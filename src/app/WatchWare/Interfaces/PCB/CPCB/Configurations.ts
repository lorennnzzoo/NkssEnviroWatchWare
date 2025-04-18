export interface StationConfiguration {
    Id: string;               // Guid
    StationId: number;
    StationName: string;
    CPCB_StationId: string;
    CPCB_UserName: string;
    CPCB_Password: string;
}

export interface ChannelConfiguration {
    Id: string;               // Guid
    ChannelId: number;
    ChannelName: string;
    StationId: number;
    CPCB_ChannelId: number;
    CPCB_ChannelName: string;
    CPCB_Units: string;
}

export interface StationConfigurationCreate {
    StationId: number;
    CPCB_StationId: string;
    CPCB_UserName: string;
    CPCB_Password: string;
}
export interface ChannelConfigurationCreate {
    ChannelId: number;
    StationId: number;
    CPCB_ChannelId: number;
    CPCB_ChannelName: string;
    CPCB_Units: string;
}

export interface StationConfigurationEdit {
    Id: string;               // Guid
    StationId: number;
    CPCB_StationId: string;
    CPCB_UserName: string;
    CPCB_Password: string;
}

export interface ChannelConfigurationEdit {
    Id: string;               // Guid
    ChannelId: number;
    StationId: number;
    CPCB_ChannelId: number;
    CPCB_ChannelName: string;
    CPCB_Units: string;
}

export interface SyncStatus {
    Id: string;
    ChannelId: number;
    ChannelName: String;
    LastChannelDataId: number;
    LastRunTime: string;
}