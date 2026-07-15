import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../components/button/index.js';
import Checkbox from '../../../components/checkbox/index.js';
import Header from '../../../components/header/index.js';
import InputEmail from '../../../components/input-email/index.js';
import InputInn from '../../../components/input-inn/index.js';
import InputLogin from '../../../components/input-login/index.js';
import InputPhone from '../../../components/input-phone/index.js';
import SegmentedControl from '../../../components/segmented-control/index.js';
import TextLink from '../../../components/text-link/index.js';
import Tabs from '../../../components/tabs/index.js';
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

const FLOWS = {
  password: 'password',
  login: 'login'
};

const FLOW_VALUES = [FLOWS.password, FLOWS.login];

const PERSONAL_DATA_POLICY_URL =
  'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';
const MOBILE_BREAKPOINT_PX = 743;

let groupNameCounter = 0;

function generateGroupName() {
  groupNameCounter += 1;
  return 'rshb-legacy-authentication-restoring-access-' + groupNameCounter;
}

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

function getFlowLabel(flow, usesMobileLabels, props) {
  if (flow === FLOWS.password) {
    return usesMobileLabels
      ? props.passwordFlowMobileLabel
      : props.passwordFlowLabel;
  }

  return usesMobileLabels ? props.loginFlowMobileLabel : props.loginFlowLabel;
}

