import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import PolicyholderForm from './index.js';
const initial = {
  birthDate: '02.06.2001',
  email: 'syutinvi@rshbins.ru',
  firstName: 'Владислав',
  lastName: 'Сютин',
  middleName: 'Игоревич',
  noMiddleName: false,
  gender: 'male' as const
};
const meta = {
  title: 'Legacy/Components/PolicyholderForm',
  component: PolicyholderForm,
  tags: ['autodocs'],
  args: { value: initial, onChange: () => undefined }
} satisfies Meta<typeof PolicyholderForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = { render: (args) => <Example {...args} /> };
function Example(args: React.ComponentProps<typeof PolicyholderForm>) {
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ padding: 32, maxWidth: 448 }}>
      <PolicyholderForm {...args} value={value} onChange={setValue} />
    </div>
  );
}
