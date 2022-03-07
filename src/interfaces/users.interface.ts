export interface User {
  _id: string;
  email: string;
  password: string;
  role: string;
  term_agree_timestamp: string;
  updated_at: string;
  is_registration_complete: boolean;
}
