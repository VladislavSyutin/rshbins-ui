import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputBirthDateProps } from './index.js';
import InputBirthDate from './index.js';

const meta = {
  title: 'Legacy/Components/InputBirthDate',
  component: InputBirthDate,
  tags: ['autodocs'],
  args: {
    clearable: true,
    dataId: 'legacy-input-birth-date',
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Дата рождения'
  },
  argTypes: {
    onValueChange: {
      control: false,
      table: {
        disable: true
      }
    },
    startIcon: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof InputBirthDate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputBirthDateProps) => (
    <div style={surfaceStyle}>
      <InputBirthDate {...args} />
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
      <div style={matrixStyle}>
        <InputBirthDate dataId="input-birth-date-empty" label="Дата рождения" />
        <InputBirthDate dataId="input-birth-date-entered" label="Дата рождения" value="02.06.2001" />
        <InputBirthDate
          dataId="input-birth-date-error"
          helperText="Некорректная дата рождения"
          invalid
          label="Дата рождения"
        />
        <InputBirthDate dataId="input-birth-date-disabled" disabled label="Дата рождения" />
      </div>
    </div>
  )
};

export const Controlled: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <ControlledBirthDateExample />
};

function ControlledBirthDateExample() {
  const [value, setValue] = useState('');

  return (
    <div style={surfaceStyle}>
      <InputBirthDate
        dataId="input-birth-date-controlled"
        helperText="Возраст должен быть от 18 до 100 лет."
        label="Дата рождения"
        onValueChange={setValue}
        value={value}
      />
    </div>
  );
}

const surfaceStyle = {
  background: 'var(--color-background-default-primary)',
  minHeight: 320,
  padding: 32
};

const matrixStyle = {
  display: 'grid',
  gap: 24,
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))'
};
