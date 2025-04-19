export interface Template {
    Id: string;
    FileName: string;
    FilePath: string;
    FileType: string;
    TemplateContent: string;
}
export interface TemplateCreate {
    FileName: string;
    FilePath: string;
    FileType: string;
    TemplateContent: string;
}