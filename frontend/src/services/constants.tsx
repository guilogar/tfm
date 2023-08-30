export const LAST_MONTHS_OPTIONS = [
  'LAST_ONE_MONTH',
  'LAST_THREE_MONTHS',
  'LAST_SIX_MONTHS',
];

export const NEXT_MONTHS_OPTIONS = [
  'NEXT_ONE_MONTH',
  'NEXT_THREE_MONTHS',
  'NEXT_SIX_MONTHS',
];

export interface iLastNeextMonthsNumeric {
  LAST_ONE_MONTH: number;
  LAST_THREE_MONTHS: number;
  LAST_SIX_MONTHS: number;
  NEXT_ONE_MONTH: number;
  NEXT_THREE_MONTHS: number;
  NEXT_SIX_MONTHS: number;
}

export type tLastNeextMonthsNumeric =
  | 'LAST_ONE_MONTH'
  | 'LAST_THREE_MONTHS'
  | 'LAST_SIX_MONTHS'
  | 'NEXT_ONE_MONTH'
  | 'NEXT_THREE_MONTHS'
  | 'NEXT_SIX_MONTHS';

export const LAST_NEXT_MONTHS_NUMERIC: iLastNeextMonthsNumeric = {
  LAST_ONE_MONTH: -1,
  LAST_THREE_MONTHS: -3,
  LAST_SIX_MONTHS: -6,
  NEXT_ONE_MONTH: 1,
  NEXT_THREE_MONTHS: 3,
  NEXT_SIX_MONTHS: 6,
};
