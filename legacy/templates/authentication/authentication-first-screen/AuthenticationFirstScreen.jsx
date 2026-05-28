import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../components/button/index.js';
import Checkbox from '../../../components/checkbox/index.js';
import Divider from '../../../components/divider/index.js';
import Header from '../../../components/header/index.js';
import InputLogin from '../../../components/input-login/index.js';
import InputPassword from '../../../components/input-password/index.js';
import InputPhone from '../../../components/input-phone/index.js';
import SegmentedControl from '../../../components/segmented-control/index.js';
import TextLink from '../../../components/text-link/index.js';
import gosuslugiIcon from '../../../icons/gosuslugi.js';
import './styles.css';

const CLIENT_TYPES = {
  individual: 'individual',
  corporate: 'corporate'
};

const CLIENT_TYPE_VALUES = [CLIENT_TYPES.individual, CLIENT_TYPES.corporate];

const DEVICES = {
  auto: 'auto',
  desktop: 'desktop',
  mobile: 'mobile'
};

const DEVICE_VALUES = [DEVICES.auto, DEVICES.desktop, DEVICES.mobile];

const PERSONAL_DATA_POLICY_URL =
  'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

let groupNameCounter = 0;

function generateGroupName() {
  groupNameCounter += 1;
  return 'rshb-legacy-authentication-first-screen-' + groupNameCounter;
}

function getDigitsOnly(value) {
  return String(value != null ? value : '').replace(/\D/g, '');
}

