export interface CreateHouseErrorScreenProps {
  error: Error;
  onRetry: () => void;
  isRetrying: boolean;
}
