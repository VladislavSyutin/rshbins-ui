import { createBusinessInput } from '../input-helpers/createBusinessInput.jsx';
import {
  NAME_ALLOWED_CHARACTER_PATTERN,
  normalizePersonNameOnBlur,
  sanitizePersonNameValue,
  validatePersonNameValue
} from '../input-helpers/formatters.js';
import './styles.css';

const InputName = createBusinessInput({
  allowedKeyPattern: NAME_ALLOWED_CHARACTER_PATTERN,
  className: 'rshb-legacy-input-name',
  displayName: 'InputName',
  label: 'Имя',
  normalizeOnBlur: function normalizeNameOnBlur(value) {
    return normalizePersonNameOnBlur(value, { allowSpace: false });
  },
  sanitize: function sanitizeName(value) {
    return sanitizePersonNameValue(value, { allowSpace: false });
  },
  validate: validatePersonNameValue
});

export default InputName;
