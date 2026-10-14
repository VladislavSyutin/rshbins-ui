import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import PassportForm from './index.js';
const initial = {
  number: '1234 567890',
  divisionCode: '000-000',
  issueDate: '20.07.1990',
  issuedBy: 'ГУ МВД РОССИИ ПО Г МОСКВЕ'
};
const meta = {
  title: 'Legacy/Components/PassportForm',
  component: PassportForm,
  tags: ['autodocs'],
  args: { value: initial, onChange: () => undefined }
} satisfies Meta<typeof PassportForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = { render: (args) => <Example {...args} /> };
function Example(args: React.ComponentProps<typeof PassportForm>) {
  const [value, setValue] = useState(args.value);
  return (
    <div style={{ padding: 32, maxWidth: 448 }}>
      <PassportForm {...args} value={value} onChange={setValue} />
    </div>
  );
}
