/// <reference types="multer" />
declare class AWSHandler {
    constructor();
    init(): void;
    deleteProfileImage(profilePhoto: string): void;
    deletePostAsset(name: string): void;
    addAssets(file: Express.Multer.File, imageFolder?: string, fileContent?: any): Promise<string>;
}
declare const _default: AWSHandler;
export default _default;
