export interface Station {
    Id: number;
    CompanyId: number;
    MonitoringTypeId: number;
    Name: string;
    IsSpcb: boolean;
    IsCpcb: boolean;
    Active: boolean;
    CreatedOn: Date;
}

export interface StationListView {
    Id: number;
    CompanyId: number;
    MonitoringType: string;
    Name: string;
    IsSpcb: boolean;
    IsCpcb: boolean;
    Active: boolean;
    CreatedOn: Date;
}


export interface StationCreation {
    CompanyId: number;
    MonitoringTypeId: number;
    Name: string;
    IsSpcb: boolean;
    IsCpcb: boolean;
}

export interface StationEdit {
    Id: number;
    CompanyId: number;
    MonitoringTypeId: number;
    Name: string;
    IsSpcb: boolean;
    IsCpcb: boolean;
}