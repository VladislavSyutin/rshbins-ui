import React, { useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputText from '../input-text/index.js';

export const REQUIRED_ERROR = 'Обязательно для заполнения';

export const businessInputPropTypes = {
  changeOnFocus: PropTypes.func,
  className: PropTypes.string,
  clearButtonDataId: PropTypes.string,
  clearable: PropTypes.bool,
  controlClassName: PropTypes.string,
  customInputStyle: PropTypes.string,
  dataId: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  endAdornment: PropTypes.node,
  error: PropTypes.bool,
  helperIcon: PropTypes.node,
  helperText: PropTypes.node,
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
  previewState: PropTypes.string,
  readOnly: PropTypes.bool,
  showHelperIcon: PropTypes.bool,
  startIcon: PropTypes.node,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export function isInputTextKey(event, allowedPattern) {
  return (
    event.key.length !== 1 ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    allowedPattern.test(event.key)
  );
}

export function createBusinessInput(config) {
  const Component = React.forwardRef(function BusinessInput(props, ref) {
    const {
      changeOnFocus,
      className,
      defaultValue,
      helperText,
      invalid,
      label,
      onBlur,
      onFocus,
      onFocusChange,
      onKeyDown,
      onValueChange,
      value,
      ...rest
    } = props;

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(
      config.sanitize(defaultValue != null ? defaultValue : '')
    );
    const [hasBeenValidated, setHasBeenValidated] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const resolvedValue = isControlled
      ? config.sanitize(value != null ? value : '')
      : uncontrolledValue;
    const validationMessage = hasBeenValidated ? config.validate(resolvedValue) : undefined;
    const resolvedInvalid = Boolean(invalid || validationMessage);

    useImperativeHandle(ref, function () {
      return inputRef.current;
    });

    function commitValue(nextValue) {
      const sanitizedValue = config.sanitize(nextValue);

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
      const normalizedValue = config.normalizeOnBlur
        ? config.normalizeOnBlur(resolvedValue)
        : config.sanitize(resolvedValue);

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
        !rest.disabled &&
        !rest.readOnly &&
        config.allowedKeyPattern &&
        !isInputTextKey(event, config.allowedKeyPattern)
      ) {
        event.preventDefault();
      }

      if (config.onKeyDown) {
        config.onKeyDown(event, {
          commitValue: commitValue,
          value: resolvedValue
        });
      }

      if (onKeyDown) {
        onKeyDown(event);
      }
    }

    return (
      <InputText
        {...rest}
        autoCapitalize={rest.autoCapitalize != null ? rest.autoCapitalize : config.autoCapitalize}
        autoCorrect={rest.autoCorrect != null ? rest.autoCorrect : config.autoCorrect}
        className={classNames(config.className, className)}
        defaultValue={undefined}
        helperText={validationMessage || helperText}
        inputMode={rest.inputMode != null ? rest.inputMode : config.inputMode}
        invalid={resolvedInvalid}
        label={label || config.label}
        maxLength={rest.maxLength != null ? rest.maxLength : config.maxLength}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onValueChange={commitValue}
        pattern={rest.pattern != null ? rest.pattern : config.pattern}
        ref={inputRef}
        spellCheck={Object.prototype.hasOwnProperty.call(rest, 'spellCheck') ? rest.spellCheck : config.spellCheck}
        type={rest.type || config.type || 'text'}
        value={resolvedValue}
      />
    );
  });

  Component.displayName = config.displayName;
  Component.propTypes = businessInputPropTypes;

  return Component;
}
