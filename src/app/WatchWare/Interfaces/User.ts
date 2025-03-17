export interface UserCreate {
    Username: string;
    Password: string;
    PhoneNumber: string;
    Email: string;
    RoleId: number;
}


export interface User {
    Id: string;  // Guid in C# is represented as string in TS
    Username: string;
    Password: string;
    PhoneNumber: string;
    Email: string;
    CreatedOn: string;  // Date in C# can be represented as string in TS (ISO format)
    LastLoggedIn: string;  // Same as above
    RoleId: number;
    Active: boolean;
}

export interface UserListView {
    Id: string;  // Guid in C# is represented as string in TS
    Username: string;
    Password: string;
    PhoneNumber: string;
    Email: string;
    CreatedOn: string;  // Date in C# can be represented as string in TS (ISO format)
    LastLoggedIn: string;  // Same as above
    Role: string;
    Active: boolean;
}
