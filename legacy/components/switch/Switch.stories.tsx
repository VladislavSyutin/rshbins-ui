import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacySwitchProps } from './index.js';
import Switch from './index.js';

/** Storybook-only: visual states for the preview matrix */
type SwitchPreviewState = 'default' | 'hover' | 'focused';

const previewStates: SwitchPreviewState[] = ['default', 'hover', 'focused'];

/**
 * Storybook-only wrapper: injects data-preview-state on the root label element
 * so CSS preview-state rules fire without exposing previewState as a public prop.
 */
function SwitchWithPreviewState({
  previewState,
  ...props
}: LegacySwitchProps & { previewState?: SwitchPreviewState }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || !previewState || previewState === 'default') return;
    const label = wrapperRef.current.firstElementChild as HTMLElement | null;
    if (label) {
      label.setAttribute('data-preview-state', previewState);
    }
  }, [previewState]);

  return (
    <div ref={wrapperRef}>
      <Switch {...props} />
    </div>
  );
}

const meta = {
  title: 'Legacy/Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    dataId: 'legacy-switch',
    defaultChecked: true,
    label: 'Контент'
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
            <SwitchWithPreviewState
              checked
              dataId={'legacy-switch-active-' + state}
              key={'active-' + state}
              label="Контент"
              previewState={state}
              readOnly
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
