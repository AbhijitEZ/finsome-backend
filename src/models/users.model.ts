import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';
import { APP_ERROR_MESSAGE, USER_ROLE } from '@/utils/constants';

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
    bio: {
      type: String,
    },
    youtube_link: {
      type: String,
    },
    instagram_link: {
      type: String,
    },
    telegram_link: {
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

userSchema.post('save', function (error, doc, next) {
  // Unqiue Email error handler
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error(APP_ERROR_MESSAGE.email_exists));
  } else {
    next(error);
  }
});

const userModel = model<User & Document>('users', userSchema);

export default userModel;
