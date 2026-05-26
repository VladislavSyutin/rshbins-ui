import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacySwitchPreviewState, LegacySwitchProps } from './index.js';
import Switch from './index.js';

const previewStates: LegacySwitchPreviewState[] = ['default', 'hover', 'focused'];
const meta = {
  title: 'Legacy/Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    dataId: 'legacy-switch',
    defaultChecked: true,
    label: 'Контент',
    previewState: 'default'
  },
  argTypes: {
    checked: {
      control: false,
      table: {
        disable: true
      }
    },
    onChange: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

function matrixProps(previewState: LegacySwitchPreviewState): Partial<LegacySwitchProps> {
  return {
    checked: true,
    previewState: previewState,
    readOnly: true
  };
}

export const Playground: Story = {
  render: ({ defaultChecked = false, onChange, ...args }: LegacySwitchProps) => {
    const [checked, setChecked] = useState(Boolean(defaultChecked));

    useEffect(() => {
      setChecked(Boolean(defaultChecked));
    }, [defaultChecked]);

    return (
      <div style={surfaceStyle}>
        <Switch
          {...args}
          checked={checked}
          onChange={(event) => {
            setChecked(event.target.checked);
            if (onChange) {
              onChange(event);
            }
          }}
        />
      </div>
    );
  }
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
        <h3 style={titleStyle}>Base states</h3>
        <div style={matrixStyle}>
          <div />
          {previewStates.map((state) => (
            <p key={state} style={metaStyle}>
              {state}
            </p>
          ))}
          <p style={metaStyle}>Active</p>
          {previewStates.map((state) => (
            <Switch
              {...matrixProps(state)}
              dataId={'legacy-switch-active-' + state}
              key={'active-' + state}
              label="Контент"
            />
          ))}
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
  backgroundColor: 'var(--color-background-default-primary)'
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-m)'
};

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-s) var(--space-margins-inside-m)',
  alignItems: 'center',
  gridTemplateColumns: '120px repeat(3, max-content)'
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
