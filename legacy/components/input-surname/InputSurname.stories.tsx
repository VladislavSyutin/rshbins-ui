import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputSurnameProps } from './index.js';
import InputSurname from './index.js';

const meta = {
  title: 'Legacy/Components/InputSurname',
  component: InputSurname,
  tags: ['autodocs'],
  args: {
    clearable: true,
    dataId: 'legacy-input-surname',
    helperText: 'Обязательно для заполнения',
    invalid: false,
    label: 'Фамилия'
  }
} satisfies Meta<typeof InputSurname>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputSurnameProps) => (
    <div style={surfaceStyle}>
      <InputSurname {...args} />
    </div>
  )
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={matrixStyle}>
        <InputSurname dataId="input-surname-empty" />
        <InputSurname dataId="input-surname-entered" value="Иванов-Петров" />
        <InputSurname dataId="input-surname-error" helperText="Обязательно для заполнения" invalid />
        <InputSurname dataId="input-surname-disabled" disabled value="Иванов" />
      </div>
    </div>
  )
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledExample />
};

function ControlledExample() {
  const [value, setValue] = useState('');

  return (
    <div style={surfaceStyle}>
      <InputSurname dataId="input-surname-controlled" onValueChange={setValue} value={value} />
    </div>
  );
}

const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 240, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
