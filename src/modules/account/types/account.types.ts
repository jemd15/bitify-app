export interface AccountScreenProps {
  // Props for AccountScreen component
}

export interface ProfileScreenProps {
  // Props for ProfileScreen component
}

export type UserType = 'free' | 'pro';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileParams {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  userType?: UserType;
}

export interface UpdateProfileParams {
  fullName?: string;
  avatarUrl?: string;
  userType?: UserType;
}
