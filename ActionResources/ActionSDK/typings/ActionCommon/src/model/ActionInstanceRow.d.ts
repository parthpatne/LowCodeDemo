export interface ActionInstanceRow {
    id?: string;
    creatorId?: string;
    createTime?: number;
    updateTime?: number;
    isAnonymous?: boolean;
    isUpdate?: boolean;
    row: {
        [key: string]: string;
    };
}
