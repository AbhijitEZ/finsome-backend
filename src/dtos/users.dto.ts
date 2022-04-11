import { GENDER_CONST } from '@/utils/constants';
import { IsBoolean, IsDateString, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class VerifyPhoneDto {
  @IsNotEmpty()
  @IsString()
  phone_country_code: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsOptional()
  @IsString()
  is_testing: string;
}

export class VerifyOtpDTO extends VerifyPhoneDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsOptional()
  @IsBoolean()
  is_reset_password: boolean;
}

export class ValidateUserFieldDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['phone_number', 'username', 'email'])
  field: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}

export class SignupPhoneDto extends VerifyOtpDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsDateString()
  birth_date: string;

  @IsOptional()
  @IsString()
  trading_exp: string;

  @IsOptional()
  @IsIn(Object.keys(GENDER_CONST))
  gender: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  new_password: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class ProfileUpdateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsDateString()
  birth_date: string;

  @IsOptional()
  @IsString()
  trading_exp: string;

  @IsOptional()
  @IsIn(Object.keys(GENDER_CONST))
  gender: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  youtube_link: string;

  @IsOptional()
  @IsString()
  instagram_link: string;

  @IsOptional()
  @IsString()
  telegram_link: string;

  @IsOptional()
  @IsString()
  remove_photo: string;
}

export class NotificationDto {
  @IsNotEmpty()
  @IsString()
  allow_notification: string;
}

export class AppImprovementUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class QuickContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
