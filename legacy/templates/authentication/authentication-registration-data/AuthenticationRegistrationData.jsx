import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../../components/button/index.js';
import Checkbox from '../../../components/checkbox/index.js';
import InputBirthDate from '../../../components/input-birth-date/index.js';
import Gender from '../../../components/gender/index.js';
import Header from '../../../components/header/index.js';
import InputEmail from '../../../components/input-email/index.js';
import InputMiddleName from '../../../components/input-middle-name/index.js';
import InputName from '../../../components/input-name/index.js';
import InputSurname from '../../../components/input-surname/index.js';
import TextLink from '../../../components/text-link/index.js';
import {
  validateEmailValue,
  validatePersonNameValue
} from '../../../components/input-helpers/formatters.js';
import './styles.css';

const DEVICES = {
  auto: 'auto',
  desktop: 'desktop',
  mobile: 'mobile'
};

const DEVICE_VALUES = [DEVICES.auto, DEVICES.desktop, DEVICES.mobile];

const GENDER_VALUES = {
  male: 'male',
  female: 'female'
};

const GENDER_VALUE_LIST = [GENDER_VALUES.male, GENDER_VALUES.female];

const PERSONAL_DATA_POLICY_URL =
  'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

const BIRTH_DATE_MIN_AGE_YEARS = 18;
const BIRTH_DATE_MAX_AGE_YEARS = 100;

