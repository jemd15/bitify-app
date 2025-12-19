export interface OnboardingPersonalFormProps {
  initialEmail?: string;
  initialFullName?: string;
  initialAvatarUrl?: string;
  onDataChange?: (data: {
    email: string;
    fullName: string;
    avatarUri?: string;
    avatarBase64?: string;
    avatarType?: string;
  }) => void;
}

export interface OnboardingPersonalFormData {
  email: string;
  fullName: string;
  avatarUri?: string;
  avatarBase64?: string;
}
