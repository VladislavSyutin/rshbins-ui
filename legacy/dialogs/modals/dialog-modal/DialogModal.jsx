import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../components/modal/index.js';
import gosuslugiIcon from '../../../icons/gosuslugi.js';
import './styles.css';

const DEFAULT_TIMEOUT_DURATION_SECONDS = 30 * 60;

const DIALOG_MODAL_TEMPLATES = {
  captcha: 'captcha',
  timeout: 'timeout',
  proofOfIdentity: 'proof-of-identity',
  logInThroughTheGosuslugi: 'log-in-through-the-gosuslugi'
};

const DIALOG_MODAL_TEMPLATE_VALUES = Object.keys(DIALOG_MODAL_TEMPLATES).map(function (key) {
  return DIALOG_MODAL_TEMPLATES[key];
});

function DialogModalIcon(props) {
  const src = props.src;

  return (
    <span
      aria-hidden="true"
      className="rshb-legacy-dialog-modal__icon"
      style={{ '--rshb-legacy-dialog-modal-icon': 'url("' + src + '")' }}
    />
  );
}

DialogModalIcon.propTypes = {
  src: PropTypes.string.isRequired
};

const DIALOG_MODAL_TEMPLATE_CONFIG = {
  [DIALOG_MODAL_TEMPLATES.captcha]: {
    description: 'Обнаружена подозрительная активность. Пожалуйста, введите код с картинки',
    heading: 'Подозрительная активность',
    inputPlaceholder: 'Код с картинки',
    primaryActionLabel: 'Продолжить',
    tertiaryActionLabel: 'Закрыть',
    variant: Modal.variants.captcha
  },
  [DIALOG_MODAL_TEMPLATES.timeout]: {
    heading: 'Подозрительная активность',
    primaryActionIcon: <DialogModalIcon src={gosuslugiIcon} />,
    primaryActionLabel: 'Войти через Госуслуги',
    tertiaryActionLabel: 'Закрыть',
    variant: Modal.variants.default
  },
  [DIALOG_MODAL_TEMPLATES.proofOfIdentity]: {
    description: 'Вы давно не заходили в личный кабинет. Пожалуйста, подтвердите личность',
    heading: 'Подтверждение личности',
    inputPlaceholder: 'Фамилия',
    primaryActionLabel: 'Продолжить',
    secondaryActionIcon: <DialogModalIcon src={gosuslugiIcon} />,
    secondaryActionLabel: 'Войти через Госуслуги',
    tertiaryActionLabel: 'Закрыть',
    variant: Modal.variants.textInput
  },
  [DIALOG_MODAL_TEMPLATES.logInThroughTheGosuslugi]: {
    description: 'Пользователь с такими данными уже зарегистрирован. Пожалуйста, подтвердите личность через Госуслуги',
    heading: 'Войдите через Госуслуги',
    primaryActionIcon: <DialogModalIcon src={gosuslugiIcon} />,
    primaryActionLabel: 'Войти через Госуслуги',
    tertiaryActionLabel: 'Закрыть',
    variant: Modal.variants.default
  }
};

