import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../components/button/index.js';
import Header from '../../../components/header/index.js';
import InputLogin from '../../../components/input-login/index.js';
import InputPassword from '../../../components/input-password/index.js';
import './styles.css';

const DEVICES = {
  auto: 'auto',
  desktop: 'desktop',
  mobile: 'mobile'
};

const DEVICE_VALUES = [DEVICES.auto, DEVICES.desktop, DEVICES.mobile];

const MODES = {
  login: 'login',
  password: 'password',
  loginAndPassword: 'login-and-password'
};

const MODE_VALUES = [MODES.login, MODES.password, MODES.loginAndPassword];

const PASSWORD_RULES = [
  {
    id: 'length-without-spaces',
    label: 'минимум 15 символов без\u00A0пробелов',
    isMet: function (value) {
      return value.length >= 15 && !/\s/.test(value);
    }
  },
  {
    id: 'latin-cases',
    label: 'прописные и строчные латинские буквы (a-z)',
    isMet: function (value) {
      return /[a-z]/.test(value) && /[A-Z]/.test(value);
    }
  },
  {
    id: 'digit',
    label: 'хотя бы одна цифра',
    isMet: function (value) {
      return /\d/.test(value);
    }
  },
  {
    id: 'special',
    label: 'хотя бы один спецсимвол',
    isMet: function (value) {
      return /[^A-Za-z0-9\s]/.test(value);
    }
  }
];

function getDefaultTitle(mode) {
  if (mode === MODES.password) {
    return 'Создайте надёжный пароль';
  }

  if (mode === MODES.loginAndPassword) {
    return 'Создайте надёжные логин и пароль';
  }

  return 'Создайте надёжный логин';
}

function getDefaultDescription(mode) {
  if (mode === MODES.password) {
    return 'Создайте пароль, который будете использовать для\u00A0входа в\u00A0личный кабинет';
  }

  if (mode === MODES.loginAndPassword) {
    return 'Создайте логин и пароль, которые будете использовать при\u00A0входе в\u00A0личный кабинет';
  }

  return 'Создайте логин, который будете использовать для\u00A0входа в\u00A0личный кабинет';
}

function getDefaultSaveButtonLabel(mode) {
  if (mode === MODES.password) {
    return 'Сохранить пароль';
  }

  if (mode === MODES.loginAndPassword) {
    return 'Сохранить логин и пароль';
  }

  return 'Сохранить логин';
}

function getPasswordRuleStates(password) {
  return PASSWORD_RULES.map(function (rule) {
    return {
      id: rule.id,
      label: rule.label,
      met: rule.isMet(password)
    };
  });
}

