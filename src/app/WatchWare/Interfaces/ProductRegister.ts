export interface Registration {
    LicenseKey: string
}

export interface Company {
    Name: string;
    Address: string;
    State: string;
    Country: string;
    Phone: string;
    Email: string;
}

export interface ProductDetails {
    CompanyDetails: Company;
    UserDetails: User;
    LicenseKey: string;
    Email: string;
    Phone: string;
    Address: string;
    State: string;
    Country: string;
}

export interface User {
    Password: string;
    Email: string;
    PhoneNumber: string;
}