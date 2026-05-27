import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  LegacyRadioGroupDirection,
  LegacyRadioGroupPreviewState,
  LegacyRadioGroupProps,
} from './index.js';
import RadioGroup from './index.js';

const defaultOptions = [
  { label: 'Контент', value: 'first', dataId: 'radio-first' },
  { label: 'Контент', value: 'second', dataId: 'radio-second' },
  { label: 'Контент', value: 'third', dataId: 'radio-third' },
];

const directions: LegacyRadioGroupDirection[] = ['vertical', 'horizontal'];
const previewStates: LegacyRadioGroupPreviewState[] = ['default', 'hover', 'focused'];

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
    previewState: 'default',
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
          <RadioGroup
            key={`inactive-${state}`}
            name={`states-inactive-${state}`}
            options={[{ label: 'Контент', value: 'first', previewState: state }]}
            previewState={state}
          />
        ))}
        <p style={metaStyle}>Active</p>
        {previewStates.map((state) => (
          <RadioGroup
            key={`active-${state}`}
            defaultValue="first"
            name={`states-active-${state}`}
            options={[{ label: 'Контент', value: 'first', previewState: state }]}
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