function DialogModal(props) {
  const {
    captchaLabel,
    captchaRefreshLabel,
    captchaVoiceLabel,
    children,
    className,
    closeOnPrimaryAction,
    closeOnTertiaryAction,
    countdownDurationSeconds,
    dataId,
    description,
    heading,
    inputPlaceholder,
    inputProps,
    onClose,
    onPrimaryAction,
    onRefreshCaptcha,
    onSecondaryAction,
    onTertiaryAction,
    onVoiceCaptcha,
    placement,
    primaryActionDisabled,
    primaryActionIcon,
    primaryActionLabel,
    primaryActionLoading,
    role,
    secondaryActionDisabled,
    secondaryActionIcon,
    secondaryActionLabel,
    secondaryActionLoading,
    template,
    tertiaryActionDisabled,
    tertiaryActionLabel,
    tertiaryActionLoading,
    variant,
    ...rest
  } = props;

  const templateConfig = DIALOG_MODAL_TEMPLATE_CONFIG[template] ||
    DIALOG_MODAL_TEMPLATE_CONFIG[DIALOG_MODAL_TEMPLATES.captcha];
  const resolvedVariant = variant || templateConfig.variant;
  const isTimeoutTemplate = templateConfig ===
    DIALOG_MODAL_TEMPLATE_CONFIG[DIALOG_MODAL_TEMPLATES.timeout];
  const resolvedCountdownDurationSeconds =
    countdownDurationSeconds !== undefined
      ? countdownDurationSeconds
      : DEFAULT_TIMEOUT_DURATION_SECONDS;
  const [secondsLeft, setSecondsLeft] = useState(resolvedCountdownDurationSeconds);

  useEffect(function () {
    setSecondsLeft(resolvedCountdownDurationSeconds);
  }, [resolvedCountdownDurationSeconds]);

  useEffect(function () {
    if (!isTimeoutTemplate || secondsLeft <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(function () {
      setSecondsLeft(function (current) {
        return Math.max(current - 1, 0);
      });
    }, 1000);

    return function () {
      window.clearInterval(timerId);
    };
  }, [isTimeoutTemplate, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  const timeoutDescription = secondsLeft > 0
    ? 'Слишком много попыток ввода. Войдите через Госуслуги или продолжите через ' + formattedTime
    : 'Слишком много попыток ввода. Теперь можно повторить попытку';
  const resolvedDescription =
    description !== undefined
      ? description
      : (isTimeoutTemplate ? timeoutDescription : templateConfig.description);

  return (
    <Modal
      {...rest}
      captchaLabel={captchaLabel}
      captchaRefreshLabel={captchaRefreshLabel}
      captchaVoiceLabel={captchaVoiceLabel}
      className={className}
      closeOnPrimaryAction={closeOnPrimaryAction}
      closeOnTertiaryAction={closeOnTertiaryAction}
      dataId={dataId}
      description={resolvedDescription}
      heading={heading !== undefined ? heading : templateConfig.heading}
      inputPlaceholder={
        inputPlaceholder !== undefined ? inputPlaceholder : templateConfig.inputPlaceholder
      }
      inputProps={inputProps}
      onClose={onClose}
      onPrimaryAction={onPrimaryAction}
      onRefreshCaptcha={onRefreshCaptcha}
      onSecondaryAction={onSecondaryAction}
      onTertiaryAction={onTertiaryAction}
      onVoiceCaptcha={onVoiceCaptcha}
      placement={placement}
      primaryActionIcon={
        primaryActionIcon !== undefined ? primaryActionIcon : templateConfig.primaryActionIcon
      }
      primaryActionLabel={
        primaryActionLabel !== undefined ? primaryActionLabel : templateConfig.primaryActionLabel
      }
      primaryActionLoading={primaryActionLoading}
      primaryActionDisabled={primaryActionDisabled}
      role={role}
      secondaryActionIcon={
        secondaryActionIcon !== undefined ? secondaryActionIcon : templateConfig.secondaryActionIcon
      }
      secondaryActionLabel={
        secondaryActionLabel !== undefined
          ? secondaryActionLabel
          : templateConfig.secondaryActionLabel
      }
      secondaryActionLoading={secondaryActionLoading}
      secondaryActionDisabled={secondaryActionDisabled}
      tertiaryActionLabel={
        tertiaryActionLabel !== undefined ? tertiaryActionLabel : templateConfig.tertiaryActionLabel
      }
      tertiaryActionLoading={tertiaryActionLoading}
      tertiaryActionDisabled={tertiaryActionDisabled}
      variant={resolvedVariant}
    >
      {children}
    </Modal>
  );
}

DialogModal.displayName = 'DialogModal';

DialogModal.templates = DIALOG_MODAL_TEMPLATES;
DialogModal.variants = Modal.variants;
DialogModal.placements = Modal.placements;

DialogModal.propTypes = {
  captchaLabel: PropTypes.node,
  captchaRefreshLabel: PropTypes.string,
  captchaVoiceLabel: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  closeOnPrimaryAction: PropTypes.bool,
  closeOnTertiaryAction: PropTypes.bool,
  countdownDurationSeconds: PropTypes.number,
  dataId: PropTypes.string,
  description: PropTypes.node,
  heading: PropTypes.node,
  inputPlaceholder: PropTypes.string,
  inputProps: PropTypes.object,
  onClose: PropTypes.func,
  onPrimaryAction: PropTypes.func,
  onRefreshCaptcha: PropTypes.func,
  onSecondaryAction: PropTypes.func,
  onTertiaryAction: PropTypes.func,
  onVoiceCaptcha: PropTypes.func,
  placement: PropTypes.oneOf([
    Modal.placements.inline,
    Modal.placements.topCenter
  ]),
  primaryActionIcon: PropTypes.node,
  primaryActionLabel: PropTypes.string,
  primaryActionLoading: PropTypes.bool,
  primaryActionDisabled: PropTypes.bool,
  role: PropTypes.string,
  secondaryActionIcon: PropTypes.node,
  secondaryActionLabel: PropTypes.string,
  secondaryActionLoading: PropTypes.bool,
  secondaryActionDisabled: PropTypes.bool,
  template: PropTypes.oneOf(DIALOG_MODAL_TEMPLATE_VALUES),
  tertiaryActionLabel: PropTypes.string,
  tertiaryActionLoading: PropTypes.bool,
  tertiaryActionDisabled: PropTypes.bool,
  variant: PropTypes.oneOf([
    Modal.variants.default,
    Modal.variants.captcha,
    Modal.variants.textInput
  ])
};

export default DialogModal;
