import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacySegmentedControlOption, LegacySegmentedControlProps } from './index.js';
import SegmentedControl from './index.js';
import starIcon from '../../icons/star-regular.js';

/** Storybook-only: visual states for the preview matrix */
type SegmentedControlPreviewState = 'default' | 'hover' | 'focused';

function StarIcon() {
  return <span aria-hidden="true" style={starIconStyle} />;
}

const defaultOptions: LegacySegmentedControlOption[] = [
  { label: 'Контент', leadingIcon: <StarIcon />, trailingIcon: <StarIcon />, value: 'first' },
  { label: 'Контент', leadingIcon: <StarIcon />, trailingIcon: <StarIcon />, value: 'second' },
];

const previewStates: SegmentedControlPreviewState[] = ['default', 'hover', 'focused'];

/**
 * Storybook-only wrapper: injects data-preview-state on each segment label element
 * so CSS preview-state rules fire without exposing previewState as a public prop.
 */
function SegmentedControlWithPreviewState({
  previewState,
  ...props
}: LegacySegmentedControlProps & { previewState?: SegmentedControlPreviewState }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || !previewState || previewState === 'default') return;
    const root = wrapperRef.current.firstElementChild;
    if (!root) return;
    root.querySelectorAll('.rshb-legacy-segment').forEach((el) => {
      (el as HTMLElement).setAttribute('data-preview-state', previewState);
    });
  }, [previewState]);

  return (
    <div ref={wrapperRef}>
      <SegmentedControl {...props} />
    </div>
  );
}

const meta = {
  title: 'Legacy/Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    dataId: 'storybook-segmented-control',
    defaultValue: 'first',
    options: defaultOptions,
    required: false,
  },
  argTypes: {
    onChange: {
      control: false,
      table: { disable: true },
    },
    value: {
      control: false,
      table: { disable: true },
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ defaultValue = 'first', onChange, options = defaultOptions, ...args }: LegacySegmentedControlProps) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <div style={surfaceStyle}>
        <SegmentedControl
          {...args}
          options={options}
          value={value}
          onChange={(nextValue, event) => {
            setValue(nextValue);
            if (onChange) {
              onChange(nextValue, event);
            }
          }}
        />
      </div>
    );
  },
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={gridStyle}>
        <section style={sectionStyle}>
          <h3 style={titleStyle}>С иконками</h3>
          <SegmentedControl
            dataId="segmented-control-icons"
            defaultValue="first"
            options={defaultOptions}
          />
        </section>
        <section style={sectionStyle}>
          <h3 style={titleStyle}>Только текст</h3>
          <SegmentedControl
            dataId="segmented-control-text"
            defaultValue="accounts"
            options={[
              { label: 'Контент', value: 'accounts' },
              { label: 'Контент', value: 'cards' },
              { label: 'Контент', value: 'payments' },
            ]}
          />
        </section>
      </div>
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={matrixStyle}>
        <div />
        {previewStates.map((state) => (
          <p key={state} style={metaStyle}>
            {state}
          </p>
        ))}
        <p style={metaStyle}>Inactive</p>
        {previewStates.map((state) => (
          <SegmentedControlWithPreviewState
            key={`inactive-${state}`}
            name={`segmented-inactive-${state}`}
            options={[{ label: 'Контент', value: 'operations' }]}
            previewState={state}
          />
        ))}
        <p style={metaStyle}>Active</p>
        {previewStates.map((state) => (
          <SegmentedControlWithPreviewState
            key={`active-${state}`}
            defaultValue="operations"
            name={`segmented-active-${state}`}
            options={[{ label: 'Контент', value: 'operations' }]}
            previewState={state}
          />
        ))}
      </div>
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

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'minmax(0, 1fr)',
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '12px',
};

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: '12px 16px',
  alignItems: 'center',
  gridTemplateColumns: '120px repeat(3, minmax(120px, max-content))',
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

const starIconStyle: CSSProperties = {
  display: 'block',
  width: 18,
  height: 18,
  backgroundColor: 'currentColor',
  WebkitMask: `url("${starIcon}") center / contain no-repeat`,
  mask: `url("${starIcon}") center / contain no-repeat`,
};
