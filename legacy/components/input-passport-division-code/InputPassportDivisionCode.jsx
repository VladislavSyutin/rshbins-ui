import React from 'react';
import {
  createBusinessInput,
  REQUIRED_ERROR,
  deleteMaskSeparator
} from '../input-helpers/createBusinessInput.jsx';
import './styles.css';

function sanitize(value) {
  const digits = String(value == null ? '' : value)
    .replace(/\D/g, '')
    .slice(0, 6);
  return digits.length <= 3
    ? digits
    : digits.slice(0, 3) + '-' + digits.slice(3);
}
function validate(value) {
  if (!value) return REQUIRED_ERROR;
  return value.replace(/\D/g, '').length === 6 ? undefined : 'Введите 6 цифр';
}
const InputPassportDivisionCode = createBusinessInput({
  displayName: 'InputPassportDivisionCode',
  className: 'rshb-legacy-input-passport-division-code',
  label: 'Код подразделения',
  sanitize,
  validate,
  allowedKeyPattern: /^\d$/,
  onKeyDown: (event, context) => deleteMaskSeparator(event, context, '-'),
  mask: '000-000',
  maxLength: 7,
  inputMode: 'numeric',
  autoComplete: 'off',
  autoCorrect: 'off',
  spellCheck: false
});
export default InputPassportDivisionCode;
