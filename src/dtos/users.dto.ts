import { GENDER_CONST } from '@/utils/constants';
import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class VerifyPhoneDto {
  @IsNotEmpty()
  @IsString()
  phone_country_code: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;
}

export class VerifyOtpDTO extends VerifyPhoneDto {
  @IsNotEmpty()
  @IsNumber()
  otp: number;
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
  @IsNumber()
  trading_exp: number;

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
  password: string;
}
