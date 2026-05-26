import { createBusinessInput } from '../input-helpers/createBusinessInput.jsx';
import { INN_MAX_DIGITS, sanitizeInnValue, validateInnValue } from '../input-helpers/formatters.js';
import './styles.css';

const InputInn = createBusinessInput({
  allowedKeyPattern: /^\d$/,
  autoCapitalize: 'off',
  autoCorrect: 'off',
  className: 'rshb-legacy-input-inn',
  displayName: 'InputInn',
  inputMode: 'numeric',
  label: 'ИНН',
  maxLength: INN_MAX_DIGITS,
  pattern: '[0-9]*',
  sanitize: sanitizeInnValue,
  spellCheck: false,
  validate: validateInnValue
});

export default InputInn;
