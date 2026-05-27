import { createBusinessInput } from '../input-helpers/createBusinessInput.jsx';
import {
  SURNAME_ALLOWED_CHARACTER_PATTERN,
  normalizePersonNameOnBlur,
  sanitizePersonNameValue,
  validatePersonNameValue
} from '../input-helpers/formatters.js';
import './styles.css';

const InputSurname = createBusinessInput({
  allowedKeyPattern: SURNAME_ALLOWED_CHARACTER_PATTERN,
  className: 'rshb-legacy-input-surname',
  displayName: 'InputSurname',
  inputMode: 'text',
  label: 'Фамилия',
  normalizeOnBlur: function normalizeSurnameOnBlur(value) {
    return normalizePersonNameOnBlur(value, { allowSpace: true });
  },
  sanitize: function sanitizeSurname(value) {
    return sanitizePersonNameValue(value, { allowSpace: true });
  },
  validate: validatePersonNameValue
});

export default InputSurname;
