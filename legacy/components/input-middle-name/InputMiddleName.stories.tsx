import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputMiddleNameProps } from './index.js';
import InputMiddleName from './index.js';

const meta = {
  title: 'Legacy/Components/InputMiddleName',
  component: InputMiddleName,
  tags: ['autodocs'],
  args: {
    clearable: true,
    dataId: 'legacy-input-middle-name',
    helperText: 'Обязательно для заполнения',
    invalid: false,
    label: 'Отчество',
    switchLabel: 'Нет отчества'
  }
} satisfies Meta<typeof InputMiddleName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputMiddleNameProps) => (
    <div style={surfaceStyle}>
      <InputMiddleName {...args} />
    </div>
  )
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={matrixStyle}>
        <InputMiddleName dataId="input-middle-name-empty" />
        <InputMiddleName dataId="input-middle-name-entered" value="Иванович" />
        <InputMiddleName dataId="input-middle-name-error" helperText="Обязательно для заполнения" invalid />
        <InputMiddleName dataId="input-middle-name-disabled" disabled value="Иванович" />
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
  const [withoutMiddleName, setWithoutMiddleName] = useState(false);

  return (
    <div style={surfaceStyle}>
      <InputMiddleName
        dataId="input-middle-name-controlled"
        onSwitchChange={setWithoutMiddleName}
        onValueChange={setValue}
        switchChecked={withoutMiddleName}
        value={value}
      />
    </div>
  );
}

const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 260, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
