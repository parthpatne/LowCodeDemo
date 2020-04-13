export declare namespace Utils {
    function parseUrlQueries(url: string): {
        [key: string]: string;
    };
    function isValidJson(json: string): boolean;
    function sanitizeHtmlTags(str: string): string;
    function executeFunction(funcNameWithNamespaces: string, args?: any[]): void;
    function replaceCharacterInString(str: string, oldChar: string, newChar: string): string;
    function jsonIsArray(json: JSON): boolean;
    function isEmptyString(str: string): boolean;
    function isEmptyObject(obj: any): boolean;
    function parseJson(jsonString: any, defaultValue?: any): any;
    function stringifyJson(obj: any): string;
    function daysTillDate(timeStamp: number): number;
    function formatTime(date: Date): string;
    function formatDate(date: Date): string;
}
