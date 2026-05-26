import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputLoginProps } from './index.js';
import InputLogin from './index.js';

const meta = {
  title: 'Legacy/Components/InputLogin',
  component: InputLogin,
  tags: ['autodocs'],
  args: { clearable: true, dataId: 'legacy-input-login', helperText: 'Обязательно для заполнения', invalid: false, label: 'Логин' }
} satisfies Meta<typeof InputLogin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args: LegacyInputLoginProps) => <div style={surfaceStyle}><InputLogin {...args} /></div> };
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div style={surfaceStyle}><div style={matrixStyle}><InputLogin dataId="input-login-empty" /><InputLogin dataId="input-login-entered" value="fos_user-01" /><InputLogin dataId="input-login-error" helperText="Обязательно для заполнения" invalid /><InputLogin dataId="input-login-disabled" disabled value="fos_user-01" /></div></div>
};
export const Controlled: Story = { parameters: { controls: { disable: true } }, render: () => <ControlledExample /> };
function ControlledExample() { const [value, setValue] = useState(''); return <div style={surfaceStyle}><InputLogin dataId="input-login-controlled" onValueChange={setValue} value={value} /></div>; }
const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 240, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
