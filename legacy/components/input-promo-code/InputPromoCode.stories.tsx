import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import InputPromoCode from './index.js';
const meta = {
  title: 'Legacy/Components/InputPromoCode',
  component: InputPromoCode,
  tags: ['autodocs'],
  args: { label: 'Промокод', dataId: 'inputpromocode' }
} satisfies Meta<typeof InputPromoCode>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 32 }}>
      <InputPromoCode {...args} />
    </div>
  )
};
export const Controlled: Story = { render: () => <Example /> };
function Example() {
  const [value, setValue] = useState('PROMO2026');
  return (
    <div style={{ padding: 32 }}>
      <InputPromoCode label="Промокод" value={value} onValueChange={setValue} />
    </div>
  );
}
