export interface SelectionModel {
    Companies: Company[];
}

export interface Company {
    Id: number;
    Name: string;
    Stations: Station[];
}

export interface Station {
    Id: number;
    Name: string;
    Channels: Channel[];
}

export interface Channel {
    Id: number;
    Name: string;
}
