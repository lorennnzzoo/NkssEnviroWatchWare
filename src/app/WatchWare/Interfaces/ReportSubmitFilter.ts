export enum DataAggregationType {
  Raw = 0,
  FiveMin = 5,
  FifteenMin = 15,
  ThirtyMin = 30,
  OneHour = 60,
  Day = 1440
}

export enum ReportType {
  DataAvailability = 1,
  DataReport = 2,
  Exceedance = 3,
  Windrose = 4,
  Trends = 5
}

export interface ReportFilter {
  companyId: number | null;
  stationsId: number[];
  channelsId: number[];
  dataAggregationType: DataAggregationType;
  from?: Date; // Use Date or string depending on your implementation
  to?: Date;   // Use Date or string depending on your implementation
  reportType: ReportType;
}


export interface SiteConfigReportFilter {
  companyId: number | null;
  stationsId: number[];
  channelsId: number[];
}