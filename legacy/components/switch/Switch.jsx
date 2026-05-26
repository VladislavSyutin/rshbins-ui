import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

const SWITCH_PREVIEW_STATES = {
  default: 'default',
  hover: 'hover',
  focused: 'focused'
};

const SWITCH_PREVIEW_STATE_VALUES = [
  SWITCH_PREVIEW_STATES.default,
  SWITCH_PREVIEW_STATES.hover,
  SWITCH_PREVIEW_STATES.focused
];

function resolvePreviewStatus(props) {
  const checked = props.checked;
  const defaultChecked = props.defaultChecked;

  return Boolean(checked != null ? checked : defaultChecked) ? 'active' : 'inactive';
}

function Switch(props) {
  const {
    checked,
    className,
    dataId,
    defaultChecked,
    disabled,
    label,
    onChange,
    previewState,
    readOnly,
    ...rest
  } = props;

  const resolvedDisabled = Boolean(disabled);
  const resolvedPreviewState = previewState || SWITCH_PREVIEW_STATES.default;
  const previewStatus = resolvePreviewStatus({
    checked: checked,
    defaultChecked: defaultChecked
  });
  const isControlled = checked !== undefined;
  const resolvedReadOnly = readOnly != null ? readOnly : isControlled && onChange == null;
  const dataIdValue = dataId || rest['data-id'];

  return (
    <label
      className={classNames('rshb-legacy-switch', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-id={dataIdValue}
      data-preview-state={resolvedPreviewState}
      data-preview-status={previewStatus}
    >
      <input
        {...rest}
        checked={checked}
        className="rshb-legacy-switch__input"
        defaultChecked={defaultChecked}
        disabled={resolvedDisabled}
        onChange={onChange}
        readOnly={resolvedReadOnly}
        role="switch"
        type="checkbox"
      />
      <span aria-hidden="true" className="rshb-legacy-switch__control">
        <span className="rshb-legacy-switch__thumb" />
      </span>
      {label ? <span className="rshb-legacy-switch__label">{label}</span> : null}
    </label>
  );
}

Switch.displayName = 'Switch';

Switch.previewStates = SWITCH_PREVIEW_STATES;

Switch.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.node,
  onChange: PropTypes.func,
  previewState: PropTypes.oneOf(SWITCH_PREVIEW_STATE_VALUES),
  readOnly: PropTypes.bool
};

export default Switch;
