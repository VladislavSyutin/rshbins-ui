import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../components/button/index.js';
import InputCodeItem from '../../../components/input-code-item/index.js';
import Header from '../../../components/header/index.js';
import TextLink from '../../../components/text-link/index.js';
import DialogToast from '../../../dialogs/toasts/dialog-toast/index.js';
import './styles.css';

const DEVICES = {
  auto: 'auto',
  desktop: 'desktop',
  mobile: 'mobile'
};

const DEVICE_VALUES = [DEVICES.auto, DEVICES.desktop, DEVICES.mobile];

const EMAIL_MODES = {
  visible: 'visible',
  hidden: 'hidden'
};

const EMAIL_MODE_VALUES = [EMAIL_MODES.visible, EMAIL_MODES.hidden];

const RESEND_TIMEOUT_SECONDS = 60;

function renderViewportToast(toast) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(toast, document.body);
}

function AuthenticationEmailConfirmation(props) {
  const {
    brandButtonProps,
    className,
    codeInputProps,
    dataId,
    device,
    email,
    emailMode,
    hiddenEmail,
    onChangeEmail,
    resendButtonLabel,
    resendButtonProps,
    safetyLabel,
    themeProps,
    title,
    ...rest
  } = props;

  const dataIdValue = dataId || rest['data-id'];
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT_SECONDS - 1);
  const [toastKey, setToastKey] = useState(0);
  const resolvedEmail = emailMode === EMAIL_MODES.hidden ? hiddenEmail : email;
  const isResendWaiting = secondsLeft > 0;
  const resolvedResendLabel = isResendWaiting
    ? 'Получить новый код через ' + secondsLeft + ' сек'
    : resendButtonLabel;

  useEffect(function () {
    if (!isResendWaiting) {
      return undefined;
    }

    const timerId = window.setInterval(function () {
      setSecondsLeft(function (currentSeconds) {
        return Math.max(currentSeconds - 1, 0);
      });
    }, 1000);

    return function () {
      window.clearInterval(timerId);
    };
  }, [isResendWaiting]);

  function restartResendTimer() {
    setSecondsLeft(RESEND_TIMEOUT_SECONDS - 1);
  }

  function handleResendClick(event) {
    if (resendButtonProps && resendButtonProps.onClick) {
      resendButtonProps.onClick(event);
    }

    if (event.defaultPrevented || isResendWaiting) {
      return;
    }

    setToastKey(function (currentKey) {
      return currentKey + 1;
    });
    restartResendTimer();
  }

  return (
    <section
      {...rest}
      className={classNames('rshb-authentication-email-confirmation', className)}
      data-device={device}
      data-email-mode={emailMode}
      data-id={dataIdValue}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-email-confirmation__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-email-confirmation__heading">
        <h1 className="rshb-authentication-email-confirmation__title">{title}</h1>

        <p className="rshb-authentication-email-confirmation__description">
          <span>Отправили по адресу </span>
          <span className="rshb-authentication-email-confirmation__email">
            {resolvedEmail}
          </span>
          {emailMode === EMAIL_MODES.visible ? (
            <>
              {' '}
              <TextLink
                as="button"
                onClick={onChangeEmail}
                size="m"
              >
                Изм.
              </TextLink>
            </>
          ) : null}
        </p>
      </div>

      <div className="rshb-authentication-email-confirmation__code-group">
        <InputCodeItem
          {...codeInputProps}
          className={classNames(
            'rshb-authentication-email-confirmation__code',
            codeInputProps && codeInputProps.className
          )}
          showComplementaryText={
            codeInputProps && codeInputProps.showComplementaryText !== undefined
              ? codeInputProps.showComplementaryText
              : false
          }
        />
        <p className="rshb-authentication-email-confirmation__safety">
          {safetyLabel}
        </p>
      </div>

      <Button
        {...resendButtonProps}
        className={classNames(
          'rshb-authentication-email-confirmation__action',
          resendButtonProps && resendButtonProps.className
        )}
        disabled={isResendWaiting || Boolean(resendButtonProps && resendButtonProps.disabled)}
        onClick={handleResendClick}
        size="m"
        type="button"
        variant="normal"
      >
        {resolvedResendLabel}
      </Button>

      {toastKey > 0
        ? renderViewportToast(
            <DialogToast
              key={toastKey}
              onClose={function () {
                setToastKey(0);
              }}
              placement="top-center"
              template="new-code-sent"
            />
          )
        : null}
    </section>
  );
}

AuthenticationEmailConfirmation.displayName = 'AuthenticationEmailConfirmation';

AuthenticationEmailConfirmation.devices = DEVICES;
AuthenticationEmailConfirmation.emailModes = EMAIL_MODES;

AuthenticationEmailConfirmation.propTypes = {
  brandButtonProps: PropTypes.object,
  className: PropTypes.string,
  codeInputProps: PropTypes.object,
  dataId: PropTypes.string,
  device: PropTypes.oneOf(DEVICE_VALUES),
  email: PropTypes.node.isRequired,
  emailMode: PropTypes.oneOf(EMAIL_MODE_VALUES),
  hiddenEmail: PropTypes.node,
  onChangeEmail: PropTypes.func,
  resendButtonLabel: PropTypes.node,
  resendButtonProps: PropTypes.object,
  safetyLabel: PropTypes.node,
  themeProps: PropTypes.object,
  title: PropTypes.node
};

AuthenticationEmailConfirmation.defaultProps = {
  brandButtonProps: undefined,
  className: undefined,
  codeInputProps: undefined,
  dataId: undefined,
  device: DEVICES.auto,
  emailMode: EMAIL_MODES.visible,
  hiddenEmail: 's******i@r*****s.ru',
  onChangeEmail: undefined,
  resendButtonLabel: 'Получить новый код',
  resendButtonProps: undefined,
  safetyLabel: 'Никому не сообщайте код.',
  themeProps: undefined,
  title: 'Введите код из письма'
};

export default AuthenticationEmailConfirmation;
