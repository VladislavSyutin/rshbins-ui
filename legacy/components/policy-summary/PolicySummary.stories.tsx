import type { Meta, StoryObj } from '@storybook/react-vite';
import PolicySummary from './index.js';
const meta = {
  title: 'Legacy/Components/PolicySummary',
  component: PolicySummary,
  tags: ['autodocs'],
  args: {
    title: 'Страхование от несчастных случаев для всей семьи',
    tariff: 'Индивидуальный',
    term: '14.10.2026–13.10.2028',
    sum: '250 000 ₽',
    premium: 4875,
    oldPremium: 5250
  }
} satisfies Meta<typeof PolicySummary>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 32, maxWidth: 500 }}>
      <PolicySummary {...args} />
    </div>
  )
};
