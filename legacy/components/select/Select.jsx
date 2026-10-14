import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
let nextId = 0;

function Select(props) {
  const {
    label,
    options,
    value,
    defaultValue,
    onChange,
    disabled,
    required,
    invalid,
    helperText,
    className,
    dataId,
    id,
    onKeyDown,
    ...rest
  } = props;
  const [controlId] = useState(() => id || 'rshb-select-' + ++nextId);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const activeRef = useRef(null);
  const selectedValue = value !== undefined ? value : internalValue;
  const selectedIndex = options.findIndex(
    (option) => option.value === selectedValue
  );
  const selected = options[selectedIndex];
  const listId = controlId + '-list';
  const enabled = options
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0);

  useEffect(() => {
    if (!isOpen) return undefined;
    function dismiss(event) {
      if (rootRef.current && !rootRef.current.contains(event.target))
        setIsOpen(false);
    }
    document.addEventListener('mousedown', dismiss);
    return () => document.removeEventListener('mousedown', dismiss);
  }, [isOpen]);
  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);
  useEffect(() => {
    if (isOpen && activeRef.current)
      activeRef.current.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  function open(last) {
    if (disabled || !enabled.length) return;
    setActiveIndex(
      enabled.indexOf(selectedIndex) !== -1
        ? selectedIndex
        : enabled[last ? enabled.length - 1 : 0]
    );
    setIsOpen(true);
  }
  function choose(index) {
    const option = options[index];
    if (disabled || !option || option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    if (onChange) onChange(option.value);
    setIsOpen(false);
    if (buttonRef.current) buttonRef.current.focus();
  }
  function handleKeyDown(event) {
    if (onKeyDown) onKeyDown(event);
    if (event.defaultPrevented || disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      setIsKeyboardNavigation(true);
      event.preventDefault();
      if (!isOpen) {
        open(event.key === 'ArrowUp');
        return;
      }
      const position = enabled.indexOf(activeIndex);
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      if (enabled.length)
        setActiveIndex(
          enabled[(position + direction + enabled.length) % enabled.length]
        );
    } else if (event.key === 'Home' || event.key === 'End') {
      setIsKeyboardNavigation(true);
      event.preventDefault();
      open(event.key === 'End');
      setActiveIndex(enabled[event.key === 'End' ? enabled.length - 1 : 0]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      setIsKeyboardNavigation(true);
      event.preventDefault();
      if (isOpen) choose(activeIndex);
      else open(false);
    } else if (event.key === 'Escape') {
      if (isOpen) event.preventDefault();
      setIsOpen(false);
    } else if (event.key === 'Tab') setIsOpen(false);
  }
  return (
    <div
      {...rest}
      ref={rootRef}
      className={classNames('rshb-legacy-select', className)}
      data-open={isOpen ? 'true' : 'false'}
      data-invalid={invalid ? 'true' : 'false'}
      data-keyboard-navigation={isKeyboardNavigation ? 'true' : 'false'}
    >
      <button
        ref={buttonRef}
        id={controlId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-labelledby={controlId + '-label'}
        aria-activedescendant={
          isOpen && options[activeIndex]
            ? listId + '-' + activeIndex
            : undefined
        }
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={helperText ? controlId + '-helper' : undefined}
        className="rshb-legacy-select__control"
        data-id={dataId || rest['data-id']}
        data-filled={selected ? 'true' : 'false'}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={() => {
          setIsKeyboardNavigation(false);
          if (isOpen) setIsOpen(false);
          else open(false);
        }}
        onBlur={(event) => {
          if (!rootRef.current.contains(event.relatedTarget)) setIsOpen(false);
        }}
      >
        <span className="rshb-legacy-select__content">
          <span id={controlId + '-label'} className="rshb-legacy-select__label">
            {label}
          </span>
          <span className="rshb-legacy-select__value">
            {selected ? selected.label : '\u00a0'}
          </span>
        </span>
        <span aria-hidden="true" className="rshb-legacy-select__arrow">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M5 7L9 11L13 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {isOpen ? (
        <div
          id={listId}
          role="listbox"
          aria-labelledby={controlId + '-label'}
          className="rshb-legacy-select__dropdown"
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={listId + '-' + index}
              ref={index === activeIndex ? activeRef : undefined}
              role="option"
              aria-selected={option.value === selectedValue}
              aria-disabled={option.disabled || undefined}
              data-selected={option.value === selectedValue ? 'true' : 'false'}
              data-active={index === activeIndex ? 'true' : 'false'}
              className="rshb-legacy-select__item"
              onMouseDown={(event) => event.preventDefault()}
              onMouseMove={() => {
                setIsKeyboardNavigation(false);
                if (!option.disabled) setActiveIndex(index);
              }}
              onClick={() => choose(index)}
            >
              <span className="rshb-legacy-select__text">{option.label}</span>
            </div>
          ))}
        </div>
      ) : null}
      {helperText ? (
        <p id={controlId + '-helper'} className="rshb-legacy-select__helper">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
Select.propTypes = {
  label: PropTypes.node.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      disabled: PropTypes.bool
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  invalid: PropTypes.bool,
  helperText: PropTypes.node,
  className: PropTypes.string,
  dataId: PropTypes.string,
  id: PropTypes.string,
  onKeyDown: PropTypes.func
};
export default Select;
