import { model, Schema, Document } from 'mongoose';
import { OtpValidationInf } from '@interfaces/general.interface';

const otpValidationSchema: Schema = new Schema(
  {
    phone_country_code: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      require: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const otpValidationModel = model<OtpValidationInf & Document>('otp-validation', otpValidationSchema);

export default otpValidationModel;
