import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/index.js';
import Calendar from '../calendar/index.js';
import Switch from '../switch/index.js';
import './styles.css';

let idCounter = 0;

const INPUT_PREVIEW_STATES = [
  'default',
  'hover',
  'focused',
  'typing',
  'entered',
  'entered-hover',
  'error',
  'error-hover',
  'error-entered',
  'error-entered-hover',
  'disabled',
  'disabled-entered',
  'keyboard-focused'
];

const INPUT_MASKS = [
  'text',
  'phone',
  'surname',
  'name',
  'code',
  'password',
  'login',
  'inn',
  'email',
  'captcha',
  'birthDate'
];

const INPUT_VARIANTS = {
  standard: 'standard',
  switch: 'switch'
};

const INPUT_VARIANT_VALUES = [INPUT_VARIANTS.standard, INPUT_VARIANTS.switch];

const PHONE_MASK = '(000) 000-00-00';
const PHONE_MAX_DIGITS = 10;
const PHONE_ALLOWED_FIRST_DIGIT = '9';
const PHONE_COUNTRY_PREFIX_DIGITS = ['7', '8'];
const CODE_MASK = '0000';
const CODE_MAX_DIGITS = 4;
const INN_MAX_DIGITS = 12;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_LOCAL_MAX_LENGTH = 64;
const DATE_MASK = 'дд.мм.гггг';
const DATE_MAX_DIGITS = 8;
const BIRTH_DATE_MIN_AGE_YEARS = 18;
const BIRTH_DATE_MAX_AGE_YEARS = 100;

const REQUIRED_ERROR = 'Обязательно для заполнения';
const PHONE_LENGTH_ERROR = 'Номер телефона должен содержать 11 цифр';
const PHONE_REPEATING_ERROR = 'Некорректный номер телефона';
const BRACKETS_ERROR = 'Скобки должны быть парными.';
const INN_LENGTH_ERROR = 'ИНН должен содержать 10 или 12 цифр.';
const EMAIL_AT_SIGN_ERROR = 'Адрес электронной почты должен содержать знак “@”';
const EMAIL_DOMAIN_ERROR =
  'Адрес электронной почты должен содержать доменную часть (например, example.ru)';
const EMAIL_DOMAIN_DOT_ERROR =
  'Адрес электронной почты должен содержать “.” (например, example.ru)';
const BIRTH_DATE_RANGE_ERROR =
  'Возраст должен быть от ' + BIRTH_DATE_MIN_AGE_YEARS + ' до ' + BIRTH_DATE_MAX_AGE_YEARS + ' лет.';

const NAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,()]$/;
const SURNAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,() ]$/;
const CYRILLIC_LETTER_PATTERN = /^[А-Яа-яЁё]$/;
const NAME_SEPARATOR_PATTERN = /^[.\-’,() ]$/;
const TRAILING_FORBIDDEN_NAME_PATTERN = /^[.\-’, ]$/;
const LOGIN_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9._-]$/;
const LOGIN_SEPARATOR_PATTERN = /^[._-]$/;
const EMAIL_ALLOWED_CHARACTER_PATTERN = /^[a-z0-9._+@-]$/;
const EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN = /^[._-]$/;
const PASSWORD_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9()~!@#$%^&*_\-+='|"{}\[\]<>;:,.?\/]$/;

function generateInputId() {
  return 'rshb-legacy-input-text-' + (++idCounter);
}

function normalizeMask(mask) {
  if (mask == null || mask === '' || mask === 'text') {
    return undefined;
  }

  return INPUT_MASKS.indexOf(mask) === -1 ? undefined : mask;
}

function getLastCharacter(value) {
  return value.length > 0 ? value.charAt(value.length - 1) : '';
}

function formatFirstLetter(value) {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase('ru-RU') + value.slice(1);
}

function hasPairedBrackets(value) {
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const character = value.charAt(index);

    if (character === '(') {
      depth += 1;
    }

    if (character === ')') {
      depth -= 1;
    }

    if (depth < 0) {
      return false;
    }
  }

  return depth === 0;
}

