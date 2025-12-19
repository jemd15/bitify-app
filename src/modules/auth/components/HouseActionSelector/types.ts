export type HouseAction = 'create' | 'accept_invitation';

export interface HouseActionSelectorProps {
  selectedAction?: HouseAction;
  onActionSelect: (action: HouseAction) => void;
}
