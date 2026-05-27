import { useEffect, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  LegacyTabsProps,
  LegacyTabsPreviewState
} from './index.js';
import Tabs from './index.js';
import starIcon from '../../../icons/star-regular.svg';

function StarIcon() {
  return <span aria-hidden="true" style={starIconStyle} />;
}

const star = <StarIcon />;

const defaultOptions = [
  { label: 'Контент', leadingIcon: star, trailingIcon: star, value: 'first' },
  { label: 'Контент', leadingIcon: star, trailingIcon: star, value: 'second' }
];

const previewStates: LegacyTabsPreviewState[] = ['default', 'hover', 'focused'];

const meta = {
  title: 'Legacy/Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    dataId: 'storybook-tabs',
    defaultValue: 'first',
    options: defaultOptions,
  },
  argTypes: {
    onChange: {
      control: false,
      table: { disable: true },
    },
    tabProps: {
      control: false,
    },
    value: {
      control: false,
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ defaultValue = 'first', onChange, options = defaultOptions, ...args }: LegacyTabsProps) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <div style={surfaceStyle}>
        <Tabs
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
          <Tabs
            dataId="tabs-icons"
            defaultValue="accounts"
            options={[
              { label: 'Счета', leadingIcon: star, trailingIcon: star, value: 'accounts' },
              { label: 'Карты', leadingIcon: star, trailingIcon: star, value: 'cards' },
            ]}
          />
        </section>
        <section style={sectionStyle}>
          <h3 style={titleStyle}>Только текст</h3>
          <Tabs
            dataId="tabs-text"
            defaultValue="documents"
            options={[
              { label: 'Документы', value: 'documents' },
              { label: 'Полисы', value: 'policies' },
              { label: 'Платежи', value: 'payments' },
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
          <div
            key={`inactive-${state}`}
            style={singleTabCellStyle}
          >
            <button
              aria-selected="false"
              style={singleTabStyle}
              type="button"
            >
              <span
                className="rshb-legacy-tab"
                data-preview-state={state}
                data-selected="false"
              >
                <span className="rshb-legacy-tab__label">Контент</span>
              </span>
            </button>
          </div>
        ))}
        <p style={metaStyle}>Active</p>
        {previewStates.map((state) => (
          <div
            key={`active-${state}`}
            style={singleTabCellStyle}
          >
            <Tabs
              dataId={`tabs-active-${state}`}
              defaultValue="operations"
              options={[{ label: 'Контент', value: 'operations', previewState: state }]}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ManualActivation: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Клавиатурная навигация</h3>
        <p style={metaStyle}>
          Стрелки переводят фокус и сразу переключают активную вкладку. `Tab` выводит фокус из группы.
        </p>
        <Tabs
          dataId="tabs-manual"
          defaultValue="sms"
          options={[
            { label: 'По SMS', value: 'sms' },
            { label: 'По номеру карты', value: 'card' },
            { label: 'Через Госуслуги', disabled: true, value: 'gosuslugi' },
          ]}
        />
      </section>
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

const singleTabStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  border: 0,
  background: 'transparent',
};

const singleTabCellStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: '72px',
};

const starIconStyle: CSSProperties = {
  display: 'block',
  width: 18,
  height: 18,
  backgroundColor: 'currentColor',
  WebkitMask: `url("${starIcon}") center / contain no-repeat`,
  mask: `url("${starIcon}") center / contain no-repeat`,
};
