export interface AvailabilityDay {
  date: string;
  availableDesks?: number;
  isDisabled: boolean;
}

export interface AvailabilityWeek {
  week: string;
  days: AvailabilityDay[];
}
