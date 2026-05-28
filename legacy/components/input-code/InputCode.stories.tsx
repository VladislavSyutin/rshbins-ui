import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputCodeProps } from './index.js';
import InputCode from './index.js';

const meta = {
  title: 'Legacy/Components/InputCode',
  component: InputCode,
  tags: ['autodocs'],
  args: { clearable: true, dataId: 'legacy-input-code', helperText: 'Обязательно для заполнения', invalid: false, label: 'Проверочный код' }
} satisfies Meta<typeof InputCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args: LegacyInputCodeProps) => <div style={surfaceStyle}><InputCode {...args} /></div> };
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div style={surfaceStyle}><div style={matrixStyle}><InputCode dataId="input-code-empty" /><InputCode dataId="input-code-entered" value="1234" /><InputCode dataId="input-code-error" helperText="Проверочный код должен содержать 4 цифры" invalid value="12" /><InputCode dataId="input-code-disabled" disabled value="1234" /></div></div>
};
export const Controlled: Story = { parameters: { controls: { disable: true } }, render: () => <ControlledExample /> };
function ControlledExample() { const [value, setValue] = useState(''); return <div style={surfaceStyle}><InputCode dataId="input-code-controlled" onValueChange={setValue} value={value} /></div>; }
const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 240, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
