import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import PhoneCodeForm from './index.js';
const meta = {
  title: 'Legacy/Components/PhoneCodeForm',
  component: PhoneCodeForm,
  tags: ['autodocs'],
  args: {
    phone: '9999999990',
    code: '',
    resendSeconds: 59,
    onBack: () => undefined,
    onChangePhone: () => undefined,
    onCodeChange: () => undefined,
    onSubmitCode: () => undefined,
    onResendCode: () => undefined
  }
} satisfies Meta<typeof PhoneCodeForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = { render: (args) => <Example {...args} /> };

function Example(args: React.ComponentProps<typeof PhoneCodeForm>) {
  const [code, setCode] = useState(args.code);
  return (
    <div style={{ padding: 32, maxWidth: 448 }}>
      <PhoneCodeForm {...args} code={code} onCodeChange={setCode} />
    </div>
  );
}
