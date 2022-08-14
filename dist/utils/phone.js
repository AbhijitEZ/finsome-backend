"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervalDurationOTPCheck = exports.usCanadaPhoneNumberSMSHandler = exports.indiaPhoneNumberSMSHandler = exports.checkPhoneNumberCountryCodeForSMSCalling = exports.createPhoneCodeToVerify = void 0;
const tslib_1 = require("tslib");
const twilio = require('twilio');
const HttpException_1 = require("../exceptions/HttpException");
const constants_1 = require("./constants");
const nanoid_1 = require("nanoid");
const axios_1 = tslib_1.__importDefault(require("axios"));
const urlencode_1 = tslib_1.__importDefault(require("urlencode"));
const date_fns_1 = require("date-fns");
/* Twilio Client is created */
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const createPhoneCodeToVerify = () => {
    const nanoid = (0, nanoid_1.customAlphabet)('0123456789', 4);
    return nanoid();
};
exports.createPhoneCodeToVerify = createPhoneCodeToVerify;
const createPhoneSMSBody = (code) => `OTP code for finsom is: ${code}`;
// TODO: This needs to updated in TextLocal template to use custom message
const createPhoneTextLocalSMSBody = (code) => `Hi there, thank you for sending your first test message from Textlocal. Get 20% off today with our code: ${code}.`;
const checkPhoneNumberCountryCodeForSMSCalling = ({ countryCode, phoneNumber, codeData, }) => {
    switch (countryCode) {
        case '+91':
            return (0, exports.usCanadaPhoneNumberSMSHandler)('91' + phoneNumber, codeData);
        case '+1':
            return (0, exports.usCanadaPhoneNumberSMSHandler)('1' + phoneNumber, codeData);
        /* TODO: would be removed based on mobile request payload in future */
        case '1':
            return (0, exports.usCanadaPhoneNumberSMSHandler)('1' + phoneNumber, codeData);
        default:
            return (0, exports.usCanadaPhoneNumberSMSHandler)(countryCode + phoneNumber, codeData);
    }
};
exports.checkPhoneNumberCountryCodeForSMSCalling = checkPhoneNumberCountryCodeForSMSCalling;
const indiaPhoneNumberSMSHandler = async (phoneNumber, codeData) => {
    try {
        const msg = createPhoneTextLocalSMSBody(codeData.code);
        const number = phoneNumber;
        const username = process.env.TEXT_LOCAL_USER_NAME;
        const hash = process.env.TEXT_LOCAL_HASH;
        const sender = '600010';
        const dataSerial = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + number + '&message=' + (0, urlencode_1.default)(msg);
        const data = await axios_1.default.get('https://api.textlocal.in/send?' + dataSerial);
        console.log('SUCCESS DATA with TEXT LOCAL: ', data.data);
    }
    catch (error) {
        console.log('ERROR with TEXT LOCAL: ', error);
        throw new HttpException_1.HttpException(411, constants_1.APP_ERROR_MESSAGE.error_with_textlocal);
    }
};
exports.indiaPhoneNumberSMSHandler = indiaPhoneNumberSMSHandler;
const usCanadaPhoneNumberSMSHandler = async (phoneNumber, codeData) => {
    try {
        const data = await twilioClient.messages.create({
            body: createPhoneSMSBody(codeData.code),
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
        console.log('SUCCESS DATA with TWILIO: ', data);
    }
    catch (error) {
        console.log('ERROR with TWILIO: ', error);
        throw new HttpException_1.HttpException(411, constants_1.APP_ERROR_MESSAGE.error_with_twilio);
    }
};
exports.usCanadaPhoneNumberSMSHandler = usCanadaPhoneNumberSMSHandler;
const intervalDurationOTPCheck = (startDate) => {
    return ((0, date_fns_1.intervalToDuration)({
        start: (0, date_fns_1.toDate)(startDate),
        end: (0, date_fns_1.toDate)(new Date()),
    }).minutes > 10);
};
exports.intervalDurationOTPCheck = intervalDurationOTPCheck;
//# sourceMappingURL=phone.js.map