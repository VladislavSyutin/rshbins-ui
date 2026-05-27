import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import Button from '../button/index.js';
import InputText from '../input-text/index.js';
import arrowRotateLeftIcon from '../../../icons/arrow-rotate-left.svg';
import volumeRegularIcon from '../../../icons/volume-regular.svg';

let idCounter = 0;

const MODAL_EXIT_DURATION_FALLBACK = 150;

const MODAL_VARIANTS = {
  default: 'default',
  captcha: 'captcha',
  textInput: 'text-input'
};

const MODAL_VARIANT_VALUES = [
  MODAL_VARIANTS.default,
  MODAL_VARIANTS.captcha,
  MODAL_VARIANTS.textInput
];

const MODAL_PLACEMENTS = {
  inline: 'inline',
  topCenter: 'top-center'
};

const MODAL_PLACEMENT_VALUES = [
  MODAL_PLACEMENTS.inline,
  MODAL_PLACEMENTS.topCenter
];

const MODAL_PREVIEW_STATES = {
  shown: 'shown',
  closing: 'closing'
};

const MODAL_PREVIEW_STATE_VALUES = [
  MODAL_PREVIEW_STATES.shown,
  MODAL_PREVIEW_STATES.closing
];

function generateId() {
  idCounter += 1;
  return 'rshb-legacy-modal-' + idCounter;
}

function readMotionUpDuration() {
  try {
    const raw = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--motion-move-in-up-duration')
      .trim();
    const duration = parseFloat(raw);

    if (Number.isNaN(duration)) {
      return MODAL_EXIT_DURATION_FALLBACK;
    }

    return raw.slice(-2) === 'ms' ? duration : duration * 1000;
  } catch (_) {
    return MODAL_EXIT_DURATION_FALLBACK;
  }
}

function ModalIcon(props) {
  const src = props.src;

  return (
    <span
      aria-hidden="true"
      className="rshb-legacy-modal__icon"
      style={{ '--rshb-legacy-modal-icon': 'url("' + src + '")' }}
    />
  );
}

ModalIcon.propTypes = {
  src: PropTypes.string.isRequired
};

