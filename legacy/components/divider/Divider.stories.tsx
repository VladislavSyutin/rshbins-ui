import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyDividerProps, LegacyDividerView } from './index.js';
import Divider from './index.js';

const views: Array<{ label: string; value: LegacyDividerView }> = [
  { label: 'With text', value: 'text' },
  { label: 'Without text', value: 'without-text' }
];

const meta = {
  title: 'Legacy/Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  args: {
    label: 'или',
    view: 'text'
  },
  argTypes: {
    view: {
      control: 'select',
      options: ['text', 'without-text']
    }
  }
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyDividerProps) => (
    <div style={surfaceStyle}>
      <Divider {...args} />
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
        {views.map((view) => (
          <div key={view.value} style={rowStyle}>
            <p style={metaStyle}>{view.label}</p>
            <Divider view={view.value} />
          </div>
        ))}
      </section>
    </div>
  )
};

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
  display: 'grid',
  gap: 'var(--space-margins-inside-xs)'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
