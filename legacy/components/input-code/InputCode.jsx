import { createBusinessInput } from '../input-helpers/createBusinessInput.jsx';
import { CODE_MAX_DIGITS, sanitizeCodeValue, validateRequiredValue } from '../input-helpers/formatters.js';
import './styles.css';

const InputCode = createBusinessInput({
  allowedKeyPattern: /^\d$/,
  autoCapitalize: 'off',
  autoCorrect: 'off',
  className: 'rshb-legacy-input-code',
  displayName: 'InputCode',
  inputMode: 'numeric',
  label: 'Проверочный код',
  maxLength: CODE_MAX_DIGITS,
  pattern: '[0-9]*',
  sanitize: sanitizeCodeValue,
  spellCheck: false,
  validate: validateRequiredValue
});

export default InputCode;
