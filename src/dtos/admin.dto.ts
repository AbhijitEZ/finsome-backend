import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class IdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class AdminLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class ToggleUserStatusDto extends IdDto {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}

export class PrivacyPolicyDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
