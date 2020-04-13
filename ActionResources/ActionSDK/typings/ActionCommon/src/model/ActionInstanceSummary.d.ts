export interface ActionInstanceSummary {
    rowCount: number;
    rowCreatorCount: number;
    aggregates?: {
        [key: string]: string;
    };
}
