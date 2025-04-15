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