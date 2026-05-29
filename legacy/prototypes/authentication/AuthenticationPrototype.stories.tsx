import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthenticationPrototype from './index.js';

const scenarioNotes = [
  'ФЛ: любой обычный номер -> SMS-код -> данные страхователя -> успех.',
  'ФЛ: 79999999990 -> SMS-код -> финальный loader и успешный вход.',
  'ФЛ: 79999999991 -> подтверждение личности -> SMS-код -> финальный loader.',
  'ФЛ: 79999999992 -> капча; введите timeout, чтобы открыть timeout-модалку.',
  'ЮЛ: login/password -> успешный вход; любые другие данные -> toast "Пользователь не найден".',
  'Регистрация: email или phone -> код -> создание логина и пароля -> успех.',
  'Восстановление: пароль по email/login или phone -> код -> создание пароля.',
  'Восстановление: логин по email или phone -> код -> создание логина.',
  'Данные страхователя: email info@rshbins.ru -> модалка Госуслуг.'
].join('\n');

const meta = {
  title: 'Legacy/Prototypes/Authentication/AuthenticationPrototype',
  component: AuthenticationPrototype,
  parameters: {
    controls: {
      expanded: true
    },
    docs: {
      description: {
        component: scenarioNotes
      }
    },
    fullscreenPrototype: true,
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AuthenticationPrototype>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};
