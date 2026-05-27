import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputEmailProps } from './index.js';
import InputEmail from './index.js';

const meta = {
  title: 'Legacy/Components/InputEmail',
  component: InputEmail,
  tags: ['autodocs'],
  args: { clearable: true, dataId: 'legacy-input-email', helperText: 'Адрес электронной почты должен содержать знак “@”', invalid: false, label: 'Электронная почта' }
} satisfies Meta<typeof InputEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args: LegacyInputEmailProps) => <div style={surfaceStyle}><InputEmail {...args} /></div> };
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div style={surfaceStyle}><div style={matrixStyle}><InputEmail dataId="input-email-empty" /><InputEmail dataId="input-email-entered" value="fos.user@example.ru" /><InputEmail dataId="input-email-error" helperText="Адрес электронной почты должен содержать знак “@”" invalid /><InputEmail dataId="input-email-disabled" disabled value="fos.user@example.ru" /></div></div>
};
export const Controlled: Story = { parameters: { controls: { disable: true } }, render: () => <ControlledExample /> };
function ControlledExample() { const [value, setValue] = useState(''); return <div style={surfaceStyle}><InputEmail dataId="input-email-controlled" onValueChange={setValue} value={value} /></div>; }
const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 240, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
