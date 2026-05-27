import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyRadioGroupDirection, LegacyRadioGroupProps } from './index.js';
import RadioGroup from './index.js';

/** Storybook-only: visual states for the preview matrix */
type RadioGroupPreviewState = 'default' | 'hover' | 'focused';

const defaultOptions = [
  { label: 'Контент', value: 'first', dataId: 'radio-first' },
  { label: 'Контент', value: 'second', dataId: 'radio-second' },
  { label: 'Контент', value: 'third', dataId: 'radio-third' },
];

const directions: LegacyRadioGroupDirection[] = ['vertical', 'horizontal'];
const previewStates: RadioGroupPreviewState[] = ['default', 'hover', 'focused'];

/**
 * Storybook-only wrapper: injects data-preview-state on each option label element
 * so CSS preview-state rules fire without exposing previewState as a public prop.
 */
function RadioGroupWithPreviewState({
  previewState,
  ...props
}: LegacyRadioGroupProps & { previewState?: RadioGroupPreviewState }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || !previewState || previewState === 'default') return;
    const root = wrapperRef.current.firstElementChild;
    if (!root) return;
    root.querySelectorAll('.rshb-legacy-radio-group__option').forEach((el) => {
      (el as HTMLElement).setAttribute('data-preview-state', previewState);
    });
  }, [previewState]);

  return (
    <div ref={wrapperRef}>
      <RadioGroup {...props} />
    </div>
  );
}

const meta = {
  title: 'Legacy/Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    dataId: 'storybook-radio-group',
    defaultValue: 'first',
    direction: 'vertical',
    disabled: false,
    options: defaultOptions,
    required: false,
  },
  argTypes: {
    onChange: {
      control: false,
      table: { disable: true },
    },
    value: {
      control: false,
      table: { disable: true },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ defaultValue = 'first', onChange, options = defaultOptions, ...args }: LegacyRadioGroupProps) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <div style={surfaceStyle}>
        <RadioGroup
          {...args}
          options={options}
          value={value}
          onChange={(nextValue, event) => {
            setValue(nextValue);
            if (onChange) {
              onChange(nextValue, event);
            }
          }}
        />
      </div>
    );
  },
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        {directions.map((direction) => (
          <section key={direction} style={sectionStyle}>
            <h3 style={titleStyle}>{direction === 'vertical' ? 'Vertical' : 'Horizontal'}</h3>
            <RadioGroup
              dataId={`overview-${direction}`}
              defaultValue="account"
              direction={direction}
              options={defaultOptions}
            />
          </section>
        ))}
      </div>
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={matrixStyle}>
        <div />
        {previewStates.map((state) => (
          <p key={state} style={metaStyle}>
            {state}
          </p>
        ))}
        <p style={metaStyle}>Inactive</p>
        {previewStates.map((state) => (
          <RadioGroupWithPreviewState
            key={`inactive-${state}`}
            name={`states-inactive-${state}`}
            options={[{ label: 'Контент', value: 'first' }]}
            previewState={state}
          />
        ))}
        <p style={metaStyle}>Active</p>
        {previewStates.map((state) => (
          <RadioGroupWithPreviewState
            key={`active-${state}`}
            defaultValue="first"
            name={`states-active-${state}`}
            options={[{ label: 'Контент', value: 'first' }]}
            previewState={state}
          />
        ))}
      </div>
    </div>
  ),
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'minmax(0, 1fr)',
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '12px',
};

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: '12px 16px',
  alignItems: 'center',
  gridTemplateColumns: '120px repeat(3, minmax(120px, max-content))',
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)',
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)',
};
