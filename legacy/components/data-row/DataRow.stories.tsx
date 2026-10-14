import type { Meta, StoryObj } from '@storybook/react-vite';
import DataRow from './index.js';
const meta = {
  title: 'Legacy/Components/DataRow',
  component: DataRow,
  tags: ['autodocs'],
  args: {
    label: 'ФИО',
    value: 'Сютин Владислав Игоревич',
    dataId: 'person-name'
  }
} satisfies Meta<typeof DataRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 32, maxWidth: 500 }}>
      <DataRow {...args} />
    </div>
  )
};