function Modal(props) {
  const {
    actions,
    captchaLabel,
    children,
    className,
    closeOnPrimaryAction,
    closeOnTertiaryAction,
    dataId,
    description,
    heading,
    inputPlaceholder,
    inputProps,
    onClose,
    onPrimaryAction,
    onRefreshCaptcha,
    onSecondaryAction,
    onTertiaryAction,
    onVoiceCaptcha,
    placement,
    previewState,
    primaryActionLabel,
    role,
    secondaryActionLabel,
    tertiaryActionLabel,
    variant,
    ...rest
  } = props;

  const resolvedCloseOnPrimaryAction =
    closeOnPrimaryAction !== undefined ? closeOnPrimaryAction : true;
  const resolvedCloseOnTertiaryAction =
    closeOnTertiaryAction !== undefined ? closeOnTertiaryAction : true;
  const resolvedDescription =
    description !== undefined
      ? description
      : 'Что-то пошло не так. Пожалуйста, повторите попытку позже.';
  const resolvedHeading = heading !== undefined ? heading : 'Ошибка';
  const resolvedInputPlaceholder =
    inputPlaceholder !== undefined ? inputPlaceholder : 'Название';
  const resolvedPlacement = placement || MODAL_PLACEMENTS.inline;
  const resolvedPreviewState = previewState || MODAL_PREVIEW_STATES.shown;
  const resolvedVariant = variant || MODAL_VARIANTS.default;
  const dataIdValue = dataId || rest['data-id'];

  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const [headingId] = useState(function () {
    return generateId() + '-heading';
  });
  const [descriptionId] = useState(function () {
    return generateId() + '-description';
  });

  const activePreviewState = isClosing
    ? MODAL_PREVIEW_STATES.closing
    : resolvedPreviewState;
  const resolvedPrimaryActionLabel =
    primaryActionLabel !== undefined
      ? primaryActionLabel
      : (resolvedVariant === MODAL_VARIANTS.default ? 'Закрыть' : 'Продолжить');
  const resolvedTertiaryActionLabel =
    tertiaryActionLabel !== undefined
      ? tertiaryActionLabel
      : (resolvedVariant === MODAL_VARIANTS.default ? null : 'Закрыть');

  const shouldRenderInput =
    resolvedVariant === MODAL_VARIANTS.captcha ||
    resolvedVariant === MODAL_VARIANTS.textInput;
  const shouldRenderCaptcha = resolvedVariant === MODAL_VARIANTS.captcha;

  const inputClassName = inputProps && inputProps.className;
  const resolvedInputProps = Object.assign({}, inputProps, {
    className: classNames('rshb-legacy-modal__field', inputClassName),
    label: resolvedInputPlaceholder
  });

  function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function requestClose() {
    if (
      !onClose ||
      isClosing ||
      resolvedPreviewState === MODAL_PREVIEW_STATES.closing
    ) {
      return;
    }

    setIsClosing(true);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(function () {
      closeTimerRef.current = null;
      onClose();
    }, readMotionUpDuration());
  }

  function handlePrimaryAction() {
    if (onPrimaryAction) {
      onPrimaryAction();
    }

    if (resolvedCloseOnPrimaryAction) {
      requestClose();
    }
  }

  function handleTertiaryAction() {
    if (onTertiaryAction) {
      onTertiaryAction();
    }

    if (resolvedCloseOnTertiaryAction) {
      requestClose();
    }
  }

  useEffect(function () {
    return clearCloseTimer;
  }, []);

  const resolvedActions =
    typeof actions === 'function' ? actions({ requestClose: requestClose }) : actions;

  const modalContent = (
    <div
      {...rest}
      aria-describedby={resolvedDescription ? descriptionId : undefined}
      aria-labelledby={resolvedHeading ? headingId : undefined}
      aria-modal={resolvedPlacement === MODAL_PLACEMENTS.topCenter ? 'true' : undefined}
      className={classNames('rshb-legacy-modal', className)}
      data-id={dataIdValue}
      data-placement={resolvedPlacement}
      data-preview-state={activePreviewState}
      data-variant={resolvedVariant}
      role={role != null ? role : 'dialog'}
    >
      <div className="rshb-legacy-modal__copy">
        {resolvedHeading ? (
          <p className="rshb-legacy-modal__title" id={headingId}>
            {resolvedHeading}
          </p>
        ) : null}
        {resolvedDescription ? (
          <p className="rshb-legacy-modal__description" id={descriptionId}>
            {resolvedDescription}
          </p>
        ) : null}
      </div>

      {children != null ? (
        children
      ) : (
        <>
          {shouldRenderCaptcha ? (
            <div className="rshb-legacy-modal__captcha">
              <div aria-hidden="true" className="rshb-legacy-modal__captcha-symbols">
                {captchaLabel ? (
                  <span className="rshb-legacy-modal__captcha-text">{captchaLabel}</span>
                ) : null}
              </div>
              <Button
                aria-label="Обновить капчу"
                buttonType={Button.buttonTypes.flatPrimary}
                className="rshb-legacy-modal__icon-action"
                iconOnly
                leadingIcon={<ModalIcon src={arrowRotateLeftIcon} />}
                onClick={onRefreshCaptcha}
                type="button"
              />
              <Button
                aria-label="Озвучить капчу"
                buttonType={Button.buttonTypes.flatPrimary}
                className="rshb-legacy-modal__icon-action"
                iconOnly
                leadingIcon={<ModalIcon src={volumeRegularIcon} />}
                onClick={onVoiceCaptcha}
                type="button"
              />
            </div>
          ) : null}

          {shouldRenderInput ? <InputText {...resolvedInputProps} /> : null}
        </>
      )}

      {resolvedActions != null ? (
        resolvedActions
      ) : (
        <div className="rshb-legacy-modal__actions">
          {resolvedPrimaryActionLabel ? (
            <Button
              buttonType={Button.buttonTypes.primary}
              className="rshb-legacy-modal__action-button"
              onClick={handlePrimaryAction}
              type="button"
            >
              {resolvedPrimaryActionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel ? (
            <Button
              buttonType={Button.buttonTypes.secondary}
              className="rshb-legacy-modal__action-button"
              onClick={onSecondaryAction}
              type="button"
            >
              {secondaryActionLabel}
            </Button>
          ) : null}
          {resolvedTertiaryActionLabel ? (
            <Button
              buttonType={Button.buttonTypes.flatPrimary}
              className="rshb-legacy-modal__action-button"
              onClick={handleTertiaryAction}
              type="button"
            >
              {resolvedTertiaryActionLabel}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );

  if (resolvedPlacement === MODAL_PLACEMENTS.topCenter) {
    return (
      <div className="rshb-legacy-modal-layer" data-preview-state={activePreviewState}>
        {modalContent}
      </div>
    );
  }

  return modalContent;
}

Modal.displayName = 'Modal';

Modal.variants = MODAL_VARIANTS;
Modal.placements = MODAL_PLACEMENTS;
Modal.previewStates = MODAL_PREVIEW_STATES;

Modal.propTypes = {
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  captchaLabel: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  closeOnPrimaryAction: PropTypes.bool,
  closeOnTertiaryAction: PropTypes.bool,
  dataId: PropTypes.string,
  description: PropTypes.node,
  heading: PropTypes.node,
  inputPlaceholder: PropTypes.string,
  inputProps: PropTypes.object,
  onClose: PropTypes.func,
  onPrimaryAction: PropTypes.func,
  onRefreshCaptcha: PropTypes.func,
  onSecondaryAction: PropTypes.func,
  onTertiaryAction: PropTypes.func,
  onVoiceCaptcha: PropTypes.func,
  placement: PropTypes.oneOf(MODAL_PLACEMENT_VALUES),
  previewState: PropTypes.oneOf(MODAL_PREVIEW_STATE_VALUES),
  primaryActionLabel: PropTypes.string,
  role: PropTypes.string,
  secondaryActionLabel: PropTypes.string,
  tertiaryActionLabel: PropTypes.string,
  variant: PropTypes.oneOf(MODAL_VARIANT_VALUES)
};

export default Modal;
