import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import InputPhone from '../input-phone/index.js';
import InputCode from '../input-code/index.js';
import Button from '../button/index.js';
import TextLink from '../text-link/index.js';
function PhoneCodeForm(props) {
  const {
    code,
    isSubmittingCode,
    onBack,
    onChangePhone,
    onCodeChange,
    onSubmitCode,
    onResendCode,
    phone,
    resendSeconds,
    className,
    dataId,
    hint = 'По этому номеру телефона мы узнаем, регистрировались ли вы ранее.',
    ...rest
  } = props;
  const prefix = dataId || 'phone-code-form';
  const canSubmit = code.length === 4 && !isSubmittingCode;

  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-phone-code-form', className)}
      data-id={dataId || rest['data-id']}
    >
      <InputPhone
        className="rshb-legacy-phone-code-form__field"
        dataId={prefix + '-phone-confirmed'}
        disabled
        value={phone}
        width="100%"
      />
      <p className="rshb-legacy-phone-code-form__field-hint">{hint}</p>
      <InputCode
        className="rshb-legacy-phone-code-form__field"
        dataId={prefix + '-code'}
        onValueChange={onCodeChange}
        value={code}
        width="100%"
      />
      <div className="rshb-legacy-phone-code-form__timer">
        {resendSeconds > 0 ? (
          <span>Получить новый код через {resendSeconds} сек</span>
        ) : (
          <TextLink
            as="button"
            dataId={prefix + '-resend-code'}
            onClick={onResendCode}
            size="s"
          >
            Получить новый код
          </TextLink>
        )}
      </div>
      <TextLink
        as="button"
        className="rshb-legacy-phone-code-form__change-phone"
        dataId={prefix + '-change-phone'}
        onClick={onChangePhone}
        size="s"
      >
        Изменить номер телефона
      </TextLink>
      <ButtonsRow
        dataId={prefix}
        canContinue={canSubmit}
        isLoading={isSubmittingCode}
        onBack={onBack}
        onContinue={onSubmitCode}
      />
    </div>
  );
}
function ButtonsRow(props) {
  const { canContinue, isLoading, onBack, onContinue, dataId } = props;

  return (
    <div className="rshb-legacy-phone-code-form__form-buttons">
      <Button
        buttonType="flat-primary"
        className="rshb-legacy-phone-code-form__form-button"
        dataId={dataId + '-back'}
        onClick={onBack}
      >
        Назад
      </Button>
      <Button
        className="rshb-legacy-phone-code-form__form-button"
        dataId={dataId + '-continue'}
        disabled={!canContinue}
        loading={isLoading}
        onClick={onContinue}
      >
        Продолжить
      </Button>
    </div>
  );
}

PhoneCodeForm.propTypes = {
  phone: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  resendSeconds: PropTypes.number.isRequired,
  isSubmittingCode: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onChangePhone: PropTypes.func.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  onResendCode: PropTypes.func.isRequired,
  className: PropTypes.string,
  dataId: PropTypes.string,
  hint: PropTypes.node
};
ButtonsRow.propTypes = {
  canContinue: PropTypes.bool,
  isLoading: PropTypes.bool,
  onBack: PropTypes.func,
  onContinue: PropTypes.func,
  dataId: PropTypes.string
};
export default PhoneCodeForm;
