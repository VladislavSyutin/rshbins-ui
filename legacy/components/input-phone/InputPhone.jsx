import React, { useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputText from '../input-text/index.js';
import { businessInputPropTypes } from '../input-helpers/createBusinessInput.jsx';
import { formatPhoneNumber, getPhoneDigits, validatePhoneValue } from '../input-helpers/formatters.js';
import './styles.css';

const PHONE_MASK = '(000) 000-00-00';

function getPhoneMaskParts(value) {
  const digits = getPhoneDigits(value);
  let filledValue = '';
  let placeholderValue = '';
  let digitIndex = 0;
  let isPlaceholder = false;

  for (let index = 0; index < PHONE_MASK.length; index += 1) {
    const character = PHONE_MASK.charAt(index);

    if (character === '0') {
      if (digitIndex < digits.length) {
        filledValue += digits.charAt(digitIndex);
        digitIndex += 1;
      } else {
        isPlaceholder = true;
        placeholderValue += '0';
      }
      continue;
    }

    if (isPlaceholder) {
      placeholderValue += character;
    } else {
      filledValue += character;
    }
  }

  return {
    filledValue: filledValue,
    placeholderValue: placeholderValue
  };
}

function countPhoneDigitsBeforePosition(value, position) {
  return getPhoneDigits(value.slice(0, Math.max(0, position))).length;
}

const InputPhone = React.forwardRef(function InputPhone(props, ref) {
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
  const [uncontrolledValue, setUncontrolledValue] = useState(formatPhoneNumber(defaultValue || ''));
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const resolvedValue = isControlled ? formatPhoneNumber(value || '') : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validatePhoneValue(resolvedValue) : undefined;
  const resolvedInvalid = Boolean(invalid || validationMessage);
  const phoneDigitsValue = getPhoneDigits(resolvedValue);
  const shouldShowMask = isFocused || resolvedValue.length > 0;
  const controlValue = shouldShowMask && phoneDigitsValue.length === 0 ? '(' : resolvedValue;
  const phoneMaskParts = shouldShowMask
    ? getPhoneMaskParts(controlValue)
    : { filledValue: '', placeholderValue: '' };

  useImperativeHandle(ref, function () {
    return inputRef.current;
  });

  function commitValue(nextValue) {
    const sanitizedValue = formatPhoneNumber(nextValue);

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

  function handlePhoneDeleteKey(event) {
    const inputElement = event.currentTarget;
    const selectionStart = inputElement.selectionStart != null
      ? inputElement.selectionStart
      : resolvedValue.length;
    const selectionEnd = inputElement.selectionEnd != null
      ? inputElement.selectionEnd
      : selectionStart;
    const digits = getPhoneDigits(resolvedValue);
    const selectedDigitsStart = countPhoneDigitsBeforePosition(resolvedValue, selectionStart);
    const selectedDigitsEnd = countPhoneDigitsBeforePosition(resolvedValue, selectionEnd);
    let nextDigits = digits;

    if (selectionStart !== selectionEnd && selectedDigitsStart !== selectedDigitsEnd) {
      nextDigits = digits.slice(0, selectedDigitsStart) + digits.slice(selectedDigitsEnd);
    } else if (event.key === 'Backspace' && selectedDigitsStart > 0) {
      nextDigits = digits.slice(0, selectedDigitsStart - 1) + digits.slice(selectedDigitsStart);
    } else if (event.key === 'Delete' && selectedDigitsStart < digits.length) {
      nextDigits = digits.slice(0, selectedDigitsStart) + digits.slice(selectedDigitsStart + 1);
    }

    event.preventDefault();
    commitValue(nextDigits);
  }

  function handleKeyDown(event) {
    if (
      !rest.disabled &&
      !rest.readOnly &&
      (event.key === 'Backspace' || event.key === 'Delete')
    ) {
      handlePhoneDeleteKey(event);
      if (onKeyDown) {
        onKeyDown(event);
      }
      return;
    }

    if (
      !rest.disabled &&
      !rest.readOnly &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      event.key.length === 1 &&
      !/^\d$/.test(event.key)
    ) {
      event.preventDefault();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  return (
    <InputText
      {...rest}
      autoCapitalize="off"
      autoCorrect="off"
      className={classNames('rshb-legacy-input-phone', className)}
      defaultValue={undefined}
      helperText={validationMessage || helperText}
      hideControlValue={shouldShowMask}
      inputMode="numeric"
      invalid={resolvedInvalid}
      label={label || 'Номер телефона'}
      maskOverlay={shouldShowMask ? (
        <>
          <span className="rshb-legacy-input-phone__mask-filled">{phoneMaskParts.filledValue}</span>
          <span className="rshb-legacy-input-phone__mask-placeholder">{phoneMaskParts.placeholderValue}</span>
        </>
      ) : undefined}
      maxLength={PHONE_MASK.length}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onValueChange={commitValue}
      pattern="[0-9]*"
      prefix={shouldShowMask ? '+7' : undefined}
      ref={inputRef}
      spellCheck={false}
      value={controlValue}
    />
  );
});

InputPhone.displayName = 'InputPhone';
InputPhone.propTypes = businessInputPropTypes;

export default InputPhone;
