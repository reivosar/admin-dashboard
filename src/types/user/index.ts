export interface UserWithDetails {
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

export interface UserProfile {
  name: string;
  birth_date: Date | string;
  gender: string;
}

export interface UserAuthorization {
  auth_id: string;
  password_hash: string;
}

export interface UserContact {
  email: string;
}
