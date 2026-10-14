import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import Card from '../card/index.js';
function Item({ label, value }) {
  return (
    <div className="rshb-legacy-policy-summary__item">
      <p className="rshb-legacy-policy-summary__label">{label}</p>
      <p className="rshb-legacy-policy-summary__value">{value}</p>
    </div>
  );
}
Item.propTypes = { label: PropTypes.node, value: PropTypes.node };
function Money({ value }) {
  return (
    <>
      {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(
        value
      )}{' '}
      <span className="rshb-legacy-policy-summary__currency">₽</span>
    </>
  );
}
Money.propTypes = { value: PropTypes.number.isRequired };
function PolicySummary({
  title,
  tariff,
  term,
  sum,
  premium,
  oldPremium,
  className,
  dataId,
  ...rest
}) {
  return (
    <Card
      {...rest}
      className={classNames('rshb-legacy-policy-summary', className)}
      dataId={dataId}
    >
      <Item label="Название полиса" value={title} />
      <Item label="Тариф" value={tariff} />
      <Item label="Срок страхования" value={term} />
      <Item label="Страховая сумма" value={sum} />
      <div className="rshb-legacy-policy-summary__item">
        <p className="rshb-legacy-policy-summary__label">Страховая премия</p>
        <div className="rshb-legacy-policy-summary__price-row">
          <span className="rshb-legacy-policy-summary__price">
            <Money value={premium} />
          </span>
          {oldPremium != null ? (
            <span className="rshb-legacy-policy-summary__old-price">
              <Money value={oldPremium} />
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
PolicySummary.propTypes = {
  title: PropTypes.node.isRequired,
  tariff: PropTypes.node.isRequired,
  term: PropTypes.node.isRequired,
  sum: PropTypes.node.isRequired,
  premium: PropTypes.number.isRequired,
  oldPremium: PropTypes.number,
  className: PropTypes.string,
  dataId: PropTypes.string
};
export default PolicySummary;
