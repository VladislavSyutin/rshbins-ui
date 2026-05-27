import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyButtonType, LegacyButtonProps } from './index.js';
import Button from './index.js';
import starIcon from '../../icons/star-regular.js';

/** Storybook-only: visual states for the preview matrix */
type ButtonPreviewState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'pressed'
  | 'disabled'
  | 'loading'
  | 'selection';

const overviewStates: ButtonPreviewState[] = [
  'default',
  'hover',
  'focused',
  'pressed',
  'disabled',
  'loading',
  'selection'
];
const variants = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Flat Primary', value: 'flat-primary' },
  { label: 'Flat Secondary', value: 'flat-secondary' }
] satisfies Array<{ label: string; value: LegacyButtonType }>;

function StarIcon() {
  return (
    <span aria-hidden="true" style={starIconStyle} />
  );
}

const starIconStyle: CSSProperties = {
  display: 'block',
  width: 16,
  height: 16,
  backgroundColor: 'currentColor',
  WebkitMask: `url("${starIcon}") center / contain no-repeat`,
  mask: `url("${starIcon}") center / contain no-repeat`
};

/**
 * Storybook-only wrapper: injects data-state on the root button element so
 * CSS preview-state rules fire without exposing previewState as a public prop.
 */
function ButtonWithPreviewState({
  previewState,
  children,
  ...props
}: LegacyButtonProps & { previewState?: ButtonPreviewState; children?: ReactNode }) {
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (ref.current && previewState && previewState !== 'default') {
      ref.current.setAttribute('data-state', previewState);
    }
  }, [previewState]);

  // For 'disabled' and 'loading' states, use the real props so the component
  // renders correctly (disabled attribute, spinner, etc.)
  if (previewState === 'disabled') {
    return <Button {...props} disabled ref={ref}>{children}</Button>;
  }
  if (previewState === 'loading') {
    return <Button {...props} loading ref={ref}>{children}</Button>;
  }
  if (previewState === 'selection') {
    return <Button {...props} selected ref={ref}>{children}</Button>;
  }

  return <Button {...props} ref={ref}>{children}</Button>;
}

const meta = {
  title: 'Legacy/Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    buttonType: 'primary',
    dataId: 'legacy-button',
    iconOnly: false,
    name: 'Контент',
    selected: false,
    size: 'm'
  },
  argTypes: {
    leadingIcon: {
      control: false,
      table: {
        disable: true
      }
    },
    trailingIcon: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyButtonProps) => (
    <Button
      {...args}
      aria-label={args.iconOnly ? 'Кнопка действия' : args['aria-label']}
      leadingIcon={<StarIcon />}
      trailingIcon={args.iconOnly ? undefined : <StarIcon />}
    />
  )
};

export const Overview: Story = {
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        {variants.map((variant) => (
          <section key={variant.value} style={cardStyle}>
            <h3 style={{ margin: 0 }}>{variant.label}</h3>
            {overviewStates.map((state) => (
              <div key={`${variant.value}-${state}`} style={stackStyle}>
                <p style={metaStyle}>{state}</p>
                <div style={rowStyle}>
                  <ButtonWithPreviewState
                    buttonType={variant.value}
                    dataId={`legacy-button-${variant.value}-${state}-m`}
                    leadingIcon={<StarIcon />}
                    name="Контент"
                    previewState={state}
                    size="m"
                    trailingIcon={<StarIcon />}
                  />
                  <ButtonWithPreviewState
                    aria-label={`${variant.label} ${state}`}
                    buttonType={variant.value}
                    dataId={`legacy-button-${variant.value}-${state}-m-icon`}
                    iconOnly
                    leadingIcon={<StarIcon />}
                    previewState={state}
                    size="m"
                  />
                </div>
                <div style={rowStyle}>
                  <ButtonWithPreviewState
                    buttonType={variant.value}
                    dataId={`legacy-button-${variant.value}-${state}-s`}
                    leadingIcon={<StarIcon />}
                    name="Контент"
                    previewState={state}
                    size="s"
                    trailingIcon={<StarIcon />}
                  />
                  <ButtonWithPreviewState
                    aria-label={`${variant.label} ${state} compact`}
                    buttonType={variant.value}
                    dataId={`legacy-button-${variant.value}-${state}-s-icon`}
                    iconOnly
                    leadingIcon={<StarIcon />}
                    previewState={state}
                    size="s"
                  />
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  padding: 'var(--space-paddings-inside-m)',
  borderRadius: 'var(--radius-l)',
  border: '1px dashed var(--color-border-default-default)',
  backgroundColor: 'var(--color-background-default-primary)'
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-xl)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-m)'
};

const stackStyle: CSSProperties = {
  display: 'grid',
  alignItems: 'start',
  gap: 'var(--space-margins-inside-xs)'
};

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-margins-inside-xs)',
  alignItems: 'center'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
