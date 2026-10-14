import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
function DataRow({
  label,
  value,
  emptyValue = 'Не указано',
  dataId,
  className,
  ...rest
}) {
  const empty = value === undefined || value === null || value === '';
  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-data-row', className)}
      data-id={dataId || rest['data-id']}
    >
      <p className="rshb-legacy-data-row__label">{label}</p>
      <p className="rshb-legacy-data-row__value">
        {empty ? emptyValue : value}
      </p>
    </div>
  );
}
DataRow.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node,
  emptyValue: PropTypes.node,
  className: PropTypes.string,
  dataId: PropTypes.string
};
export default DataRow;