function normalizeDate(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function shiftDateByYears(value, years) {
  const normalizedValue = normalizeDate(value);
  const nextYear = normalizedValue.getFullYear() + years;
  const nextMonth = normalizedValue.getMonth();
  const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
  const nextDay = Math.min(normalizedValue.getDate(), daysInNextMonth);

  return new Date(nextYear, nextMonth, nextDay);
}

function parseDateDigits(value) {
  const digits = String(value || '').replace(/\D/g, '');

  if (digits.length !== 8) {
    return null;
  }

  const day = Number.parseInt(digits.slice(0, 2), 10);
  const month = Number.parseInt(digits.slice(2, 4), 10);
  const year = Number.parseInt(digits.slice(4, 8), 10);
  const parsedDate = new Date(year, month - 1, day);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return normalizeDate(parsedDate);
}

function isBirthDateValueValid(value) {
  const parsedDate = parseDateDigits(value);

  if (!parsedDate) {
    return false;
  }

  const today = normalizeDate(new Date());
  const minDate = shiftDateByYears(today, -BIRTH_DATE_MAX_AGE_YEARS);
  const maxDate = shiftDateByYears(today, -BIRTH_DATE_MIN_AGE_YEARS);

  return parsedDate >= minDate && parsedDate <= maxDate;
}

function isPersonNameValid(value) {
  return validatePersonNameValue(String(value || '')) === undefined;
}

function isEmailValid(value) {
  return validateEmailValue(String(value || '')) === undefined;
}

function buildDefaultConsentLabel(onPersonalDataClick) {
  return (
    <>
      Соглашаюсь на{' '}
      <TextLink
        href={PERSONAL_DATA_POLICY_URL}
        onClick={onPersonalDataClick}
        rel="noreferrer"
        size="s"
        target="_blank"
      >
        передачу и обработку
      </TextLink>{' '}
      персональных данных.
    </>
  );
}

function AuthenticationRegistrationData(props) {
  const {
    birthDateInputProps,
    birthDateLabel,
    brandButtonProps,
    className,
    consentCheckboxProps,
    consentLabel,
    dataId,
    defaultBirthDate,
    defaultConsentAccepted,
    defaultEmail,
    defaultGender,
    defaultMiddleName,
    defaultName,
    defaultSurname,
    defaultWithoutMiddleName,
    device,
    emailInputProps,
    emailLabel,
    genderProps,
    middleNameInputProps,
    middleNameLabel,
    nameInputProps,
    nameLabel,
    onConsentChange,
    onPersonalDataClick,
    onSubmit,
    saveButtonLabel,
    saveButtonProps,
    surnameInputProps,
    surnameLabel,
    themeProps,
    title,
    ...rest
  } = props;

  const dataIdValue = dataId || rest['data-id'];
  const [surname, setSurname] = useState(defaultSurname);
  const [name, setName] = useState(defaultName);
  const [middleName, setMiddleName] = useState(defaultMiddleName);
  const [withoutMiddleName, setWithoutMiddleName] = useState(defaultWithoutMiddleName);
  const [birthDate, setBirthDate] = useState(defaultBirthDate);
  const [gender, setGender] = useState(defaultGender);
  const [email, setEmail] = useState(defaultEmail);
  const [consentAccepted, setConsentAccepted] = useState(defaultConsentAccepted);
  const resolvedConsentLabel =
    consentLabel !== undefined
      ? consentLabel
      : buildDefaultConsentLabel(onPersonalDataClick);
  const canSubmit =
    isPersonNameValid(surname) &&
    isPersonNameValid(name) &&
    (withoutMiddleName || isPersonNameValid(middleName)) &&
    isBirthDateValueValid(birthDate) &&
    gender !== undefined &&
    isEmailValid(email) &&
    consentAccepted;

  function handleConsentChange(event) {
    const nextChecked = event.target.checked;

    setConsentAccepted(nextChecked);

    if (onConsentChange) {
      onConsentChange(nextChecked);
    }

    if (consentCheckboxProps && consentCheckboxProps.onChange) {
      consentCheckboxProps.onChange(event);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (onSubmit) {
      onSubmit({
        birthDate: birthDate,
        consentAccepted: consentAccepted,
        email: email,
        gender: gender,
        middleName: middleName,
        name: name,
        surname: surname,
        withoutMiddleName: withoutMiddleName
      });
    }
  }

  return (
    <section
      {...rest}
      className={classNames('rshb-authentication-registration-data', className)}
      data-device={device}
      data-id={dataIdValue}
    >
      <Header
        brandButtonProps={brandButtonProps}
        className="rshb-authentication-registration-data__topbar"
        size="xs"
        themeProps={themeProps}
      />

      <h1 className="rshb-authentication-registration-data__title">
        {title}
      </h1>

      <form
        className="rshb-authentication-registration-data__panel"
        onSubmit={handleSubmit}
      >
        <div className="rshb-authentication-registration-data__fields">
          <InputSurname
            {...surnameInputProps}
            className={classNames(
              'rshb-authentication-registration-data__field',
              surnameInputProps && surnameInputProps.className
            )}
            label={surnameLabel}
            onValueChange={function (nextValue) {
              setSurname(nextValue);
              if (surnameInputProps && surnameInputProps.onValueChange) {
                surnameInputProps.onValueChange(nextValue);
              }
            }}
            value={surname}
          />

          <InputName
            {...nameInputProps}
            className={classNames(
              'rshb-authentication-registration-data__field',
              nameInputProps && nameInputProps.className
            )}
            label={nameLabel}
            onValueChange={function (nextValue) {
              setName(nextValue);
              if (nameInputProps && nameInputProps.onValueChange) {
                nameInputProps.onValueChange(nextValue);
              }
            }}
            value={name}
          />

          <InputMiddleName
            {...middleNameInputProps}
            className={classNames(
              'rshb-authentication-registration-data__field',
              middleNameInputProps && middleNameInputProps.className
            )}
            label={middleNameLabel}
            onSwitchChange={function (checked, event) {
              setWithoutMiddleName(checked);
              if (checked) {
                setMiddleName('');
              }
              if (middleNameInputProps && middleNameInputProps.onSwitchChange) {
                middleNameInputProps.onSwitchChange(checked, event);
              }
            }}
            onValueChange={function (nextValue) {
              setMiddleName(nextValue);
              if (middleNameInputProps && middleNameInputProps.onValueChange) {
                middleNameInputProps.onValueChange(nextValue);
              }
            }}
            switchChecked={withoutMiddleName}
            value={middleName}
          />

          <div className="rshb-authentication-registration-data__compound-row">
            <InputBirthDate
              {...birthDateInputProps}
              className={classNames(
                'rshb-authentication-registration-data__field',
                'rshb-authentication-registration-data__field--birth-date',
                birthDateInputProps && birthDateInputProps.className
              )}
              label={birthDateLabel}
              onValueChange={function (nextValue) {
                setBirthDate(nextValue);
                if (birthDateInputProps && birthDateInputProps.onValueChange) {
                  birthDateInputProps.onValueChange(nextValue);
                }
              }}
              value={birthDate}
            />

            <Gender
              {...genderProps}
              className={classNames(
                'rshb-authentication-registration-data__gender',
                genderProps && genderProps.className
              )}
              onChange={function (nextValue, event) {
                setGender(nextValue);
                if (genderProps && genderProps.onChange) {
                  genderProps.onChange(nextValue, event);
                }
              }}
              value={gender}
            />
          </div>

          <InputEmail
            {...emailInputProps}
            className={classNames(
              'rshb-authentication-registration-data__field',
              emailInputProps && emailInputProps.className
            )}
            label={emailLabel}
            onValueChange={function (nextValue) {
              setEmail(nextValue);
              if (emailInputProps && emailInputProps.onValueChange) {
                emailInputProps.onValueChange(nextValue);
              }
            }}
            value={email}
          />
        </div>

        <div className="rshb-authentication-registration-data__actions">
          <Checkbox
            {...consentCheckboxProps}
            checked={consentAccepted}
            className={classNames(
              'rshb-authentication-registration-data__consent',
              consentCheckboxProps && consentCheckboxProps.className
            )}
            label={resolvedConsentLabel}
            onChange={handleConsentChange}
            size="s"
          />

          <Button
            {...saveButtonProps}
            className={classNames(
              'rshb-authentication-registration-data__action',
              saveButtonProps && saveButtonProps.className
            )}
            disabled={!canSubmit || Boolean(saveButtonProps && saveButtonProps.disabled)}
            type="submit"
            variant="brand"
          >
            {saveButtonLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}

AuthenticationRegistrationData.displayName = 'AuthenticationRegistrationData';

AuthenticationRegistrationData.devices = DEVICES;
AuthenticationRegistrationData.genderValues = GENDER_VALUES;

AuthenticationRegistrationData.propTypes = {
  birthDateInputProps: PropTypes.object,
  birthDateLabel: PropTypes.node,
  brandButtonProps: PropTypes.object,
  className: PropTypes.string,
  consentCheckboxProps: PropTypes.object,
  consentLabel: PropTypes.node,
  dataId: PropTypes.string,
  defaultBirthDate: PropTypes.string,
  defaultConsentAccepted: PropTypes.bool,
  defaultEmail: PropTypes.string,
  defaultGender: PropTypes.oneOf(GENDER_VALUE_LIST),
  defaultMiddleName: PropTypes.string,
  defaultName: PropTypes.string,
  defaultSurname: PropTypes.string,
  defaultWithoutMiddleName: PropTypes.bool,
  device: PropTypes.oneOf(DEVICE_VALUES),
  emailInputProps: PropTypes.object,
  emailLabel: PropTypes.node,
  genderProps: PropTypes.object,
  middleNameInputProps: PropTypes.object,
  middleNameLabel: PropTypes.node,
  nameInputProps: PropTypes.object,
  nameLabel: PropTypes.node,
  onConsentChange: PropTypes.func,
  onPersonalDataClick: PropTypes.func,
  onSubmit: PropTypes.func,
  saveButtonLabel: PropTypes.node,
  saveButtonProps: PropTypes.object,
  surnameInputProps: PropTypes.object,
  surnameLabel: PropTypes.node,
  themeProps: PropTypes.object,
  title: PropTypes.node
};

AuthenticationRegistrationData.defaultProps = {
  birthDateInputProps: undefined,
  birthDateLabel: 'Дата рождения',
  brandButtonProps: undefined,
  className: undefined,
  consentCheckboxProps: undefined,
  consentLabel: undefined,
  dataId: undefined,
  defaultBirthDate: '',
  defaultConsentAccepted: false,
  defaultEmail: '',
  defaultGender: undefined,
  defaultMiddleName: '',
  defaultName: '',
  defaultSurname: '',
  defaultWithoutMiddleName: false,
  device: DEVICES.auto,
  emailInputProps: undefined,
  emailLabel: 'Электронная почта',
  genderProps: undefined,
  middleNameInputProps: undefined,
  middleNameLabel: 'Отчество',
  nameInputProps: undefined,
  nameLabel: 'Имя',
  onConsentChange: undefined,
  onPersonalDataClick: undefined,
  onSubmit: undefined,
  saveButtonLabel: 'Сохранить данные',
  saveButtonProps: undefined,
  surnameInputProps: undefined,
  surnameLabel: 'Фамилия',
  themeProps: undefined,
  title: 'Заполните информацию о себе'
};

export default AuthenticationRegistrationData;
