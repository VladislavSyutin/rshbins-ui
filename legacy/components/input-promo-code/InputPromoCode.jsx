import React from 'react';
import {
  createBusinessInput,
  REQUIRED_ERROR
} from '../input-helpers/createBusinessInput.jsx';
import './styles.css';

function sanitize(value) {
  return String(value == null ? '' : value)
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();
}
function validate(value) {
  if (!value) return REQUIRED_ERROR;
  return undefined;
}
const InputPromoCode = createBusinessInput({
  displayName: 'InputPromoCode',
  className: 'rshb-legacy-input-promo-code',
  label: 'Промокод',
  sanitize,
  validate,
  allowedKeyPattern: /^[A-Za-z0-9]$/,
  autoCapitalize: 'characters',
  autoComplete: 'off',
  autoCorrect: 'off',
  spellCheck: false
});
export default InputPromoCode;
