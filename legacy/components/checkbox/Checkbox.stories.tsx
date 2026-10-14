import { useEffect, useRef, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyCheckboxProps, LegacyCheckboxSize } from './index.js';
import Checkbox from './index.js';

/** Storybook-only: visual states for the preview matrix */
type CheckboxPreviewState = 'default' | 'hover' | 'focused';

const previewStates: CheckboxPreviewState[] = ['default', 'hover', 'focused'];
const sizes: Array<{ label: string; value: LegacyCheckboxSize }> = [
  { label: 'Size M', value: 'm' },
  { label: 'Size S', value: 's' },
];
type MatrixVariant = 'inactive' | 'active' | 'error';
const variants: Array<{ label: string; value: MatrixVariant }> = [
  { label: 'Inactive', value: 'inactive' },
  { label: 'Active', value: 'active' },
  { label: 'Error', value: 'error' },
];

/**
 * Storybook-only wrapper: injects data-preview-state on the root label element
 * so CSS preview-state rules fire without exposing previewState as a public prop.
 */
function CheckboxWithPreviewState({
  previewState,
  ...props
}: LegacyCheckboxProps & { previewState?: CheckboxPreviewState }) {
  const ref = useRef<HTMLLabelElement | null>(null);

  useEffect(() => {
    if (ref.current && previewState && previewState !== 'default') {
      ref.current.setAttribute('data-preview-state', previewState);
    }
  }, [previewState]);

  // Checkbox renders a <label> as root; use data-id prop to locate it via ref
  // We pass a className with a unique marker and then find it via the ref trick
  // Actually, Checkbox doesn't accept a ref — we attach it via a wrapper div
  return (
    <div
      ref={(node) => {
        ref.current = node ? (node.firstElementChild as HTMLLabelElement) : null;
        if (ref.current && previewState && previewState !== 'default') {
          ref.current.setAttribute('data-preview-state', previewState);
        }
      }}
    >
      <Checkbox {...props} />
    </div>
  );
}

const meta = {
  title: 'Legacy/Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    invalid: false,
    label: 'Контент',
    size: 'm',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

function matrixProps(
  variant: MatrixVariant,
  previewState: CheckboxPreviewState,
): LegacyCheckboxProps & { previewState?: CheckboxPreviewState } {
  if (variant === 'active') {
    return { checked: true, previewState, readOnly: true };
  }
  if (variant === 'error') {
    return { invalid: true, previewState, readOnly: true };
  }
  return { previewState, readOnly: true };
}

export const Playground: Story = {
  render: (args: LegacyCheckboxProps) => (
    <div style={surfaceStyle}>
      <Checkbox {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Ознакомился (-ась) с документами', size: 's' },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true, label: 'Ознакомился (-ась) с документами', size: 's' },
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      {sizes.map((size) => (
        <section key={size.value} style={sectionStyle}>
          <h3 style={titleStyle}>{size.label}</h3>
          <div style={matrixStyle}>
            <div />
            {previewStates.map((state) => (
              <p key={`${size.value}-${state}`} style={metaStyle}>
                {state}
              </p>
            ))}
            {variants.flatMap((variant) => [
              <p key={`${size.value}-${variant.value}-label`} style={metaStyle}>
                {variant.label}
              </p>,
              ...previewStates.map((state) => (
                <CheckboxWithPreviewState
                  {...matrixProps(variant.value, state)}
                  key={`${size.value}-${variant.value}-${state}`}
                  label="Контент"
                  size={size.value}
                />
              )),
            ])}
          </div>
        </section>
      ))}
    </div>
  ),
};


const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  padding: '24px',
  borderRadius: '24px',
  background: 'var(--color-background-default-primary)',
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
};

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: '12px 16px',
  alignItems: 'center',
  gridTemplateColumns: '120px repeat(3, max-content)',
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-primary)',
  fontFamily: 'var(--typography-body-emphasized-fontFamily)',
  fontSize: 'var(--typography-body-emphasized-fontSize)',
  fontWeight: 'var(--typography-body-emphasized-fontWeight)',
  lineHeight: 'var(--typography-body-emphasized-lineHeight)',
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)',
};
