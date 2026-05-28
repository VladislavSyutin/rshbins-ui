import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../legacy/components/button/Button.stories.tsx',
    '../legacy/components/card/Card.stories.tsx',
    '../legacy/components/checkbox/Checkbox.stories.tsx',
    '../legacy/components/divider/Divider.stories.tsx',
    '../legacy/components/cookies/Cookies.stories.tsx',
    '../legacy/components/text-link/TextLink.stories.tsx',
    '../legacy/components/calendar/Calendar.stories.tsx',
    '../legacy/components/input-birth-date/InputBirthDate.stories.tsx',
    '../legacy/components/input-captcha/InputCaptcha.stories.tsx',
    '../legacy/components/input-code-item/InputCodeItem.stories.tsx',
    '../legacy/components/input-code/InputCode.stories.tsx',
    '../legacy/components/input-email/InputEmail.stories.tsx',
    '../legacy/components/input-inn/InputInn.stories.tsx',
    '../legacy/components/input-login/InputLogin.stories.tsx',
    '../legacy/components/input-name/InputName.stories.tsx',
    '../legacy/components/input-middle-name/InputMiddleName.stories.tsx',
    '../legacy/components/input-password/InputPassword.stories.tsx',
    '../legacy/components/input-phone/InputPhone.stories.tsx',
    '../legacy/components/input-surname/InputSurname.stories.tsx',
    '../legacy/components/input-text/InputText.stories.tsx',
    '../legacy/components/loader-brand/LoaderBrand.stories.tsx',
    '../legacy/components/spin/Spin.stories.tsx',
    '../legacy/components/switch/Switch.stories.tsx',
    '../legacy/components/gender/Gender.stories.tsx',
    '../legacy/components/radio-group/RadioGroup.stories.tsx',
    '../legacy/components/segmented-control/SegmentedControl.stories.tsx',
    '../legacy/components/tabs/Tabs.stories.tsx',
    '../legacy/components/toast/Toast.stories.tsx',
    '../legacy/dialogs/toasts/dialog-toast/DialogToast.stories.tsx',
    '../legacy/dialogs/modals/dialog-modal/DialogModal.stories.tsx',
    '../legacy/templates/authentication/authentication-first-screen/AuthenticationFirstScreen.stories.tsx',
    '../legacy/templates/authentication/authentication-creating-login-password/AuthenticationCreatingLoginPassword.stories.tsx',
    '../legacy/templates/authentication/authentication-email-confirmation/AuthenticationEmailConfirmation.stories.tsx',
    '../legacy/templates/authentication/authentication-phone-confirmation/AuthenticationPhoneConfirmation.stories.tsx',
    '../legacy/templates/authentication/authentication-registration/AuthenticationRegistration.stories.tsx',
    '../legacy/templates/authentication/authentication-registration-data/AuthenticationRegistrationData.stories.tsx',
    '../legacy/templates/authentication/authentication-restoring-access/AuthenticationRestoringAccess.stories.tsx',
    '../legacy/components/logo/Logo.stories.tsx',
    '../legacy/components/modal/Modal.stories.tsx',
    '../legacy/components/theme/Theme.stories.tsx',
    '../legacy/components/header/Header.stories.tsx'
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  async viteFinal(config) {
    return {
      ...config,
      server: {
        ...config.server,
        fs: {
          ...config.server?.fs,
          allow: [
            ...(config.server?.fs?.allow ?? []),
            path.resolve(__dirname, '..'),
            path.resolve(__dirname, '../node_modules')
          ]
        }
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: config.optimizeDeps?.include?.filter((dependency) => dependency !== 'react-dom/client')
      },
      legacy: {
        ...config.legacy,
        inconsistentCjsInterop: true
      }
    };
  }
};

export default config;
