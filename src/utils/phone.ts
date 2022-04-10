const twilio = require('twilio');
import { HttpException } from '@/exceptions/HttpException';
import { APP_ERROR_MESSAGE } from './constants';
import { customAlphabet } from 'nanoid';
import axios from 'axios';
import ulencode from 'urlencode';
import { intervalToDuration, toDate } from 'date-fns';

/* Twilio Client is created */
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const createPhoneCodeToVerify = () => {
  const nanoid = customAlphabet('0123456789', 4);
  return nanoid();
};

const createPhoneSMSBody = (code: string) => `OTP code for finsom is: ${code}`;

// TODO: This needs to updated in TextLocal template to use custom message
const createPhoneTextLocalSMSBody = (code: string) =>
  `Hi there, thank you for sending your first test message from Textlocal. Get 20% off today with our code: ${code}.`;

export const checkPhoneNumberCountryCodeForSMSCalling = ({
  countryCode,
  phoneNumber,
  codeData,
}: {
  countryCode: string;
  phoneNumber: string;
  codeData: { code: string };
}) => {
  switch (countryCode) {
    case '+91':
      return indiaPhoneNumberSMSHandler('91' + phoneNumber, codeData);

    case '+1':
      return usCanadaPhoneNumberSMSHandler('1' + phoneNumber, codeData);

    /* TODO: would be removed based on mobile request payload in future */
    case '1':
      return usCanadaPhoneNumberSMSHandler('1' + phoneNumber, codeData);

    default:
      throw new HttpException(400, APP_ERROR_MESSAGE.phone_invalid);
  }
};

export const indiaPhoneNumberSMSHandler = async (phoneNumber, codeData) => {
  try {
    const msg = createPhoneTextLocalSMSBody(codeData.code);
    const number = phoneNumber;
    const username = process.env.TEXT_LOCAL_USER_NAME;
    const hash = process.env.TEXT_LOCAL_HASH;
    const sender = '600010';
    const dataSerial = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + number + '&message=' + ulencode(msg);
    const data = await axios.get('https://api.textlocal.in/send?' + dataSerial);

    console.log('SUCCESS DATA with TEXT LOCAL: ', data.data);
  } catch (error) {
    console.log('ERROR with TEXT LOCAL: ', error);
    throw new HttpException(411, APP_ERROR_MESSAGE.error_with_textlocal);
  }
};

export const usCanadaPhoneNumberSMSHandler = async (phoneNumber, codeData) => {
  try {
    const data = await twilioClient.messages.create({
      body: createPhoneSMSBody(codeData.code),
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    console.log('SUCCESS DATA with TWILIO: ', data);
  } catch (error) {
    console.log('ERROR with TWILIO: ', error);
    throw new HttpException(411, APP_ERROR_MESSAGE.error_with_twilio);
  }
};

export const intervalDurationOTPCheck = (startDate: Date) => {
  return (
    intervalToDuration({
      start: toDate(startDate),
      end: toDate(new Date()),
    }).minutes > 10
  );
};
