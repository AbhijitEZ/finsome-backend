import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { OtpValidationInf } from '@interfaces/general.interface';
import { OTP_VALIDATIONS } from '@/utils/constants';

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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

otpValidationSchema.plugin(paginate);
const otpValidationModel = model<OtpValidationInf & Document>(OTP_VALIDATIONS, otpValidationSchema);

export default otpValidationModel;
