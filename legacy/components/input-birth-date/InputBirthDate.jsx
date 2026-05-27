import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/index.js';
import Calendar from '../calendar/index.js';
import InputText from '../input-text/index.js';
import './styles.css';
import calendarIcon from '../../../icons/calendar.svg';

const DATE_MASK = 'дд.мм.гггг';
const DATE_MAX_DIGITS = 8;
const BIRTH_DATE_MIN_AGE_YEARS = 18;
const BIRTH_DATE_MAX_AGE_YEARS = 100;
const REQUIRED_ERROR = 'Обязательно для заполнения.';
const BIRTH_DATE_INCOMPLETE_ERROR = 'Некорректная дата рождения';
const BIRTH_DATE_RANGE_ERROR =
  'Возраст должен быть от ' + BIRTH_DATE_MIN_AGE_YEARS + ' до ' + BIRTH_DATE_MAX_AGE_YEARS + ' лет.';

function normalizeDate(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function shiftDateByYears(value, years) {
  const normalizedValue = normalizeDate(value);
  const nextYear = normalizedValue.getFullYear() + years;
  const nextMonth = normalizedValue.getMonth();
  const nextDay = Math.min(normalizedValue.getDate(), getDaysInMonth(nextYear, nextMonth));

  return new Date(nextYear, nextMonth, nextDay);
}

function getBirthDateRange(today) {
  return {
    maxDate: shiftDateByYears(today, -BIRTH_DATE_MIN_AGE_YEARS),
    minDate: shiftDateByYears(today, -BIRTH_DATE_MAX_AGE_YEARS)
  };
}

function padDateSegment(value) {
  return String(value).padStart(2, '0');
}

function getDigitsOnly(value, maxLength) {
  return String(value != null ? value : '').replace(/\D/g, '').slice(0, maxLength);
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
    normalizedValue.getFullYear()
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

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year) || month < 1 || month > 12 || day < 1) {
    return null;
  }

  const parsedDate = new Date(year, month - 1, day);

  if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 || parsedDate.getDate() !== day) {
    return null;
  }

  return normalizeDate(parsedDate);
}

