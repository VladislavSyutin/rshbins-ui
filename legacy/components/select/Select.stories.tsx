import type { Meta, StoryObj } from '@storybook/react-vite';
import Select from './index.js';
const meta = {
  title: 'Legacy/Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Тариф',
    options: [
      { value: 'individual', label: 'Индивидуальный' },
      { value: 'family', label: 'Семейный' }
    ],
    defaultValue: 'individual'
  }
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 32, maxWidth: 500 }}>
      <Select {...args} />
    </div>
  )
};
