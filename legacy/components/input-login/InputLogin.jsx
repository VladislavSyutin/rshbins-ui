import { createBusinessInput } from '../input-helpers/createBusinessInput.jsx';
import {
  LOGIN_ALLOWED_CHARACTER_PATTERN,
  sanitizeLoginValue,
  validateRequiredValue
} from '../input-helpers/formatters.js';
import './styles.css';

const InputLogin = createBusinessInput({
  allowedKeyPattern: LOGIN_ALLOWED_CHARACTER_PATTERN,
  autoCapitalize: 'off',
  autoCorrect: 'off',
  className: 'rshb-legacy-input-login',
  displayName: 'InputLogin',
  inputMode: 'email',
  label: 'Логин',
  sanitize: sanitizeLoginValue,
  spellCheck: false,
  validate: validateRequiredValue
});

export default InputLogin;
