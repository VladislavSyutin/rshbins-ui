import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import Button from '../button/index.js';
import TextLink from '../text-link/index.js';

const COOKIES_EXIT_DURATION_FALLBACK = 150;

function readMotionDownDuration() {
  try {
    var raw = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--motion-move-in-down-duration')
      .trim();
    var ms = parseFloat(raw);
    if (isNaN(ms)) return COOKIES_EXIT_DURATION_FALLBACK;
    return raw.slice(-2) === 'ms' ? ms : ms * 1000;
  } catch (_) {
    return COOKIES_EXIT_DURATION_FALLBACK;
  }
}

const COOKIES_SIZES = {
  s: 's',
  xs: 'xs'
};

const COOKIES_SIZE_VALUES = [COOKIES_SIZES.s, COOKIES_SIZES.xs];

const COOKIES_PLACEMENTS = {
  inline: 'inline',
  bottomCenter: 'bottom-center'
};

const COOKIES_PLACEMENT_VALUES = [COOKIES_PLACEMENTS.inline, COOKIES_PLACEMENTS.bottomCenter];
const DEFAULT_POLICY_HREF = 'https://rshbins.ru/about/documentation/Politika_obrabotki_PDN.pdf';

function getDefaultDescription() {
  return (
    <>
      Продолжая использование сайта, вы соглашаетесь на обработку файлов cookie и иных персональных данных с помощью сервиса Яндекс Метрика в соответствии с{' '}
      <TextLink
        href={DEFAULT_POLICY_HREF}
        rel="noreferrer noopener"
        size="s"
        target="_blank"
      >
        Политикой АО СК «РСХБ-Страхование»
      </TextLink>
      .
    </>
  );
}

function Cookies(props) {
  const {
    className,
    closeOnPrimaryAction,
    dataId,
    description,
    heading,
    onClose,
    onPrimaryAction,
    onSecondaryAction,
    placement,
    primaryActionLabel,
    secondaryActionLabel,
    size,
    ...rest
  } = props;

  const resolvedCloseOnPrimaryAction = closeOnPrimaryAction !== undefined ? closeOnPrimaryAction : true;
  const resolvedDescription = description !== undefined ? description : getDefaultDescription();
  const resolvedHeading = heading !== undefined ? heading : null;
  const resolvedPlacement = placement || COOKIES_PLACEMENTS.inline;
  const resolvedPrimaryActionLabel = primaryActionLabel !== undefined ? primaryActionLabel : 'Понятно';
  const resolvedSecondaryActionLabel = secondaryActionLabel !== undefined ? secondaryActionLabel : null;
  const resolvedSize = size || COOKIES_SIZES.s;

  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  const activePreviewState = isClosing ? 'closing' : 'shown';
  const dataIdValue = dataId || rest['data-id'];

  function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return;
    }
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function requestClose() {
    if (!onClose || isClosing) {
      return;
    }
    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(function () {
      closeTimerRef.current = null;
      onClose();
    }, readMotionDownDuration());
  }

  function handlePrimaryAction() {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
    if (resolvedCloseOnPrimaryAction) {
      requestClose();
    }
  }

  useEffect(function () {
    return clearCloseTimer;
  }, []);

  const hasActions = resolvedPrimaryActionLabel || resolvedSecondaryActionLabel;

  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-cookies', className)}
      data-id={dataIdValue}
      data-placement={resolvedPlacement}
      data-preview-state={activePreviewState}
      data-size={resolvedSize}
    >
      <div className="rshb-legacy-cookies__content">
        {resolvedHeading ? <p className="rshb-legacy-cookies__title">{resolvedHeading}</p> : null}
        <p className="rshb-legacy-cookies__description">{resolvedDescription}</p>
      </div>
      {hasActions ? (
        <div className="rshb-legacy-cookies__actions">
          {resolvedPrimaryActionLabel ? (
            <Button onClick={handlePrimaryAction} size="s" variant="brand">
              {resolvedPrimaryActionLabel}
            </Button>
          ) : null}
          {resolvedSecondaryActionLabel ? (
            <Button onClick={onSecondaryAction} size="s" variant="normal">
              {resolvedSecondaryActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

Cookies.displayName = 'Cookies';

Cookies.sizes = COOKIES_SIZES;
Cookies.placements = COOKIES_PLACEMENTS;

Cookies.propTypes = {
  className: PropTypes.string,
  closeOnPrimaryAction: PropTypes.bool,
  dataId: PropTypes.string,
  description: PropTypes.node,
  heading: PropTypes.node,
  onClose: PropTypes.func,
  onPrimaryAction: PropTypes.func,
  onSecondaryAction: PropTypes.func,
  placement: PropTypes.oneOf(COOKIES_PLACEMENT_VALUES),
  primaryActionLabel: PropTypes.string,
  secondaryActionLabel: PropTypes.string,
  size: PropTypes.oneOf(COOKIES_SIZE_VALUES)
};

export default Cookies;
