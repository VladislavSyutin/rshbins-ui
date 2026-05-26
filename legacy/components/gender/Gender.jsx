import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

var idCounter = 0;

function generateGroupName() {
  return 'rshb-legacy-gender-' + (++idCounter);
}

const GENDER_VALUES = {
  male: 'male',
  female: 'female'
};

const GENDER_VALUE_LIST = [GENDER_VALUES.male, GENDER_VALUES.female];

function resolveItemPreviewStatus(checked, invalid) {
  if (invalid && !checked) return 'error';
  return checked ? 'active' : 'inactive';
}

function GenderOption(props) {
  const { checked, invalid, label, name, onChange, position, required, value } = props;

  const previewStatus = resolveItemPreviewStatus(Boolean(checked), Boolean(invalid));
  const resolvedReadOnly = checked !== undefined && onChange == null;

  return (
    <label
      className="rshb-legacy-gender__item"
      data-position={position}
      data-preview-status={previewStatus}
    >
      <input
        aria-invalid={Boolean(invalid) || undefined}
        checked={checked}
        className="rshb-legacy-gender__item-input"
        name={name}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        required={Boolean(required)}
        type="radio"
        value={value}
      />
      <span className="rshb-legacy-gender__item-content">
        <span className="rshb-legacy-gender__item-label">{label}</span>
      </span>
    </label>
  );
}

function Gender(props) {
  const {
    className,
    dataId,
    defaultValue,
    femaleLabel,
    invalid,
    maleLabel,
    name,
    onChange,
    required,
    role,
    value,
    ...rest
  } = props;

  const resolvedInvalid = Boolean(invalid);
  const resolvedRequired = Boolean(required);
  const resolvedFemaleLabel = femaleLabel !== undefined ? femaleLabel : 'Жен';
  const resolvedMaleLabel = maleLabel !== undefined ? maleLabel : 'Муж';
  const dataIdValue = dataId || rest['data-id'];

  const [generatedName] = useState(generateGroupName);
  const resolvedName = name !== undefined ? name : generatedName;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(function () {
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const resolvedValue = isControlled ? value : internalValue;
  const showInvalid = resolvedInvalid && resolvedValue === undefined;

  function handleChange(nextValue, event) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onChange) {
      onChange(nextValue, event);
    }
  }

  return (
    <div
      {...rest}
      aria-invalid={showInvalid || undefined}
      className={classNames('rshb-legacy-gender', className)}
      data-id={dataIdValue}
      role={role !== undefined ? role : 'radiogroup'}
    >
      <GenderOption
        checked={resolvedValue === GENDER_VALUES.male}
        invalid={showInvalid}
        label={resolvedMaleLabel}
        name={resolvedName}
        onChange={function (event) { handleChange(GENDER_VALUES.male, event); }}
        position="left"
        required={resolvedRequired}
        value={GENDER_VALUES.male}
      />
      <GenderOption
        checked={resolvedValue === GENDER_VALUES.female}
        invalid={showInvalid}
        label={resolvedFemaleLabel}
        name={resolvedName}
        onChange={function (event) { handleChange(GENDER_VALUES.female, event); }}
        position="right"
        required={resolvedRequired}
        value={GENDER_VALUES.female}
      />
    </div>
  );
}

Gender.displayName = 'Gender';

Gender.values = GENDER_VALUES;

Gender.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultValue: PropTypes.oneOf(GENDER_VALUE_LIST),
  femaleLabel: PropTypes.node,
  invalid: PropTypes.bool,
  maleLabel: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOf(GENDER_VALUE_LIST)
};

export default Gender;
