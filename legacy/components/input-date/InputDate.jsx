import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/index.js';
import Calendar from '../calendar/index.js';
import InputText from '../input-text/index.js';
import './styles.css';
import calendarIcon from '../../icons/calendar.js';

const DATE_MASK = 'дд.мм.гггг';
const DATE_MAX_DIGITS = 8;
const REQUIRED_ERROR = 'Обязательно для заполнения.';

function normalizeDate(value) {
  const normalized = new Date(0);
  normalized.setFullYear(
    value.getFullYear(),
    value.getMonth(),
    value.getDate()
  );
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function padDateSegment(value) {
  return String(value).padStart(2, '0');
}

function getDigitsOnly(value, maxLength) {
  return String(value != null ? value : '')
    .replace(/\D/g, '')
    .slice(0, maxLength);
}

function formatDateFromDigits(value) {
  const digits = getDigitsOnly(value, DATE_MAX_DIGITS);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return digits.slice(0, 2) + '.' + digits.slice(2);
  }

  return digits.slice(0, 2) + '.' + digits.slice(2, 4) + '.' + digits.slice(4);
}

function formatDateValue(value) {
  const normalizedValue = normalizeDate(value);

  return (
    padDateSegment(normalizedValue.getDate()) +
    '.' +
    padDateSegment(normalizedValue.getMonth() + 1) +
    '.' +
    String(normalizedValue.getFullYear()).padStart(4, '0')
  );
}

function parseDateDigits(value) {
  const digits = getDigitsOnly(value, DATE_MAX_DIGITS);

  if (digits.length !== DATE_MAX_DIGITS) {
    return null;
  }

  const day = Number.parseInt(digits.slice(0, 2), 10);
  const month = Number.parseInt(digits.slice(2, 4), 10);
  const year = Number.parseInt(digits.slice(4, 8), 10);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    month < 1 ||
    month > 12 ||
    day < 1
  ) {
    return null;
  }

  if (year < 1) return null;
  const parsedDate = new Date(0);
  parsedDate.setFullYear(year, month - 1, day);
  parsedDate.setHours(0, 0, 0, 0);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return normalizeDate(parsedDate);
}

function isDateWithinRange(value, minDate, maxDate) {
  const normalizedValue = normalizeDate(value);

  return (
    (!minDate || normalizedValue >= minDate) &&
    (!maxDate || normalizedValue <= maxDate)
  );
}

function isAllowedDayPrefix(prefix) {
  if (prefix.length === 0) {
    return true;
  }

  if (prefix.length === 1) {
    return ['0', '1', '2', '3'].indexOf(prefix) !== -1;
  }

  const day = Number.parseInt(prefix, 10);

  return day >= 1 && day <= 31;
}

function isAllowedMonthPrefix(prefix) {
  if (prefix.length === 0) {
    return true;
  }

  if (prefix.length === 1) {
    return ['0', '1'].indexOf(prefix) !== -1;
  }

  const month = Number.parseInt(prefix, 10);

  return month >= 1 && month <= 12;
}

function canYearPrefixBeCompleted(prefix, minYear, maxYear) {
  if (prefix.length === 0) {
    return true;
  }

  const rangeStart = Number.parseInt(prefix.padEnd(4, '0'), 10);
  const rangeEnd = Number.parseInt(prefix.padEnd(4, '9'), 10);

  return rangeEnd >= minYear && rangeStart <= maxYear;
}

function sanitizeDateDigits(value, minDate, maxDate) {
  const rawDigits = getDigitsOnly(value, DATE_MAX_DIGITS);
  const minYear = minDate ? minDate.getFullYear() : 1;
  const maxYear = maxDate ? maxDate.getFullYear() : 9999;
  let nextDigits = '';

  for (let index = 0; index < rawDigits.length; index += 1) {
    const digit = rawDigits.charAt(index);
    const candidateDigits = nextDigits + digit;
    const dayPrefix = candidateDigits.slice(
      0,
      Math.min(2, candidateDigits.length)
    );
    const monthPrefix =
      candidateDigits.length > 2
        ? candidateDigits.slice(2, Math.min(4, candidateDigits.length))
        : '';
    const yearPrefix =
      candidateDigits.length > 4 ? candidateDigits.slice(4) : '';

    if (!isAllowedDayPrefix(dayPrefix)) {
      break;
    }

    if (!isAllowedMonthPrefix(monthPrefix)) {
      break;
    }

    if (!canYearPrefixBeCompleted(yearPrefix, minYear, maxYear)) {
      break;
    }

    if (candidateDigits.length === DATE_MAX_DIGITS) {
      const parsedDate = parseDateDigits(candidateDigits);

      if (!parsedDate || !isDateWithinRange(parsedDate, minDate, maxDate)) {
        break;
      }
    }

    nextDigits = candidateDigits;
  }

  return nextDigits;
}

