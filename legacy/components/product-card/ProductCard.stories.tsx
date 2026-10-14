import type { Meta, StoryObj } from '@storybook/react-vite';
import ProductCard from './index.js';
const meta = {
  title: 'Legacy/Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: {
    fullscreenPrototype: true,
    layout: 'fullscreen'
  },
  args: {
    title: 'Страхование от несчастных случаев для всей семьи',
    accent: 'Поможем защитить вас и ваших близких от несчастных случаев.',
    text: 'Этот страховой продукт - возможность позаботиться о себе и самых близких людях и получить достойную денежную компенсацию, если вы или кто-то из вашего окружения пострадает в результате несчастного случая.',
    imageSrc: new URL(
      '../../prototypes/policy-issuance/assets/health-family.png',
      import.meta.url
    ).href
  }
} satisfies Meta<typeof ProductCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {
  render: (args, context) => (
    <div
      className={'theme-' + (context.globals.theme || 'light')}
      style={{
        padding: 32,
        overflowX: 'auto',
        background: 'var(--color-background-default-secondary)'
      }}
    >
      <div style={{ width: 1156 }}>
        <ProductCard {...args} />
      </div>
    </div>
  )
};
