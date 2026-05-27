import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

export type LegacyCalendarView = 'day' | 'month' | 'year';

export interface LegacyCalendarDayItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  anotherMonth?: boolean;
  dataId?: string;
  day: number;
  selected?: boolean;
}

export interface LegacyCalendarPeriodItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  dataId?: string;
  label: string;
  selected?: boolean;
}

export interface LegacyCalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'value'> {
  dataId?: string;
  defaultValue?: Date;
  initialView?: LegacyCalendarView;
  maxDate?: Date;
  minDate?: Date;
  onChange?: (value: Date) => void;
  value?: Date;
}

export function CalendarDayItem(props: LegacyCalendarDayItemProps): JSX.Element;
export function CalendarPeriodItem(props: LegacyCalendarPeriodItemProps): JSX.Element;

declare const Calendar: {
  (props: LegacyCalendarProps): JSX.Element;
  views: Record<LegacyCalendarView, LegacyCalendarView>;
};

export default Calendar;
