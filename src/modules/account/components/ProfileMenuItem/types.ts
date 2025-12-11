export type RightElementIcon = {
  type: 'icon';
  name: string;
};

export type RightElementSwitch = {
  type: 'switch';
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export type RightElementSelect = {
  type: 'select';
  value: string;
  options: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
};

export type RightElementNone = {
  type: 'none';
};

export type RightElement =
  | RightElementIcon
  | RightElementSwitch
  | RightElementSelect
  | RightElementNone;

export interface ProfileMenuItemProps {
  leftIcon: string;
  title: string;
  description?: string;
  rightElement: RightElement;
  onPress?: () => void;
}
