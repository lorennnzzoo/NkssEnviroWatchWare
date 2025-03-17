export interface ConfigSetting {
    Id: number;
    GroupName: string;
    ContentName: string;
    ContentValue: string;
    Active: boolean;
}

export interface ConfigSettingCreation {
    GroupName: string;
    ContentName: string;
    ContentValue: string;
}

export interface ConfigSettingEdit {
    Id: number;
    GroupName: string;
    ContentName: string;
    ContentValue: string;
}