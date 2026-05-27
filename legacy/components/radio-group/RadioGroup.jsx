import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

var idCounter = 0;

const RADIO_GROUP_DIRECTIONS = {
  vertical: 'vertical',
  horizontal: 'horizontal'
};

const RADIO_PREVIEW_STATES = {
  default: 'default',
  hover: 'hover',
  focused: 'focused'
};

const RADIO_GROUP_DIRECTION_VALUES = [
  RADIO_GROUP_DIRECTIONS.vertical,
  RADIO_GROUP_DIRECTIONS.horizontal
];

const RADIO_PREVIEW_STATE_VALUES = [
  RADIO_PREVIEW_STATES.default,
  RADIO_PREVIEW_STATES.hover,
  RADIO_PREVIEW_STATES.focused
];

function generateGroupName() {
  idCounter += 1;
  return 'rshb-legacy-radio-group-' + idCounter;
}

function resolveSelectedValue(options, candidate) {
  const resolvedOptions = Array.isArray(options) ? options : [];

  if (candidate != null && resolvedOptions.some(function (option) { return option.value === candidate; })) {
    return candidate;
  }

  return undefined;
}

function resolvePreviewStatus(props) {
  return props.checked ? 'active' : 'inactive';
}

function RadioOption(props) {
  const {
    checked,
    dataId,
    disabled,
    id,
    label,
    name,
    onChange,
    previewState,
    readOnly,
    required,
    value
  } = props;

  const resolvedDisabled = Boolean(disabled);
  const resolvedPreviewState = previewState || RADIO_PREVIEW_STATES.default;
  const previewStatus = resolvePreviewStatus({ checked: checked });
  const resolvedReadOnly = readOnly != null ? readOnly : checked && onChange == null;

  return (
    <label
      className="rshb-legacy-radio-group__option"
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-id={dataId}
      data-preview-state={resolvedPreviewState}
      data-preview-status={previewStatus}
    >
      <input
        checked={checked}
        className="rshb-legacy-radio-group__input"
        disabled={resolvedDisabled}
        id={id}
        name={name}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        required={Boolean(required)}
        type="radio"
        value={value}
      />
      <span aria-hidden="true" className="rshb-legacy-radio-group__control">
        <span className="rshb-legacy-radio-group__dot" />
      </span>
      {label != null ? (
        <span className="rshb-legacy-radio-group__label">{label}</span>
      ) : null}
    </label>
  );
}

function RadioGroup(props) {
  const {
    className,
    dataId,
    defaultValue,
    direction,
    disabled,
    name,
    onChange,
    options,
    previewState,
    required,
    role,
    value,
    ...rest
  } = props;

  const resolvedOptions = Array.isArray(options) ? options : [];
  const resolvedDirection = direction || RADIO_GROUP_DIRECTIONS.vertical;
  const resolvedDisabled = Boolean(disabled);
  const resolvedRequired = Boolean(required);
  const resolvedPreviewState = previewState || RADIO_PREVIEW_STATES.default;
  const dataIdValue = dataId || rest['data-id'];

  const [generatedName] = useState(generateGroupName);
  const resolvedName = name !== undefined ? name : generatedName;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(function () {
    return resolveSelectedValue(resolvedOptions, defaultValue);
  });

  useEffect(function () {
    if (!isControlled) {
      setInternalValue(function (currentValue) {
        const nextValue = defaultValue !== undefined ? defaultValue : currentValue;
        return resolveSelectedValue(resolvedOptions, nextValue);
      });
    }
  }, [defaultValue, isControlled, resolvedOptions]);

  const resolvedValue = resolveSelectedValue(
    resolvedOptions,
    isControlled ? value : internalValue
  );

  function handleOptionChange(nextValue, event) {
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
      aria-disabled={resolvedDisabled || undefined}
      aria-orientation={resolvedDirection}
      aria-required={resolvedRequired || undefined}
      className={classNames('rshb-legacy-radio-group', className)}
      data-direction={resolvedDirection}
      data-id={dataIdValue}
      data-preview-state={resolvedPreviewState}
      role={role !== undefined ? role : 'radiogroup'}
    >
      {resolvedOptions.map(function (option, index) {
        const optionId = option.id != null ? option.id : resolvedName + '-' + (index + 1);
        const optionValue = option.value;
        const optionChecked = optionValue === resolvedValue;

        return (
          <RadioOption
            checked={optionChecked}
            dataId={option.dataId}
            disabled={resolvedDisabled || option.disabled}
            id={optionId}
            key={option.id != null ? option.id : optionValue}
            label={option.label}
            name={resolvedName}
            onChange={function (event) {
              handleOptionChange(optionValue, event);
            }}
            previewState={option.previewState || resolvedPreviewState}
            required={resolvedRequired}
            value={optionValue}
          />
        );
      })}
    </div>
  );
}

RadioGroup.displayName = 'RadioGroup';

RadioGroup.directions = RADIO_GROUP_DIRECTIONS;
RadioGroup.previewStates = RADIO_PREVIEW_STATES;

RadioOption.propTypes = {
  checked: PropTypes.bool,
  dataId: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  previewState: PropTypes.oneOf(RADIO_PREVIEW_STATE_VALUES),
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string
};

RadioGroup.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultValue: PropTypes.string,
  direction: PropTypes.oneOf(RADIO_GROUP_DIRECTION_VALUES),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    dataId: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    previewState: PropTypes.oneOf(RADIO_PREVIEW_STATE_VALUES),
    value: PropTypes.string.isRequired
  })).isRequired,
  previewState: PropTypes.oneOf(RADIO_PREVIEW_STATE_VALUES),
  required: PropTypes.bool,
  role: PropTypes.string,
  value: PropTypes.string
};

RadioGroup.defaultProps = {
  direction: RADIO_GROUP_DIRECTIONS.vertical,
  options: []
};

export default RadioGroup;
