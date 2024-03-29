import { model, Schema, Document, PaginateResult } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { User } from '@interfaces/users.interface';
import { APP_ERROR_MESSAGE, USERS, USER_ROLE } from '@/utils/constants';
import { HttpException } from '@/exceptions/HttpException';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } },
      },
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      default: USER_ROLE.MEMBER,
    },
    profile_photo: {
      type: String,
    },
    phone_country_code: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    term_agree_timestamp: {
      type: Date,
      required: true,
    },
    username: {
      type: String,
    },
    fullname: {
      type: String,
    },
    birth_date: {
      type: Date,
    },
    trading_exp: {
      type: String,
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
    is_registration_complete: {
      type: Boolean,
      default: false,
    },
    forgot_password_otp: {
      code: {
        type: String,
      },
      created_at: {
        type: Date,
      },
    },
    allow_notification: {
      type: Boolean,
      default: true,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);


userSchema.index({
  fullname: 'text',
  email: 'text',
  username: 'text',
});

userSchema.post('save', function (error, doc, next) {
  // Unqiue Email error handler
  if (error.name === 'MongoError' && error.code === 11000) {
    if (error.keyPattern?.phone_number) {
      next(new HttpException(409, APP_ERROR_MESSAGE.phone_exists));
    } else {
      next(new HttpException(409, APP_ERROR_MESSAGE.email_exists));
    }
  } else {
    next(error);
  }
});
userSchema.plugin(paginate);
const userModel = model(USERS, userSchema);

export default userModel;
