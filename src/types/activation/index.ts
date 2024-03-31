export interface ActivationUser {
  user_id: number;
  auth_id: string;
  password_hash: string;
  activation_code: string;
  expires_at: Date;
}
