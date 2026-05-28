import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationRegistration from './index.js';
import type { LegacyAuthenticationRegistrationMethod } from './index.js';
import Card from '../../../components/card/index.js';
import type { LegacyThemeMode } from '../../../components/theme/index.js';

const meta = {
  title: 'Legacy/Templates/Authentication/AuthenticationRegistration',
  component: AuthenticationRegistration,
  tags: ['autodocs'],
  args: {
    defaultMethod: 'email',
    device: 'desktop'
  }
} satisfies Meta<typeof AuthenticationRegistration>;

export default meta;

type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-secondary)'
};

const storyWidthStyle: CSSProperties = {
  width: '448px',
  maxWidth: '100%'
};

const mobileWidthStyle: CSSProperties = {
  width: '361px',
  maxWidth: '100%'
};

const overviewSectionStyle: CSSProperties = {
  display: 'grid',
  gap: '16px'
};

const desktopOverviewGridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(448px, max-content))',
  alignItems: 'start'
};

const mobileOverviewGridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(361px, max-content))',
  alignItems: 'start'
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '12px',
  alignContent: 'start'
};

const labelStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};

export const Playground: Story = {
  render: (args) => {
    const [mode, setMode] = useState<LegacyThemeMode>('light');
    const [method, setMethod] = useState<LegacyAuthenticationRegistrationMethod>(
      (args.method as LegacyAuthenticationRegistrationMethod) ||
      (args.defaultMethod as LegacyAuthenticationRegistrationMethod) ||
      'email'
    );

    useEffect(() => {
      if (args.method) {
        setMethod(args.method as LegacyAuthenticationRegistrationMethod);
        return;
      }

      setMethod(
        (args.defaultMethod as LegacyAuthenticationRegistrationMethod) || 'email'
      );
    }, [args.method, args.defaultMethod]);

    return (
      <div className={`theme-${mode}`} style={surfaceStyle}>
        <div style={args.device === 'mobile' ? mobileWidthStyle : storyWidthStyle}>
          <AuthenticationRegistration
            {...args}
            method={method}
            onMethodChange={setMethod}
            themeProps={{
              applyToDocument: false,
              mode,
              onModeChange: setMode
            }}
          />
        </div>
      </div>
    );
  }
};

export const Overview: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <section style={overviewSectionStyle}>
        <p style={labelStyle}>Desktop</p>
        <div style={desktopOverviewGridStyle}>
          <Card style={sectionStyle}>
            <p style={labelStyle}>Email</p>
            <Card className="theme-light" style={storyWidthStyle}>
              <AuthenticationRegistration
                defaultMethod="email"
                device="desktop"
                themeProps={{ applyToDocument: false }}
              />
            </Card>
          </Card>

          <Card style={sectionStyle}>
            <p style={labelStyle}>Phone</p>
            <Card className="theme-light" style={storyWidthStyle}>
              <AuthenticationRegistration
                defaultMethod="phone"
                device="desktop"
                themeProps={{ applyToDocument: false }}
              />
            </Card>
          </Card>
        </div>
      </section>

      <section style={overviewSectionStyle}>
        <p style={labelStyle}>Mobile</p>
        <div style={mobileOverviewGridStyle}>
          <Card style={sectionStyle}>
            <p style={labelStyle}>Email</p>
            <Card className="theme-light" style={mobileWidthStyle}>
              <AuthenticationRegistration
                defaultMethod="email"
                device="mobile"
                themeProps={{ applyToDocument: false }}
              />
            </Card>
          </Card>

          <Card style={sectionStyle}>
            <p style={labelStyle}>Phone</p>
            <Card className="theme-light" style={mobileWidthStyle}>
              <AuthenticationRegistration
                defaultMethod="phone"
                device="mobile"
                themeProps={{ applyToDocument: false }}
              />
            </Card>
          </Card>
        </div>
      </section>
    </div>
  )
};
