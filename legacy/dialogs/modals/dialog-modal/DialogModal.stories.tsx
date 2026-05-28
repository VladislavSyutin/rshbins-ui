import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  LegacyDialogModalProps,
  LegacyDialogModalTemplate
} from './index.js';
import DialogModal from './index.js';
import Button from '../../../components/button/index.js';

const templates: Array<{ label: string; template: LegacyDialogModalTemplate }> = [
  { label: 'Captcha', template: 'captcha' },
  { label: 'Timeout', template: 'timeout' },
  { label: 'Proof of identity', template: 'proof-of-identity' },
  { label: 'Log in through Gosuslugi', template: 'log-in-through-the-gosuslugi' }
];

const templateOptions = templates.map((item) => item.template);
const templateLabels = templates.reduce<Record<string, string>>((acc, item) => {
  acc[item.template] = item.label;
  return acc;
}, {});

const meta = {
  title: 'Legacy/Dialogs/Modals/DialogModal',
  component: DialogModal,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: ['template']
    }
  },
  args: {
    captchaLabel: '8К7МН4',
    closeOnPrimaryAction: true,
    closeOnTertiaryAction: true,
    dataId: 'legacy-dialog-modal',
    placement: 'inline',
    template: 'captcha'
  },
  argTypes: {
    captchaLabel: {
      control: false,
      table: { disable: true }
    },
    captchaRefreshLabel: {
      control: false,
      table: { disable: true }
    },
    captchaVoiceLabel: {
      control: false,
      table: { disable: true }
    },
    children: {
      control: false,
      table: { disable: true }
    },
    className: {
      control: false,
      table: { disable: true }
    },
    closeOnPrimaryAction: {
      control: false,
      table: { disable: true }
    },
    closeOnTertiaryAction: {
      control: false,
      table: { disable: true }
    },
    countdownDurationSeconds: {
      control: false,
      table: { disable: true }
    },
    dataId: {
      control: false,
      table: { disable: true }
    },
    description: {
      control: false,
      table: { disable: true }
    },
    heading: {
      control: false,
      table: { disable: true }
    },
    inputPlaceholder: {
      control: false,
      table: { disable: true }
    },
    inputProps: {
      control: false,
      table: { disable: true }
    },
    onClose: {
      control: false,
      table: { disable: true }
    },
    onPrimaryAction: {
      control: false,
      table: { disable: true }
    },
    onRefreshCaptcha: {
      control: false,
      table: { disable: true }
    },
    onSecondaryAction: {
      control: false,
      table: { disable: true }
    },
    onTertiaryAction: {
      control: false,
      table: { disable: true }
    },
    onVoiceCaptcha: {
      control: false,
      table: { disable: true }
    },
    placement: {
      control: false,
      table: { disable: true }
    },
    primaryActionIcon: {
      control: false,
      table: { disable: true }
    },
    primaryActionLabel: {
      control: false,
      table: { disable: true }
    },
    role: {
      control: false,
      table: { disable: true }
    },
    secondaryActionIcon: {
      control: false,
      table: { disable: true }
    },
    secondaryActionLabel: {
      control: false,
      table: { disable: true }
    },
    template: {
      control: 'select',
      labels: templateLabels,
      options: templateOptions
    },
    tertiaryActionLabel: {
      control: false,
      table: { disable: true }
    },
    variant: {
      control: false,
      table: { disable: true }
    }
  }
} satisfies Meta<typeof DialogModal>;

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
    targetDocument.head.querySelector('[data-rshb-legacy-dialog-modal-portal-style]')
  ) {
    return;
  }

  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const clone = node.cloneNode(true) as HTMLLinkElement | HTMLStyleElement;

    clone.setAttribute('data-rshb-legacy-dialog-modal-portal-style', 'true');

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

    root.setAttribute('data-rshb-legacy-dialog-modal-portal-root', 'true');
    targetDocument.body.appendChild(root);
    setPortalRoot(root);

    return () => {
      root.remove();
    };
  }, []);

  return portalRoot ? createPortal(children, portalRoot) : null;
}

function getStoryArgsForTemplate(args: LegacyDialogModalProps): LegacyDialogModalProps {
  if (args.template === 'captcha') {
    return {
      ...args,
      captchaLabel: args.captchaLabel || '8К7МН4',
      closeOnPrimaryAction: false,
      inputProps: {
        dataId: 'dialog-modal-captcha-input',
        defaultValue: ''
      }
    };
  }

  if (args.template === 'proof-of-identity') {
    return {
      ...args,
      closeOnPrimaryAction: false,
      inputProps: {
        dataId: 'dialog-modal-last-name-input',
        defaultValue: ''
      }
    };
  }

  return args;
}

function InteractiveDialogModalDemo(args: LegacyDialogModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const resolvedArgs = getStoryArgsForTemplate(args);

  function showModal() {
    setModalKey((value) => value + 1);
    setIsVisible(true);
  }

  return (
    <div style={surfaceStyle}>
      <div style={demoStyle}>
        <Button buttonType="primary" onClick={showModal}>
          Показать modal
        </Button>
        {isVisible ? (
          <ParentDocumentPortal>
            <DialogModal
              {...resolvedArgs}
              key={modalKey}
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
      <DialogModal {...getStoryArgsForTemplate(args)} />
    </div>
  )
};

export const Interactive: Story = {
  args: {
    template: 'log-in-through-the-gosuslugi'
  },
  render: (args) => <InteractiveDialogModalDemo {...args} />
};

export const TimeoutExpired: Story = {
  args: {
    countdownDurationSeconds: 0,
    template: 'timeout'
  },
  render: (args) => (
    <div style={surfaceStyle}>
      <DialogModal {...getStoryArgsForTemplate(args)} />
    </div>
  )
};

export const Overview: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: (args) => (
    <div style={surfaceStyle}>
      <div style={overviewGridStyle}>
        {templates.map((item) => (
          <DialogModal
            {...getStoryArgsForTemplate({ ...args, template: item.template })}
            dataId={`legacy-dialog-modal-${item.template}`}
            key={item.template}
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

const overviewGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 360px))',
  gap: '32px',
  alignItems: 'start',
  width: '100%'
};

const demoStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
  gap: '16px',
  justifyItems: 'start',
  minHeight: '220px'
};
