export interface Desk {
  id: number;
  userName?: string;
  userId?: number;
  status: 'available' | 'reserved' | 'disabled' | 'user-reserved';
}

export interface DayAvailabilityResponse {
  date: string;
  isDisabled: boolean;
  availableCount: number;
  desks: Desk[];
}
