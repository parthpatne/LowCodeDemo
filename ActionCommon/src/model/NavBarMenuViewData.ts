import { NavBarMenuItem } from "./NavBarMenuItem";
import { NavBarMenuListType } from "./NavBarMenuListType";

export interface NavBarMenuViewData {
    listTitle?: string;
    listType: NavBarMenuListType;
    listItems: NavBarMenuItem[];
}
