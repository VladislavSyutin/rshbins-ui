import React from 'react';
import PropTypes from 'prop-types';
import Toast from '../../../components/toast/index.js';

const DIALOG_TOAST_STATES = {
  success: 'success',
  failure: 'failure'
};

const DIALOG_TOAST_STATE_VALUES = [
  DIALOG_TOAST_STATES.success,
  DIALOG_TOAST_STATES.failure
];

const DIALOG_TOAST_TEMPLATES = {
  systemError: 'system-error',
  linkExpired: 'link-expired',
  userNotFound: 'user-not-found',
  userRegistered: 'user-registered',
  passwordAlreadyUsed: 'password-already-used',
  passwordChangeAvailableOnceEveryXHours: 'password-change-available-once-every-x-hours',
  passwordExpired: 'password-expired',
  successfulAuthentication: 'successful-authentication',
  newCodeSent: 'new-code-sent',
  newInstructionsSent: 'new-instructions-sent',
  emailConfirmed: 'email-confirmed'
};

const DIALOG_TOAST_TEMPLATE_VALUES = Object.keys(DIALOG_TOAST_TEMPLATES).map(function (key) {
  return DIALOG_TOAST_TEMPLATES[key];
});

const DIALOG_TOAST_TEMPLATE_CONFIG = {
  [DIALOG_TOAST_TEMPLATES.systemError]: {
    message: 'Что-то пошло не так',
    state: DIALOG_TOAST_STATES.failure
  },
  [DIALOG_TOAST_TEMPLATES.linkExpired]: {
    message: 'Срок действия ссылки истёк',
    state: DIALOG_TOAST_STATES.failure
  },
  [DIALOG_TOAST_TEMPLATES.userNotFound]: {
    message: 'Пользователь не найден',
    state: DIALOG_TOAST_STATES.failure
  },
  [DIALOG_TOAST_TEMPLATES.userRegistered]: {
    message: 'Пользователь зарегистрирован',
    state: DIALOG_TOAST_STATES.failure
  },
  [DIALOG_TOAST_TEMPLATES.passwordAlreadyUsed]: {
    message: 'Пароль уже был использован',
    state: DIALOG_TOAST_STATES.failure
  },
  [DIALOG_TOAST_TEMPLATES.passwordChangeAvailableOnceEveryXHours]: {
    message: 'Смена пароля доступна раз в 24 ч',
    state: DIALOG_TOAST_STATES.failure
  },
  [DIALOG_TOAST_TEMPLATES.passwordExpired]: {
    message: 'Срок действия пароля истёк',
    state: DIALOG_TOAST_STATES.failure
  },
  [DIALOG_TOAST_TEMPLATES.successfulAuthentication]: {
    message: 'Успешный вход',
    state: DIALOG_TOAST_STATES.success
  },
  [DIALOG_TOAST_TEMPLATES.newCodeSent]: {
    message: 'Новый код отправлен',
    state: DIALOG_TOAST_STATES.success
  },
  [DIALOG_TOAST_TEMPLATES.newInstructionsSent]: {
    message: 'Новая инструкция отправлена',
    state: DIALOG_TOAST_STATES.success
  },
  [DIALOG_TOAST_TEMPLATES.emailConfirmed]: {
    message: 'Адрес эл. почты подтверждён',
    state: DIALOG_TOAST_STATES.success
  }
};

const DIALOG_TOAST_VARIANTS = Toast.variants;

const DIALOG_TOAST_VARIANT_VALUES = [
  DIALOG_TOAST_VARIANTS.danger,
  DIALOG_TOAST_VARIANTS.success
];

function resolveVariant(state, variant) {
  if (variant) {
    return variant;
  }

  return state === DIALOG_TOAST_STATES.success
    ? DIALOG_TOAST_VARIANTS.success
    : DIALOG_TOAST_VARIANTS.danger;
}

function DialogToast(props) {
  const {
    autoCloseDuration,
    className,
    closeLabel,
    dataId,
    onClose,
    placement,
    role,
    state,
    template,
    variant,
    ...rest
  } = props;

  const templateConfig = DIALOG_TOAST_TEMPLATE_CONFIG[template] ||
    DIALOG_TOAST_TEMPLATE_CONFIG[DIALOG_TOAST_TEMPLATES.systemError];
  const resolvedState = state || templateConfig.state;
  const resolvedVariant = resolveVariant(resolvedState, variant);

  return (
    <Toast
      {...rest}
      autoCloseDuration={autoCloseDuration}
      className={className}
      closeLabel={closeLabel}
      dataId={dataId}
      onClose={onClose}
      placement={placement}
      role={role}
      variant={resolvedVariant}
    >
      {templateConfig.message}
    </Toast>
  );
}

DialogToast.displayName = 'DialogToast';

DialogToast.states = DIALOG_TOAST_STATES;
DialogToast.templates = DIALOG_TOAST_TEMPLATES;
DialogToast.variants = DIALOG_TOAST_VARIANTS;

DialogToast.propTypes = {
  autoCloseDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null])
  ]),
  className: PropTypes.string,
  closeLabel: PropTypes.string,
  dataId: PropTypes.string,
  onClose: PropTypes.func,
  placement: PropTypes.oneOf([
    Toast.placements.inline,
    Toast.placements.topCenter
  ]),
  role: PropTypes.string,
  state: PropTypes.oneOf(DIALOG_TOAST_STATE_VALUES),
  template: PropTypes.oneOf(DIALOG_TOAST_TEMPLATE_VALUES),
  variant: PropTypes.oneOf(DIALOG_TOAST_VARIANT_VALUES)
};

export default DialogToast;
