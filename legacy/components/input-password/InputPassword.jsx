import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/index.js';
import InputText from '../input-text/index.js';
import './styles.css';
import eyeIcon from '../../../icons/eye.svg';
import eyeSlashIcon from '../../../icons/eye-slash.svg';

const PASSWORD_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9()~!@#$%^&*_\-+='|"{}\[\]<>;:,.?\/]$/;
const REQUIRED_ERROR = 'Обязательно для заполнения';

function sanitizePasswordValue(value) {
  const stringValue = String(value != null ? value : '');
  let sanitizedValue = '';

  for (let index = 0; index < stringValue.length; index += 1) {
    const character = stringValue.charAt(index);

    if (PASSWORD_ALLOWED_CHARACTER_PATTERN.test(character)) {
      sanitizedValue += character;
    }
  }

  return sanitizedValue;
}

function InputPasswordIcon(props) {
  const src = props.src;

  return (
    <span
      aria-hidden="true"
      className="rshb-legacy-input-password__icon"
      style={{ '--rshb-legacy-input-password-icon': 'url("' + src + '")' }}
    />
  );
}

InputPasswordIcon.propTypes = {
  src: PropTypes.string.isRequired
};

function getInputElement(inputHandle) {
  if (!inputHandle) {
    return null;
  }

  return inputHandle.inputElement || inputHandle;
}

const InputPassword = React.forwardRef(function InputPassword(props, ref) {
  const {
    changeOnFocus,
    className,
    defaultValue,
    disabled,
    endAdornment,
    helperText,
    hidePasswordLabel,
    invalid,
    label,
    onBlur,
    onFocus,
    onFocusChange,
    onKeyDown,
    onValueChange,
    readOnly,
    showPasswordLabel,
    value,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    sanitizePasswordValue(defaultValue != null ? defaultValue : '')
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const resolvedShowPasswordLabel =
    showPasswordLabel !== undefined ? showPasswordLabel : 'Показать пароль';
  const resolvedHidePasswordLabel =
    hidePasswordLabel !== undefined ? hidePasswordLabel : 'Скрыть пароль';
  const inputRef = useRef(null);
  const pendingSelectionRef = useRef(null);
  const resolvedValue = isControlled
    ? sanitizePasswordValue(value != null ? value : '')
    : uncontrolledValue;
  const validationMessage = hasBeenValidated && resolvedValue.length === 0
    ? REQUIRED_ERROR
    : undefined;
  const resolvedInvalid = Boolean(invalid || validationMessage);
  const canTogglePasswordVisibility = !disabled && !readOnly;

  useImperativeHandle(ref, function () {
    return inputRef.current;
  });

  useEffect(function restoreSelectionAfterVisibilityToggle() {
    const pendingSelection = pendingSelectionRef.current;

    if (!pendingSelection) {
      return;
    }

    pendingSelectionRef.current = null;

    const inputElement = getInputElement(inputRef.current);

    if (!inputElement || typeof inputElement.setSelectionRange !== 'function') {
      return;
    }

    const frame = typeof window !== 'undefined' && window.requestAnimationFrame
      ? window.requestAnimationFrame
      : function (callback) {
          callback();
          return 0;
        };

    frame(function () {
      inputElement.focus();
      inputElement.setSelectionRange(pendingSelection.start, pendingSelection.end);
    });
  }, [isPasswordVisible]);

  function commitValue(nextValue) {
    const sanitizedValue = sanitizePasswordValue(nextValue);

    if (!isControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    if (onValueChange) {
      onValueChange(sanitizedValue);
    }

    if (changeOnFocus && isFocused) {
      changeOnFocus(sanitizedValue);
    }
  }

  function handleFocus(event) {
    setIsFocused(true);
    if (onFocusChange) {
      onFocusChange(true);
    }
    if (onFocus) {
      onFocus(event);
    }
  }

  function handleBlur(event) {
    setIsFocused(false);
    setHasBeenValidated(true);
    if (onFocusChange) {
      onFocusChange(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  }

  function handleKeyDown(event) {
    if (
      !disabled &&
      !readOnly &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      event.key.length === 1 &&
      !PASSWORD_ALLOWED_CHARACTER_PATTERN.test(event.key)
    ) {
      event.preventDefault();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  function keepInputFocusOnMouseDown(event) {
    event.preventDefault();
  }

  function handleTogglePasswordVisibility() {
    if (!canTogglePasswordVisibility) {
      return;
    }

    const inputElement = getInputElement(inputRef.current);

    if (inputElement) {
      pendingSelectionRef.current = {
        start: inputElement.selectionStart != null ? inputElement.selectionStart : resolvedValue.length,
        end: inputElement.selectionEnd != null ? inputElement.selectionEnd : resolvedValue.length
      };
    }

    setIsPasswordVisible(function (currentValue) {
      return !currentValue;
    });
  }

  const visibilityToggle = resolvedValue.length > 0 ? (
    <Button
      aria-label={isPasswordVisible ? resolvedHidePasswordLabel : resolvedShowPasswordLabel}
      aria-pressed={isPasswordVisible}
      buttonType={Button.buttonTypes.flatSecondary}
      className="rshb-legacy-input-password__visibility-toggle"
      disabled={!canTogglePasswordVisibility}
      iconOnly
      leadingIcon={<InputPasswordIcon src={isPasswordVisible ? eyeSlashIcon : eyeIcon} />}
      onClick={handleTogglePasswordVisibility}
      onMouseDown={keepInputFocusOnMouseDown}
      size="s"
      type="button"
    />
  ) : null;

  return (
    <InputText
      {...rest}
      className={classNames('rshb-legacy-input-password', className)}
      defaultValue={undefined}
      disabled={disabled}
      endAdornment={
        <>
          {visibilityToggle}
          {endAdornment}
        </>
      }
      helperText={validationMessage || helperText}
      invalid={resolvedInvalid}
      label={label || 'Пароль'}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onValueChange={commitValue}
      readOnly={readOnly}
      ref={inputRef}
      type={isPasswordVisible ? 'text' : 'password'}
      value={resolvedValue}
    />
  );
});

InputPassword.displayName = 'InputPassword';

InputPassword.propTypes = {
  changeOnFocus: PropTypes.func,
  className: PropTypes.string,
  clearButtonDataId: PropTypes.string,
  clearable: PropTypes.bool,
  controlClassName: PropTypes.string,
  customInputStyle: PropTypes.string,
  dataId: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  hidePasswordLabel: PropTypes.string,
  id: PropTypes.string,
  inputClassName: PropTypes.string,
  invalid: PropTypes.bool,
  label: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onFocusChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onPointerDown: PropTypes.func,
  onValueChange: PropTypes.func,
  readOnly: PropTypes.bool,
  showPasswordLabel: PropTypes.string,
  startIcon: PropTypes.node,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default InputPassword;
