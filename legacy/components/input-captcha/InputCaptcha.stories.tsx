import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputCaptchaProps } from './index.js';
import InputCaptcha from './index.js';

const meta = {
  title: 'Legacy/Components/InputCaptcha',
  component: InputCaptcha,
  tags: ['autodocs'],
  args: { clearable: true, dataId: 'legacy-input-captcha', helperText: 'Обязательно для заполнения', invalid: false, label: 'Код с картинки' }
} satisfies Meta<typeof InputCaptcha>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args: LegacyInputCaptchaProps) => <div style={surfaceStyle}><InputCaptcha {...args} /></div> };
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div style={surfaceStyle}><div style={matrixStyle}><InputCaptcha dataId="input-captcha-empty" /><InputCaptcha dataId="input-captcha-entered" value="a7K9" /><InputCaptcha dataId="input-captcha-error" helperText="Обязательно для заполнения" invalid /><InputCaptcha dataId="input-captcha-disabled" disabled value="a7K9" /></div></div>
};
export const Controlled: Story = { parameters: { controls: { disable: true } }, render: () => <ControlledExample /> };
function ControlledExample() { const [value, setValue] = useState(''); return <div style={surfaceStyle}><InputCaptcha dataId="input-captcha-controlled" onValueChange={setValue} value={value} /></div>; }
const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 240, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
