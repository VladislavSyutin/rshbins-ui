import { createBusinessInput } from '../input-helpers/createBusinessInput.jsx';
import {
  EMAIL_ALLOWED_CHARACTER_PATTERN,
  EMAIL_MAX_LENGTH,
  sanitizeEmailValue,
  validateEmailValue
} from '../input-helpers/formatters.js';
import './styles.css';

const InputEmail = createBusinessInput({
  allowedKeyPattern: EMAIL_ALLOWED_CHARACTER_PATTERN,
  autoCapitalize: 'none',
  autoCorrect: 'off',
  className: 'rshb-legacy-input-email',
  displayName: 'InputEmail',
  inputMode: 'email',
  label: 'Электронная почта',
  maxLength: EMAIL_MAX_LENGTH,
  sanitize: sanitizeEmailValue,
  spellCheck: false,
  validate: validateEmailValue
});

export default InputEmail;
