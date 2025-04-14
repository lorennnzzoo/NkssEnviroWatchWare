import { Channel } from "./Channel";
import { DataAggregationType } from "./ReportSubmitFilter";
import { Station } from "./Station";

export interface ReportSubscription {
    Id: string;
    StationId: number;
    Interval: DataAggregationType;
    Range: ReportRange;
    EmailScheduleTime: string;
    Frequency: EmailFrequency;
}

export interface ReportSubscriptionCreate {
    StationId: number;
    Interval: DataAggregationType;
    Range: ReportRange;
    EmailScheduleTime: string;
    Frequency: EmailFrequency;
}

export enum ReportRange {
    PastDay,
    PastWeek,
    PastMonth
}

export enum EmailFrequency {
    Daily,
    Weekly,
    Monthly
}


export interface ReportSubscriptionListView {
    Id: string;
    Station: string;
    Interval: string;
    Range: string;
    EmailScheduleTime: string;
    Frequency: string;
}
