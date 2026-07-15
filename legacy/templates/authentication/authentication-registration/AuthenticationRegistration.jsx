import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../components/button/index.js';
import Checkbox from '../../../components/checkbox/index.js';
import Header from '../../../components/header/index.js';
import InputEmail from '../../../components/input-email/index.js';
import InputInn from '../../../components/input-inn/index.js';
import InputPhone from '../../../components/input-phone/index.js';
import TextLink from '../../../components/text-link/index.js';
import Tabs from '../../../components/tabs/index.js';
import chevronLeftIcon from '../../../icons/chevron-left.js';
import {
  getPhoneDigits,
  validateEmailValue,
  validateInnValue
} from '../../../components/input-helpers/formatters.js';
import './styles.css';

const DEVICES = {
  auto: 'auto',
  desktop: 'desktop',
  mobile: 'mobile'
};

const DEVICE_VALUES = [DEVICES.auto, DEVICES.desktop, DEVICES.mobile];

const METHODS = {
  email: 'email',
  phone: 'phone'
};

const METHOD_VALUES = [METHODS.email, METHODS.phone];

const PERSONAL_DATA_POLICY_URL =
  'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

function isInnValid(value) {
  return validateInnValue(String(value || '')) === undefined;
}

function isEmailValid(value) {
  return validateEmailValue(String(value || '')) === undefined;
}

function isPhoneValid(value) {
  return getPhoneDigits(value).length === 10;
}

function buildDefaultConsentLabel(onPersonalDataClick) {
  return (
    <>
      Соглашаюсь на{'\u00A0'}
      <TextLink
        href={PERSONAL_DATA_POLICY_URL}
        onClick={onPersonalDataClick}
        rel="noreferrer"
        size="s"
        target="_blank"
      >
        передачу и обработку
      </TextLink>{' '}
      персональных данных.
    </>
  );
}

function BackIcon() {
  return (
    <span
      aria-hidden="true"
      className="rshb-authentication-registration__back-icon"
      style={{
        '--rshb-authentication-registration-back-icon-url':
          'url("' + chevronLeftIcon + '")'
      }}
    />
  );
}