function sanitizeDateValue(value, minDate, maxDate) {
  const dateRange = { minDate, maxDate };

  return formatDateFromDigits(
    sanitizeDateDigits(value, dateRange.minDate, dateRange.maxDate)
  );
}

function buildDateMaskParts(value) {
  const formattedValue = formatDateFromDigits(value);

  return {
    filledValue: formattedValue,
    placeholderValue: DATE_MASK.slice(formattedValue.length)
  };
}

function validateDateValue(
  value,
  minDate,
  maxDate,
  incompleteError,
  rangeError
) {
  const digits = getDigitsOnly(value, DATE_MAX_DIGITS);

  if (digits.length === 0) {
    return REQUIRED_ERROR;
  }

  const parsedDate = parseDateDigits(digits);

  if (!parsedDate) {
    return incompleteError;
  }

  const dateRange = { minDate, maxDate };

  return isDateWithinRange(parsedDate, dateRange.minDate, dateRange.maxDate)
    ? undefined
    : rangeError;
}

const isMobileDevice =
  typeof window !== 'undefined' &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function convertRuDateToIso(value) {
  if (!value) {
    return '';
  }
  const parts = String(value).split('.');
  if (
    parts.length === 3 &&
    parts[0].length === 2 &&
    parts[1].length === 2 &&
    parts[2].length === 4
  ) {
    return parts[2] + '-' + parts[1] + '-' + parts[0];
  }
  return '';
}

function convertIsoDateToRu(value) {
  if (!value) {
    return '';
  }
  const parts = String(value).split('-');
  if (
    parts.length === 3 &&
    parts[0].length === 4 &&
    parts[1].length === 2 &&
    parts[2].length === 2
  ) {
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }
  return value;
}

function InputDateIcon(props) {
  const src = props.src;

  return (
    <span
      aria-hidden="true"
      className="rshb-legacy-input-date__icon"
      style={{ '--rshb-legacy-input-date-icon': 'url("' + src + '")' }}
    />
  );
}

InputDateIcon.propTypes = {
  src: PropTypes.string.isRequired
};

