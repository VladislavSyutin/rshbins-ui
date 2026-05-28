import { REQUIRED_ERROR } from './createBusinessInput.jsx';

export const BRACKETS_ERROR = 'Скобки должны быть парными.';
export const INN_LENGTH_ERROR = 'ИНН должен содержать 10 или 12 цифр.';
export const PHONE_LENGTH_ERROR = 'Номер телефона должен содержать 11 цифр';
export const PHONE_REPEATING_ERROR = 'Некорректный номер телефона';
export const EMAIL_AT_SIGN_ERROR = 'Адрес электронной почты должен содержать знак “@”';
export const EMAIL_DOMAIN_ERROR =
  'Адрес электронной почты должен содержать доменную часть (например, example.ru)';
export const EMAIL_DOMAIN_DOT_ERROR =
  'Адрес электронной почты должен содержать “.” (например, example.ru)';
export const CODE_LENGTH_ERROR = 'Проверочный код должен содержать 4 цифры';

export const NAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,()]$/;
export const SURNAME_ALLOWED_CHARACTER_PATTERN = /^[А-Яа-яЁё.\-’,() ]$/;
export const LOGIN_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9._-]$/;
export const EMAIL_ALLOWED_CHARACTER_PATTERN = /^[A-Za-z0-9._+@-]$/;

const CYRILLIC_LETTER_PATTERN = /^[А-Яа-яЁё]$/;
const NAME_SEPARATOR_PATTERN = /^[.\-’,() ]$/;
const TRAILING_FORBIDDEN_NAME_PATTERN = /^[.\-’, ]$/;
const LOGIN_SEPARATOR_PATTERN = /^[._-]$/;
const EMAIL_LOCAL_EDGE_FORBIDDEN_PATTERN = /^[._-]$/;

export const CODE_MAX_DIGITS = 4;
export const INN_MAX_DIGITS = 12;
export const EMAIL_MAX_LENGTH = 254;
const EMAIL_LOCAL_MAX_LENGTH = 64;
const PHONE_MAX_DIGITS = 10;
const PHONE_ALLOWED_FIRST_DIGIT = '9';
const PHONE_COUNTRY_PREFIX_DIGITS = ['7', '8'];

function getLastCharacter(value) {
  return value.length > 0 ? value.charAt(value.length - 1) : '';
}

function formatFirstLetter(value) {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase('ru-RU') + value.slice(1);
}

export function hasPairedBrackets(value) {
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

export function sanitizePersonNameValue(value, options) {
  const allowSpace = options && options.allowSpace;
  const allowedPattern = allowSpace ? SURNAME_ALLOWED_CHARACTER_PATTERN : NAME_ALLOWED_CHARACTER_PATTERN;
  const stringValue = String(value != null ? value : '');
  let sanitizedValue = '';

  for (let index = 0; index < stringValue.length; index += 1) {
    const character = stringValue.charAt(index);

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

export function normalizePersonNameOnBlur(value, options) {
  let normalizedValue = sanitizePersonNameValue(value, options);

  while (
    normalizedValue.length > 0 &&
    TRAILING_FORBIDDEN_NAME_PATTERN.test(getLastCharacter(normalizedValue))
  ) {
    normalizedValue = normalizedValue.slice(0, -1);
  }

  return normalizedValue;
}

export function validatePersonNameValue(value) {
  if (value.length === 0) {
    return REQUIRED_ERROR;
  }

  return hasPairedBrackets(value) ? undefined : BRACKETS_ERROR;
}

export function getDigitsOnly(value, maxLength) {
  return String(value != null ? value : '').replace(/\D/g, '').slice(0, maxLength);
}

export function sanitizeCodeValue(value) {
  return getDigitsOnly(value, CODE_MAX_DIGITS);
}

export function sanitizeInnValue(value) {
  return getDigitsOnly(value, INN_MAX_DIGITS);
}

export function validateRequiredValue(value) {
  return value.length === 0 ? REQUIRED_ERROR : undefined;
}

export function validateCodeValue(value) {
  if (value.length === 0) {
    return REQUIRED_ERROR;
  }

  return value.length === CODE_MAX_DIGITS ? undefined : CODE_LENGTH_ERROR;
}

export function validateInnValue(value) {
  if (value.length === 0) {
    return REQUIRED_ERROR;
  }

  return value.length === 10 || value.length === 12 ? undefined : INN_LENGTH_ERROR;
}

export function sanitizeLoginValue(value) {
  const stringValue = String(value != null ? value : '');
  let sanitizedValue = '';

  for (let index = 0; index < stringValue.length; index += 1) {
    const character = stringValue.charAt(index);

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

export function sanitizeCaptchaValue(value) {
  return String(value != null ? value : '').replace(/\s/g, '');
}

export function sanitizeEmailValue(value) {
  const lowerValue = String(value != null ? value : '').toLowerCase();
  let sanitizedValue = '';
  let hasAtSign = false;
  let localLength = 0;

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

export function validateEmailValue(value) {
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

  return undefined;
}

export function getPhoneDigits(value) {
  let digits = String(value != null ? value : '').replace(/\D/g, '');

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

export function formatPhoneNumber(value) {
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

export function validatePhoneValue(value) {
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