function sanitizePersonNameValue(value, options) {
  const allowSpace = options && options.allowSpace;
  const allowedPattern = allowSpace ? SURNAME_ALLOWED_CHARACTER_PATTERN : NAME_ALLOWED_CHARACTER_PATTERN;
  let sanitizedValue = '';

  for (let index = 0; index < value.length; index += 1) {
    const character = value.charAt(index);

    if (!allowedPattern.test(character)) {
      continue;
    }

    const previousCharacter = getLastCharacter(sanitizedValue);

    if (sanitizedValue.length === 0 && !CYRILLIC_LETTER_PATTERN.test(character)) {
      continue;
    }

    if (
      previousCharacter &&
      NAME_SEPARATOR_PATTERN.test(previousCharacter) &&
      NAME_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return formatFirstLetter(sanitizedValue);
}

function normalizePersonNameOnBlur(value, options) {
  let normalizedValue = sanitizePersonNameValue(value, options);

  while (
    normalizedValue.length > 0 &&
    TRAILING_FORBIDDEN_NAME_PATTERN.test(getLastCharacter(normalizedValue))
  ) {
    normalizedValue = normalizedValue.slice(0, -1);
  }

  return normalizedValue;
}

function getPhoneDigits(value) {
  let digits = value.replace(/\D/g, '');

  if (
    digits.length > PHONE_MAX_DIGITS &&
    PHONE_COUNTRY_PREFIX_DIGITS.indexOf(digits.charAt(0)) !== -1
  ) {
    digits = digits.slice(1);
  }

  if (digits.length > 0 && digits.charAt(0) !== PHONE_ALLOWED_FIRST_DIGIT) {
    return '';
  }

  return digits.slice(0, PHONE_MAX_DIGITS);
}

function formatPhoneNumber(value) {
  const digits = getPhoneDigits(value);
  let formatted = '';

  if (digits.length > 0) {
    formatted = '(' + digits.slice(0, 3);
  }

  if (digits.length >= 3) {
    formatted += ') ' + digits.slice(3, 6);
  }

  if (digits.length >= 6) {
    formatted += '-' + digits.slice(6, 8);
  }

  if (digits.length >= 8) {
    formatted += '-' + digits.slice(8, 10);
  }

  return formatted;
}

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

function getDigitsOnly(value, maxLength) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

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

function getDateDigits(value) {
  return getDigitsOnly(value, DATE_MAX_DIGITS);
}

function parseDateDigits(value) {
  const digits = getDateDigits(value);

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
  const rawDigits = getDateDigits(value);
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

function sanitizeLoginValue(value) {
  let sanitizedValue = '';

  for (let index = 0; index < value.length; index += 1) {
    const character = value.charAt(index);

    if (!LOGIN_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    const previousCharacter = getLastCharacter(sanitizedValue);

    if (
      previousCharacter &&
      LOGIN_SEPARATOR_PATTERN.test(previousCharacter) &&
      LOGIN_SEPARATOR_PATTERN.test(character)
    ) {
      continue;
    }

    sanitizedValue += character;
  }

  return sanitizedValue;
}

function sanitizeEmailValue(value) {
  let sanitizedValue = '';
  let hasAtSign = false;
  let localLength = 0;
  const lowerValue = value.toLowerCase();

  for (let index = 0; index < lowerValue.length; index += 1) {
    const character = lowerValue.charAt(index);

    if (sanitizedValue.length >= EMAIL_MAX_LENGTH) {
      break;
    }

    if (!EMAIL_ALLOWED_CHARACTER_PATTERN.test(character)) {
      continue;
    }

    if (character === '@') {
      if (
        hasAtSign ||
        localLength === 0 ||
        EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN.test(getLastCharacter(sanitizedValue))
      ) {
        continue;
      }

      hasAtSign = true;
      sanitizedValue += character;
      continue;
    }

    if (character === '.' && getLastCharacter(sanitizedValue) === '.') {
      continue;
    }

    if (!hasAtSign) {
      if (localLength >= EMAIL_LOCAL_MAX_LENGTH) {
        continue;
      }

      if (localLength === 0 && EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN.test(character)) {
        continue;
      }

      localLength += 1;
    }

    sanitizedValue += character;
  }

  return sanitizedValue;
}

function sanitizePasswordValue(value) {
  let sanitizedValue = '';

  for (let index = 0; index < value.length; index += 1) {
    const character = value.charAt(index);

    if (PASSWORD_ALLOWED_CHARACTER_PATTERN.test(character)) {
      sanitizedValue += character;
    }
  }

  return sanitizedValue;
}

function sanitizeCaptchaValue(value) {
  return value.replace(/\s/g, '');
}

function sanitizeValueForMask(mask, value) {
  const stringValue = String(value != null ? value : '');

  if (mask === 'phone') {
    return formatPhoneNumber(stringValue);
  }

  if (mask === 'surname') {
    return sanitizePersonNameValue(stringValue, { allowSpace: true });
  }

  if (mask === 'name') {
    return sanitizePersonNameValue(stringValue, { allowSpace: false });
  }

  if (mask === 'code') {
    return getDigitsOnly(stringValue, CODE_MAX_DIGITS);
  }

  if (mask === 'password') {
    return sanitizePasswordValue(stringValue);
  }

  if (mask === 'login') {
    return sanitizeLoginValue(stringValue);
  }

  if (mask === 'inn') {
    return getDigitsOnly(stringValue, INN_MAX_DIGITS);
  }

  if (mask === 'email') {
    return sanitizeEmailValue(stringValue);
  }

  if (mask === 'captcha') {
    return sanitizeCaptchaValue(stringValue);
  }

  if (mask === 'birthDate') {
    return sanitizeBirthDateValue(stringValue);
  }

  return stringValue;
}

function normalizeValueForMaskOnBlur(mask, value) {
  if (mask === 'surname') {
    return normalizePersonNameOnBlur(value, { allowSpace: true });
  }

  if (mask === 'name') {
    return normalizePersonNameOnBlur(value, { allowSpace: false });
  }

  return sanitizeValueForMask(mask, value);
}

function validateValueForMask(mask, value) {
  if (!mask) {
    return undefined;
  }

  if (mask === 'phone') {
    const digits = getPhoneDigits(value);

    if (digits.length === 0) {
      return REQUIRED_ERROR;
    }

    if (digits.length < PHONE_MAX_DIGITS) {
      return PHONE_LENGTH_ERROR;
    }

    if (/^(\d)\1+$/.test(digits)) {
      return PHONE_REPEATING_ERROR;
    }

    return undefined;
  }

  if (mask === 'surname' || mask === 'name') {
    if (value.length === 0) {
      return REQUIRED_ERROR;
    }

    return hasPairedBrackets(value) ? undefined : BRACKETS_ERROR;
  }

  if (mask === 'code' || mask === 'password' || mask === 'login' || mask === 'captcha') {
    return value.length === 0 ? REQUIRED_ERROR : undefined;
  }

  if (mask === 'inn') {
    if (value.length === 0) {
      return REQUIRED_ERROR;
    }

    return value.length === 10 || value.length === 12 ? undefined : INN_LENGTH_ERROR;
  }

  if (mask === 'email') {
    if (value.length === 0) {
      return REQUIRED_ERROR;
    }

    if (value.indexOf('@') === -1) {
      return EMAIL_AT_SIGN_ERROR;
    }

    const domain = value.split('@')[1] || '';

    if (domain.length < 3) {
      return EMAIL_DOMAIN_ERROR;
    }

    if (domain.indexOf('.') === -1 || domain.charAt(0) === '.' || getLastCharacter(domain) === '.') {
      return EMAIL_DOMAIN_DOT_ERROR;
    }
  }

  if (mask === 'birthDate') {
    const digits = getDateDigits(value);

    if (digits.length === 0) {
      return REQUIRED_ERROR;
    }

    const parsedDate = parseDateDigits(digits);

    if (!parsedDate) {
      return '';
    }

    const birthDateRange = getBirthDateRange(normalizeDate(new Date()));

    return isDateWithinRange(parsedDate, birthDateRange.minDate, birthDateRange.maxDate)
      ? undefined
      : BIRTH_DATE_RANGE_ERROR;
  }

  return undefined;
}

function getDefaultLabelForMask(mask) {
  if (mask === 'phone') {
    return 'Номер телефона';
  }

  if (mask === 'surname') {
    return 'Фамилия';
  }

  if (mask === 'name') {
    return 'Имя';
  }

  if (mask === 'code') {
    return 'Проверочный код';
  }

  if (mask === 'password') {
    return 'Пароль';
  }

  if (mask === 'login') {
    return 'Логин';
  }

  if (mask === 'inn') {
    return 'ИНН';
  }

  if (mask === 'email') {
    return 'Электронная почта';
  }

  if (mask === 'captcha') {
    return 'Код с картинки';
  }

  if (mask === 'birthDate') {
    return 'Дата рождения';
  }

  return 'Название';
}

function getDefaultInputModeForMask(mask) {
  if (mask === 'phone' || mask === 'code' || mask === 'inn' || mask === 'birthDate') {
    return 'numeric';
  }

  if (mask === 'email' || mask === 'login') {
    return 'email';
  }

  return undefined;
}

function getMaxLengthForMask(mask) {
  if (mask === 'phone') {
    return PHONE_MASK.length;
  }

  if (mask === 'code') {
    return CODE_MAX_DIGITS;
  }

  if (mask === 'inn') {
    return INN_MAX_DIGITS;
  }

  if (mask === 'email') {
    return EMAIL_MAX_LENGTH;
  }

  if (mask === 'birthDate') {
    return DATE_MASK.length;
  }

  return undefined;
}

function getPatternForMask(mask) {
  if (mask === 'phone' || mask === 'code' || mask === 'inn') {
    return '[0-9]*';
  }

  if (mask === 'birthDate') {
    return '[0-9.]*';
  }

  return undefined;
}

function getAutoCapitalizeForMask(mask) {
  if (
    mask === 'phone' ||
    mask === 'code' ||
    mask === 'password' ||
    mask === 'login' ||
    mask === 'email' ||
    mask === 'birthDate'
  ) {
    return 'off';
  }

  return undefined;
}

function getAutoCorrectForMask(mask) {
  if (
    mask === 'phone' ||
    mask === 'code' ||
    mask === 'password' ||
    mask === 'login' ||
    mask === 'email' ||
    mask === 'birthDate'
  ) {
    return 'off';
  }

  return undefined;
}

function getSpellCheckForMask(mask) {
  if (
    mask === 'phone' ||
    mask === 'code' ||
    mask === 'password' ||
    mask === 'login' ||
    mask === 'email' ||
    mask === 'birthDate'
  ) {
    return false;
  }

  return undefined;
}

function normalizeRenderableNode(node) {
  if (
    node == null ||
    typeof node === 'string' ||
    typeof node === 'number' ||
    React.isValidElement(node)
  ) {
    return node;
  }

  return undefined;
}

function isTextKeyAllowedForMask(mask, key) {
  if (!mask || key.length !== 1) {
    return true;
  }

  if (mask === 'phone' || mask === 'code' || mask === 'inn' || mask === 'birthDate') {
    return /^\d$/.test(key);
  }

  if (mask === 'surname') {
    return SURNAME_ALLOWED_CHARACTER_PATTERN.test(key);
  }

  if (mask === 'name') {
    return NAME_ALLOWED_CHARACTER_PATTERN.test(key);
  }

  if (mask === 'password') {
    return PASSWORD_ALLOWED_CHARACTER_PATTERN.test(key);
  }

  if (mask === 'login') {
    return LOGIN_ALLOWED_CHARACTER_PATTERN.test(key);
  }

  if (mask === 'email') {
    return EMAIL_ALLOWED_CHARACTER_PATTERN.test(key.toLowerCase());
  }

  if (mask === 'captcha') {
    return !/\s/.test(key);
  }

  return true;
}

function resolveInteractiveState(_ref) {
  const disabled = _ref.disabled;
  const hasKeyboardFocus = _ref.hasKeyboardFocus;
  const invalid = _ref.invalid;
  const isFocused = _ref.isFocused;
  const value = _ref.value;

  const hasValue = value.length > 0;

  if (disabled) {
    return hasValue ? 'disabled-entered' : 'disabled';
  }

  if (isFocused) {
    if (hasKeyboardFocus && !hasValue) {
      return 'keyboard-focused';
    }
    return hasValue ? 'typing' : 'focused';
  }

  if (invalid) {
    return hasValue ? 'error-entered' : 'error';
  }

  return hasValue ? 'entered' : 'default';
}

function XmarkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M3.46967 3.46967C3.76256 3.17678 4.23744 3.17678 4.53033 3.46967L8 6.93934L11.4697 3.46967C11.7626 3.17678 12.2374 3.17678 12.5303 3.46967C12.8232 3.76256 12.8232 4.23744 12.5303 4.53033L9.06066 8L12.5303 11.4697C12.8232 11.7626 12.8232 12.2374 12.5303 12.5303C12.2374 12.8232 11.7626 12.8232 11.4697 12.5303L8 9.06066L4.53033 12.5303C4.23744 12.8232 3.76256 12.8232 3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L6.93934 8L3.46967 4.53033C3.17678 4.23744 3.17678 3.76256 3.46967 3.46967Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M5.25 5.49674C4.83579 5.49674 4.5 5.16095 4.5 4.74674V4.00001C3.67157 4.00001 3 4.67159 3 5.50001V6.50001H13V5.50001C13 4.67159 12.3284 4.00001 11.5 4.00001V4.75003C11.5 5.16425 11.1642 5.50003 10.75 5.50003C10.3358 5.50003 10 5.16425 10 4.75003V4.00001H6V4.74674C6 5.16095 5.66421 5.49674 5.25 5.49674ZM10 2.50001H6V1.74756C6 1.33334 5.66421 0.997559 5.25 0.997559C4.83579 0.997559 4.5 1.33334 4.5 1.74756V2.50001C2.84315 2.50001 1.5 3.84316 1.5 5.50001V11.5C1.5 13.1569 2.84315 14.5 4.5 14.5H11.5C13.1569 14.5 14.5 13.1569 14.5 11.5V5.50001C14.5 3.84316 13.1569 2.50001 11.5 2.50001V1.75001C11.5 1.3358 11.1642 1.00001 10.75 1.00001C10.3358 1.00001 10 1.3358 10 1.75001V2.50001ZM3 8.00001V11.5C3 12.3284 3.67157 13 4.5 13H11.5C12.3284 13 13 12.3284 13 11.5V8.00001H3Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 3C4.9 3 2.32 4.86 1.25 8C2.32 11.14 4.9 13 8 13C11.1 13 13.68 11.14 14.75 8C13.68 4.86 11.1 3 8 3ZM8 11.5C5.65 11.5 3.68 10.2 2.88 8C3.68 5.8 5.65 4.5 8 4.5C10.35 4.5 12.32 5.8 13.12 8C12.32 10.2 10.35 11.5 8 11.5ZM8 5.75C6.76 5.75 5.75 6.76 5.75 8C5.75 9.24 6.76 10.25 8 10.25C9.24 10.25 10.25 9.24 10.25 8C10.25 6.76 9.24 5.75 8 5.75ZM8 8.75C7.59 8.75 7.25 8.41 7.25 8C7.25 7.59 7.59 7.25 8 7.25C8.41 7.25 8.75 7.59 8.75 8C8.75 8.41 8.41 8.75 8 8.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 3C4.9 3 2.32 4.86 1.25 8C2.32 11.14 4.9 13 8 13C11.1 13 13.68 11.14 14.75 8C13.68 4.86 11.1 3 8 3ZM8 11.5C5.65 11.5 3.68 10.2 2.88 8C3.68 5.8 5.65 4.5 8 4.5C10.35 4.5 12.32 5.8 13.12 8C12.32 10.2 10.35 11.5 8 11.5ZM8 5.75C6.76 5.75 5.75 6.76 5.75 8C5.75 9.24 6.76 10.25 8 10.25C9.24 10.25 10.25 9.24 10.25 8C10.25 6.76 9.24 5.75 8 5.75ZM8 8.75C7.59 8.75 7.25 8.41 7.25 8C7.25 7.59 7.59 7.25 8 7.25C8.41 7.25 8.75 7.59 8.75 8C8.75 8.41 8.41 8.75 8 8.75Z"
        fill="currentColor"
      />
      <path
        d="M2.28 1.22C1.99 0.93 1.51 0.93 1.22 1.22C0.93 1.51 0.93 1.99 1.22 2.28L13.72 14.78C14.01 15.07 14.49 15.07 14.78 14.78C15.07 14.49 15.07 14.01 14.78 13.72L2.28 1.22Z"
        fill="currentColor"
      />
    </svg>
  );
}

const InputText = React.forwardRef(function InputText(props, ref) {
  const {
    changeOnFocus,
    className,
    clearButtonDataId,
    clearable,
    controlClassName,
    customInputStyle,
    dataId,
    defaultValue,
    disabled,
    error,
    helperIcon,
    helperText,
    id,
    inputClassName,
    invalid,
    label,
    mask,
    onBlur,
    onChange,
    onFocus,
    onFocusChange,
    onKeyDown,
    onPointerDown,
    onValueChange,
    previewState,
    readOnly,
    showHelperIcon,
    startIcon,
    style,
    switchChecked,
    switchDataId,
    switchLabel,
    switchOnChange,
    switchDefaultChecked,
    onSwitchChange,
    type,
    value,
    variant,
    width,
    ...rest
  } = props;

  const resolvedClearable = clearable != null ? clearable : true;
  const resolvedVariant = INPUT_VARIANT_VALUES.indexOf(variant) === -1
    ? INPUT_VARIANTS.standard
    : variant;
  const resolvedMask = normalizeMask(mask);
  const resolvedLabel = normalizeRenderableNode(label) != null
    ? label
    : getDefaultLabelForMask(resolvedMask);
  const hasSwitch = resolvedVariant === INPUT_VARIANTS.switch;
  const isSwitchControlled = switchChecked !== undefined;
  const [uncontrolledSwitchChecked, setUncontrolledSwitchChecked] = useState(
    Boolean(switchDefaultChecked)
  );
  const resolvedSwitchChecked = hasSwitch
    ? isSwitchControlled
      ? Boolean(switchChecked)
      : uncontrolledSwitchChecked
    : false;
  const resolvedDisabled = Boolean(disabled || resolvedSwitchChecked);
  const resolvedSwitchLabel = normalizeRenderableNode(switchLabel);

  const [inputId] = useState(function () {
    return id || generateInputId();
  });
  const [helperId] = useState(function () {
    return inputId + '-helper';
  });

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    sanitizeValueForMask(resolvedMask, defaultValue != null ? defaultValue : '')
  );
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const keyboardFocusCandidateRef = useRef(false);

  const resolvedValue = isControlled
    ? sanitizeValueForMask(resolvedMask, value != null ? value : '')
    : sanitizeValueForMask(resolvedMask, uncontrolledValue);
  const validationMessage = hasBeenValidated
    ? validateValueForMask(resolvedMask, resolvedValue)
    : undefined;
  const resolvedInvalid = Boolean(invalid || error || validationMessage);
  const resolvedReadOnly =
    readOnly != null
      ? readOnly
      : isControlled && onChange == null && onValueChange == null;
  const isInteractive = previewState == null;

  const visualState = isInteractive
    ? resolveInteractiveState({
        disabled: resolvedDisabled,
        hasKeyboardFocus: hasKeyboardFocus,
        invalid: resolvedInvalid,
        isFocused: isFocused,
        value: resolvedValue
      })
    : previewState;

  const isErrorState =
    visualState === 'error' ||
    visualState === 'error-hover' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover';

  const isEnteredState =
    visualState === 'typing' ||
    visualState === 'entered' ||
    visualState === 'entered-hover' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover' ||
    visualState === 'disabled-entered';
  const isFocusedState =
    visualState === 'focused' ||
    visualState === 'typing' ||
    visualState === 'keyboard-focused';

  const resolvedHelperText = isErrorState ? validationMessage || helperText : undefined;

  const showsClearControl =
    resolvedClearable &&
    !resolvedDisabled &&
    !resolvedReadOnly &&
    (isInteractive ? isFocused && resolvedValue.length > 0 : visualState === 'typing');
  const showsPasswordVisibilityToggle = resolvedMask === 'password' && resolvedValue.length > 0;
  const canTogglePasswordVisibility = !resolvedDisabled && isInteractive;
  const shouldShowPhoneMask = resolvedMask === 'phone' && (isEnteredState || isFocusedState);
  const shouldShowCodeMask = resolvedMask === 'code' && (isEnteredState || isFocusedState);
  const shouldShowBirthDateMask = resolvedMask === 'birthDate' && (isEnteredState || isFocusedState);
  const phoneDigitsValue = resolvedMask === 'phone' ? getPhoneDigits(resolvedValue) : '';
  const resolvedControlValue =
    resolvedMask === 'phone' && shouldShowPhoneMask && phoneDigitsValue.length === 0
      ? '('
      : resolvedValue;
  const phoneMaskParts = shouldShowPhoneMask
    ? getPhoneMaskParts(resolvedControlValue)
    : { filledValue: '', placeholderValue: '' };
  const codeMaskFilledValue = resolvedMask === 'code' ? getDigitsOnly(resolvedValue, CODE_MAX_DIGITS) : '';
  const codeMaskRemainingValue = CODE_MASK.slice(codeMaskFilledValue.length);
  const birthDateMaskParts = shouldShowBirthDateMask
    ? buildBirthDateMaskParts(resolvedValue)
    : { filledValue: '', placeholderValue: '' };
  const selectedBirthDate = resolvedMask === 'birthDate' ? parseDateDigits(resolvedValue) : null;
  const birthDateRange = resolvedMask === 'birthDate'
    ? getBirthDateRange(normalizeDate(new Date()))
    : null;
  const resolvedType =
    resolvedMask === 'password'
      ? isPasswordVisible ? 'text' : 'password'
      : resolvedMask
        ? 'text'
        : type || 'text';
  const resolvedInputMode =
    rest.inputMode != null ? rest.inputMode : getDefaultInputModeForMask(resolvedMask);
  const resolvedMaxLength =
    rest.maxLength != null ? rest.maxLength : getMaxLengthForMask(resolvedMask);
  const resolvedPattern =
    rest.pattern != null ? rest.pattern : getPatternForMask(resolvedMask);
  const resolvedAutoCapitalize =
    rest.autoCapitalize != null ? rest.autoCapitalize : getAutoCapitalizeForMask(resolvedMask);
  const resolvedAutoCorrect =
    rest.autoCorrect != null ? rest.autoCorrect : getAutoCorrectForMask(resolvedMask);
  const resolvedSpellCheck =
    Object.prototype.hasOwnProperty.call(rest, 'spellCheck')
      ? rest.spellCheck
      : getSpellCheckForMask(resolvedMask);
  const describedBy = [rest['aria-describedby'], resolvedHelperText ? helperId : undefined]
    .filter(Boolean)
    .join(' ') || undefined;
  const wrapperStyle = width !== undefined ? Object.assign({}, style, { width: width }) : style;
  const inputDataId = dataId || rest['data-id'];
  const resolvedClearButtonDataId = clearButtonDataId || (dataId ? dataId + '-clear' : undefined);
  const resolvedSwitchDataId = switchDataId || (dataId ? dataId + '-switch' : undefined);
  const resolvedCalendarButtonDataId = dataId ? dataId + '-calendar-button' : undefined;
  const resolvedCalendarDataId = dataId ? dataId + '-calendar' : undefined;

  useEffect(function () {
    if (!isSwitchControlled) {
      setUncontrolledSwitchChecked(Boolean(switchDefaultChecked));
    }
  }, [isSwitchControlled, switchDefaultChecked]);

  useEffect(function () {
    if (!isControlled || value === undefined || !onValueChange) {
      return;
    }

    const rawValue = String(value != null ? value : '');

    if (rawValue !== resolvedValue) {
      onValueChange(resolvedValue);
    }
  }, [isControlled, onValueChange, resolvedMask, resolvedValue, value]);

  useEffect(function () {
    if (
      resolvedMask !== 'phone' ||
      !isFocused ||
      phoneDigitsValue.length > 0 ||
      !inputRef.current ||
      typeof inputRef.current.setSelectionRange !== 'function'
    ) {
      return;
    }

    const frame = typeof window !== 'undefined' && window.requestAnimationFrame
      ? window.requestAnimationFrame
      : function (callback) {
          callback();
          return 0;
        };

    frame(function () {
      if (inputRef.current && inputRef.current.value === '(') {
        inputRef.current.setSelectionRange(1, 1);
      }
    });
  }, [isFocused, phoneDigitsValue.length, resolvedMask]);

  useEffect(function closeCalendarWhenMaskChanges() {
    if (resolvedMask !== 'birthDate') {
      setIsCalendarOpen(false);
    }
  }, [resolvedMask]);

  useEffect(function bindCalendarDismiss() {
    if (resolvedMask !== 'birthDate' || !isCalendarOpen) {
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
  }, [isCalendarOpen, resolvedMask]);

  useImperativeHandle(ref, function () {
    return {
      focus: function () {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      inputElement: inputRef.current
    };
  });

  function commitValue(nextValue, shouldNotifyChangeOnFocus) {
    const sanitizedValue = sanitizeValueForMask(resolvedMask, nextValue);

    if (!isControlled) {
      setUncontrolledValue(sanitizedValue);
    }

    if (onValueChange) {
      onValueChange(sanitizedValue);
    }

    if (shouldNotifyChangeOnFocus && changeOnFocus && isFocused) {
      changeOnFocus(sanitizedValue);
    }
  }

  function updateValue(nextValue) {
    commitValue(nextValue, true);
  }

  function handleChange(event) {
    updateValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  }

  function handleFocus(event) {
    setIsFocused(true);
    setHasKeyboardFocus(
      keyboardFocusCandidateRef.current && event.currentTarget.matches(':focus-visible')
    );
    if (onFocusChange) {
      onFocusChange(true);
    }
    if (onFocus) {
      onFocus(event);
    }
  }

  function handleBlur(event) {
    const normalizedValue = normalizeValueForMaskOnBlur(resolvedMask, resolvedValue);

    if (normalizedValue !== resolvedValue) {
      commitValue(normalizedValue, false);
    }

    setIsFocused(false);
    setHasKeyboardFocus(false);
    setHasBeenValidated(true);
    if (onFocusChange) {
      onFocusChange(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  }

  function handleClear() {
    updateValue('');
    setIsCalendarOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
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
    updateValue(nextDigits);
  }

  function handleTogglePasswordVisibility() {
    if (!canTogglePasswordVisibility) {
      return;
    }

    setIsPasswordVisible(function (currentValue) {
      return !currentValue;
    });
  }

  function handleCalendarButtonClick() {
    if (resolvedDisabled || resolvedReadOnly || !isInteractive) {
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
    updateValue(formatDateValue(nextDate));
    setHasBeenValidated(true);
    setIsCalendarOpen(false);

    if (inputRef.current) {
      inputRef.current.focus();
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
    <div
      className={classNames(
        'rshb-legacy-input-text',
        resolvedMask ? 'rshb-legacy-input-text--' + resolvedMask : null,
        className
      )}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-field-id={dataId}
      data-calendar-open={isCalendarOpen ? 'true' : 'false'}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-has-start-icon={startIcon ? 'true' : 'false'}
      data-mask={resolvedMask || 'text'}
      data-show-code-mask={shouldShowCodeMask ? 'true' : 'false'}
      data-show-date-mask={shouldShowBirthDateMask ? 'true' : 'false'}
      data-show-mask-prefix={shouldShowPhoneMask ? 'true' : 'false'}
      data-state={visualState}
      data-variant={resolvedVariant}
      ref={rootRef}
      style={wrapperStyle}
    >
      <div className="rshb-legacy-input-text__field">
        {startIcon ? (
          <span aria-hidden="true" className="rshb-legacy-input-text__start-icon">
            {startIcon}
          </span>
        ) : null}
        <div className="rshb-legacy-input-text__content">
          <label className="rshb-legacy-input-text__label" htmlFor={inputId}>
            {resolvedLabel}
          </label>
          {shouldShowPhoneMask ? (
            <span aria-hidden="true" className="rshb-legacy-input-text__prefix">
              +7
            </span>
          ) : null}
          <input
            {...rest}
            autoCapitalize={resolvedAutoCapitalize}
            autoCorrect={resolvedAutoCorrect}
            aria-describedby={describedBy}
            aria-invalid={resolvedInvalid || undefined}
            className={classNames(
              'rshb-legacy-input-text__control',
              inputClassName,
              customInputStyle,
              controlClassName
            )}
            data-id={inputDataId}
            disabled={resolvedDisabled}
            id={inputId}
            inputMode={resolvedInputMode}
            maxLength={resolvedMaxLength}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={function (event) {
              keyboardFocusCandidateRef.current = event.key === 'Tab';

              if (
                resolvedMask === 'phone' &&
                isInteractive &&
                !resolvedDisabled &&
                !resolvedReadOnly &&
                (event.key === 'Backspace' || event.key === 'Delete')
              ) {
                handlePhoneDeleteKey(event);
                if (onKeyDown) {
                  onKeyDown(event);
                }
                return;
              }

              if (
                isInteractive &&
                !resolvedDisabled &&
                !resolvedReadOnly &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey &&
                !isTextKeyAllowedForMask(resolvedMask, event.key)
              ) {
                event.preventDefault();
              }

              if (onKeyDown) {
                onKeyDown(event);
              }
            }}
            onPointerDown={function (event) {
              keyboardFocusCandidateRef.current = false;
              if (onPointerDown) {
                onPointerDown(event);
              }
            }}
            pattern={resolvedPattern}
            readOnly={!isInteractive || resolvedReadOnly}
            ref={inputRef}
            spellCheck={resolvedSpellCheck}
            type={resolvedType}
            value={resolvedControlValue}
          />
          {shouldShowPhoneMask ? (
            <span aria-hidden="true" className="rshb-legacy-input-text__mask">
              <span className="rshb-legacy-input-text__mask-filled">{phoneMaskParts.filledValue}</span>
              <span className="rshb-legacy-input-text__mask-placeholder">{phoneMaskParts.placeholderValue}</span>
            </span>
          ) : null}
          {shouldShowCodeMask ? (
            <span aria-hidden="true" className="rshb-legacy-input-text__mask">
              <span className="rshb-legacy-input-text__mask-filled">{codeMaskFilledValue}</span>
              <span className="rshb-legacy-input-text__mask-placeholder">{codeMaskRemainingValue}</span>
            </span>
          ) : null}
          {shouldShowBirthDateMask ? (
            <span aria-hidden="true" className="rshb-legacy-input-text__mask">
              <span className="rshb-legacy-input-text__mask-filled">{birthDateMaskParts.filledValue}</span>
              <span className="rshb-legacy-input-text__mask-placeholder">{birthDateMaskParts.placeholderValue}</span>
            </span>
          ) : null}
        </div>
        {showsClearControl ? (
          <Button
            aria-label="Очистить поле"
            buttonType={Button.buttonTypes.flatSecondary}
            className="rshb-legacy-input-text__clear"
            dataId={resolvedClearButtonDataId}
            iconOnly
            leadingIcon={<XmarkIcon />}
            onClick={handleClear}
            onMouseDown={function (event) {
              event.preventDefault();
            }}
            size="s"
            tabIndex={-1}
            type="button"
          />
        ) : null}
        {showsPasswordVisibilityToggle ? (
          <Button
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={isPasswordVisible}
            buttonType={Button.buttonTypes.flatSecondary}
            className="rshb-legacy-input-text__visibility-toggle"
            disabled={!canTogglePasswordVisibility}
            iconOnly
            leadingIcon={isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
            onClick={handleTogglePasswordVisibility}
            onMouseDown={function (event) {
              event.preventDefault();
            }}
            size="s"
            tabIndex={isInteractive ? 0 : -1}
            type="button"
          />
        ) : null}
        {resolvedMask === 'birthDate' ? (
          <Button
            aria-expanded={isCalendarOpen}
            aria-haspopup="dialog"
            aria-label="Открыть календарь"
            buttonType={Button.buttonTypes.flatSecondary}
            className="rshb-legacy-input-text__calendar-toggle"
            dataId={resolvedCalendarButtonDataId}
            disabled={resolvedDisabled || resolvedReadOnly || !isInteractive}
            iconOnly
            leadingIcon={<CalendarIcon />}
            onClick={handleCalendarButtonClick}
            onMouseDown={function (event) {
              event.preventDefault();
            }}
            selected={isCalendarOpen}
            size="s"
            type="button"
          />
        ) : null}
      </div>
      {resolvedHelperText ? (
        <div className="rshb-legacy-input-text__helper" id={helperId}>
          <span className="rshb-legacy-input-text__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
      {hasSwitch ? (
        <Switch
          checked={resolvedSwitchChecked}
          className="rshb-legacy-input-text__switch"
          dataId={resolvedSwitchDataId}
          disabled={Boolean(disabled)}
          label={resolvedSwitchLabel}
          onChange={handleSwitchChange}
        />
      ) : null}
      {resolvedMask === 'birthDate' && isCalendarOpen && birthDateRange ? (
        <div className="rshb-legacy-input-text__calendar">
          <Calendar
            dataId={resolvedCalendarDataId}
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

InputText.displayName = 'InputText';

InputText.variants = INPUT_VARIANTS;

InputText.previewStates = INPUT_PREVIEW_STATES.reduce(function (states, state) {
  states[state] = state;
  return states;
}, {});

InputText.propTypes = {
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
  mask: PropTypes.oneOf(INPUT_MASKS),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onFocusChange: PropTypes.func,
  onValueChange: PropTypes.func,
  previewState: PropTypes.oneOf(INPUT_PREVIEW_STATES),
  readOnly: PropTypes.bool,
  showHelperIcon: PropTypes.bool,
  startIcon: PropTypes.node,
  style: PropTypes.object,
  switchChecked: PropTypes.bool,
  switchDataId: PropTypes.string,
  switchDefaultChecked: PropTypes.bool,
  switchLabel: PropTypes.node,
  switchOnChange: PropTypes.func,
  onSwitchChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(INPUT_VARIANT_VALUES),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default InputText;
