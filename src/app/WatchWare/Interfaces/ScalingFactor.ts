export interface ScalingFactor {
    Id: number;
    MinInput: number;
    MaxInput: number;
    MinOutput: number;
    MaxOutput: number;
    Active: boolean;
}

export interface ScalingFactorCreation {
    MinInput: number;
    MaxInput: number;
    MinOutput: number;
    MaxOutput: number;
}

export interface ScalingFactorEdit {
    Id: number;
    MinInput: number;
    MaxInput: number;
    MinOutput: number;
    MaxOutput: number;
}
