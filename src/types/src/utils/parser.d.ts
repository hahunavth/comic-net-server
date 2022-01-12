export declare function getDocumentByUrl(urlString: string): Promise<HTMLElement | undefined>;
declare type QueryOneT<Tk> = {
    selector: string;
    attribute?: string;
    nested?: QueryListT<Tk>;
    callback?: (el: Element) => any;
};
declare type QueryAllT<Tk> = {
    selectorAll: string;
    attribute?: string;
    nested?: QueryListT<Tk>;
    callback?: (el: Element) => any;
    aCallback?: (els: Element[]) => any;
};
declare type QueryItemT<Tk> = QueryOneT<Tk> | QueryAllT<Tk>;
declare type QueryListT<T> = {
    [k in keyof T]: QueryItemT<T[k]>;
};
export declare function parseListGen3<T>(document: HTMLElement, query: QueryListT<T>): { [k in keyof T]?: any; } | undefined;
export {};
