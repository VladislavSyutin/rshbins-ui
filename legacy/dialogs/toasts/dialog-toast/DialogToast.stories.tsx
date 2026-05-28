import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  LegacyDialogToastProps,
  LegacyDialogToastTemplate
} from './index.js';
import DialogToast from './index.js';
import Button from '../../../components/button/index.js';

const templates: Array<{ label: string; template: LegacyDialogToastTemplate }> = [
  { label: 'System error', template: 'system-error' },
  { label: 'Link expired', template: 'link-expired' },
  { label: 'User not found', template: 'user-not-found' },
  { label: 'User registered', template: 'user-registered' },
  { label: 'Password already used', template: 'password-already-used' },
  {
    label: 'Password change once every X hours',
    template: 'password-change-available-once-every-x-hours'
  },
  { label: 'Password expired', template: 'password-expired' },
  { label: 'Successful authentication', template: 'successful-authentication' },
  { label: 'New code sent', template: 'new-code-sent' },
  { label: 'New instructions sent', template: 'new-instructions-sent' },
  { label: 'Email confirmed', template: 'email-confirmed' }
];

const templateOptions = templates.map((item) => item.template);
const templateLabels = templates.reduce<Record<string, string>>((acc, item) => {
  acc[item.template] = item.label;
  return acc;
}, {});

const meta = {
  title: 'Legacy/Dialogs/Toasts/DialogToast',
  component: DialogToast,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['template']
    }
  },
  args: {
    autoCloseDuration: null,
    dataId: 'legacy-dialog-toast',
    placement: 'inline',
    template: 'system-error'
  },
  argTypes: {
    autoCloseDuration: {
      control: false,
      table: { disable: true }
    },
    className: {
      control: false,
      table: { disable: true }
    },
    closeLabel: {
      control: false,
      table: { disable: true }
    },
    dataId: {
      control: false,
      table: { disable: true }
    },
    onClose: {
      control: false,
      table: { disable: true }
    },
    placement: {
      control: false,
      table: { disable: true }
    },
    role: {
      control: false,
      table: { disable: true }
    },
    state: {
      control: false,
      table: { disable: true }
    },
    template: {
      control: 'select',
      labels: templateLabels,
      options: templateOptions
    },
    variant: {
      control: false,
      table: { disable: true }
    }
  }
} satisfies Meta<typeof DialogToast>;

export default meta;

type Story = StoryObj<typeof meta>;

function getPortalDocument(): Document {
  try {
    if (window.parent.document?.body && window.parent.document !== document) {
      return window.parent.document;
    }
  } catch {
    return document;
  }

  return document;
}

function syncPreviewStyles(targetDocument: Document) {
  if (
    targetDocument === document ||
    targetDocument.head.querySelector('[data-rshb-legacy-dialog-toast-portal-style]')
  ) {
    return;
  }

  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const clone = node.cloneNode(true) as HTMLLinkElement | HTMLStyleElement;

    clone.setAttribute('data-rshb-legacy-dialog-toast-portal-style', 'true');

    if (node.tagName === 'LINK' && clone.tagName === 'LINK') {
      (clone as HTMLLinkElement).href = (node as HTMLLinkElement).href;
    }

    targetDocument.head.appendChild(clone);
  });
}

function ParentDocumentPortal({ children }: { children: ReactNode }) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const targetDocument = getPortalDocument();
    syncPreviewStyles(targetDocument);

    const root = targetDocument.createElement('div');

    root.setAttribute('data-rshb-legacy-dialog-toast-portal-root', 'true');
    targetDocument.body.appendChild(root);
    setPortalRoot(root);

    return () => {
      root.remove();
    };
  }, []);

  return portalRoot ? createPortal(children, portalRoot) : null;
}

function InteractiveDialogToastDemo(args: LegacyDialogToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  function showToast() {
    setToastKey((value) => value + 1);
    setIsVisible(true);
  }

  return (
    <div style={surfaceStyle}>
      <div style={demoStyle}>
        <Button buttonType="primary" onClick={showToast}>
          Показать toast
        </Button>
        {isVisible ? (
          <ParentDocumentPortal>
            <DialogToast
              {...args}
              autoCloseDuration={5000}
              key={toastKey}
              onClose={() => setIsVisible(false)}
              placement="top-center"
            />
          </ParentDocumentPortal>
        ) : null}
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div style={surfaceStyle}>
      <DialogToast {...args} />
    </div>
  )
};

export const Interactive: Story = {
  args: {
    autoCloseDuration: 5000,
    template: 'successful-authentication'
  },
  render: (args) => <InteractiveDialogToastDemo {...args} />
};

export const Overview: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={templateGridStyle}>
        {templates.map((item) => (
          <DialogToast
            autoCloseDuration={null}
            dataId={`legacy-dialog-toast-${item.template}`}
            key={item.template}
            template={item.template}
          />
        ))}
      </div>
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '28px 36px 40px',
  border: '1px dashed var(--color-border-default-default)',
  borderRadius: '4px',
  background: 'var(--color-background-default-primary)'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '32px',
  alignItems: 'center'
};

const templateGridStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  justifyItems: 'start'
};

const demoStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
  gap: '16px',
  justifyItems: 'start',
  minHeight: '220px'
};
