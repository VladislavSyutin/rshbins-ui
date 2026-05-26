import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar, {
  CalendarDayItem,
  CalendarPeriodItem,
  type LegacyCalendarItemPreviewState
} from './index.js';

const today = new Date();

const meta = {
  title: 'Legacy/Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    dataId: 'legacy-calendar',
    initialView: 'day'
  },
  argTypes: {
    className: {
      control: false
    },
    defaultValue: {
      control: false
    },
    maxDate: {
      control: false
    },
    minDate: {
      control: false
    },
    onChange: {
      control: false,
      table: {
        disable: true
      }
    },
    value: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-xl)',
  padding: 'var(--space-paddings-inside-xl)',
  borderRadius: 'var(--radius-l)',
  background: 'var(--color-background-default-primary)'
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-m)'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 'var(--space-margins-inside-xl)'
};

const compactRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--space-margins-inside-m)'
};

const staticItemStyle: CSSProperties = {
  pointerEvents: 'none'
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

const dayStates: Array<{
  anotherMonth?: boolean;
  day: number;
  disabled?: boolean;
  label: string;
  previewState?: LegacyCalendarItemPreviewState;
  selected?: boolean;
}> = [
  { day: 29, label: 'Default' },
  { day: 29, label: 'Hover', previewState: 'hover' },
  { day: 29, label: 'Focused', previewState: 'focused' },
  { day: 29, label: 'Active', selected: true },
  { day: 29, disabled: true, label: 'Disabled' },
  { anotherMonth: true, day: 29, label: 'Another month' },
  { anotherMonth: true, day: 29, label: 'Another month hover', previewState: 'hover' },
  { anotherMonth: true, day: 29, label: 'Another month focused', previewState: 'focused' }
];

const periodStates: Array<{
  disabled?: boolean;
  label: string;
  previewState?: LegacyCalendarItemPreviewState;
  selected?: boolean;
  text: string;
}> = [
  { label: 'Default', text: 'Май' },
  { label: 'Hover', previewState: 'hover', text: 'Май' },
  { label: 'Focused', previewState: 'focused', text: 'Май' },
  { label: 'Active', selected: true, text: 'Май' },
  { disabled: true, label: 'Disabled', text: 'Май' }
];

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <Calendar {...args} />
    </div>
  )
};

export const Overview: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Variants</h3>
        <p style={metaStyle}>Легаси-адаптация тех же трёх режимов: день, месяц и год.</p>
        <div style={rowStyle}>
          <Calendar dataId="legacy-calendar-day" defaultValue={today} initialView="day" />
          <Calendar dataId="legacy-calendar-month" defaultValue={today} initialView="month" />
          <Calendar dataId="legacy-calendar-year" defaultValue={today} initialView="year" />
        </div>
      </section>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Day item states</h3>
        <p style={metaStyle}>Состояния CalendarDayItem, включая соседние месяцы.</p>
        <div style={compactRowStyle}>
          {dayStates.map((state) => (
            <div key={state.label} style={state.disabled ? undefined : staticItemStyle}>
              <CalendarDayItem
                anotherMonth={state.anotherMonth}
                dataId={'legacy-calendar-day-item-' + state.label.toLowerCase().replace(/\s+/g, '-')}
                day={state.day}
                disabled={state.disabled}
                previewState={state.previewState}
                selected={state.selected}
              />
            </div>
          ))}
        </div>
      </section>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Period item states</h3>
        <p style={metaStyle}>Состояния CalendarPeriodItem для месяцев и лет.</p>
        <div style={compactRowStyle}>
          {periodStates.map((state) => (
            <div key={state.label} style={state.disabled ? undefined : staticItemStyle}>
              <CalendarPeriodItem
                dataId={'legacy-calendar-period-item-' + state.label.toLowerCase()}
                disabled={state.disabled}
                label={state.text}
                previewState={state.previewState}
                selected={state.selected}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
};

export const LimitedRange: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Range restrictions</h3>
        <p style={metaStyle}>Пример с отключёнными днями, месяцами и годами вне допустимого периода.</p>
        <Calendar
          dataId="legacy-calendar-limited-range"
          defaultValue={new Date(2026, 4, 26)}
          maxDate={new Date(2026, 5, 10)}
          minDate={new Date(2026, 4, 10)}
        />
      </section>
    </div>
  )
};
