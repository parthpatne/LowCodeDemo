import { NavBarMenuViewData } from "./NavBarMenuViewData";

export interface NavBarMenuItem {
    id: string;
    title: string;
    icon?: string;
    iconSelected?: string;
    contentDescription?: string;
    enabled: boolean;
    viewData?: NavBarMenuViewData;
}