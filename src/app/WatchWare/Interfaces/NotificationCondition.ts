export enum ConditionType {
    Value = 0,
    LogTime = 1,
}

export enum Operator {
    GreaterThan = 0,    // >
    LessThan = 1,       // <
    Equal = 2,          // =
    GreaterThanOrEqual = 3, // >=
    LessThanOrEqual = 4 // <=
}
export interface ConditionCreate {
    ConditionName: string;
    ConditionType: ConditionType;
    Cooldown: number;
    Duration: number;
    Operator: Operator;
    Threshold: number;
}

export interface Condition {
    Id: string;
    ConditionName: string;
    ConditionType: ConditionType;
    Cooldown: number;
    Duration: number;
    Operator: Operator;
    Threshold: number;
}

export interface NotificationSubscription {
    Id: string;
    ChannelId: number;
    Conditions: Condition[];
}