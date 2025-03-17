
export interface MenuItem {
    title: string;
    icon?: string;
    route?: string;
    children?: MenuItem[];
    expanded?: boolean;
}