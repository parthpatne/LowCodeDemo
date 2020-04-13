export declare class Localizer {
    private static jsonObject;
    /**
     * Get localized Action strings. It will first try to fetch the proper locale strings
     * i.e. content of string_<language>.json within the Action package. If that is not
     * found it will fallback to default locale strings i.e. strings_en.json file.
     * @return promise returning either success or ActionError
     */
    static initialize(): Promise<boolean>;
    /**
     * Get localized value of the given string id.
     * If any id is not found the same will be returned.
     * @param stringId id of the string to be localized
     * @param args any arguments which needs to passed
     */
    static getString(id: string, ...args: any[]): string;
    private static getStringInternal;
}
