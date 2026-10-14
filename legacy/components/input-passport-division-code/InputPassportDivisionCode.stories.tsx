import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import InputPassportDivisionCode from './index.js';
const meta = {
  title: 'Legacy/Components/InputPassportDivisionCode',
  component: InputPassportDivisionCode,
  tags: ['autodocs'],
  args: { label: 'Код подразделения', dataId: 'inputpassportdivisioncode' }
} satisfies Meta<typeof InputPassportDivisionCode>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 32 }}>
      <InputPassportDivisionCode {...args} />
    </div>
  )
};
export const Controlled: Story = { render: () => <Example /> };
function Example() {
  const [value, setValue] = useState('000-000');
  return (
    <div style={{ padding: 32 }}>
      <InputPassportDivisionCode
        label="Код подразделения"
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}
