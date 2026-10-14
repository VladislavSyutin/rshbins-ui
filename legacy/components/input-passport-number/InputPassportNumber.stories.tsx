import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import InputPassportNumber from './index.js';
const meta = {
  title: 'Legacy/Components/InputPassportNumber',
  component: InputPassportNumber,
  tags: ['autodocs'],
  args: { label: 'Серия и номер', dataId: 'inputpassportnumber' }
} satisfies Meta<typeof InputPassportNumber>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 32 }}>
      <InputPassportNumber {...args} />
    </div>
  )
};
export const Controlled: Story = { render: () => <Example /> };
function Example() {
  const [value, setValue] = useState('1234 567890');
  return (
    <div style={{ padding: 32 }}>
      <InputPassportNumber
        label="Серия и номер"
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}
