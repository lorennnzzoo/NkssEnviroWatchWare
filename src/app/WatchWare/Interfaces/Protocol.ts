export interface Analyzer {
    Id: number;
    ProtocolType: string;
    CommunicationType: string;
    Command: string;
    ComPort: string;
    BaudRate: number;
    Parity: string;
    DataBits: number;
    StopBits: string;
    IpAddress: string;
    Port: number;
    Manufacturer: string;
    Model: string;
    Active: boolean;
}


export interface AnalyzerCreation {
    ProtocolType: string;
    CommunicationType: string;
    Command: string;
    ComPort: string;
    BaudRate: number;
    Parity: string;
    DataBits: number;
    StopBits: string;
    IpAddress: string;
    Port: number;
    Manufacturer: string;
    Model: string;
}

export interface AnalyzerEdit {
    Id: number;
    ProtocolType: string;
    CommunicationType: string;
    Command: string;
    ComPort: string;
    BaudRate: number;
    Parity: string;
    DataBits: number;
    StopBits: string;
    IpAddress: string;
    Port: number;
    Manufacturer: string;
    Model: string;
}