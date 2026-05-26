import React, { useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/index.js';
import './styles.css';
import xmarkIcon from '../../../icons/xmark.svg';

let idCounter = 0;

const INPUT_PREVIEW_STATES = [
  'default',
  'hover',
  'focused',
  'typing',
  'entered',
  'entered-hover',
  'error',
  'error-hover',
  'error-entered',
  'error-entered-hover',
  'disabled',
  'disabled-entered',
  'keyboard-focused'
];

function generateInputId() {
  idCounter += 1;
  return 'rshb-legacy-input-text-' + idCounter;
}

function normalizeRenderableNode(node) {
  if (
    node == null ||
    typeof node === 'string' ||
    typeof node === 'number' ||
    React.isValidElement(node)
  ) {
    return node;
  }

  return undefined;
}

function resolveInteractiveState(_ref) {
  const disabled = _ref.disabled;
  const hasKeyboardFocus = _ref.hasKeyboardFocus;
  const invalid = _ref.invalid;
  const isFocused = _ref.isFocused;
  const value = _ref.value;

  const hasValue = value.length > 0;

  if (disabled) {
    return hasValue ? 'disabled-entered' : 'disabled';
  }

  if (isFocused) {
    if (hasKeyboardFocus && !hasValue) {
      return 'keyboard-focused';
    }
    return hasValue ? 'typing' : 'focused';
  }

  if (invalid) {
    return hasValue ? 'error-entered' : 'error';
  }

  return hasValue ? 'entered' : 'default';
}

function InputTextIcon(props) {
  const src = props.src;

  return (
    <span
      aria-hidden="true"
      className="rshb-legacy-input-text__icon"
      style={{ '--rshb-legacy-input-text-icon': 'url("' + src + '")' }}
    />
  );
}

InputTextIcon.propTypes = {
  src: PropTypes.string.isRequired
};

const InputText = React.forwardRef(function InputText(props, ref) {
  const {
    changeOnFocus,
    className,
    clearButtonDataId,
    clearable,
    contentClassName,
    controlClassName,
    customInputStyle,
    dataId,
    defaultValue,
    disabled,
    endAdornment,
    error,
    helperIcon,
    helperText,
    hideControlValue,
    id,
    inputClassName,
    invalid,
    label,
    maskOverlay,
    onBlur,
    onChange,
    onFocus,
    onFocusChange,
    onKeyDown,
    onPointerDown,
    onValueChange,
    prefix,
    previewState,
    readOnly,
    showHelperIcon,
    startIcon,
    style,
    type,
    value,
    width,
    ...rest
  } = props;

  const resolvedClearable = clearable != null ? clearable : true;
  const resolvedLabel = normalizeRenderableNode(label) != null ? label : 'Название';
  const resolvedPrefix = normalizeRenderableNode(prefix);
  const resolvedMaskOverlay = normalizeRenderableNode(maskOverlay);
  const resolvedEndAdornment = normalizeRenderableNode(endAdornment);
  const resolvedDisabled = Boolean(disabled);

  const [inputId] = useState(function () {
    return id || generateInputId();
  });
  const [helperId] = useState(function () {
    return inputId + '-helper';
  });

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue != null ? String(defaultValue) : ''
  );
  const [isFocused, setIsFocused] = useState(false);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const inputRef = useRef(null);
  const keyboardFocusCandidateRef = useRef(false);

  const resolvedValue = isControlled
    ? String(value != null ? value : '')
    : uncontrolledValue;
  const resolvedInvalid = Boolean(invalid || error);
  const resolvedReadOnly =
    readOnly != null
      ? readOnly
      : isControlled && onChange == null && onValueChange == null;
  const isInteractive = previewState == null;

  const visualState = isInteractive
    ? resolveInteractiveState({
        disabled: resolvedDisabled,
        hasKeyboardFocus: hasKeyboardFocus,
        invalid: resolvedInvalid,
        isFocused: isFocused,
        value: resolvedValue
      })
    : previewState;

  const isErrorState =
    visualState === 'error' ||
    visualState === 'error-hover' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover';
  const isEnteredState =
    visualState === 'typing' ||
    visualState === 'entered' ||
    visualState === 'entered-hover' ||
    visualState === 'error-entered' ||
    visualState === 'error-entered-hover' ||
    visualState === 'disabled-entered';
  const isFocusedState =
    visualState === 'focused' ||
    visualState === 'typing' ||
    visualState === 'keyboard-focused';
  const resolvedHelperText = isErrorState ? helperText : undefined;

  const showsClearControl =
    resolvedClearable &&
    !resolvedDisabled &&
    !resolvedReadOnly &&
    (isInteractive ? isFocused && resolvedValue.length > 0 : visualState === 'typing');
  const shouldHideControlValue = Boolean(hideControlValue) && (isEnteredState || isFocusedState);
  const describedBy = [rest['aria-describedby'], resolvedHelperText ? helperId : undefined]
    .filter(Boolean)
    .join(' ') || undefined;
  const wrapperStyle = width !== undefined ? Object.assign({}, style, { width: width }) : style;
  const inputDataId = dataId || rest['data-id'];
  const resolvedClearButtonDataId = clearButtonDataId || (dataId ? dataId + '-clear' : undefined);

  useImperativeHandle(ref, function () {
    return {
      focus: function () {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      inputElement: inputRef.current
    };
  });

  function commitValue(nextValue, shouldNotifyChangeOnFocus) {
    const stringValue = String(nextValue != null ? nextValue : '');

    if (!isControlled) {
      setUncontrolledValue(stringValue);
    }

    if (onValueChange) {
      onValueChange(stringValue);
    }

    if (shouldNotifyChangeOnFocus && changeOnFocus && isFocused) {
      changeOnFocus(stringValue);
    }
  }

  function handleChange(event) {
    commitValue(event.target.value, true);
    if (onChange) {
      onChange(event);
    }
  }

  function handleFocus(event) {
    setIsFocused(true);
    setHasKeyboardFocus(
      keyboardFocusCandidateRef.current && event.currentTarget.matches(':focus-visible')
    );
    if (onFocusChange) {
      onFocusChange(true);
    }
    if (onFocus) {
      onFocus(event);
    }
  }

  function handleBlur(event) {
    setIsFocused(false);
    setHasKeyboardFocus(false);
    if (onFocusChange) {
      onFocusChange(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  }

  function handleClear() {
    commitValue('', true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function keepInputFocusOnMouseDown(event) {
    event.preventDefault();
  }

  return (
    <div
      className={classNames('rshb-legacy-input-text', className)}
      data-disabled={resolvedDisabled ? 'true' : 'false'}
      data-field-id={dataId}
      data-has-helper={resolvedHelperText ? 'true' : 'false'}
      data-has-mask-overlay={resolvedMaskOverlay ? 'true' : 'false'}
      data-has-prefix={resolvedPrefix ? 'true' : 'false'}
      data-has-start-icon={startIcon ? 'true' : 'false'}
      data-hide-control-value={shouldHideControlValue ? 'true' : 'false'}
      data-state={visualState}
      style={wrapperStyle}
    >
      <div className="rshb-legacy-input-text__field">
        {startIcon ? (
          <span aria-hidden="true" className="rshb-legacy-input-text__start-icon">
            {startIcon}
          </span>
        ) : null}
        <div className={classNames('rshb-legacy-input-text__content', contentClassName)}>
          <label className="rshb-legacy-input-text__label" htmlFor={inputId}>
            {resolvedLabel}
          </label>
          {resolvedPrefix ? (
            <span aria-hidden="true" className="rshb-legacy-input-text__prefix">
              {resolvedPrefix}
            </span>
          ) : null}
          <input
            {...rest}
            aria-describedby={describedBy}
            aria-invalid={resolvedInvalid || undefined}
            className={classNames(
              'rshb-legacy-input-text__control',
              inputClassName,
              customInputStyle,
              controlClassName
            )}
            data-id={inputDataId}
            disabled={resolvedDisabled}
            id={inputId}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={function (event) {
              keyboardFocusCandidateRef.current = event.key === 'Tab';
              if (onKeyDown) {
                onKeyDown(event);
              }
            }}
            onPointerDown={function (event) {
              keyboardFocusCandidateRef.current = false;
              if (onPointerDown) {
                onPointerDown(event);
              }
            }}
            readOnly={!isInteractive || resolvedReadOnly}
            ref={inputRef}
            type={type || 'text'}
            value={resolvedValue}
          />
          {resolvedMaskOverlay ? (
            <span aria-hidden="true" className="rshb-legacy-input-text__mask">
              {resolvedMaskOverlay}
            </span>
          ) : null}
        </div>
        {showsClearControl ? (
          <Button
            aria-label="Очистить поле"
            buttonType={Button.buttonTypes.flatSecondary}
            className="rshb-legacy-input-text__clear"
            dataId={resolvedClearButtonDataId}
            iconOnly
            leadingIcon={<InputTextIcon src={xmarkIcon} />}
            onClick={handleClear}
            onMouseDown={keepInputFocusOnMouseDown}
            size="s"
            tabIndex={-1}
            type="button"
          />
        ) : null}
        {resolvedEndAdornment}
      </div>
      {resolvedHelperText ? (
        <div className="rshb-legacy-input-text__helper" id={helperId}>
          <span className="rshb-legacy-input-text__helper-text">{resolvedHelperText}</span>
        </div>
      ) : null}
    </div>
  );
});

InputText.displayName = 'InputText';

InputText.previewStates = INPUT_PREVIEW_STATES.reduce(function (states, state) {
  states[state] = state;
  return states;
}, {});

InputText.propTypes = {
  changeOnFocus: PropTypes.func,
  className: PropTypes.string,
  clearButtonDataId: PropTypes.string,
  clearable: PropTypes.bool,
  contentClassName: PropTypes.string,
  controlClassName: PropTypes.string,
  customInputStyle: PropTypes.string,
  dataId: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  endAdornment: PropTypes.node,
  error: PropTypes.bool,
  helperIcon: PropTypes.node,
  helperText: PropTypes.node,
  hideControlValue: PropTypes.bool,
  id: PropTypes.string,
  inputClassName: PropTypes.string,
  invalid: PropTypes.bool,
  label: PropTypes.node,
  maskOverlay: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onFocusChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onPointerDown: PropTypes.func,
  onValueChange: PropTypes.func,
  prefix: PropTypes.node,
  previewState: PropTypes.oneOf(INPUT_PREVIEW_STATES),
  readOnly: PropTypes.bool,
  showHelperIcon: PropTypes.bool,
  startIcon: PropTypes.node,
  style: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default InputText;
