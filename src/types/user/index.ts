export interface UserModel {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female" | "other";
  birth_date: string;
  activated_at?: string;
  lastActivity?: string;
}

export interface UserModelWithDetails {
  id: number;
  name: string | null;
  birth_date: Date | null;
  gender: string | null;
  email: string | null;
  auth_id: string;
  password_hash: string;
  activated_at: Date | null;
  lastActivity: Date | null;
}

export interface UserProfileModel {
  name: string;
  birth_date: Date | string;
  gender: string;
}

export interface UserAuthorizationModel {
  auth_id: string;
  password_hash: string;
}

export interface UserContactModel {
  email: string;
}
