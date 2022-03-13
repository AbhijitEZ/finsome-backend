/// <reference types="multer" />
declare class AWSHandler {
    constructor();
    init(): void;
    deleteProfileImage(profilePhoto: string): void;
    addProfileImage(file: Express.Multer.File): Promise<string>;
}
declare const _default: AWSHandler;
export default _default;
