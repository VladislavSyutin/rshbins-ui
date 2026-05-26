import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import spinnerIcon from '../../../icons/spinner.svg';

const SPIN_SIZES = {
  twoExtraSmall: '2xs',
  extraSmall: 'xs',
  small: 's',
  medium: 'm',
  large: 'l',
  extraLarge: 'xl'
};

const SPIN_SIZE_VALUES = [
  SPIN_SIZES.twoExtraSmall,
  SPIN_SIZES.extraSmall,
  SPIN_SIZES.small,
  SPIN_SIZES.medium,
  SPIN_SIZES.large,
  SPIN_SIZES.extraLarge
];

const SPIN_SIZE_MAP = {
  '2xs': 16,
  xs: 18,
  s: 24,
  m: 28,
  l: 32,
  xl: 38
};

function Spin(props) {
  const { className, dataId, label, size, style, ...rest } = props;
  const requestedSize = size || SPIN_SIZES.twoExtraSmall;
  const resolvedSize = SPIN_SIZE_MAP[requestedSize]
    ? requestedSize
    : SPIN_SIZES.twoExtraSmall;
  const dataIdValue = dataId || rest['data-id'];
  const resolvedStyle = Object.assign({}, style, {
    '--rshb-legacy-spin-icon': 'url("' + spinnerIcon + '")',
    '--rshb-legacy-spin-size': SPIN_SIZE_MAP[resolvedSize] + 'px'
  });

  return (
    <span
      {...rest}
      aria-hidden={label ? undefined : rest['aria-hidden'] != null ? rest['aria-hidden'] : true}
      aria-label={label}
      aria-live={label ? 'polite' : undefined}
      className={classNames('rshb-legacy-spin', className)}
      data-id={dataIdValue}
      data-size={resolvedSize}
      role={label ? 'status' : undefined}
      style={resolvedStyle}
    >
      <span aria-hidden="true" className="rshb-legacy-spin__inner">
        <span aria-hidden="true" className="rshb-legacy-spin__icon" />
      </span>
    </span>
  );
}

Spin.displayName = 'Spin';

Spin.sizes = SPIN_SIZES;

Spin.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.oneOf(SPIN_SIZE_VALUES),
  style: PropTypes.object
};

export default Spin;
