import React, { useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputText from '../input-text/index.js';
import Switch from '../switch/index.js';
import { businessInputPropTypes } from '../input-helpers/createBusinessInput.jsx';
import {
  NAME_ALLOWED_CHARACTER_PATTERN,
  normalizePersonNameOnBlur,
  sanitizePersonNameValue,
  validatePersonNameValue
} from '../input-helpers/formatters.js';
import './styles.css';

const InputMiddleName = React.forwardRef(function InputMiddleName(props, ref) {
  const {
    changeOnFocus,
    className,
    defaultValue,
    disabled,
    helperText,
    invalid,
    label,
    onBlur,
    onFocus,
    onFocusChange,
    onKeyDown,
    onValueChange,
    switchChecked,
    switchDataId,
    switchDefaultChecked,
    switchLabel,
    switchOnChange,
    onSwitchChange,
    value,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const isSwitchControlled = switchChecked !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    sanitizePersonNameValue(defaultValue || '', { allowSpace: false })
  );
  const [uncontrolledSwitchChecked, setUncontrolledSwitchChecked] = useState(Boolean(switchDefaultChecked));
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const resolvedSwitchChecked = isSwitchControlled ? Boolean(switchChecked) : uncontrolledSwitchChecked;
  const resolvedValue = isControlled
    ? sanitizePersonNameValue(value || '', { allowSpace: false })
    : uncontrolledValue;
  const validationMessage = hasBeenValidated && !resolvedSwitchChecked
    ? validatePersonNameValue(resolvedValue)
    : undefined;
  const resolvedInvalid = Boolean(invalid || validationMessage);
  const resolvedDisabled = Boolean(disabled || resolvedSwitchChecked);

  useImperativeHandle(ref, function () {
    return inputRef.current;
  });

  function commitValue(nextValue) {
    const sanitizedValue = sanitizePersonNameValue(nextValue, { allowSpace: false });

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
    const normalizedValue = normalizePersonNameOnBlur(resolvedValue, { allowSpace: false });

    if (normalizedValue !== resolvedValue) {
      commitValue(normalizedValue);
    }

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
      !resolvedDisabled &&
      !rest.readOnly &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      event.key.length === 1 &&
      !NAME_ALLOWED_CHARACTER_PATTERN.test(event.key)
    ) {
      event.preventDefault();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  function handleSwitchChange(event) {
    const nextChecked = event.target.checked;

    if (!isSwitchControlled) {
      setUncontrolledSwitchChecked(nextChecked);
    }

    if (onSwitchChange) {
      onSwitchChange(nextChecked, event);
    }

    if (switchOnChange) {
      switchOnChange(event);
    }
  }

  return (
    <div className={classNames('rshb-legacy-input-middle-name', className)}>
      <InputText
        {...rest}
        className="rshb-legacy-input-middle-name__input"
        defaultValue={undefined}
        disabled={resolvedDisabled}
        helperText={validationMessage || helperText}
        inputMode="text"
        invalid={resolvedInvalid}
        label={label || 'Отчество'}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onValueChange={commitValue}
        ref={inputRef}
        value={resolvedValue}
        width="100%"
      />
      <Switch
        checked={resolvedSwitchChecked}
        className="rshb-legacy-input-middle-name__switch"
        dataId={switchDataId || (rest.dataId ? rest.dataId + '-switch' : undefined)}
        disabled={Boolean(disabled)}
        label={switchLabel || 'Нет отчества'}
        onChange={handleSwitchChange}
      />
    </div>
  );
});

InputMiddleName.displayName = 'InputMiddleName';
InputMiddleName.propTypes = {
  ...businessInputPropTypes,
  onSwitchChange: PropTypes.func,
  switchChecked: PropTypes.bool,
  switchDataId: PropTypes.string,
  switchDefaultChecked: PropTypes.bool,
  switchLabel: PropTypes.node,
  switchOnChange: PropTypes.func
};

export default InputMiddleName;
