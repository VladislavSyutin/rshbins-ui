import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputPasswordProps } from './index.js';
import InputPassword from './index.js';

const meta = {
  title: 'Legacy/Components/InputPassword',
  component: InputPassword,
  tags: ['autodocs'],
  args: {
    clearable: true,
    dataId: 'legacy-input-password',
    helperText: 'Введите пароль',
    invalid: false,
    label: 'Пароль'
  },
  argTypes: {
    helperIcon: {
      control: false,
      table: {
        disable: true
      }
    },
    onValueChange: {
      control: false,
      table: {
        disable: true
      }
    },
    showHelperIcon: {
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
} satisfies Meta<typeof InputPassword>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputPasswordProps) => (
    <div style={surfaceStyle}>
      <InputPassword {...args} />
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
        <InputPassword dataId="input-password-empty" label="Пароль" />
        <InputPassword dataId="input-password-entered" label="Пароль" value="Password-2026!" />
        <InputPassword
          dataId="input-password-error"
          helperText="Обязательно для заполнения"
          invalid
          label="Пароль"
        />
        <InputPassword dataId="input-password-disabled" disabled label="Пароль" />
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
  render: () => <ControlledPasswordExample />
};

function ControlledPasswordExample() {
  const [value, setValue] = useState('');

  return (
    <div style={surfaceStyle}>
      <InputPassword
        dataId="input-password-controlled"
        helperText="Разрешены латинские буквы, цифры и спецсимволы"
        label="Пароль"
        onValueChange={setValue}
        value={value}
      />
    </div>
  );
}

const surfaceStyle = {
  background: 'var(--color-background-default-primary)',
  minHeight: 240,
  padding: 32
};

const matrixStyle = {
  display: 'grid',
  gap: 24,
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))'
};
