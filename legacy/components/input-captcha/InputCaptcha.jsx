import { createBusinessInput } from '../input-helpers/createBusinessInput.jsx';
import { sanitizeCaptchaValue, validateRequiredValue } from '../input-helpers/formatters.js';
import './styles.css';

const InputCaptcha = createBusinessInput({
  allowedKeyPattern: /^\S$/,
  className: 'rshb-legacy-input-captcha',
  displayName: 'InputCaptcha',
  label: 'Код с картинки',
  sanitize: sanitizeCaptchaValue,
  validate: validateRequiredValue
});

export default InputCaptcha;
