export interface Contact {
    Id: string;
    Address: string;
}
export enum ContactType {
    Email = 0,
    Mobile = 1
}
export interface ContactCreation {
    type: ContactType;
    address: string;
}

export interface ContactDeletion {
    type: ContactType;
    id: string;
}

export interface ContactEdition {
    id: string | null;
    type: ContactType;
    address: string;
}