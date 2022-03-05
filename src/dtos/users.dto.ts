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

export class CreateUserDto extends VerifyPhoneDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsDateString()
  birth_date: string;

  @IsOptional()
  @IsNumber()
  trading_exp: number;
}

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
