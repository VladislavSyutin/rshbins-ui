import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

const TEXT_LINK_SIZES = {
  m: 'm',
  s: 's'
};

const TEXT_LINK_SIZE_VALUES = [TEXT_LINK_SIZES.m, TEXT_LINK_SIZES.s];
const TEXT_LINK_ELEMENTS = {
  anchor: 'a',
  button: 'button'
};
const TEXT_LINK_ELEMENT_VALUES = [TEXT_LINK_ELEMENTS.anchor, TEXT_LINK_ELEMENTS.button];

function TextLink(props) {
  const {
    as,
    children,
    className,
    dataId,
    href,
    size,
    type,
    ...rest
  } = props;

  const resolvedAs = as || (href ? TEXT_LINK_ELEMENTS.anchor : TEXT_LINK_ELEMENTS.button);
  const resolvedSize = size || TEXT_LINK_SIZES.s;
  const dataIdValue = dataId || rest['data-id'];

  if (resolvedAs === TEXT_LINK_ELEMENTS.button) {
    return (
      <button
        {...rest}
        className={classNames('rshb-legacy-text-link', className)}
        data-id={dataIdValue}
        data-size={resolvedSize}
        type={type || 'button'}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      {...rest}
      className={classNames('rshb-legacy-text-link', className)}
      data-id={dataIdValue}
      data-size={resolvedSize}
      href={href}
    >
      {children}
    </a>
  );
}

TextLink.displayName = 'TextLink';

TextLink.sizes = TEXT_LINK_SIZES;
TextLink.elements = TEXT_LINK_ELEMENTS;

TextLink.propTypes = {
  as: PropTypes.oneOf(TEXT_LINK_ELEMENT_VALUES),
  children: PropTypes.node,
  className: PropTypes.string,
  dataId: PropTypes.string,
  href: PropTypes.string,
  size: PropTypes.oneOf(TEXT_LINK_SIZE_VALUES),
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default TextLink;
