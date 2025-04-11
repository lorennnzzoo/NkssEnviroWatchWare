import { ConditionType } from "./NotificationCondition";

export interface NotificationHistory {
    Id: number;
    ChannelId: number;
    StationId: number;
    ChannelName: string;
    StationName: string;
    ConditionId: string; // GUIDs are represented as strings in TypeScript
    ConditionType: string;
    RaisedTime: string; // or Date if you convert
    EmailSentTime: string | null;
    SentEmailAddresses: string | null;
    MobileSentTime: string | null;
    SentMobileAddresses: string | null;
    Message: string;
    MetaData: string;
    IsRead: boolean;
}


