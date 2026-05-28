import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import TextLink from './index.js';

function preventNavigation(event: any) {
  event.preventDefault();
}

const meta = {
  title: 'Legacy/Components/TextLink',
  component: TextLink,
  tags: ['autodocs'],
  args: {
    children: 'Забыли логин или пароль?',
    href: 'https://rshbins.ru',
    onClick: preventNavigation,
    size: 'm'
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['a', 'button']
    },
    onClick: {
      control: false
    },
    size: {
      control: 'select',
      options: ['m', 's']
    }
  }
} satisfies Meta<typeof TextLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <TextLink {...args} />
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
        <div style={rowStyle}>
          <p style={metaStyle}>Размер M</p>
          <TextLink as="button" onClick={() => undefined} size="m">
            Забыли логин или пароль?
          </TextLink>
        </div>
        <div style={rowStyle}>
          <p style={metaStyle}>Размер S</p>
          <p style={copyStyle}>
            Соглашаюсь на{' '}
            <TextLink
              href="https://rshbins.ru"
              onClick={preventNavigation}
              rel="noreferrer noopener"
              size="s"
              target="_blank"
            >
              передачу и обработку
            </TextLink>{' '}
            персональных данных.
          </p>
        </div>
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
  gap: 'var(--space-margins-inside-xs)',
  justifyItems: 'start'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

const copyStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
