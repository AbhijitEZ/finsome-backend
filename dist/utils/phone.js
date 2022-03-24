"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usCanadaPhoneNumberSMSHandler = exports.indiaPhoneNumberSMSHandler = exports.checkPhoneNumberCountryCodeForSMSCalling = exports.createPhoneCodeToVerify = void 0;
const tslib_1 = require("tslib");
const twilio = require('twilio');
const HttpException_1 = require("../exceptions/HttpException");
const constants_1 = require("./constants");
const nanoid_1 = require("nanoid");
const axios_1 = tslib_1.__importDefault(require("axios"));
/* Twilio Client is created */
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const createPhoneCodeToVerify = () => {
    const nanoid = (0, nanoid_1.customAlphabet)('0123456789', 4);
    return nanoid();
};
exports.createPhoneCodeToVerify = createPhoneCodeToVerify;
const createPhoneSMSBody = (code) => `OTP code for finsom is: ${code}`;
const checkPhoneNumberCountryCodeForSMSCalling = ({ countryCode, phoneNumber, codeData, }) => {
    switch (countryCode) {
        case '+91':
            return (0, exports.indiaPhoneNumberSMSHandler)('91' + phoneNumber, codeData);
        case '+1':
            return (0, exports.usCanadaPhoneNumberSMSHandler)('1' + phoneNumber, codeData);
        default:
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.phone_invalid);
    }
};
exports.checkPhoneNumberCountryCodeForSMSCalling = checkPhoneNumberCountryCodeForSMSCalling;
const indiaPhoneNumberSMSHandler = async (phoneNumber, codeData) => {
    try {
        await axios_1.default.post('https://api.textlocal.in/send/', {
            apikey: process.env.TEXT_LOCAL_API_KEY,
            numbers: phoneNumber,
            message: createPhoneSMSBody(codeData.code),
            sender: 'Finsom Admin',
        });
    }
    catch (error) {
        console.log('ERROR with TEXT LOCAL: ', error);
        throw new HttpException_1.HttpException(411, constants_1.APP_ERROR_MESSAGE.error_with_textlocal);
    }
};
exports.indiaPhoneNumberSMSHandler = indiaPhoneNumberSMSHandler;
const usCanadaPhoneNumberSMSHandler = async (phoneNumber, codeData) => {
    try {
        await twilioClient.messages.create({
            body: createPhoneSMSBody(codeData.code),
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
    }
    catch (error) {
        console.log('ERROR with TWILIO: ', error);
        throw new HttpException_1.HttpException(411, constants_1.APP_ERROR_MESSAGE.error_with_twilio);
    }
};
exports.usCanadaPhoneNumberSMSHandler = usCanadaPhoneNumberSMSHandler;
//# sourceMappingURL=phone.js.map