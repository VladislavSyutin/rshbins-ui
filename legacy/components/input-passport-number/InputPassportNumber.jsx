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
    .slice(0, 10);
  return digits.length <= 4
    ? digits
    : digits.slice(0, 4) + ' ' + digits.slice(4);
}
function validate(value) {
  if (!value) return REQUIRED_ERROR;
  return value.replace(/\D/g, '').length === 10 ? undefined : 'Введите 10 цифр';
}
const InputPassportNumber = createBusinessInput({
  displayName: 'InputPassportNumber',
  className: 'rshb-legacy-input-passport-number',
  label: 'Серия и номер',
  sanitize,
  validate,
  allowedKeyPattern: /^\d$/,
  onKeyDown: (event, context) => deleteMaskSeparator(event, context, ' '),
  mask: '0000 000000',
  maxLength: 11,
  inputMode: 'numeric',
  autoComplete: 'off',
  autoCorrect: 'off',
  spellCheck: false
});
export default InputPassportNumber;
