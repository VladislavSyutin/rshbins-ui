import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

function Card(props) {
  const { children, className, dataId, ...rest } = props;
  const dataIdValue = dataId || rest['data-id'];

  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-card', className)}
      data-id={dataIdValue}
    >
      {children}
    </div>
  );
}

Card.displayName = 'Card';

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dataId: PropTypes.string
};

export default Card;
