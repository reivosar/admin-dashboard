export type User = {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female" | "other";
  birth_date: string;
  activated_at?: string;
  lastActivity?: string;
};