function AuthenticationRestoringAccess(props) {
  const {
    backButtonProps,
    brandButtonProps,
    className,
    consentCheckboxProps,
    consentLabel,
    dataId,
    defaultConsentAccepted,
    defaultInn,
    defaultLogin,
    defaultLoginMethod,
    defaultRestoringFlow,
    defaultRestoringValue,
    device,
    emailInputProps,
    emailLabel,
    emailMethodLabel,
    innInputProps,
    innLabel,
    loginButtonLabel,
    loginEmailDescription,
    loginFlowLabel,
    loginFlowMobileLabel,
    loginInputProps,
    loginLabel,
    loginMethod,
    loginPhoneDescription,
    onBack,
    onConsentChange,
    onLoginMethodChange,
    onPasswordSubmit,
    onPersonalDataClick,
    onRestoringFlowChange,
    onRestoringLoginSubmit,
    passwordButtonLabel,
    passwordDescription,
    passwordFlowLabel,
    passwordFlowMobileLabel,
    phoneInputProps,
    phoneLabel,
    phoneMethodLabel,
    restoringFlow,
    submitButtonProps,
    themeProps,
    title,
    ...rest
  } = props;

  const dataIdValue = dataId || rest['data-id'];
  const [generatedName] = useState(generateGroupName);
  const isRestoringFlowControlled = restoringFlow !== undefined;
  const isLoginMethodControlled = loginMethod !== undefined;
  const [internalRestoringFlow, setInternalRestoringFlow] = useState(defaultRestoringFlow);
  const [internalLoginMethod, setInternalLoginMethod] = useState(defaultLoginMethod);
  const [login, setLogin] = useState(defaultLogin);
  const [inn, setInn] = useState(defaultInn);
  const [restoringValue, setRestoringValue] = useState(defaultRestoringValue);
  const [consentAccepted, setConsentAccepted] = useState(defaultConsentAccepted);
  const [isAutoMobileViewport, setIsAutoMobileViewport] = useState(function () {
    return typeof window !== 'undefined'
      ? window.innerWidth <= MOBILE_BREAKPOINT_PX
      : false;
  });

  const resolvedRestoringFlow = isRestoringFlowControlled
    ? restoringFlow
    : internalRestoringFlow;
  const resolvedLoginMethod = isLoginMethodControlled
    ? loginMethod
    : internalLoginMethod;
  const usesMobileFlowLabels =
    device === DEVICES.mobile || (device === DEVICES.auto && isAutoMobileViewport);
  const resolvedConsentLabel =
    consentLabel !== undefined
      ? consentLabel
      : buildDefaultConsentLabel(onPersonalDataClick);
  const restoringDescription =
    resolvedRestoringFlow === FLOWS.password
      ? passwordDescription
      : resolvedLoginMethod === METHODS.email
        ? loginEmailDescription
        : loginPhoneDescription;
  const canSubmitPassword = String(login || '').trim().length > 0;
  const canSubmitLogin =
    isInnValid(inn) &&
    (resolvedLoginMethod === METHODS.phone
      ? isPhoneValid(restoringValue)
      : isEmailValid(restoringValue)) &&
    consentAccepted;
  const flowSwitchOptions = [
    {
      label: getFlowLabel(FLOWS.password, usesMobileFlowLabels, {
        passwordFlowLabel,
        passwordFlowMobileLabel,
        loginFlowLabel,
        loginFlowMobileLabel
      }),
      value: FLOWS.password
    },
    {
      label: getFlowLabel(FLOWS.login, usesMobileFlowLabels, {
        passwordFlowLabel,
        passwordFlowMobileLabel,
        loginFlowLabel,
        loginFlowMobileLabel
      }),
      value: FLOWS.login
    }
  ];

  useEffect(function () {
    if (device !== DEVICES.auto || typeof window === 'undefined') {
      return undefined;
    }

    function handleResize() {
      setIsAutoMobileViewport(window.innerWidth <= MOBILE_BREAKPOINT_PX);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, [device]);

  function handleRestoringFlowChange(nextValue) {
    const nextFlow = nextValue === FLOWS.login ? FLOWS.login : FLOWS.password;

    if (!isRestoringFlowControlled) {
      setInternalRestoringFlow(nextFlow);
    }

    if (onRestoringFlowChange) {
      onRestoringFlowChange(nextFlow);
    }
  }

  function handleLoginMethodChange(nextValue) {
    const nextMethod = nextValue === METHODS.phone ? METHODS.phone : METHODS.email;

    if (!isLoginMethodControlled) {
      setInternalLoginMethod(nextMethod);
    }

    setRestoringValue('');

    if (onLoginMethodChange) {
      onLoginMethodChange(nextMethod);
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

  function handlePasswordSubmit(event) {
    event.preventDefault();

    if (!canSubmitPassword) {
      return;
    }

    if (onPasswordSubmit) {
      onPasswordSubmit({ login: login });
    }
  }

  function handleRestoringLoginSubmit(event) {
    event.preventDefault();

    if (!canSubmitLogin) {
      return;
    }

    if (onRestoringLoginSubmit) {
      onRestoringLoginSubmit({
        consentAccepted: consentAccepted,
        inn: inn,
        method: resolvedLoginMethod,
        value: restoringValue
      });
    }
  }

  function renderFlowSwitch() {
    return (
      <SegmentedControl
        className="rshb-authentication-restoring-access__switch"
        name={generatedName}
        onChange={function (nextValue) {
          handleRestoringFlowChange(nextValue);
        }}
        options={flowSwitchOptions}
        value={resolvedRestoringFlow}
      />
    );
  }

  return (
    <section
      {...rest}
      className={classNames('rshb-authentication-restoring-access', className)}
      data-device={device}
      data-id={dataIdValue}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-restoring-access__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <div className="rshb-authentication-restoring-access__content">
        <div className="rshb-authentication-restoring-access__heading">
          <h1 className="rshb-authentication-restoring-access__title">
            {title}
          </h1>
        </div>

        {resolvedRestoringFlow === FLOWS.password ? (
          <form
            className="rshb-authentication-restoring-access__panel"
            onSubmit={handlePasswordSubmit}
          >
            {renderFlowSwitch()}

            <div className="rshb-authentication-restoring-access__group">
              <p className="rshb-authentication-restoring-access__description">
                {restoringDescription}
              </p>

              <InputLogin
                {...loginInputProps}
                className={classNames(
                  'rshb-authentication-restoring-access__field',
                  loginInputProps && loginInputProps.className
                )}
                label={loginLabel}
                onValueChange={function (nextValue) {
                  setLogin(nextValue);
                  if (loginInputProps && loginInputProps.onValueChange) {
                    loginInputProps.onValueChange(nextValue);
                  }
                }}
                value={login}
              />
            </div>

            <div className="rshb-authentication-restoring-access__action-row">
              <Button
                {...backButtonProps}
                className={classNames(
                  'rshb-authentication-restoring-access__action',
                  backButtonProps && backButtonProps.className
                )}
                onClick={handleBackButtonClick}
                size="m"
                type="button"
                variant="normal"
              >
                Назад
              </Button>

              <Button
                {...submitButtonProps}
                className={classNames(
                  'rshb-authentication-restoring-access__action',
                  submitButtonProps && submitButtonProps.className
                )}
                disabled={!canSubmitPassword || Boolean(submitButtonProps && submitButtonProps.disabled)}
                size="m"
                type="submit"
                variant="brand"
              >
                {passwordButtonLabel}
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="rshb-authentication-restoring-access__panel"
            onSubmit={handleRestoringLoginSubmit}
          >
            <div className="rshb-authentication-restoring-access__switch-group">
              {renderFlowSwitch()}

              <Tabs
                className="rshb-authentication-restoring-access__tabs"
                onChange={function (nextValue) {
                  handleLoginMethodChange(nextValue);
                }}
                options={[
                  { label: emailMethodLabel, value: METHODS.email },
                  { label: phoneMethodLabel, value: METHODS.phone }
                ]}
                value={resolvedLoginMethod}
              />
            </div>

            <div className="rshb-authentication-restoring-access__group">
              <p className="rshb-authentication-restoring-access__description">
                {restoringDescription}
              </p>

              <div className="rshb-authentication-restoring-access__fields">
                <InputInn
                  {...innInputProps}
                  className={classNames(
                    'rshb-authentication-restoring-access__field',
                    innInputProps && innInputProps.className
                  )}
                  label={innLabel}
                  onValueChange={function (nextValue) {
                    setInn(nextValue);
                    if (innInputProps && innInputProps.onValueChange) {
                      innInputProps.onValueChange(nextValue);
                    }
                  }}
                  value={inn}
                />

                {resolvedLoginMethod === METHODS.email ? (
                  <InputEmail
                    {...emailInputProps}
                    className={classNames(
                      'rshb-authentication-restoring-access__field',
                      emailInputProps && emailInputProps.className
                    )}
                    label={emailLabel}
                    onValueChange={function (nextValue) {
                      setRestoringValue(nextValue);
                      if (emailInputProps && emailInputProps.onValueChange) {
                        emailInputProps.onValueChange(nextValue);
                      }
                    }}
                    value={restoringValue}
                  />
                ) : (
                  <InputPhone
                    {...phoneInputProps}
                    className={classNames(
                      'rshb-authentication-restoring-access__field',
                      phoneInputProps && phoneInputProps.className
                    )}
                    label={phoneLabel}
                    onValueChange={function (nextValue) {
                      setRestoringValue(nextValue);
                      if (phoneInputProps && phoneInputProps.onValueChange) {
                        phoneInputProps.onValueChange(nextValue);
                      }
                    }}
                    value={restoringValue}
                  />
                )}
              </div>
            </div>

            <div className="rshb-authentication-restoring-access__actions">
              <Checkbox
                {...consentCheckboxProps}
                checked={consentAccepted}
                className={classNames(
                  'rshb-authentication-restoring-access__consent',
                  consentCheckboxProps && consentCheckboxProps.className
                )}
                label={resolvedConsentLabel}
                onChange={handleConsentChange}
                size="s"
              />

              <div className="rshb-authentication-restoring-access__action-row">
                <Button
                  {...backButtonProps}
                  className={classNames(
                    'rshb-authentication-restoring-access__action',
                    backButtonProps && backButtonProps.className
                  )}
                  onClick={handleBackButtonClick}
                  size="m"
                  type="button"
                  variant="normal"
                >
                  Назад
                </Button>

                <Button
                  {...submitButtonProps}
                  className={classNames(
                    'rshb-authentication-restoring-access__action',
                    submitButtonProps && submitButtonProps.className
                  )}
                  disabled={!canSubmitLogin || Boolean(submitButtonProps && submitButtonProps.disabled)}
                  size="m"
                  type="submit"
                  variant="brand"
                >
                  {loginButtonLabel}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

AuthenticationRestoringAccess.displayName = 'AuthenticationRestoringAccess';

AuthenticationRestoringAccess.devices = DEVICES;
AuthenticationRestoringAccess.flows = FLOWS;
AuthenticationRestoringAccess.methods = METHODS;

AuthenticationRestoringAccess.propTypes = {
  backButtonProps: PropTypes.object,
  brandButtonProps: PropTypes.object,
  className: PropTypes.string,
  consentCheckboxProps: PropTypes.object,
  consentLabel: PropTypes.node,
  dataId: PropTypes.string,
  defaultConsentAccepted: PropTypes.bool,
  defaultInn: PropTypes.string,
  defaultLogin: PropTypes.string,
  defaultLoginMethod: PropTypes.oneOf(METHOD_VALUES),
  defaultRestoringFlow: PropTypes.oneOf(FLOW_VALUES),
  defaultRestoringValue: PropTypes.string,
  device: PropTypes.oneOf(DEVICE_VALUES),
  emailInputProps: PropTypes.object,
  emailLabel: PropTypes.node,
  emailMethodLabel: PropTypes.node,
  innInputProps: PropTypes.object,
  innLabel: PropTypes.node,
  loginButtonLabel: PropTypes.node,
  loginEmailDescription: PropTypes.node,
  loginFlowLabel: PropTypes.node,
  loginFlowMobileLabel: PropTypes.node,
  loginInputProps: PropTypes.object,
  loginLabel: PropTypes.node,
  loginMethod: PropTypes.oneOf(METHOD_VALUES),
  loginPhoneDescription: PropTypes.node,
  onBack: PropTypes.func,
  onConsentChange: PropTypes.func,
  onLoginMethodChange: PropTypes.func,
  onPasswordSubmit: PropTypes.func,
  onPersonalDataClick: PropTypes.func,
  onRestoringFlowChange: PropTypes.func,
  onRestoringLoginSubmit: PropTypes.func,
  passwordButtonLabel: PropTypes.node,
  passwordDescription: PropTypes.node,
  passwordFlowLabel: PropTypes.node,
  passwordFlowMobileLabel: PropTypes.node,
  phoneInputProps: PropTypes.object,
  phoneLabel: PropTypes.node,
  phoneMethodLabel: PropTypes.node,
  restoringFlow: PropTypes.oneOf(FLOW_VALUES),
  submitButtonProps: PropTypes.object,
  themeProps: PropTypes.object,
  title: PropTypes.node
};

AuthenticationRestoringAccess.defaultProps = {
  backButtonProps: undefined,
  brandButtonProps: undefined,
  className: undefined,
  consentCheckboxProps: undefined,
  consentLabel: undefined,
  dataId: undefined,
  defaultConsentAccepted: false,
  defaultInn: '',
  defaultLogin: '',
  defaultLoginMethod: METHODS.email,
  defaultRestoringFlow: FLOWS.password,
  defaultRestoringValue: '',
  device: DEVICES.auto,
  emailInputProps: undefined,
  emailLabel: 'Электронная почта',
  emailMethodLabel: 'Электронная почта',
  innInputProps: undefined,
  innLabel: 'ИНН',
  loginButtonLabel: 'Продолжить',
  loginEmailDescription:
    'Введите ИНН и адрес электронной почты, которые были указаны при\u00A0регистрации',
  loginFlowLabel: 'Восстанов. логина',
  loginFlowMobileLabel: 'Восстан. логина',
  loginInputProps: undefined,
  loginLabel: 'Логин',
  loginMethod: undefined,
  loginPhoneDescription:
    'Введите ИНН и номер телефона, которые были указаны при\u00A0регистрации',
  onBack: undefined,
  onConsentChange: undefined,
  onLoginMethodChange: undefined,
  onPasswordSubmit: undefined,
  onPersonalDataClick: undefined,
  onRestoringFlowChange: undefined,
  onRestoringLoginSubmit: undefined,
  passwordButtonLabel: 'Продолжить',
  passwordDescription: 'Введите логин, который был создан при\u00A0регистрации',
  passwordFlowLabel: 'Восстанов. пароля',
  passwordFlowMobileLabel: 'Восстан. пароля',
  phoneInputProps: undefined,
  phoneLabel: 'Номер телефона',
  phoneMethodLabel: 'Номер телефона',
  restoringFlow: undefined,
  submitButtonProps: undefined,
  themeProps: undefined,
  title: 'Восстановление доступа'
};

export default AuthenticationRestoringAccess;
