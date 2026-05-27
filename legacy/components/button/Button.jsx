import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import Spin from '../spin/index.js';

const BUTTON_TYPES = {
  primary: 'primary',
  secondary: 'secondary',
  flatPrimary: 'flat-primary',
  flatSecondary: 'flat-secondary'
};

const BUTTON_TYPE_VALUES = [
  BUTTON_TYPES.primary,
  BUTTON_TYPES.secondary,
  BUTTON_TYPES.flatPrimary,
  BUTTON_TYPES.flatSecondary
];

const NATIVE_BUTTON_TYPES = ['button', 'submit', 'reset'];

const BUTTON_VARIANTS = {
  brand: 'brand',
  normal: 'normal',
  flatPrimary: 'flat-primary',
  flatSecondary: 'flat-secondary'
};

const BUTTON_SIZES = {
  medium: 'm',
  small: 's'
};

const BUTTON_SIZE_VALUES = [BUTTON_SIZES.medium, BUTTON_SIZES.small];

function normalizeButtonType(buttonType) {
  switch (buttonType) {
    case BUTTON_TYPES.primary:
    case BUTTON_TYPES.secondary:
    case BUTTON_TYPES.flatPrimary:
    case BUTTON_TYPES.flatSecondary:
      return buttonType;
    default:
      return undefined;
  }
}

function normalizeNativeButtonType(type) {
  return NATIVE_BUTTON_TYPES.indexOf(type) === -1 ? undefined : type;
}

function resolveVisualType(buttonType, type) {
  return normalizeButtonType(buttonType) || normalizeButtonType(type);
}

function resolveVariant(buttonType, type, variant) {
  const requestedType = resolveVisualType(buttonType, type) || variant;

  switch (requestedType) {
    case BUTTON_TYPES.primary:
    case BUTTON_VARIANTS.brand:
      return BUTTON_VARIANTS.brand;
    case BUTTON_TYPES.secondary:
    case BUTTON_VARIANTS.normal:
      return BUTTON_VARIANTS.normal;
    case BUTTON_TYPES.flatPrimary:
    case BUTTON_VARIANTS.flatPrimary:
      return BUTTON_VARIANTS.flatPrimary;
    case BUTTON_TYPES.flatSecondary:
    case BUTTON_VARIANTS.flatSecondary:
      return BUTTON_VARIANTS.flatSecondary;
    default:
      return BUTTON_VARIANTS.brand;
  }
}

function resolveButtonType(buttonType, type, variant) {
  const normalizedButtonType = resolveVisualType(buttonType, type);

  if (normalizedButtonType) {
    return normalizedButtonType;
  }

  switch (variant) {
    case BUTTON_VARIANTS.normal:
      return BUTTON_TYPES.secondary;
    case BUTTON_VARIANTS.flatPrimary:
      return BUTTON_TYPES.flatPrimary;
    case BUTTON_VARIANTS.flatSecondary:
      return BUTTON_TYPES.flatSecondary;
    case BUTTON_VARIANTS.brand:
    default:
      return BUTTON_TYPES.primary;
  }
}

function resolveState(_ref) {
  const disabled = _ref.disabled;
  const loading = _ref.loading;
  const selected = _ref.selected;

  if (loading) {
    return 'loading';
  }

  if (disabled) {
    return 'disabled';
  }

  if (selected) {
    return 'selection';
  }

  return 'default';
}

function Button(props) {
  const {
    buttonType,
    children,
    className,
    dataId,
    disabled,
    iconOnly,
    leadingIcon,
    loading,
    name,
    selected,
    size,
    trailingIcon,
    type,
    variant
  } = props;

  const buttonProps = Object.assign({}, props);
  delete buttonProps.buttonType;
  delete buttonProps.children;
  delete buttonProps.className;
  delete buttonProps.dataId;
  delete buttonProps.disabled;
  delete buttonProps.iconOnly;
  delete buttonProps.leadingIcon;
  delete buttonProps.loading;
  delete buttonProps.selected;
  delete buttonProps.size;
  delete buttonProps.trailingIcon;
  delete buttonProps.variant;

  const resolvedState = resolveState({
    disabled: Boolean(disabled),
    loading: Boolean(loading),
    selected: Boolean(selected)
  });
  const resolvedButtonType = resolveButtonType(buttonType, type, variant);
  const resolvedSize = size || BUTTON_SIZES.medium;
  const resolvedType = normalizeNativeButtonType(type) || 'button';
  const resolvedVariant = resolveVariant(buttonType, type, variant);
  const isIconOnly = Boolean(iconOnly);
  const iconOnlyIcon = leadingIcon || trailingIcon;
  const isDisabledLike = resolvedState === 'disabled' || resolvedState === 'loading';
  const label = children != null ? children : name;
  const implicitAriaLabel = typeof label === 'string' ? label : undefined;
  const ariaLabel = buttonProps['aria-label'] || (isIconOnly ? implicitAriaLabel : undefined);
  const dataIdValue = dataId || buttonProps['data-id'];

  return (
    <button
      {...buttonProps}
      aria-busy={resolvedState === 'loading' ? true : undefined}
      aria-label={ariaLabel}
      className={classNames(
        'rshb-legacy-button',
        resolvedState === 'loading' && 'rshb-legacy-button--loading',
        className
      )}
      data-button-type={resolvedButtonType}
      data-icon-only={isIconOnly ? 'true' : 'false'}
      data-id={dataIdValue}
      data-size={resolvedSize}
      data-state={resolvedState}
      data-variant={resolvedVariant}
      disabled={isDisabledLike}
      name={name}
      type={resolvedType}
    >
      <span
        className={classNames(
          'rshb-legacy-button__content',
          resolvedState === 'loading' && 'rshb-legacy-button__content--ghost'
        )}
      >
        {isIconOnly ? (
          iconOnlyIcon ? (
            <span aria-hidden="true" className="rshb-legacy-button__icon">
              {iconOnlyIcon}
            </span>
          ) : null
        ) : (
          <>
            {leadingIcon ? (
              <span aria-hidden="true" className="rshb-legacy-button__icon">
                {leadingIcon}
              </span>
            ) : null}
            <span className="rshb-legacy-button__label">{label}</span>
            {trailingIcon ? (
              <span aria-hidden="true" className="rshb-legacy-button__icon">
                {trailingIcon}
              </span>
            ) : null}
          </>
        )}
      </span>

      {resolvedState === 'loading' ? (
        <span aria-hidden="true" className="rshb-legacy-button__spinner">
          <Spin size={resolvedSize === BUTTON_SIZES.medium ? 's' : 'xs'} />
        </span>
      ) : null}
    </button>
  );
}

Button.displayName = 'Button';

Button.buttonTypes = BUTTON_TYPES;
Button.sizes = BUTTON_SIZES;

Button.propTypes = {
  buttonType: PropTypes.oneOf(BUTTON_TYPE_VALUES),
  children: PropTypes.node,
  className: PropTypes.string,
  dataId: PropTypes.string,
  disabled: PropTypes.bool,
  iconOnly: PropTypes.bool,
  leadingIcon: PropTypes.node,
  loading: PropTypes.bool,
  name: PropTypes.string,
  selected: PropTypes.bool,
  size: PropTypes.oneOf(BUTTON_SIZE_VALUES),
  trailingIcon: PropTypes.node,
  type: PropTypes.oneOf(NATIVE_BUTTON_TYPES.concat(BUTTON_TYPE_VALUES))
};

export default Button;
