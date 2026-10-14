import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import InputPassportNumber from '../input-passport-number/index.js';
import InputPassportDivisionCode from '../input-passport-division-code/index.js';
import InputDate from '../input-date/index.js';
import InputText from '../input-text/index.js';
function PassportForm(props) {
  const {
    value: passport,
    onChange: onPassportChange,
    className,
    dataId,
    title,
    description,
    ...rest
  } = props;
  const prefix = dataId || 'passport-form';

  function setPassportField(fieldName, value) {
    onPassportChange(Object.assign({}, passport, { [fieldName]: value }));
  }

  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-passport-form', className)}
      data-id={dataId || rest['data-id']}
    >
      <div className="rshb-legacy-passport-form__section-copy">
        <p className="rshb-legacy-passport-form__details-heading">
          {title || 'Паспортные данные'}
        </p>
        <p className="rshb-legacy-passport-form__section-description">
          {description || 'Нужны для заключения договора.'}
        </p>
      </div>
      <div className="rshb-legacy-passport-form__fields">
        <InputPassportNumber
          className="rshb-legacy-passport-form__field"
          dataId={prefix + '-number'}
          label="Серия и номер"
          onValueChange={function (value) {
            setPassportField('number', value);
          }}
          value={passport.number}
          width="100%"
        />
        <div className="rshb-legacy-passport-form__two-fields">
          <InputPassportDivisionCode
            className="rshb-legacy-passport-form__field"
            dataId={prefix + '-code'}
            label="Код подразделения"
            onValueChange={function (value) {
              setPassportField('divisionCode', value);
            }}
            value={passport.divisionCode}
            width="100%"
          />
          <InputDate
            className="rshb-legacy-passport-form__field"
            dataId={prefix + '-date'}
            maxDate={new Date()}
            label="Дата выдачи"
            onValueChange={function (value) {
              setPassportField('issueDate', value);
            }}
            value={passport.issueDate}
            width="100%"
          />
        </div>
        <InputText
          className="rshb-legacy-passport-form__field"
          dataId={prefix + '-issued-by'}
          label="Кем выдан"
          onValueChange={function (value) {
            setPassportField('issuedBy', value);
          }}
          value={passport.issuedBy}
          width="100%"
        />
      </div>
    </div>
  );
}

PassportForm.propTypes = {
  value: PropTypes.shape({
    divisionCode: PropTypes.string.isRequired,
    issueDate: PropTypes.string.isRequired,
    issuedBy: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  dataId: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.node
};
export default PassportForm;
