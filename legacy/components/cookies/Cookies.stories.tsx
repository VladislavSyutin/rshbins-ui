import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyCookiesProps } from './index.js';
import Cookies from './index.js';
import Button from '../button/index.js';

const meta = {
  title: 'Legacy/Components/Cookies',
  component: Cookies,
  tags: ['autodocs'],
  args: {
    closeOnPrimaryAction: true,
    dataId: 'legacy-cookies',
    description: 'Описание',
    heading: 'Заголовок',
    placement: 'inline',
    previewState: 'shown',
    primaryActionLabel: 'Контент',
    secondaryActionLabel: 'Контент',
    size: 's'
  },
  argTypes: {
    onClose: {
      control: false,
      table: { disable: true }
    },
    onPrimaryAction: {
      control: false,
      table: { disable: true }
    },
    onSecondaryAction: {
      control: false,
      table: { disable: true }
    }
  }
} satisfies Meta<typeof Cookies>;

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
    targetDocument.head.querySelector('[data-rshb-legacy-cookies-portal-style]')
  ) {
    return;
  }
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const clone = node.cloneNode(true) as HTMLLinkElement | HTMLStyleElement;
    clone.setAttribute('data-rshb-legacy-cookies-portal-style', 'true');
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
    root.setAttribute('data-rshb-legacy-cookies-portal-root', 'true');
    targetDocument.body.appendChild(root);
    setPortalRoot(root);
    return () => {
      root.remove();
    };
  }, []);

  return portalRoot ? createPortal(children, portalRoot) : null;
}

function InteractiveCookiesDemo(args: LegacyCookiesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [cookiesKey, setCookiesKey] = useState(0);

  function showCookies() {
    setCookiesKey((v) => v + 1);
    setIsVisible(true);
  }

  return (
    <div style={surfaceStyle}>
      <div style={demoStyle}>
        <Button buttonType="primary" onClick={showCookies}>
          Показать cookies
        </Button>
        {isVisible ? (
          <ParentDocumentPortal>
            <Cookies
              {...args}
              key={cookiesKey}
              onClose={() => setIsVisible(false)}
              placement="bottom-center"
              primaryActionLabel="Закрыть"
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
      <Cookies {...args} />
    </div>
  )
};

export const Interactive: Story = {
  render: (args) => <InteractiveCookiesDemo {...args} />
};

export const Overview: Story = {
  parameters: {
    controls: { disable: true }
  },
  render: (args) => (
    <div style={surfaceStyle}>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Size S</h3>
        <Cookies
          {...args}
          description="Мы используем файлы куки для улучшения работы сайта и персонализации контента. Продолжая использовать сайт, вы соглашаетесь с их использованием."
          heading="Мы используем куки"
          primaryActionLabel="Принять"
          secondaryActionLabel="Настройки"
          size="s"
        />
      </section>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Size XS</h3>
        <Cookies
          {...args}
          description="Мы используем файлы куки для улучшения работы сайта."
          heading="Мы используем куки"
          primaryActionLabel="Принять"
          secondaryActionLabel="Настройки"
          size="xs"
        />
      </section>
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

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '16px'
};

const demoStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
  gap: '16px',
  justifyItems: 'start',
  minHeight: '220px'
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)'
};
