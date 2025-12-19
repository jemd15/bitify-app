export interface ProfileHeaderProps {
  avatarUrl?: string;
  fullName?: string;
  onAvatarChange: (avatarUrl: string) => Promise<void>;
}