const InputDate = React.forwardRef(function InputDate(props, ref) {
  const {
    calendarOpenLabel,
    minDate,
    maxDate,
    incompleteError = 'Некорректная дата',
    rangeError = 'Дата вне допустимого диапазона',
    changeOnFocus,
    className,
    defaultValue,
    disabled,
    endAdornment,
    helperText,
    invalid,
    label,
    onBlur,
    onFocus,
    onFocusChange,
    onKeyDown,
    onValueChange,
    readOnly,
    style,
    value,
    width,
    ...rest
  } = props;

  const dateRange = {
    minDate: minDate ? normalizeDate(minDate) : undefined,
    maxDate: maxDate ? normalizeDate(maxDate) : undefined
  };
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    sanitizeDateValue(
      defaultValue != null ? defaultValue : '',
      dateRange.minDate,
      dateRange.maxDate
    )
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const resolvedValue = isControlled
    ? sanitizeDateValue(
        value != null ? value : '',
        dateRange.minDate,
        dateRange.maxDate
      )
    : uncontrolledValue;
  const validationMessage = hasBeenValidated
    ? validateDateValue(
        resolvedValue,
        dateRange.minDate,
        dateRange.maxDate,
        incompleteError,
        rangeError
      )
    : undefined;
  const resolvedInvalid = Boolean(invalid || validationMessage !== undefined);
  const resolvedReadOnly = Boolean(readOnly);
  const selectedDate = parseDateDigits(resolvedValue);
  const dateMaskParts = buildDateMaskParts(resolvedValue);
  const shouldShowMask = isFocused || resolvedValue.length > 0;
  const isInteractive = true;
  const resolvedCalendarOpenLabel =
    calendarOpenLabel !== undefined ? calendarOpenLabel : 'Открыть календарь';

  useImperativeHandle(ref, function () {
    return inputRef.current;
  });

  useEffect(
    function bindCalendarDismiss() {
      if (!isCalendarOpen) {
        return undefined;
      }

      function handlePointerDown(event) {
        if (rootRef.current && !rootRef.current.contains(event.target)) {
          setIsCalendarOpen(false);
        }
      }

      function handleEscape(event) {
        if (event.key === 'Escape') {
          setIsCalendarOpen(false);
        }
      }

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleEscape);

      return function cleanupCalendarDismiss() {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleEscape);
      };
    },
    [isCalendarOpen]
  );

  function commitValue(nextValue) {
    const sanitizedValue = sanitizeDateValue(
      nextValue,
      dateRange.minDate,
      dateRange.maxDate
    );

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
      !resolvedReadOnly &&
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

  function keepInputFocusOnMouseDown(event) {
    event.preventDefault();
  }

  function handleCalendarButtonClick() {
    if (disabled || resolvedReadOnly || !isInteractive) {
      return;
    }

    if (inputRef.current) {
      const inputEl = inputRef.current.inputElement || inputRef.current;
      inputEl.focus();
      if (isMobileDevice && typeof inputEl.showPicker === 'function') {
        try {
          inputEl.showPicker();
        } catch (e) {
          // ignore
        }
      }
    }

    if (!isMobileDevice) {
      setIsCalendarOpen(function toggleCalendar(currentValue) {
        return !currentValue;
      });
    }
  }

  function handleMobileValueChange(nextValue) {
    commitValue(convertIsoDateToRu(nextValue));
  }

  function handleCalendarChange(nextDate) {
    commitValue(formatDateValue(nextDate));
    setHasBeenValidated(true);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const calendarToggle = (
    <Button
      aria-expanded={isCalendarOpen}
      aria-haspopup="dialog"
      aria-label={resolvedCalendarOpenLabel}
      buttonType={Button.buttonTypes.flatSecondary}
      className="rshb-legacy-input-date__calendar-toggle"
      dataId={rest.dataId ? rest.dataId + '-calendar-button' : undefined}
      disabled={disabled || resolvedReadOnly || !isInteractive}
      iconOnly
      leadingIcon={<InputDateIcon src={calendarIcon} />}
      onClick={handleCalendarButtonClick}
      onMouseDown={keepInputFocusOnMouseDown}
      selected={isCalendarOpen}
      size="s"
      type="button"
    />
  );

  return (
    <div
      className={classNames('rshb-legacy-input-date', className)}
      data-calendar-open={isCalendarOpen ? 'true' : 'false'}
      ref={rootRef}
      style={
        width !== undefined ? Object.assign({}, style, { width: width }) : style
      }
    >
      <InputText
        {...rest}
        className="rshb-legacy-input-date__input"
        defaultValue={undefined}
        disabled={disabled}
        endAdornment={
          <>
            {calendarToggle}
            {endAdornment}
          </>
        }
        helperText={
          validationMessage !== undefined ? validationMessage : helperText
        }
        hideControlValue={!isMobileDevice}
        inputMode={isMobileDevice ? undefined : 'numeric'}
        invalid={resolvedInvalid}
        label={label || 'Дата'}
        maskOverlay={
          shouldShowMask && !isMobileDevice ? (
            <>
              <span className="rshb-legacy-input-date__mask-filled">
                {dateMaskParts.filledValue}
              </span>
              <span className="rshb-legacy-input-date__mask-placeholder">
                {dateMaskParts.placeholderValue}
              </span>
            </>
          ) : undefined
        }
        min={
          isMobileDevice && dateRange.minDate
            ? convertRuDateToIso(formatDateValue(dateRange.minDate))
            : undefined
        }
        max={
          isMobileDevice && dateRange.maxDate
            ? convertRuDateToIso(formatDateValue(dateRange.maxDate))
            : undefined
        }
        maxLength={isMobileDevice ? undefined : DATE_MASK.length}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onValueChange={isMobileDevice ? handleMobileValueChange : commitValue}
        pattern={isMobileDevice ? undefined : '[0-9.]*'}
        readOnly={resolvedReadOnly}
        ref={inputRef}
        type={isMobileDevice ? 'date' : 'text'}
        value={
          isMobileDevice ? convertRuDateToIso(resolvedValue) : resolvedValue
        }
        width="100%"
      />
      {isCalendarOpen && !isMobileDevice ? (
        <div
          className="rshb-legacy-input-date__calendar"
          onMouseDown={keepInputFocusOnMouseDown}
        >
          <Calendar
            dataId={rest.dataId ? rest.dataId + '-calendar' : undefined}
            maxDate={dateRange.maxDate}
            minDate={dateRange.minDate}
            onChange={handleCalendarChange}
            value={selectedDate || dateRange.maxDate || new Date()}
          />
        </div>
      ) : null}
    </div>
  );
});

InputDate.displayName = 'InputDate';

InputDate.propTypes = {
  calendarOpenLabel: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  incompleteError: PropTypes.string,
  rangeError: PropTypes.string,
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
  startIcon: PropTypes.node,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default InputDate;
