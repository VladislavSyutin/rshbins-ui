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

const PHONE_MODES = {
  visible: 'visible',
  hidden: 'hidden'
};

const PHONE_MODE_VALUES = [PHONE_MODES.visible, PHONE_MODES.hidden];

const RESEND_TIMEOUT_SECONDS = 60;

function renderViewportToast(toast) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(toast, document.body);
}

function AuthenticationPhoneConfirmation(props) {
  const {
    brandButtonProps,
    className,
    codeInputProps,
    dataId,
    device,
    emailButtonLabel,
    emailButtonProps,
    hiddenPhoneNumber,
    onChangePhone,
    onRequestEmailCode,
    phoneMode,
    phoneNumber,
    resendButtonLabel,
    resendButtonProps,
    safetyLabel,
    showEmailButton,
    themeProps,
    title,
    ...rest
  } = props;

  const dataIdValue = dataId || rest['data-id'];
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT_SECONDS - 1);
  const [toastKey, setToastKey] = useState(0);
  const resolvedPhoneNumber =
    phoneMode === PHONE_MODES.hidden ? hiddenPhoneNumber : phoneNumber;
  const shouldShowEmailButton =
    phoneMode === PHONE_MODES.visible && showEmailButton;
  const isResendWaiting = secondsLeft > 0;
  const resolvedResendLabel = isResendWaiting
    ? 'Получить новый код через\u00A0' + secondsLeft + ' сек'
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

  function handleEmailButtonClick(event) {
    if (emailButtonProps && emailButtonProps.onClick) {
      emailButtonProps.onClick(event);
    }

    if (!event.defaultPrevented && onRequestEmailCode) {
      onRequestEmailCode();
    }
  }

  return (
    <section
      {...rest}
      className={classNames('rshb-authentication-phone-confirmation', className)}
      data-device={device}
      data-id={dataIdValue}
      data-phone-mode={phoneMode}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-phone-confirmation__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-phone-confirmation__heading">
        <h1 className="rshb-authentication-phone-confirmation__title">{title}</h1>

        <p className="rshb-authentication-phone-confirmation__description">
          <span className="rshb-authentication-phone-confirmation__description-prefix rshb-authentication-phone-confirmation__description-prefix--desktop">
            Отправили на{'\u00A0'}номер{' '}
          </span>
          <span className="rshb-authentication-phone-confirmation__description-prefix rshb-authentication-phone-confirmation__description-prefix--mobile">
            Отправили на{'\u00A0'}
          </span>
          <span className="rshb-authentication-phone-confirmation__phone">
            {resolvedPhoneNumber}
          </span>
          {phoneMode === PHONE_MODES.visible ? (
            <>
              {' '}
              <TextLink
                as="button"
                onClick={onChangePhone}
                size="m"
              >
                Изм.
              </TextLink>
            </>
          ) : null}
        </p>
      </div>

      <div className="rshb-authentication-phone-confirmation__code-group">
        <InputCodeItem
          {...codeInputProps}
          className={classNames(
            'rshb-authentication-phone-confirmation__code',
            codeInputProps && codeInputProps.className
          )}
          showComplementaryText={
            codeInputProps && codeInputProps.showComplementaryText !== undefined
              ? codeInputProps.showComplementaryText
              : false
          }
        />
        <p className="rshb-authentication-phone-confirmation__safety">
          {safetyLabel}
        </p>
      </div>

      <div className="rshb-authentication-phone-confirmation__actions">
        <Button
          {...resendButtonProps}
          className={classNames(
            'rshb-authentication-phone-confirmation__action',
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

        {shouldShowEmailButton ? (
          <Button
            {...emailButtonProps}
            className={classNames(
              'rshb-authentication-phone-confirmation__action',
              emailButtonProps && emailButtonProps.className
            )}
            onClick={handleEmailButtonClick}
            size="m"
            type="button"
            variant="flat-secondary"
          >
            {emailButtonLabel}
          </Button>
        ) : null}
      </div>

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

AuthenticationPhoneConfirmation.displayName = 'AuthenticationPhoneConfirmation';

AuthenticationPhoneConfirmation.devices = DEVICES;
AuthenticationPhoneConfirmation.phoneModes = PHONE_MODES;

AuthenticationPhoneConfirmation.propTypes = {
  brandButtonProps: PropTypes.object,
  className: PropTypes.string,
  codeInputProps: PropTypes.object,
  dataId: PropTypes.string,
  device: PropTypes.oneOf(DEVICE_VALUES),
  emailButtonLabel: PropTypes.node,
  emailButtonProps: PropTypes.object,
  hiddenPhoneNumber: PropTypes.node,
  onChangePhone: PropTypes.func,
  onRequestEmailCode: PropTypes.func,
  phoneMode: PropTypes.oneOf(PHONE_MODE_VALUES),
  phoneNumber: PropTypes.node.isRequired,
  resendButtonLabel: PropTypes.node,
  resendButtonProps: PropTypes.object,
  safetyLabel: PropTypes.node,
  showEmailButton: PropTypes.bool,
  themeProps: PropTypes.object,
  title: PropTypes.node
};

AuthenticationPhoneConfirmation.defaultProps = {
  brandButtonProps: undefined,
  className: undefined,
  codeInputProps: undefined,
  dataId: undefined,
  device: DEVICES.auto,
  emailButtonLabel: 'Получить код на\u00A0эл. почту',
  emailButtonProps: undefined,
  hiddenPhoneNumber: '+7 (***) ***-99-99',
  onChangePhone: undefined,
  onRequestEmailCode: undefined,
  phoneMode: PHONE_MODES.visible,
  resendButtonLabel: 'Получить новый код',
  resendButtonProps: undefined,
  safetyLabel: 'Никому не сообщайте код.',
  showEmailButton: true,
  themeProps: undefined,
  title: 'Введите код из\u00A0смс'
};

export default AuthenticationPhoneConfirmation;
