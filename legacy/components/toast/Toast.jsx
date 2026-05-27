import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

const TOAST_EXIT_DURATION_FALLBACK = 150;

const TOAST_VARIANTS = {
  danger: 'danger',
  success: 'success'
};

const TOAST_VARIANT_VALUES = [TOAST_VARIANTS.danger, TOAST_VARIANTS.success];

const TOAST_PLACEMENTS = {
  inline: 'inline',
  topCenter: 'top-center'
};

const TOAST_PLACEMENT_VALUES = [TOAST_PLACEMENTS.inline, TOAST_PLACEMENTS.topCenter];

const TOAST_CLOSING_STATE = 'closing';
const TOAST_SHOWN_STATE = 'shown';

function readMotionUpDuration() {
  try {
    var raw = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--motion-move-in-up-duration')
      .trim();
    var ms = parseFloat(raw);

    if (isNaN(ms)) {
      return TOAST_EXIT_DURATION_FALLBACK;
    }

    return raw.slice(-2) === 'ms' ? ms : ms * 1000;
  } catch (_) {
    return TOAST_EXIT_DURATION_FALLBACK;
  }
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 15.125 11.6875" width="14" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M14.7649 0.248285C15.1973 0.618939 15.2474 1.26997 14.8767 1.7024L6.62673 11.3274C6.43979 11.5455 6.17036 11.6757 5.88333 11.6868C5.59629 11.6978 5.31766 11.5886 5.11455 11.3855L0.302046 6.57297C-0.100682 6.17024 -0.100682 5.51729 0.302046 5.11456C0.704774 4.71184 1.35773 4.71184 1.76045 5.11456L5.7855 9.13961L13.3108 0.36014C13.6814 -0.0722897 14.3324 -0.122369 14.7649 0.248285Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function TriangleExclamationIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M7.13413 2.99449L2.21716 11.4995C1.83174 12.1662 2.31284 13 3.0829 13L12.9168 13C13.6869 13 14.168 12.1662 13.7826 11.4995L8.8656 2.99449C8.48057 2.32849 7.51915 2.3285 7.13413 2.99449ZM10.1642 2.24374C9.20163 0.578749 6.7981 0.578747 5.83552 2.24374L0.91856 10.7488C-0.0449811 12.4154 1.15775 14.5 3.0829 14.5L12.9168 14.5C14.842 14.5 16.0447 12.4154 15.0812 10.7488L10.1642 2.24374ZM7.99988 5.00003C8.41409 5.00003 8.74988 5.33582 8.74988 5.75003V7.75003C8.74988 8.16424 8.41409 8.50003 7.99988 8.50003C7.58566 8.50003 7.24988 8.16424 7.24988 7.75003V5.75003C7.24988 5.33582 7.58566 5.00003 7.99988 5.00003ZM8.99988 10.75C8.99988 11.3023 8.55216 11.75 7.99988 11.75C7.44759 11.75 6.99988 11.3023 6.99988 10.75C6.99988 10.1977 7.44759 9.75003 7.99988 9.75003C8.55216 9.75003 8.99988 10.1977 8.99988 10.75Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function XmarkIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M3.46967 3.46967C3.76256 3.17678 4.23744 3.17678 4.53033 3.46967L8 6.93934L11.4697 3.46967C11.7626 3.17678 12.2374 3.17678 12.5303 3.46967C12.8232 3.76256 12.8232 4.23744 12.5303 4.53033L9.06066 8L12.5303 11.4697C12.8232 11.7626 12.8232 12.2374 12.5303 12.5303C12.2374 12.8232 11.7626 12.8232 11.4697 12.5303L8 9.06066L4.53033 12.5303C4.23744 12.8232 3.76256 12.8232 3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L6.93934 8L3.46967 4.53033C3.17678 4.23744 3.17678 3.76256 3.46967 3.46967Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function Toast(props) {
  const {
    autoCloseDuration,
    children,
    className,
    closeLabel,
    closable,
    dataId,
    onClose,
    placement,
    role,
    variant,
    ...rest
  } = props;

  const resolvedAutoCloseDuration = autoCloseDuration !== undefined ? autoCloseDuration : 5000;
  const resolvedChildren = children !== undefined ? children : 'Контент';
  const resolvedCloseLabel = closeLabel !== undefined ? closeLabel : 'Закрыть уведомление';
  const resolvedClosable = closable !== undefined ? closable : true;
  const resolvedPlacement = placement || TOAST_PLACEMENTS.inline;
  const resolvedVariant = variant || TOAST_VARIANTS.danger;
  const resolvedRole = role != null ? role : (resolvedVariant === TOAST_VARIANTS.danger ? 'alert' : 'status');
  const dataIdValue = dataId || rest['data-id'];

  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const activePreviewState = isClosing ? TOAST_CLOSING_STATE : TOAST_SHOWN_STATE;
  const StatusIcon = resolvedVariant === TOAST_VARIANTS.success ? CheckIcon : TriangleExclamationIcon;

  function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function requestClose() {
    if (isClosing || !isVisible) {
      return;
    }

    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(function () {
      closeTimerRef.current = null;
      setIsVisible(false);

      if (onClose) {
        onClose();
      }
    }, readMotionUpDuration());
  }

  useEffect(function () {
    return clearCloseTimer;
  }, []);

  useEffect(function () {
    if (
      resolvedAutoCloseDuration === null ||
      isClosing ||
      !isVisible
    ) {
      return undefined;
    }

    var timerId = window.setTimeout(requestClose, resolvedAutoCloseDuration);

    return function () {
      window.clearTimeout(timerId);
    };
  }, [resolvedAutoCloseDuration, isClosing, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-toast', className)}
      data-id={dataIdValue}
      data-placement={resolvedPlacement}
      data-preview-state={activePreviewState}
      data-variant={resolvedVariant}
      role={resolvedRole}
    >
      <span aria-hidden="true" className="rshb-legacy-toast__status-icon">
        <StatusIcon />
      </span>
      <span className="rshb-legacy-toast__content">{resolvedChildren}</span>
      {resolvedClosable ? (
        <button
          aria-label={resolvedCloseLabel}
          className="rshb-legacy-toast__close"
          onClick={requestClose}
          type="button"
        >
          <span aria-hidden="true" className="rshb-legacy-toast__close-icon">
            <XmarkIcon />
          </span>
        </button>
      ) : null}
    </div>
  );
}

Toast.displayName = 'Toast';

Toast.variants = TOAST_VARIANTS;
Toast.placements = TOAST_PLACEMENTS;

Toast.propTypes = {
  autoCloseDuration: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  closeLabel: PropTypes.string,
  closable: PropTypes.bool,
  dataId: PropTypes.string,
  onClose: PropTypes.func,
  placement: PropTypes.oneOf(TOAST_PLACEMENT_VALUES),
  role: PropTypes.string,
  variant: PropTypes.oneOf(TOAST_VARIANT_VALUES)
};

export default Toast;
