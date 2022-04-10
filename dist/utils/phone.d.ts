export declare const createPhoneCodeToVerify: () => string;
export declare const checkPhoneNumberCountryCodeForSMSCalling: ({ countryCode, phoneNumber, codeData, }: {
    countryCode: string;
    phoneNumber: string;
    codeData: {
        code: string;
    };
}) => Promise<void>;
export declare const indiaPhoneNumberSMSHandler: (phoneNumber: any, codeData: any) => Promise<void>;
export declare const usCanadaPhoneNumberSMSHandler: (phoneNumber: any, codeData: any) => Promise<void>;
export declare const intervalDurationOTPCheck: (startDate: Date) => boolean;
