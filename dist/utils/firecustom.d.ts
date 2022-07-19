declare class FireCustom {
    constructor();
    init(): Promise<void>;
    /**
     * Notification method which shoots only notify `Android device` at present
     */
    sendNotification(token: any, messagePayload: any): void;
    sendAllNotification: (messages: any) => Promise<void | import("firebase-admin/lib/messaging/messaging-api").BatchResponse>;
}
declare const _default: FireCustom;
export default _default;
