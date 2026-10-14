import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import Card from '../card/index.js';
import Button from '../button/index.js';
function ProductCard(props) {
  const {
    title,
    accent,
    text,
    bullets,
    imageSrc,
    imageAlt = '',
    onCalculate,
    onDetails,
    calculateLabel = 'Рассчитать стоимость',
    detailsLabel = 'Подробнее',
    dataId,
    className,
    ...rest
  } = props;
  const prefix = dataId || 'product-card';

  function handleCalculate() {
    if (onCalculate) onCalculate();
  }

  return (
    <Card
      {...rest}
      className={classNames('rshb-legacy-product-card', className)}
      dataId={dataId}
    >
      <div className="rshb-legacy-product-card__card-content">
        <div className="rshb-legacy-product-card__card-copy">
          <h2 className="rshb-legacy-product-card__card-title">{title}</h2>
          {accent != null ? (
            <p className="rshb-legacy-product-card__card-accent">{accent}</p>
          ) : null}
          {bullets ? (
            <ul className="rshb-legacy-product-card__card-list">
              {bullets.map(function (item, index) {
                return <li key={index}>{item}</li>;
              })}
            </ul>
          ) : text != null ? (
            <p className="rshb-legacy-product-card__card-text">{text}</p>
          ) : null}
        </div>
        <div className="rshb-legacy-product-card__actions">
          <Button
            className="rshb-legacy-product-card__button"
            dataId={prefix + '-calculate'}
            onClick={handleCalculate}
          >
            {calculateLabel}
          </Button>
          <Button
            buttonType="secondary"
            className="rshb-legacy-product-card__button"
            dataId={prefix + '-details'}
            onClick={onDetails}
          >
            {detailsLabel}
          </Button>
        </div>
      </div>
      <div className="rshb-legacy-product-card__image-wrap">
        <img
          alt={imageAlt}
          className="rshb-legacy-product-card__image"
          src={imageSrc}
        />
      </div>
    </Card>
  );
}

ProductCard.propTypes = {
  title: PropTypes.node.isRequired,
  accent: PropTypes.node,
  text: PropTypes.node,
  bullets: PropTypes.arrayOf(PropTypes.node),
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string,
  onCalculate: PropTypes.func,
  onDetails: PropTypes.func,
  calculateLabel: PropTypes.node,
  detailsLabel: PropTypes.node,
  dataId: PropTypes.string,
  className: PropTypes.string
};
export default ProductCard;