function buildDefaultConsentLabel(onPersonalDataClick) {
  return (
    <>
      Соглашаюсь на{' '}
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

function AuthenticationFirstScreen(props) {
  const {
    brandButtonProps,
    className,
    clientType,
    consentCheckboxProps,
    consentLabel,
    corporateClientLabel,
    corporateClientShortLabel,
    dataId,
    defaultClientType,
    defaultConsentAccepted,
    defaultLogin,
    defaultPassword,
    defaultPhone,
    device,
    forgotCredentialsLabel,
    gosuslugiButtonLabel,
    heading,
    individualClientLabel,
    individualClientShortLabel,
    loginButtonLabel,
    loginButtonProps,
    loginInputProps,
    loginLabel,
    onClientTypeChange,
    onCorporateSubmit,
    onForgotCredentials,
    onGosuslugiLogin,
    onIndividualSubmit,
    onPersonalDataClick,
    onRegister,
    passwordInputProps,
    passwordLabel,
    phoneInputProps,
    phoneLabel,
    registerButtonLabel,
    themeProps,
    ...rest
  } = props;

  const dataIdValue = dataId || rest['data-id'];
  const [generatedName] = useState(generateGroupName);
  const isClientTypeControlled = clientType !== undefined;
  const [internalClientType, setInternalClientType] = useState(defaultClientType);
  const [phone, setPhone] = useState(defaultPhone);
  const [login, setLogin] = useState(defaultLogin);
  const [password, setPassword] = useState(defaultPassword);
  const [consentAccepted, setConsentAccepted] = useState(defaultConsentAccepted);

  const resolvedClientType = isClientTypeControlled ? clientType : internalClientType;
  const phoneDigits = getDigitsOnly(phone);
  const canSubmitIndividual = phoneDigits.length === 10 && consentAccepted;
  const canSubmitCorporate =
    String(login).trim().length > 0 && String(password).trim().length > 0;
  const resolvedLoginButtonLabel =
    loginButtonLabel !== undefined
      ? loginButtonLabel
      : resolvedClientType === CLIENT_TYPES.individual
        ? 'Войти по номеру телефона'
        : 'Войти в личный кабинет';
  const resolvedConsentLabel =
    consentLabel !== undefined
      ? consentLabel
      : buildDefaultConsentLabel(onPersonalDataClick);

  function handleClientTypeChange(nextClientType) {
    const resolvedValue =
      nextClientType === CLIENT_TYPES.corporate
        ? CLIENT_TYPES.corporate
        : CLIENT_TYPES.individual;

    if (!isClientTypeControlled) {
      setInternalClientType(resolvedValue);
    }

    if (onClientTypeChange) {
      onClientTypeChange(resolvedValue);
    }
  }

  function handlePhoneValueChange(nextValue) {
    setPhone(nextValue);

    if (phoneInputProps && phoneInputProps.onValueChange) {
      phoneInputProps.onValueChange(nextValue);
    }
  }

  function handleLoginValueChange(nextValue) {
    setLogin(nextValue);

    if (loginInputProps && loginInputProps.onValueChange) {
      loginInputProps.onValueChange(nextValue);
    }
  }

  function handlePasswordValueChange(nextValue) {
    setPassword(nextValue);

    if (passwordInputProps && passwordInputProps.onValueChange) {
      passwordInputProps.onValueChange(nextValue);
    }
  }

  function handleConsentChange(event) {
    setConsentAccepted(event.target.checked);

    if (consentCheckboxProps && consentCheckboxProps.onChange) {
      consentCheckboxProps.onChange(event);
    }
  }

  function handleIndividualSubmit(event) {
    event.preventDefault();

    if (!canSubmitIndividual) {
      return;
    }

    if (onIndividualSubmit) {
      onIndividualSubmit({
        consentAccepted: consentAccepted,
        phone: phone
      });
    }
  }

  function handleCorporateSubmit(event) {
    event.preventDefault();

    if (!canSubmitCorporate) {
      return;
    }

    if (onCorporateSubmit) {
      onCorporateSubmit({
        login: login,
        password: password
      });
    }
  }

  return (
    <section
      {...rest}
      className={classNames('rshb-authentication-first-screen', className)}
      data-device={device}
      data-id={dataIdValue}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-first-screen__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-first-screen__content">
        <h1 className="rshb-authentication-first-screen__title">{heading}</h1>

        <SegmentedControl
          className="rshb-authentication-first-screen__type-switch"
          name={generatedName}
          onChange={handleClientTypeChange}
          options={[
            {
              label: (
                <>
                  <span className="rshb-authentication-first-screen__label-desktop">
                    {individualClientLabel}
                  </span>
                  <span className="rshb-authentication-first-screen__label-mobile">
                    {individualClientShortLabel}
                  </span>
                </>
              ),
              value: CLIENT_TYPES.individual
            },
            {
              label: (
                <>
                  <span className="rshb-authentication-first-screen__label-desktop">
                    {corporateClientLabel}
                  </span>
                  <span className="rshb-authentication-first-screen__label-mobile">
                    {corporateClientShortLabel}
                  </span>
                </>
              ),
              value: CLIENT_TYPES.corporate
            }
          ]}
          value={resolvedClientType}
        />

        {resolvedClientType === CLIENT_TYPES.individual ? (
          <form
            className="rshb-authentication-first-screen__panel"
            onSubmit={handleIndividualSubmit}
          >
            <div className="rshb-authentication-first-screen__group rshb-authentication-first-screen__group--tight">
              <Button
                className="rshb-authentication-first-screen__action"
                leadingIcon={
                  <span
                    aria-hidden="true"
                    className="rshb-authentication-first-screen__gosuslugi-icon"
                    style={{
                      '--rshb-authentication-first-screen-icon-url':
                        'url("' + gosuslugiIcon + '")'
                    }}
                  />
                }
                onClick={onGosuslugiLogin}
                variant="brand"
              >
                {gosuslugiButtonLabel}
              </Button>

              <Divider className="rshb-authentication-first-screen__divider" />

              <InputPhone
                {...phoneInputProps}
                className={classNames(
                  'rshb-authentication-first-screen__field',
                  phoneInputProps && phoneInputProps.className
                )}
                label={phoneLabel}
                onValueChange={handlePhoneValueChange}
                value={phone}
              />
            </div>

            <div className="rshb-authentication-first-screen__group">
              <Checkbox
                {...consentCheckboxProps}
                checked={consentAccepted}
                className={classNames(
                  'rshb-authentication-first-screen__consent',
                  consentCheckboxProps && consentCheckboxProps.className
                )}
                label={resolvedConsentLabel}
                onChange={handleConsentChange}
                size="s"
              />

              <Button
                {...loginButtonProps}
                className={classNames(
                  'rshb-authentication-first-screen__action',
                  loginButtonProps && loginButtonProps.className
                )}
                disabled={
                  !canSubmitIndividual ||
                  Boolean(loginButtonProps && loginButtonProps.disabled)
                }
                type="submit"
                variant="brand"
              >
                {resolvedLoginButtonLabel}
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="rshb-authentication-first-screen__panel"
            onSubmit={handleCorporateSubmit}
          >
            <div className="rshb-authentication-first-screen__group rshb-authentication-first-screen__group--tight">
              <InputLogin
                {...loginInputProps}
                className={classNames(
                  'rshb-authentication-first-screen__field',
                  loginInputProps && loginInputProps.className
                )}
                label={loginLabel}
                onValueChange={handleLoginValueChange}
                value={login}
              />
              <InputPassword
                {...passwordInputProps}
                className={classNames(
                  'rshb-authentication-first-screen__field',
                  passwordInputProps && passwordInputProps.className
                )}
                label={passwordLabel}
                onValueChange={handlePasswordValueChange}
                value={password}
              />

              <TextLink
                as="button"
                className="rshb-authentication-first-screen__forgot-link"
                onClick={onForgotCredentials}
                size="m"
              >
                {forgotCredentialsLabel}
              </TextLink>
            </div>

            <div className="rshb-authentication-first-screen__group rshb-authentication-first-screen__group--tight">
              <Button
                {...loginButtonProps}
                className={classNames(
                  'rshb-authentication-first-screen__action',
                  loginButtonProps && loginButtonProps.className
                )}
                disabled={
                  !canSubmitCorporate ||
                  Boolean(loginButtonProps && loginButtonProps.disabled)
                }
                type="submit"
                variant="brand"
              >
                {resolvedLoginButtonLabel}
              </Button>
              <Button
                className="rshb-authentication-first-screen__action"
                onClick={onRegister}
                type="button"
                variant="normal"
              >
                {registerButtonLabel}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

AuthenticationFirstScreen.displayName = 'AuthenticationFirstScreen';

AuthenticationFirstScreen.clientTypes = CLIENT_TYPES;
AuthenticationFirstScreen.devices = DEVICES;

AuthenticationFirstScreen.propTypes = {
  brandButtonProps: PropTypes.object,
  className: PropTypes.string,
  clientType: PropTypes.oneOf(CLIENT_TYPE_VALUES),
  consentCheckboxProps: PropTypes.object,
  consentLabel: PropTypes.node,
  corporateClientLabel: PropTypes.node,
  corporateClientShortLabel: PropTypes.node,
  dataId: PropTypes.string,
  defaultClientType: PropTypes.oneOf(CLIENT_TYPE_VALUES),
  defaultConsentAccepted: PropTypes.bool,
  defaultLogin: PropTypes.string,
  defaultPassword: PropTypes.string,
  defaultPhone: PropTypes.string,
  device: PropTypes.oneOf(DEVICE_VALUES),
  forgotCredentialsLabel: PropTypes.node,
  gosuslugiButtonLabel: PropTypes.node,
  heading: PropTypes.node,
  individualClientLabel: PropTypes.node,
  individualClientShortLabel: PropTypes.node,
  loginButtonLabel: PropTypes.node,
  loginButtonProps: PropTypes.object,
  loginInputProps: PropTypes.object,
  loginLabel: PropTypes.node,
  onClientTypeChange: PropTypes.func,
  onCorporateSubmit: PropTypes.func,
  onForgotCredentials: PropTypes.func,
  onGosuslugiLogin: PropTypes.func,
  onIndividualSubmit: PropTypes.func,
  onPersonalDataClick: PropTypes.func,
  onRegister: PropTypes.func,
  passwordInputProps: PropTypes.object,
  passwordLabel: PropTypes.node,
  phoneInputProps: PropTypes.object,
  phoneLabel: PropTypes.node,
  registerButtonLabel: PropTypes.node,
  themeProps: PropTypes.object
};

AuthenticationFirstScreen.defaultProps = {
  brandButtonProps: undefined,
  className: undefined,
  clientType: undefined,
  consentCheckboxProps: undefined,
  consentLabel: undefined,
  corporateClientLabel: 'Корпорат. клиент',
  corporateClientShortLabel: 'Корпорат. клиент',
  dataId: undefined,
  defaultClientType: CLIENT_TYPES.individual,
  defaultConsentAccepted: false,
  defaultLogin: '',
  defaultPassword: '',
  defaultPhone: '',
  device: DEVICES.auto,
  forgotCredentialsLabel: 'Забыли логин или пароль?',
  gosuslugiButtonLabel: 'Войти через Госуслуги',
  heading: 'Вход в личный кабинет',
  individualClientLabel: 'Физическое лицо',
  individualClientShortLabel: 'Физ. лицо',
  loginButtonLabel: undefined,
  loginButtonProps: undefined,
  loginInputProps: undefined,
  loginLabel: 'Логин',
  onClientTypeChange: undefined,
  onCorporateSubmit: undefined,
  onForgotCredentials: undefined,
  onGosuslugiLogin: undefined,
  onIndividualSubmit: undefined,
  onPersonalDataClick: undefined,
  onRegister: undefined,
  passwordInputProps: undefined,
  passwordLabel: 'Пароль',
  phoneInputProps: undefined,
  phoneLabel: 'Номер телефона',
  registerButtonLabel: 'Зарегистрироваться',
  themeProps: undefined
};

export default AuthenticationFirstScreen;
