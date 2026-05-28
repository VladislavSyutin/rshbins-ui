import { useEffect, useRef, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputTextProps } from './index.js';
import Card from '../card/index.js';
import InputText from './index.js';

/** Storybook-only: visual states for the preview matrix */
type InputTextPreviewState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'typing'
  | 'entered'
  | 'entered-hover'
  | 'error'
  | 'error-hover'
  | 'error-entered'
  | 'error-entered-hover'
  | 'disabled'
  | 'disabled-entered'
  | 'keyboard-focused';

const overviewStates: Array<{
  helperText?: string;
  invalid?: boolean;
  label: string;
  previewState: InputTextPreviewState;
  value?: string;
}> = [
  { label: 'Default', previewState: 'default' },
  { label: 'Hover', previewState: 'hover' },
  { label: 'Focused', previewState: 'focused' },
  { label: 'Typing', previewState: 'typing', value: 'Контент' },
  { label: 'Entered', previewState: 'entered', value: 'Контент' },
  { label: 'Entered Hover', previewState: 'entered-hover', value: 'Контент' },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error',
    previewState: 'error'
  },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error Hover',
    previewState: 'error-hover'
  },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error Entered',
    previewState: 'error-entered',
    value: 'Контент'
  },
  {
    helperText: 'Вспомогательный текст',
    invalid: true,
    label: 'Error Entered Hover',
    previewState: 'error-entered-hover',
    value: 'Контент'
  },
  { label: 'Disabled', previewState: 'disabled' },
  { label: 'Disabled Entered', previewState: 'disabled-entered', value: 'Контент' },
  { label: 'Keyboard Focused', previewState: 'keyboard-focused' }
];

/**
 * Storybook-only wrapper: injects data-state on the root div element so CSS
 * preview-state rules fire without exposing previewState as a public prop.
 */
function InputTextWithPreviewState({
  previewState,
  ...props
}: LegacyInputTextProps & { previewState?: InputTextPreviewState }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current && previewState) {
      const root = wrapperRef.current.firstElementChild as HTMLElement | null;
      if (root) {
        root.setAttribute('data-state', previewState);
      }
    }
  }, [previewState]);

  // For disabled states, use the real disabled prop
  const isDisabled = previewState === 'disabled' || previewState === 'disabled-entered';

  return (
    <div ref={wrapperRef}>
      <InputText {...props} disabled={isDisabled || props.disabled} />
    </div>
  );
}

const meta = {
  title: 'Legacy/Components/InputText',
  component: InputText,
  tags: ['autodocs'],
  args: {
    clearable: true,
    dataId: 'legacy-input-text',
    helperText: 'Вспомогательный текст',
    invalid: false,
    label: 'Название'
  },
  argTypes: {
    helperText: {
      control: 'text'
    },
    label: {
      control: 'text'
    },
    onValueChange: {
      control: false,
      table: {
        disable: true
      }
    },
    startIcon: {
      control: false,
      table: {
        disable: true
      }
    },
    endAdornment: {
      control: false,
      table: {
        disable: true
      }
    },
    maskOverlay: {
      control: false,
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof InputText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputTextProps) => (
    <div style={surfaceStyle}>
      <InputText {...args} />
    </div>
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
      <div style={matrixStyle}>
        {overviewStates.map((state) => (
          <Card key={state.label} style={cardStyle}>
            <p style={metaStyle}>{state.label}</p>
            <InputTextWithPreviewState
              clearable
              dataId={`legacy-input-text-${state.previewState}`}
              helperText={state.helperText}
              invalid={state.invalid}
              label="Название"
              previewState={state.previewState}
              value={state.value}
            />
          </Card>
        ))}
      </div>
    </div>
  )
};

export const NarrowContainer: Story = {
  name: 'Narrow container',
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={{ width: 240 }}>
        <InputText
          clearable
          dataId="legacy-input-text-narrow"
          label="Очень длинное название поля"
          value="Длинное значение"
        />
      </div>
    </div>
  )
};

const surfaceStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-xl)',
  padding: 'var(--space-paddings-inside-xl)',
  borderRadius: 'var(--radius-l)',
  border: '1px dashed var(--color-border-default-default)',
  backgroundColor: 'var(--color-background-default-primary)'
};

const matrixStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-l) var(--space-margins-inside-2xl)',
  alignItems: 'start',
  gridTemplateColumns: 'repeat(auto-fit, minmax(361px, 1fr))'
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--space-margins-inside-xs)'
};

const metaStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-default-secondary)',
  fontFamily: 'var(--typography-footnote-regular-fontFamily)',
  fontSize: 'var(--typography-footnote-regular-fontSize)',
  fontWeight: 'var(--typography-footnote-regular-fontWeight)',
  lineHeight: 'var(--typography-footnote-regular-lineHeight)'
};
