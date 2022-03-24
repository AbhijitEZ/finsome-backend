const twilio = require('twilio');
import { HttpException } from '@/exceptions/HttpException';
import { APP_ERROR_MESSAGE } from './constants';
import { customAlphabet } from 'nanoid';
import axios from 'axios';

/* Twilio Client is created */
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const createPhoneCodeToVerify = () => {
  const nanoid = customAlphabet('0123456789', 4);
  return nanoid();
};

const createPhoneSMSBody = (code: string) => `OTP code for finsom is: ${code}`;

export const checkPhoneNumberCountryCodeForSMSCalling = ({
  countryCode,
  phoneNumber,
  codeData,
}: {
  countryCode: string;
  phoneNumber: string;
  codeData: any;
}) => {
  switch (countryCode) {
    case '+91':
      return indiaPhoneNumberSMSHandler('91' + phoneNumber, codeData);

    case '+1':
      return usCanadaPhoneNumberSMSHandler('1' + phoneNumber, codeData);

    default:
      throw new HttpException(400, APP_ERROR_MESSAGE.phone_invalid);
  }
};

export const indiaPhoneNumberSMSHandler = async (phoneNumber, codeData) => {
  try {
    await axios.post('https://api.textlocal.in/send/', {
      apikey: process.env.TEXT_LOCAL_API_KEY,
      numbers: phoneNumber,
      message: createPhoneSMSBody(codeData.code),
      sender: 'Finsom Admin',
    });
  } catch (error) {
    console.log('ERROR with TEXT LOCAL: ', error);
    throw new HttpException(411, APP_ERROR_MESSAGE.error_with_textlocal);
  }
};

export const usCanadaPhoneNumberSMSHandler = async (phoneNumber, codeData) => {
  try {
    await twilioClient.messages.create({
      body: createPhoneSMSBody(codeData.code),
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  } catch (error) {
    console.log('ERROR with TWILIO: ', error);
    throw new HttpException(411, APP_ERROR_MESSAGE.error_with_twilio);
  }
};
