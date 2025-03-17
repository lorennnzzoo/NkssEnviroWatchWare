export interface ChannelDataFeed {
    ChannelId:number;
    ChannelName: string;
    ChannelValue: string;
    Units: string;
    ChannelDataLogTime: Date; // Optional field
    PcbLimit: string;
    Average:number;
    Availability:number;
    Active:boolean;
}
