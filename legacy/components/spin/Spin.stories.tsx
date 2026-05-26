import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacySpinProps } from './index.js';
import Spin from './index.js';

const sizes = ['2xs', 'xs', 's', 'm', 'l', 'xl'] as const;

const meta = {
  title: 'Legacy/Components/Spin',
  component: Spin,
  tags: ['autodocs'],
  args: {
    dataId: 'legacy-spin',
    label: '',
    size: '2xs'
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['2xs', 'xs', 's', 'm', 'l', 'xl']
    }
  }
} satisfies Meta<typeof Spin>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacySpinProps) => (
    <div style={surfaceStyle}>
      <Spin {...args} />
    </div>
  )
};

export const Sizes: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      {sizes.map((size) => (
        <div key={size} style={rowStyle}>
          <p style={captionStyle}>{size.toUpperCase()}</p>
          <Spin dataId={`legacy-spin-${size}`} size={size} />
        </div>
      ))}
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-m)',
  padding: 'var(--space-paddings-inside-xl)',
  borderRadius: 'var(--radius-l)',
  background: 'var(--color-background-default-primary)',
  color: 'var(--color-text-brand-default)'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-margins-inside-m)',
  flexWrap: 'wrap'
};

const captionStyle: CSSProperties = {
  minWidth: '48px',
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
