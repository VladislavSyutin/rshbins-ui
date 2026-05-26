import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyGenderProps, LegacyGenderValue } from './index.js';
import Gender from './index.js';

const meta = {
  title: 'Legacy/Components/Gender',
  component: Gender,
  tags: ['autodocs'],
  args: {
    defaultValue: undefined,
    femaleLabel: 'Жен',
    invalid: false,
    maleLabel: 'Муж',
    required: false
  },
  argTypes: {
    onChange: {
      control: false,
      table: { disable: true }
    },
    value: {
      control: false,
      table: { disable: true }
    },
    defaultValue: {
      control: 'select',
      options: [undefined, 'male', 'female']
    }
  }
} satisfies Meta<typeof Gender>;

export default meta;

type Story = StoryObj<typeof meta>;

const states: Array<{ label: string; props: Partial<LegacyGenderProps> }> = [
  { label: 'Default', props: {} },
  { label: 'Male', props: { value: 'male' } },
  { label: 'Female', props: { value: 'female' } },
  { label: 'Error', props: { invalid: true, value: undefined } }
];

export const Playground: Story = {
  render: ({ defaultValue, onChange, ...args }) => {
    const [value, setValue] = useState<LegacyGenderValue | undefined>(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <div style={surfaceStyle}>
        <Gender
          {...args}
          value={value}
          onChange={(nextValue, event) => {
            setValue(nextValue);
            onChange?.(nextValue, event);
          }}
        />
      </div>
    );
  }
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        {states.map((state) => (
          <section key={state.label} style={cardStyle}>
            <h3 style={titleStyle}>{state.label}</h3>
            <Gender {...state.props} />
          </section>
        ))}
      </div>
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, max-content))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: '12px'
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)'
};
