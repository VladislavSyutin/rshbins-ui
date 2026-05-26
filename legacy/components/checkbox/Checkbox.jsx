import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

const CHECKBOX_PREVIEW_STATES = {
  default: 'default',
  hover: 'hover',
  focused: 'focused'
};

const CHECKBOX_PREVIEW_STATE_VALUES = [
  CHECKBOX_PREVIEW_STATES.default,
  CHECKBOX_PREVIEW_STATES.hover,
  CHECKBOX_PREVIEW_STATES.focused
];

const CHECKBOX_SIZES = ['m', 's'];

function resolvePreviewStatus(props) {
  const checked = props.checked;
  const defaultChecked = props.defaultChecked;
  const invalid = props.invalid;

  const isChecked = Boolean(checked != null ? checked : defaultChecked);

  if (invalid && !isChecked) {
    return 'error';
  }

  return isChecked ? 'active' : 'inactive';
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="rshb-legacy-checkbox__mark-icon"
      fill="none"
      viewBox="0 0 16 12"
    >
      <path
        d="M1.5 6.5L5.5 10.5L14.5 1.5"
        stroke="var(--color-text-brand-on-brand)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function Checkbox(props) {
  const {
    checked,
    className,
    dataId,
    defaultChecked,
    disabled,
    invalid,
    label,
    onChange,
    previewState,
    readOnly,
    size,
    ...rest
  } = props;

  const resolvedDisabled = Boolean(disabled);
  const resolvedInvalid = Boolean(invalid);
  const resolvedSize = size || 'm';
  const resolvedPreviewState = previewState || CHECKBOX_PREVIEW_STATES.default;
  const dataIdValue = dataId || rest['data-id'];

  const previewStatus = resolvePreviewStatus({
    checked: checked,
    defaultChecked: defaultChecked,
    invalid: resolvedInvalid
  });

  const isControlled = checked !== undefined;
  const resolvedReadOnly = readOnly != null ? readOnly : isControlled && onChange == null;

  return (
    <label
      className={classNames('rshb-legacy-checkbox', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-id={dataIdValue}
      data-preview-state={resolvedPreviewState}
      data-preview-status={previewStatus}
      data-size={resolvedSize}
    >
      <input
        {...rest}
        aria-invalid={resolvedInvalid || undefined}
        checked={checked}
        className="rshb-legacy-checkbox__input"
        defaultChecked={defaultChecked}
        disabled={resolvedDisabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        type="checkbox"
      />
      <span aria-hidden="true" className="rshb-legacy-checkbox__control">
        <span className="rshb-legacy-checkbox__mark">
          <CheckIcon />
        </span>
      </span>
      {label != null ? (
        <span className="rshb-legacy-checkbox__label">{label}</span>
      ) : null}
    </label>
  );
}

Checkbox.displayName = 'Checkbox';

Checkbox.previewStates = CHECKBOX_PREVIEW_STATES;

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  label: PropTypes.node,
  onChange: PropTypes.func,
  previewState: PropTypes.oneOf(CHECKBOX_PREVIEW_STATE_VALUES),
  readOnly: PropTypes.bool,
  size: PropTypes.oneOf(CHECKBOX_SIZES)
};

export default Checkbox;
