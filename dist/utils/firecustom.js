"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const admin = tslib_1.__importStar(require("firebase-admin"));
class FireCustom {
    constructor() {
        this.sendAllNotification = (messages) => {
            return admin
                .messaging()
                .sendMulticast(messages)
                .then(onFulfilled => {
                return onFulfilled;
            })
                .catch(onRejected => {
                console.log('>>>>>>>>>>>>>>>>>>> FIREBASE MESSAGE Rejected', onRejected);
            });
        };
        this.init();
    }
    async init() {
        const firebaseConfig = await Promise.resolve().then(() => tslib_1.__importStar(require(`../firebase-admin-sdk.json`)));
        const firebaseParams = {
            type: firebaseConfig.type,
            projectId: firebaseConfig.project_id,
            privateKeyId: firebaseConfig.private_key_id,
            privateKey: firebaseConfig.private_key,
            clientEmail: firebaseConfig.client_email,
            clientId: firebaseConfig.client_id,
            authUri: firebaseConfig.auth_uri,
            tokenUri: firebaseConfig.token_uri,
            authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
            clientC509CertUrl: firebaseConfig.client_x509_cert_url,
        };
        admin.initializeApp({
            credential: admin.credential.cert(firebaseParams),
        });
        console.log('************* Firebase Initialized *************');
    }
    /**
     * Notification method which shoots only notify `Android device` at present
     */
    sendNotification(token, messagePayload) {
        admin
            .messaging()
            .send({
            token,
            android: Object.assign({ priority: 'high' }, messagePayload),
        })
            .then(onFulfilled => {
            console.log('>>>>>>>>>>>>>>>>>>> FIREBASE SEND Fulfilled', onFulfilled);
        })
            .catch(onRejected => {
            console.log('>>>>>>>>>>>>>>>>>>> FIREBASE MESSAGE Rejected', onRejected);
        });
    }
}
exports.default = new FireCustom();
//# sourceMappingURL=firecustom.js.map