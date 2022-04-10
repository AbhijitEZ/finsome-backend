export interface User {
  _id: string;
  email: string;
  password: string;
  role: string;
  term_agree_timestamp: string;
  updated_at: Date;
  is_registration_complete: boolean;
  profile_photo?: string;
  otp?: string;
  deleted_at?: Date;
}
