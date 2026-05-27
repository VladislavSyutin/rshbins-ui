import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

var idCounter = 0;


function generateGroupName() {
  idCounter += 1;
  return 'rshb-legacy-segmented-control-' + idCounter;
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

function SegmentOption(props) {
  const {
    checked,
    className,
    dataId,
    disabled,
    id,
    label,
    leadingIcon,
    name,
    onChange,
    readOnly,
    required,
    trailingIcon,
    value
  } = props;

  const resolvedDisabled = Boolean(disabled);
  const previewStatus = resolvePreviewStatus({ checked: checked });
  const resolvedReadOnly = readOnly != null ? readOnly : checked && onChange == null;

  return (
    <label
      className={classNames('rshb-legacy-segment', 'rshb-legacy-segmented-control__segment', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-id={dataId}
      data-preview-status={previewStatus}
    >
      <input
        checked={checked}
        className="rshb-legacy-segment__input"
        disabled={resolvedDisabled}
        id={id}
        name={name}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        required={Boolean(required)}
        type="radio"
        value={value}
      />
      <span className="rshb-legacy-segment__content">
        {leadingIcon ? (
          <span aria-hidden="true" className="rshb-legacy-segment__icon">
            {leadingIcon}
          </span>
        ) : null}
        {label != null ? <span className="rshb-legacy-segment__label">{label}</span> : null}
        {trailingIcon ? (
          <span aria-hidden="true" className="rshb-legacy-segment__icon">
            {trailingIcon}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function SegmentedControl(props) {
  const {
    className,
    dataId,
    defaultValue,
    disabled,
    name,
    onChange,
    options,
    required,
    role,
    value,
    ...rest
  } = props;

  const resolvedOptions = Array.isArray(options) ? options : [];
  const resolvedDisabled = Boolean(disabled);
  const resolvedRequired = Boolean(required);
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
      aria-orientation="horizontal"
      aria-required={resolvedRequired || undefined}
      className={classNames('rshb-legacy-segmented-control', className)}
      data-id={dataIdValue}
      role={role !== undefined ? role : 'radiogroup'}
    >
      {resolvedOptions.map(function (option, index) {
        const optionId = option.id != null ? option.id : resolvedName + '-' + (index + 1);
        const optionValue = option.value;

        return (
          <SegmentOption
            checked={optionValue === resolvedValue}
            dataId={option.dataId}
            disabled={resolvedDisabled || option.disabled}
            id={optionId}
            key={option.id != null ? option.id : optionValue}
            label={option.label}
            leadingIcon={option.leadingIcon}
            name={resolvedName}
            onChange={function (event) {
              handleOptionChange(optionValue, event);
            }}
            required={resolvedRequired}
            trailingIcon={option.trailingIcon}
            value={optionValue}
          />
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = 'SegmentedControl';

SegmentOption.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  dataId: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  leadingIcon: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  trailingIcon: PropTypes.node,
  value: PropTypes.string
};

SegmentedControl.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    dataId: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node.isRequired,
    leadingIcon: PropTypes.node,
    trailingIcon: PropTypes.node,
    value: PropTypes.string.isRequired
  })).isRequired,
  required: PropTypes.bool,
  role: PropTypes.string,
  value: PropTypes.string
};

SegmentedControl.defaultProps = {
  options: []
};

export default SegmentedControl;
