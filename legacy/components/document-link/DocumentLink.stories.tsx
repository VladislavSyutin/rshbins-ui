import type { Meta, StoryObj } from '@storybook/react-vite';
import DocumentLink from './index.js';
const meta = {
  title: 'Legacy/Components/DocumentLink',
  component: DocumentLink,
  tags: ['autodocs'],
  args: {
    title: 'Правила страхования',
    fileSize: '10 МБ',
    href: 'https://rshbins.ru/upload/iblock/612/gva4yeqp8pue2b1qc4r56m68na4oz86k/03_17102017.pdf'
  }
} satisfies Meta<typeof DocumentLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 32, maxWidth: 500 }}>
      <DocumentLink {...args} />
    </div>
  )
};
