import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

const DIVIDER_VIEWS = {
  text: 'text',
  withoutText: 'without-text'
};

const DIVIDER_VIEW_VALUES = [
  DIVIDER_VIEWS.text,
  DIVIDER_VIEWS.withoutText
];

function Divider(props) {
  const { className, dataId, label, view, ...rest } = props;

  const resolvedLabel = label !== undefined ? label : 'или';
  const resolvedView = DIVIDER_VIEW_VALUES.indexOf(view) === -1
    ? DIVIDER_VIEWS.text
    : view;
  const dataIdValue = dataId || rest['data-id'];
  const showsLabel = resolvedView === DIVIDER_VIEWS.text;

  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-divider', className)}
      data-id={dataIdValue}
      data-view={resolvedView}
    >
      <span aria-hidden="true" className="rshb-legacy-divider__line" />
      {showsLabel ? <span className="rshb-legacy-divider__label">{resolvedLabel}</span> : null}
      <span aria-hidden="true" className="rshb-legacy-divider__line" />
    </div>
  );
}

Divider.displayName = 'Divider';

Divider.views = DIVIDER_VIEWS;

Divider.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  label: PropTypes.node,
  view: PropTypes.oneOf(DIVIDER_VIEW_VALUES)
};

export default Divider;
