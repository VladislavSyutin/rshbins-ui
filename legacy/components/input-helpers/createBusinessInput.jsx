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
  helperText: PropTypes.node,
  hideControlValue: PropTypes.bool,
  id: PropTypes.string,
  inputClassName: PropTypes.string,
  invalid: PropTypes.bool,
  label: PropTypes.node,
  maskOverlay: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onFocusChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onPointerDown: PropTypes.func,
  onValueChange: PropTypes.func,
  readOnly: PropTypes.bool,
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

function buildMaskParts(mask, value) {
  const stringValue = String(value != null ? value : '');

  return {
    filledValue: stringValue,
    placeholderValue: mask.slice(stringValue.length)
  };
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
    const resolvedInvalid = Boolean(invalid || validationMessage !== undefined);
    const shouldShowMask = Boolean(config.mask) && (isFocused || resolvedValue.length > 0);
    const maskParts = shouldShowMask ? buildMaskParts(config.mask, resolvedValue) : undefined;

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
        autoComplete={rest.autoComplete != null ? rest.autoComplete : config.autoComplete}
        autoCapitalize={rest.autoCapitalize != null ? rest.autoCapitalize : config.autoCapitalize}
        autoCorrect={rest.autoCorrect != null ? rest.autoCorrect : config.autoCorrect}
        className={classNames(config.className, className)}
        defaultValue={undefined}
        helperText={validationMessage !== undefined ? validationMessage : helperText}
        hideControlValue={rest.hideControlValue != null ? rest.hideControlValue : shouldShowMask}
        inputMode={rest.inputMode != null ? rest.inputMode : config.inputMode}
        invalid={resolvedInvalid}
        label={label || config.label}
        maskOverlay={rest.maskOverlay != null ? rest.maskOverlay : (maskParts ? (
          <>
            <span className={config.className + '__mask-filled'}>{maskParts.filledValue}</span>
            <span className={config.className + '__mask-placeholder'}>{maskParts.placeholderValue}</span>
          </>
        ) : undefined)}
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
