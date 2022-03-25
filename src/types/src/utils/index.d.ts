export declare const pageToPagination: (page: string, limit: string) => number;
export declare const checkDotEnv: () => void;
export declare function getComicSlug(path: string): string | null;
export declare function getChapterSlug(path: string): string | null;
/**
 * getPathFromUrl with any domain
 * @param url
 * @returns
 *
 * @example: http://abc.domain.com/slug/slug2 -> /slug/slug2
 */
export declare function getPathFromUrl(url?: string | null): string | undefined;
export declare const string2Number: (e: string | undefined) => number;
