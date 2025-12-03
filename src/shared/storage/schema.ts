/**
 * Device data that's specific to the device and does not vary based on account
 */
export type Device = {
  appLanguage: 'es' | 'en'
  hasSeenOnboarding: boolean
  lastSyncTimestamp: number | undefined
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    notificationsEnabled: boolean
  }
}

/**
 * Account data that's specific to the account on this device
 */
export type Account = {
  lastViewedHouseId: string | undefined
  taskFilters: {
    showCompleted: boolean
    selectedRoomId: string | null
  }
  searchHistory: string[]
}