function isDateWithinRange(value, minDate, maxDate) {
  const normalizedValue = normalizeDate(value);

  return normalizedValue >= minDate && normalizedValue <= maxDate;
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

function sanitizeBirthDateDigits(value, minDate, maxDate) {
  const rawDigits = getDigitsOnly(value, DATE_MAX_DIGITS);
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  let nextDigits = '';

  for (let index = 0; index < rawDigits.length; index += 1) {
    const digit = rawDigits.charAt(index);
    const candidateDigits = nextDigits + digit;
    const dayPrefix = candidateDigits.slice(0, Math.min(2, candidateDigits.length));
    const monthPrefix =
      candidateDigits.length > 2
        ? candidateDigits.slice(2, Math.min(4, candidateDigits.length))
        : '';
    const yearPrefix = candidateDigits.length > 4 ? candidateDigits.slice(4) : '';

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

function sanitizeBirthDateValue(value) {
  const birthDateRange = getBirthDateRange(normalizeDate(new Date()));

  return formatDateFromDigits(sanitizeBirthDateDigits(value, birthDateRange.minDate, birthDateRange.maxDate));
}

function buildBirthDateMaskParts(value) {
  const formattedValue = formatDateFromDigits(value);

  return {
    filledValue: formattedValue,
    placeholderValue: DATE_MASK.slice(formattedValue.length)
  };
}

function validateBirthDateValue(value) {
  const digits = getDigitsOnly(value, DATE_MAX_DIGITS);

  if (digits.length === 0) {
    return REQUIRED_ERROR;
  }

  const parsedDate = parseDateDigits(digits);

  if (!parsedDate) {
    return BIRTH_DATE_INCOMPLETE_ERROR;
  }

  const birthDateRange = getBirthDateRange(normalizeDate(new Date()));

  return isDateWithinRange(parsedDate, birthDateRange.minDate, birthDateRange.maxDate)
    ? undefined
    : BIRTH_DATE_RANGE_ERROR;
}

function InputBirthDateIcon(props) {
  const src = props.src;

  return (
    <span
      aria-hidden="true"
      className="rshb-legacy-input-birth-date__icon"
      style={{ '--rshb-legacy-input-birth-date-icon': 'url("' + src + '")' }}
    />
  );
}

InputBirthDateIcon.propTypes = {
  src: PropTypes.string.isRequired
};

const InputBirthDate = React.forwardRef(function InputBirthDate(props, ref) {
  const {
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

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    sanitizeBirthDateValue(defaultValue != null ? defaultValue : '')
  );
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const resolvedValue = isControlled
    ? sanitizeBirthDateValue(value != null ? value : '')
    : uncontrolledValue;
  const validationMessage = hasBeenValidated ? validateBirthDateValue(resolvedValue) : undefined;
  const resolvedInvalid = Boolean(invalid || validationMessage !== undefined);
  const resolvedReadOnly = Boolean(readOnly);
  const birthDateRange = getBirthDateRange(normalizeDate(new Date()));
  const selectedBirthDate = parseDateDigits(resolvedValue);
  const birthDateMaskParts = buildBirthDateMaskParts(resolvedValue);
  const shouldShowMask = isFocused || resolvedValue.length > 0;
  const isInteractive = rest.previewState == null;

  useImperativeHandle(ref, function () {
    return inputRef.current;
  });

  useEffect(function bindCalendarDismiss() {
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
  }, [isCalendarOpen]);

  function commitValue(nextValue) {
    const sanitizedValue = sanitizeBirthDateValue(nextValue);

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
      inputRef.current.focus();
    }

    setIsCalendarOpen(function toggleCalendar(currentValue) {
      return !currentValue;
    });
  }

  function handleCalendarChange(nextDate) {
    commitValue(formatDateValue(nextDate));
    setHasBeenValidated(true);
    setIsCalendarOpen(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const calendarToggle = (
    <Button
      aria-expanded={isCalendarOpen}
      aria-haspopup="dialog"
      aria-label="Открыть календарь"
      buttonType={Button.buttonTypes.flatSecondary}
      className="rshb-legacy-input-birth-date__calendar-toggle"
      dataId={rest.dataId ? rest.dataId + '-calendar-button' : undefined}
      disabled={disabled || resolvedReadOnly || !isInteractive}
      iconOnly
      leadingIcon={<InputBirthDateIcon src={calendarIcon} />}
      onClick={handleCalendarButtonClick}
      onMouseDown={keepInputFocusOnMouseDown}
      selected={isCalendarOpen}
      size="s"
      type="button"
    />
  );

  return (
    <div
      className={classNames('rshb-legacy-input-birth-date', className)}
      data-calendar-open={isCalendarOpen ? 'true' : 'false'}
      ref={rootRef}
      style={width !== undefined ? Object.assign({}, style, { width: width }) : style}
    >
      <InputText
        {...rest}
        className="rshb-legacy-input-birth-date__input"
        defaultValue={undefined}
        disabled={disabled}
        endAdornment={
          <>
            {calendarToggle}
            {endAdornment}
          </>
        }
        helperText={validationMessage !== undefined ? validationMessage : helperText}
        hideControlValue
        inputMode="numeric"
        invalid={resolvedInvalid}
        label={label || 'Дата рождения'}
        maskOverlay={shouldShowMask ? (
          <>
            <span className="rshb-legacy-input-birth-date__mask-filled">
              {birthDateMaskParts.filledValue}
            </span>
            <span className="rshb-legacy-input-birth-date__mask-placeholder">
              {birthDateMaskParts.placeholderValue}
            </span>
          </>
        ) : undefined}
        maxLength={DATE_MASK.length}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onValueChange={commitValue}
        pattern="[0-9.]*"
        readOnly={resolvedReadOnly}
        ref={inputRef}
        value={resolvedValue}
        width="100%"
      />
      {isCalendarOpen ? (
        <div className="rshb-legacy-input-birth-date__calendar" onMouseDown={keepInputFocusOnMouseDown}>
          <Calendar
            dataId={rest.dataId ? rest.dataId + '-calendar' : undefined}
            maxDate={birthDateRange.maxDate}
            minDate={birthDateRange.minDate}
            onChange={handleCalendarChange}
            value={selectedBirthDate || birthDateRange.maxDate}
          />
        </div>
      ) : null}
    </div>
  );
});

InputBirthDate.displayName = 'InputBirthDate';

InputBirthDate.propTypes = {
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

export default InputBirthDate;
