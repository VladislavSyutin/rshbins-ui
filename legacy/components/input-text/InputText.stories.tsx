import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputTextMask, LegacyInputTextPreviewState, LegacyInputTextProps } from './index.js';
import InputText from './index.js';

type MatrixState = LegacyInputTextPreviewState;

const overviewStates: Array<{
  helperText?: string;
  invalid?: boolean;
  label: string;
  previewState: MatrixState;
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

const maskExamples: Array<{
  helperText?: string;
  label: string;
  mask: Exclude<LegacyInputTextMask, 'text'>;
  value: string;
}> = [
  {
    label: 'Номер телефона',
    mask: 'phone',
    value: '9123456789',
    helperText: 'Берет 8/+7 при вставке, хранит формат (999) 999-99-99'
  },
  {
    label: 'Фамилия',
    mask: 'surname',
    value: 'иванов-петров',
    helperText: 'Кириллица, пробелы, дефис, точки, скобки, парные скобки на blur'
  },
  {
    label: 'Имя',
    mask: 'name',
    value: 'иван',
    helperText: 'Кириллица без пробелов, первая буква приводится к верхнему регистру'
  },
  {
    label: 'Проверочный код',
    mask: 'code',
    value: '1234',
    helperText: 'Только 4 цифры, визуальная маска 0000'
  },
  {
    label: 'Пароль',
    mask: 'password',
    value: 'Password-2026!',
    helperText: 'Разрешенный ASCII-набор и переключение видимости'
  },
  {
    label: 'Логин',
    mask: 'login',
    value: 'fos_user-01',
    helperText: 'Латиница, цифры, точка, дефис, подчёркивание'
  },
  {
    label: 'ИНН',
    mask: 'inn',
    value: '7707083893',
    helperText: 'Только цифры, 10 или 12 символов'
  },
  {
    label: 'Электронная почта',
    mask: 'email',
    value: 'FOS.User@example.ru',
    helperText: 'Нижний регистр, один @, базовая доменная проверка'
  },
  {
    label: 'Код с картинки',
    mask: 'captcha',
    value: 'a7K9',
    helperText: 'Любые символы без пробелов'
  }
];

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
    helperIcon: {
      control: false,
      table: {
        disable: true
      }
    },
    showHelperIcon: {
      control: false,
      table: {
        disable: true
      }
    },
    onValueChange: {
      control: false,
      table: {
        disable: true
      }
    },
    mask: {
      control: 'select',
      options: ['text', 'phone', 'surname', 'name', 'code', 'password', 'login', 'inn', 'email', 'captcha']
    },
    startIcon: {
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
          <section key={state.label} style={cardStyle}>
            <p style={metaStyle}>{state.label}</p>
            <InputText
              clearable
              dataId={`legacy-input-text-${state.previewState}`}
              helperText={state.helperText}
              invalid={state.invalid}
              label="Название"
              previewState={state.previewState}
              value={state.value}
            />
          </section>
        ))}
      </div>
    </div>
  )
};

export const MaskPresets: Story = {
  name: 'FOS masks',
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => (
    <div style={surfaceStyle}>
      <div style={matrixStyle}>
        {maskExamples.map((example) => (
          <section key={example.mask} style={cardStyle}>
            <p style={metaStyle}>{example.mask}</p>
            <InputText
              clearable
              dataId={`fos-mask-${example.mask}`}
              defaultValue={example.value}
              helperText={example.helperText}
              label={example.label}
              mask={example.mask}
            />
          </section>
        ))}
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
