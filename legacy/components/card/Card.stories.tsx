import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyCardProps } from './index.js';
import Card from './index.js';

const meta = {
  title: 'Legacy/Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    dataId: 'legacy-card'
  }
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-xl)',
  padding: 'var(--space-paddings-inside-xl)',
  borderRadius: 'var(--radius-l)',
  background: 'var(--color-background-default-secondary)'
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

export const Playground: Story = {
  render: (args: LegacyCardProps) => (
    <div style={surfaceStyle}>
      <Card
        {...args}
        style={{
          gap: 'var(--space-margins-inside-s)',
          border: '1px dashed var(--color-border-default-default)',
          ...args.style
        }}
      >
        <div style={{ padding: 'var(--space-paddings-inside-m)' }}>
          <h3 style={titleStyle}>Заголовок</h3>
          <p style={metaStyle}>Базовый preview-shell без внутренних отступов по умолчанию.</p>
        </div>
      </Card>
    </div>
  )
};
