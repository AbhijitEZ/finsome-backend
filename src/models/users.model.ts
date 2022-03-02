import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';
import { USER_ROLE } from '@/utils/constants';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      default: USER_ROLE.MEMBER,
    },
    phone_country_code: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    term_agree_timestamp: {
      type: Date,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    birth_date: {
      type: Date,
    },
    trading_exp: {
      type: Number,
    },
    gender: {
      type: String,
    },
    forgot_password_otp: {
      type: String,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const userModel = model<User & Document>('users', userSchema);

export default userModel;