function AuthenticationRegistration(props) {
  const {
    backButtonProps,
    brandButtonProps,
    className,
    consentCheckboxProps,
    consentLabel,
    dataId,
    defaultConsentAccepted,
    defaultInn,
    defaultMethod,
    defaultValue,
    device,
    emailDescription,
    emailInputProps,
    emailLabel,
    emailMethodLabel,
    innInputProps,
    innLabel,
    method,
    onBack,
    onConsentChange,
    onMethodChange,
    onPersonalDataClick,
    onSubmit,
    phoneDescription,
    phoneInputProps,
    phoneLabel,
    phoneMethodLabel,
    registerButtonLabel,
    registerButtonProps,
    themeProps,
    title,
    ...rest
  } = props;

  const dataIdValue = dataId || rest['data-id'];
  const isMethodControlled = method !== undefined;
  const [internalMethod, setInternalMethod] = useState(defaultMethod);
  const [inn, setInn] = useState(defaultInn);
  const [registrationValue, setRegistrationValue] = useState(defaultValue);
  const [consentAccepted, setConsentAccepted] = useState(defaultConsentAccepted);

  const resolvedMethod = isMethodControlled ? method : internalMethod;
  const resolvedConsentLabel =
    consentLabel !== undefined
      ? consentLabel
      : buildDefaultConsentLabel(onPersonalDataClick);
  const description =
    resolvedMethod === METHODS.phone ? phoneDescription : emailDescription;
  const canSubmit =
    isInnValid(inn) &&
    (resolvedMethod === METHODS.phone
      ? isPhoneValid(registrationValue)
      : isEmailValid(registrationValue)) &&
    consentAccepted;

  function handleMethodChange(nextValue) {
    const nextMethod = nextValue === METHODS.phone ? METHODS.phone : METHODS.email;

    if (!isMethodControlled) {
      setInternalMethod(nextMethod);
    }

    setRegistrationValue('');

    if (onMethodChange) {
      onMethodChange(nextMethod);
    }
  }

  function handleInnValueChange(nextValue) {
    setInn(nextValue);

    if (innInputProps && innInputProps.onValueChange) {
      innInputProps.onValueChange(nextValue);
    }
  }

  function handleRegistrationValueChange(nextValue) {
    setRegistrationValue(nextValue);

    if (resolvedMethod === METHODS.phone) {
      if (phoneInputProps && phoneInputProps.onValueChange) {
        phoneInputProps.onValueChange(nextValue);
      }
      return;
    }

    if (emailInputProps && emailInputProps.onValueChange) {
      emailInputProps.onValueChange(nextValue);
    }
  }

  function handleConsentChange(event) {
    const nextChecked = event.target.checked;

    setConsentAccepted(nextChecked);

    if (onConsentChange) {
      onConsentChange(nextChecked);
    }

    if (consentCheckboxProps && consentCheckboxProps.onChange) {
      consentCheckboxProps.onChange(event);
    }
  }

  function handleBackButtonClick(event) {
    if (backButtonProps && backButtonProps.onClick) {
      backButtonProps.onClick(event);
    }

    if (!event.defaultPrevented && onBack) {
      onBack();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (onSubmit) {
      onSubmit({
        consentAccepted: consentAccepted,
        inn: inn,
        method: resolvedMethod,
        value: registrationValue
      });
    }
  }

  return (
    <section
      {...rest}
      className={classNames('rshb-authentication-registration', className)}
      data-device={device}
      data-id={dataIdValue}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-registration__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-registration__content">
        <div className="rshb-authentication-registration__heading">
          <Button
            {...backButtonProps}
            aria-label={
              (backButtonProps && backButtonProps['aria-label']) || 'Вернуться назад'
            }
            className={classNames(
              'rshb-authentication-registration__back',
              backButtonProps && backButtonProps.className
            )}
            iconOnly
            leadingIcon={<BackIcon />}
            onClick={handleBackButtonClick}
            size="s"
            type="button"
            variant="flat-primary"
          />

          <h1 className="rshb-authentication-registration__title">{title}</h1>

          <Tabs
            className="rshb-authentication-registration__tabs"
            onChange={function (nextValue) {
              handleMethodChange(nextValue);
            }}
            options={[
              { label: emailMethodLabel, value: METHODS.email },
              { label: phoneMethodLabel, value: METHODS.phone }
            ]}
            value={resolvedMethod}
          />
        </div>

        <form
          className="rshb-authentication-registration__panel"
          onSubmit={handleSubmit}
        >
          <div className="rshb-authentication-registration__group">
            <p className="rshb-authentication-registration__description">
              {description}
            </p>

            <div className="rshb-authentication-registration__fields">
              <InputInn
                {...innInputProps}
                className={classNames(
                  'rshb-authentication-registration__field',
                  innInputProps && innInputProps.className
                )}
                label={innLabel}
                onValueChange={handleInnValueChange}
                value={inn}
              />

              {resolvedMethod === METHODS.phone ? (
                <InputPhone
                  {...phoneInputProps}
                  className={classNames(
                    'rshb-authentication-registration__field',
                    phoneInputProps && phoneInputProps.className
                  )}
                  label={phoneLabel}
                  onValueChange={handleRegistrationValueChange}
                  value={registrationValue}
                />
              ) : (
                <InputEmail
                  {...emailInputProps}
                  className={classNames(
                    'rshb-authentication-registration__field',
                    emailInputProps && emailInputProps.className
                  )}
                  label={emailLabel}
                  onValueChange={handleRegistrationValueChange}
                  value={registrationValue}
                />
              )}
            </div>
          </div>

          <div className="rshb-authentication-registration__actions">
            <Checkbox
              {...consentCheckboxProps}
              checked={consentAccepted}
              className={classNames(
                'rshb-authentication-registration__consent',
                consentCheckboxProps && consentCheckboxProps.className
              )}
              label={resolvedConsentLabel}
              onChange={handleConsentChange}
              size="s"
            />

            <Button
              {...registerButtonProps}
              className={classNames(
                'rshb-authentication-registration__action',
                registerButtonProps && registerButtonProps.className
              )}
              disabled={!canSubmit || Boolean(registerButtonProps && registerButtonProps.disabled)}
              type="submit"
              variant="brand"
            >
              {registerButtonLabel}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

AuthenticationRegistration.displayName = 'AuthenticationRegistration';

AuthenticationRegistration.devices = DEVICES;
AuthenticationRegistration.methods = METHODS;

AuthenticationRegistration.propTypes = {
  backButtonProps: PropTypes.object,
  brandButtonProps: PropTypes.object,
  className: PropTypes.string,
  consentCheckboxProps: PropTypes.object,
  consentLabel: PropTypes.node,
  dataId: PropTypes.string,
  defaultConsentAccepted: PropTypes.bool,
  defaultInn: PropTypes.string,
  defaultMethod: PropTypes.oneOf(METHOD_VALUES),
  defaultValue: PropTypes.string,
  device: PropTypes.oneOf(DEVICE_VALUES),
  emailDescription: PropTypes.node,
  emailInputProps: PropTypes.object,
  emailLabel: PropTypes.node,
  emailMethodLabel: PropTypes.node,
  innInputProps: PropTypes.object,
  innLabel: PropTypes.node,
  method: PropTypes.oneOf(METHOD_VALUES),
  onBack: PropTypes.func,
  onConsentChange: PropTypes.func,
  onMethodChange: PropTypes.func,
  onPersonalDataClick: PropTypes.func,
  onSubmit: PropTypes.func,
  phoneDescription: PropTypes.node,
  phoneInputProps: PropTypes.object,
  phoneLabel: PropTypes.node,
  phoneMethodLabel: PropTypes.node,
  registerButtonLabel: PropTypes.node,
  registerButtonProps: PropTypes.object,
  themeProps: PropTypes.object,
  title: PropTypes.node
};

AuthenticationRegistration.defaultProps = {
  backButtonProps: undefined,
  brandButtonProps: undefined,
  className: undefined,
  consentCheckboxProps: undefined,
  consentLabel: undefined,
  dataId: undefined,
  defaultConsentAccepted: false,
  defaultInn: '',
  defaultMethod: METHODS.email,
  defaultValue: '',
  device: DEVICES.auto,
  emailDescription:
    'Введите ИНН и адрес электронной почты, которые были указаны при\u00A0оформлении полиса',
  emailInputProps: undefined,
  emailLabel: 'Электронная почта',
  emailMethodLabel: 'Электронная почта',
  innInputProps: undefined,
  innLabel: 'ИНН',
  method: undefined,
  onBack: undefined,
  onConsentChange: undefined,
  onMethodChange: undefined,
  onPersonalDataClick: undefined,
  onSubmit: undefined,
  phoneDescription:
    'Введите ИНН и номер телефона, которые были указаны при\u00A0оформлении полиса',
  phoneInputProps: undefined,
  phoneLabel: 'Номер телефона',
  phoneMethodLabel: 'Номер телефона',
  registerButtonLabel: 'Зарегистрироваться',
  registerButtonProps: undefined,
  themeProps: undefined,
  title: 'Регистрация'
};

export default AuthenticationRegistration;
