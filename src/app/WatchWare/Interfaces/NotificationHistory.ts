import { ConditionType } from "./NotificationCondition";

export interface NotificationHistory {
    Id: number;
    ChannelId: number;
    ChannelName: string;
    ConditionId: string;
    ConditionType: ConditionType;
    RaisedTime: string;
    SentTime?: string | null;
    Message: string;
    MetaData: string;
    IsRead: boolean;
}
