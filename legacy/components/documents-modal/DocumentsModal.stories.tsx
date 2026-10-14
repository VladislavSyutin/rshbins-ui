import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import DocumentsModal from './index.js';
import type { LegacyDocumentsModalProps } from './index.js';
import Button from '../button/index.js';
import documents from '../../prototypes/policy-issuance/assets/documents/index.js';

function Demo(args: LegacyDocumentsModalProps) {
  const [open, setOpen] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  return <>
    <Button onClick={() => { setConfirmed(false); setOpen(true); }}>Открыть документы</Button>
    {confirmed ? <p>Ознакомление подтверждено</p> : null}
    {open ? <DocumentsModal {...args} onConfirm={() => setConfirmed(true)} onClose={() => setOpen(false)} /> : null}
  </>;
}

const meta = {
  id: 'legacy-components-documents-modal',
  title: 'Legacy/Components/DocumentsModal',
  component: DocumentsModal,
  parameters: { layout: 'fullscreen', viewport: { options: INITIAL_VIEWPORTS } },
  args: { documents, dataId: 'documents-modal', onClose: () => undefined },
  argTypes: { documents: { control: false }, onClose: { control: false }, onConfirm: { control: false } },
  render: (args) => <Demo {...args} />
} satisfies Meta<typeof DocumentsModal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Mobile: Story = { globals: { viewport: { value: 'mobile1', isRotated: false } } };
export const LoadError: Story = {
  args: { documents: [{ id: 'unavailable', title: 'Документ', pages: [{ src: '/unavailable-document-page.webp', width: 595, height: 842 }] }] }
};
