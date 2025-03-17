export interface Channel {
    Id: number;
    StationId: number;
    Name: string;
    LoggingUnits: string;
    ProtocolId: number;
    Active: boolean;
    ValuePosition: number;
    MaximumRange: number;
    MinimumRange: number;
    Threshold: number;
    CpcbChannelName: string;
    SpcbChannelName: string;
    OxideId: number;
    Priority: number;
    IsCpcb: boolean;
    IsSpcb: boolean;
    ScalingFactorId: number;
    OutputType: string;
    ChannelTypeId: number;
    ConversionFactor: number;
    CreatedOn: Date;
}

export interface ChannelListView {
    Id: number;
    Name: string;
    LoggingUnits: string;
    Protocol: string;
    Active: boolean;
    ValuePosition: number;
    MaximumRange: number;
    MinimumRange: number;
    Threshold: number;
    CpcbChannelName: string;
    SpcbChannelName: string;
    Oxide: string;
    Priority: number;
    IsCpcb: boolean;
    IsSpcb: boolean;
    OutputType: string;
    ChannelType: string;
    ConversionFactor: number;
    CreatedOn: Date;
}


export interface ChannelCreation {
    StationId: number;
    Name: string;
    LoggingUnits: string;
    ProtocolId: number;
    ValuePosition: number;
    MaximumRange: number;
    MinimumRange: number;
    Threshold: number;
    CpcbChannelName: string;
    SpcbChannelName: string;
    OxideId: number;
    Priority: number;
    IsCpcb: boolean;
    IsSpcb: boolean;
    ScalingFactorId: number;
    OutputType: string;
    ChannelTypeId: number;
    ConversionFactor: number;
}


export interface ChannelEdit {
    Id: number;
    StationId: number;
    Name: string;
    LoggingUnits: string;
    ProtocolId: number;
    ValuePosition: number;
    MaximumRange: number;
    MinimumRange: number;
    Threshold: number;
    CpcbChannelName: string;
    SpcbChannelName: string;
    OxideId: number;
    Priority: number;
    IsCpcb: boolean;
    IsSpcb: boolean;
    ScalingFactorId: number;
    OutputType: string;
    ChannelTypeId: number;
    ConversionFactor: number;
    CreatedOn: Date;
}