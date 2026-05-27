import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import Logo from '../logo/index.js';
import Theme from '../theme/index.js';

const HEADER_SIZES = {
  l: 'l',
  m: 'm',
  s: 's',
  xs: 'xs',
  responsive: 'responsive'
};

const HEADER_SIZE_VALUES = [
  HEADER_SIZES.l,
  HEADER_SIZES.m,
  HEADER_SIZES.s,
  HEADER_SIZES.xs,
  HEADER_SIZES.responsive
];

function Header(props) {
  const {
    brandButtonProps,
    brandLabel,
    className,
    dataId,
    size,
    themeProps,
    ...rest
  } = props;

  const resolvedBrandLabel = brandLabel !== undefined ? brandLabel : 'РСХБ Страхование';
  const resolvedSize = size || HEADER_SIZES.responsive;
  const dataIdValue = dataId || rest['data-id'];

  const brandClassName = brandButtonProps && brandButtonProps.className;
  const brandAriaLabel = brandButtonProps && brandButtonProps['aria-label'];
  const brandRestProps = Object.assign({}, brandButtonProps);
  delete brandRestProps.className;
  delete brandRestProps['aria-label'];

  const resolvedThemeProps = Object.assign({ applyToDocument: false }, themeProps, {
    className: classNames('rshb-legacy-header__theme', themeProps && themeProps.className)
  });

  return (
    <header
      {...rest}
      className={classNames('rshb-legacy-header', className)}
      data-id={dataIdValue}
      data-size={resolvedSize}
    >
      <button
        {...brandRestProps}
        aria-label={brandAriaLabel || resolvedBrandLabel}
        className={classNames('rshb-legacy-header__brand', brandClassName)}
        type="button"
      >
        <Logo className="rshb-legacy-header__brand-logo" />
      </button>
      <Theme {...resolvedThemeProps} />
    </header>
  );
}

Header.displayName = 'Header';

Header.sizes = HEADER_SIZES;

Header.propTypes = {
  brandButtonProps: PropTypes.object,
  brandLabel: PropTypes.string,
  className: PropTypes.string,
  dataId: PropTypes.string,
  size: PropTypes.oneOf(HEADER_SIZE_VALUES),
  themeProps: PropTypes.object
};

export default Header;
