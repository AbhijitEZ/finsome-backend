/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export declare const isEmpty: (value: string | number | object) => boolean;
export declare const profileImageGenerator: (imageName: string) => string;
export declare const postAssetsGenerator: (imageName: string) => string;
export declare const fileUnSyncFromLocalStroage: (path: string) => void;
export declare const dateFormatter: (date: string) => string;
export declare const listingResponseSanitize: (data: any) => {
    total_count: any;
    result: any;
};
export declare const includeDeletedAtMatch: (data: any) => any;