function renderPasswordRules(password) {
  var ruleStates = getPasswordRuleStates(password);

  return (
    <ul className="rshb-authentication-creating-login-password__rules">
      {ruleStates.map(function (rule) {
        return (
          <li
            className="rshb-authentication-creating-login-password__rule"
            data-met={rule.met ? 'true' : 'false'}
            key={rule.id}
          >
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

function AuthenticationCreatingLoginPassword(props) {
  const {
    brandButtonProps,
    className,
    dataId,
    defaultLogin,
    defaultPassword,
    defaultRepeatedPassword,
    device,
    loginHint,
    loginInputProps,
    loginLabel,
    mode,
    onSubmit,
    passwordInputProps,
    passwordLabel,
    repeatedPasswordInputProps,
    repeatedPasswordLabel,
    saveButtonProps,
    saveButtonLabel,
    themeProps,
    title,
    ...rest
  } = props;

  const dataIdValue = dataId || rest['data-id'];
  const [login, setLogin] = useState(defaultLogin);
  const [password, setPassword] = useState(defaultPassword);
  const [repeatedPassword, setRepeatedPassword] = useState(defaultRepeatedPassword);
  const showsLogin = mode === MODES.login || mode === MODES.loginAndPassword;
  const showsPassword = mode === MODES.password || mode === MODES.loginAndPassword;
  const resolvedTitle = title !== undefined ? title : getDefaultTitle(mode);
  const resolvedDescription = getDefaultDescription(mode);
  const resolvedSaveButtonLabel =
    saveButtonLabel !== undefined ? saveButtonLabel : getDefaultSaveButtonLabel(mode);
  const resolvedLoginLabel =
    loginLabel !== undefined
      ? loginLabel
      : mode === MODES.loginAndPassword
        ? 'Логин'
        : 'Новый логин';
  const resolvedPasswordLabel =
    passwordLabel !== undefined
      ? passwordLabel
      : mode === MODES.loginAndPassword
        ? 'Пароль'
        : 'Новый пароль';
  const passwordRuleStates = getPasswordRuleStates(password);
  const isPasswordValid = passwordRuleStates.every(function (rule) {
    return rule.met;
  });
  const isPasswordRepeated =
    repeatedPassword.length > 0 && repeatedPassword === password;
  const canSubmit =
    (!showsLogin || login.trim().length > 0) &&
    (!showsPassword || (isPasswordValid && isPasswordRepeated));

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

  function handleRepeatedPasswordValueChange(nextValue) {
    setRepeatedPassword(nextValue);

    if (repeatedPasswordInputProps && repeatedPasswordInputProps.onValueChange) {
      repeatedPasswordInputProps.onValueChange(nextValue);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (onSubmit) {
      onSubmit({
        login: showsLogin ? login : undefined,
        password: showsPassword ? password : undefined,
        repeatedPassword: showsPassword ? repeatedPassword : undefined
      });
    }
  }

  return (
    <section
      {...rest}
      className={classNames('rshb-authentication-creating-login-password', className)}
      data-device={device}
      data-id={dataIdValue}
      data-mode={mode}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-creating-login-password__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <h1 className="rshb-authentication-creating-login-password__title">
        {resolvedTitle}
      </h1>

      <form
        className="rshb-authentication-creating-login-password__form"
        onSubmit={handleSubmit}
      >
        <div className="rshb-authentication-creating-login-password__fields">
          <p className="rshb-authentication-creating-login-password__description">
            {resolvedDescription}
          </p>

          {showsLogin ? (
            <div className="rshb-authentication-creating-login-password__field-group">
              <InputLogin
                {...loginInputProps}
                className={classNames(
                  'rshb-authentication-creating-login-password__field',
                  loginInputProps && loginInputProps.className
                )}
                label={resolvedLoginLabel}
                onValueChange={handleLoginValueChange}
                value={login}
              />
              <p className="rshb-authentication-creating-login-password__hint">
                {loginHint}
              </p>
            </div>
          ) : null}

          {showsPassword ? (
            <div className="rshb-authentication-creating-login-password__field-group">
              <InputPassword
                {...passwordInputProps}
                className={classNames(
                  'rshb-authentication-creating-login-password__field',
                  passwordInputProps && passwordInputProps.className
                )}
                label={resolvedPasswordLabel}
                onValueChange={handlePasswordValueChange}
                value={password}
              />

              <InputPassword
                {...repeatedPasswordInputProps}
                className={classNames(
                  'rshb-authentication-creating-login-password__field',
                  repeatedPasswordInputProps && repeatedPasswordInputProps.className
                )}
                label={repeatedPasswordLabel}
                onValueChange={handleRepeatedPasswordValueChange}
                value={repeatedPassword}
              />

              {renderPasswordRules(password)}
            </div>
          ) : null}
        </div>

        <Button
          {...saveButtonProps}
          className={classNames(
            'rshb-authentication-creating-login-password__action',
            saveButtonProps && saveButtonProps.className
          )}
          disabled={!canSubmit || Boolean(saveButtonProps && saveButtonProps.disabled)}
          type="submit"
          variant="brand"
        >
          {resolvedSaveButtonLabel}
        </Button>
      </form>
    </section>
  );
}

AuthenticationCreatingLoginPassword.displayName =
  'AuthenticationCreatingLoginPassword';

AuthenticationCreatingLoginPassword.devices = DEVICES;
AuthenticationCreatingLoginPassword.modes = MODES;

AuthenticationCreatingLoginPassword.propTypes = {
  brandButtonProps: PropTypes.object,
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultLogin: PropTypes.string,
  defaultPassword: PropTypes.string,
  defaultRepeatedPassword: PropTypes.string,
  device: PropTypes.oneOf(DEVICE_VALUES),
  loginHint: PropTypes.node,
  loginInputProps: PropTypes.object,
  loginLabel: PropTypes.node,
  mode: PropTypes.oneOf(MODE_VALUES),
  onSubmit: PropTypes.func,
  passwordInputProps: PropTypes.object,
  passwordLabel: PropTypes.node,
  repeatedPasswordInputProps: PropTypes.object,
  repeatedPasswordLabel: PropTypes.node,
  saveButtonProps: PropTypes.object,
  saveButtonLabel: PropTypes.node,
  themeProps: PropTypes.object,
  title: PropTypes.node
};

AuthenticationCreatingLoginPassword.defaultProps = {
  brandButtonProps: undefined,
  className: undefined,
  dataId: undefined,
  defaultLogin: '',
  defaultPassword: '',
  defaultRepeatedPassword: '',
  device: DEVICES.auto,
  loginHint:
    'Можно использовать латинские буквы (a-z), цифры и спецсимволы: ".", "-", "_".',
  loginInputProps: undefined,
  loginLabel: undefined,
  mode: MODES.login,
  onSubmit: undefined,
  passwordInputProps: undefined,
  passwordLabel: undefined,
  repeatedPasswordInputProps: undefined,
  repeatedPasswordLabel: 'Повторите пароль',
  saveButtonProps: undefined,
  saveButtonLabel: undefined,
  themeProps: undefined,
  title: undefined
};

export default AuthenticationCreatingLoginPassword;
