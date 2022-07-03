import * as admin from 'firebase-admin';

class FireCustom {
  constructor() {
    this.init();
  }

  public async init() {
    const firebaseConfig = await import(`../firebase-admin-sdk.json`);
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
  public sendNotification(token, messagePayload) {
    admin.messaging().send({
      token,
      android: {
        priority: 'high',
        ...messagePayload,
      },
    });
  }
}

export default new FireCustom();
