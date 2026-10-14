import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import InputSurname from '../input-surname/index.js';
import InputName from '../input-name/index.js';
import InputMiddleName from '../input-middle-name/index.js';
import InputBirthDate from '../input-birth-date/index.js';
import Gender from '../gender/index.js';
import InputEmail from '../input-email/index.js';
function PolicyholderForm(props) {
  const {
    value: policyholder,
    onChange: onPolicyholderChange,
    className,
    dataId,
    title,
    description,
    ...rest
  } = props;
  const prefix = dataId || 'policyholder-form';

  function setPolicyholderField(fieldName, value) {
    onPolicyholderChange(
      Object.assign({}, policyholder, { [fieldName]: value })
    );
  }

  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-policyholder-form', className)}
      data-id={dataId || rest['data-id']}
    >
      <div className="rshb-legacy-policyholder-form__section-copy">
        <p className="rshb-legacy-policyholder-form__details-heading">
          {title || 'Данные страхователя'}
        </p>
        <p className="rshb-legacy-policyholder-form__section-description">
          {description || 'Страхователь — тот, кто оформляет полис.'}
        </p>
      </div>
      <div className="rshb-legacy-policyholder-form__fields">
        <InputSurname
          className="rshb-legacy-policyholder-form__field"
          dataId={prefix + '-last-name'}
          onValueChange={function (value) {
            setPolicyholderField('lastName', value);
          }}
          value={policyholder.lastName}
          width="100%"
        />
        <InputName
          className="rshb-legacy-policyholder-form__field"
          dataId={prefix + '-first-name'}
          onValueChange={function (value) {
            setPolicyholderField('firstName', value);
          }}
          value={policyholder.firstName}
          width="100%"
        />
        <InputMiddleName
          className="rshb-legacy-policyholder-form__field"
          dataId={prefix + '-middle-name'}
          onSwitchChange={function (checked) {
            setPolicyholderField('noMiddleName', checked);
          }}
          onValueChange={function (value) {
            setPolicyholderField('middleName', value);
          }}
          switchChecked={policyholder.noMiddleName}
          value={policyholder.middleName}
          width="100%"
        />
        <div className="rshb-legacy-policyholder-form__date-gender">
          <InputBirthDate
            className="rshb-legacy-policyholder-form__field"
            dataId={prefix + '-birth-date'}
            label="Дата рождения"
            onValueChange={function (value) {
              setPolicyholderField('birthDate', value);
            }}
            value={policyholder.birthDate}
            width="100%"
          />
          <Gender
            className="rshb-legacy-policyholder-form__gender"
            dataId={prefix + '-gender'}
            onChange={function (value) {
              setPolicyholderField('gender', value);
            }}
            value={policyholder.gender}
          />
        </div>
        <InputEmail
          className="rshb-legacy-policyholder-form__field"
          dataId={prefix + '-email'}
          label="Адрес электронной почты"
          onValueChange={function (value) {
            setPolicyholderField('email', value);
          }}
          value={policyholder.email}
          width="100%"
        />
        <p className="rshb-legacy-policyholder-form__field-hint">
          По этому адресу мы отправим вам документы.
        </p>
      </div>
    </div>
  );
}

PolicyholderForm.propTypes = {
  value: PropTypes.shape({
    birthDate: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    gender: PropTypes.oneOf(['male', 'female']),
    lastName: PropTypes.string.isRequired,
    middleName: PropTypes.string.isRequired,
    noMiddleName: PropTypes.bool.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  dataId: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.node
};
export default PolicyholderForm;
