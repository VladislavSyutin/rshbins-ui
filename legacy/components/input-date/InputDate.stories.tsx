import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import InputDate from './index.js';
const meta = {
  title: 'Legacy/Components/InputDate',
  component: InputDate,
  tags: ['autodocs'],
  args: { label: 'Дата выдачи', dataId: 'inputdate' }
} satisfies Meta<typeof InputDate>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 32 }}>
      <InputDate {...args} />
    </div>
  )
};
export const Controlled: Story = { render: () => <Example /> };
function Example() {
  const [value, setValue] = useState('20.07.1990');
  return (
    <div style={{ padding: 32 }}>
      <InputDate label="Дата выдачи" value={value} onValueChange={setValue} />
    </div>
  );
}
