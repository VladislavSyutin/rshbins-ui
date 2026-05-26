import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputInnProps } from './index.js';
import InputInn from './index.js';

const meta = {
  title: 'Legacy/Components/InputInn',
  component: InputInn,
  tags: ['autodocs'],
  args: { clearable: true, dataId: 'legacy-input-inn', helperText: 'ИНН должен содержать 10 или 12 цифр.', invalid: false, label: 'ИНН' }
} satisfies Meta<typeof InputInn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args: LegacyInputInnProps) => <div style={surfaceStyle}><InputInn {...args} /></div> };
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div style={surfaceStyle}><div style={matrixStyle}><InputInn dataId="input-inn-empty" /><InputInn dataId="input-inn-entered" value="7707083893" /><InputInn dataId="input-inn-error" helperText="ИНН должен содержать 10 или 12 цифр." invalid /><InputInn dataId="input-inn-disabled" disabled value="7707083893" /></div></div>
};
export const Controlled: Story = { parameters: { controls: { disable: true } }, render: () => <ControlledExample /> };
function ControlledExample() { const [value, setValue] = useState(''); return <div style={surfaceStyle}><InputInn dataId="input-inn-controlled" onValueChange={setValue} value={value} /></div>; }
const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 240, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
