export interface Oxide {
    Id: number;
    OxideName: string;
    Limit: string;
    Active: boolean;
}

export interface OxideCreation {
    OxideName: string;
    Limit: string;
}

export interface OxideEdit {
    Id: number;
    OxideName: string;
    Limit: string;
}