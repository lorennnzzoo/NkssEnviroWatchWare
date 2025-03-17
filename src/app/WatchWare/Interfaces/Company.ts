export interface Company {
    Id: number;
    ShortName: string;
    LegalName: string;
    Country: string;
    State: string;
    District: string;
    Address: string;
    PinCode: string;
    Logo: Uint8Array | null;
    Active: boolean;
    CreatedOn: Date;
}

export interface CompanyCreation {
    ShortName: string;
    LegalName: string;
    Country: string;
    State: string;
    District: string;
    Address: string;
    PinCode: string;
}


export interface CompanyEdit {
    Id: number;
    ShortName: string;
    LegalName: string;
    Country: string;
    State: string;
    District: string;
    Address: string;
    PinCode: string;
}