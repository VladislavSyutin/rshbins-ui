import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

const LOADER_BRAND_LOGO_STEPS = {
  step1: '1',
  step2: '2',
  step3: '3',
  step4: '4',
  step5: '5',
  step6: '6',
  step7: '7',
  step8: '8'
};

const LOADER_BRAND_TEXT_STEPS = {
  step1: '1',
  step2: '2',
  step3: '3',
  step4: '4'
};

const LOGO_STEP_SEQUENCE = [
  LOADER_BRAND_LOGO_STEPS.step1,
  LOADER_BRAND_LOGO_STEPS.step2,
  LOADER_BRAND_LOGO_STEPS.step3,
  LOADER_BRAND_LOGO_STEPS.step4,
  LOADER_BRAND_LOGO_STEPS.step5,
  LOADER_BRAND_LOGO_STEPS.step6,
  LOADER_BRAND_LOGO_STEPS.step7,
  LOADER_BRAND_LOGO_STEPS.step8
];

const TEXT_STEP_SEQUENCE = [
  LOADER_BRAND_TEXT_STEPS.step1,
  LOADER_BRAND_TEXT_STEPS.step2,
  LOADER_BRAND_TEXT_STEPS.step3,
  LOADER_BRAND_TEXT_STEPS.step4
];

const LOGO_IDLE_DELAY_MS = 1;
const LOGO_PAUSE_DELAY_MS = 500;
const LOGO_PAUSE_STEPS = new Set([
  LOADER_BRAND_LOGO_STEPS.step4,
  LOADER_BRAND_LOGO_STEPS.step8
]);
const LOGO_TRANSITION_DURATION_MS = 200;
const TEXT_TRANSITION_DURATION_MS = 300;
const TEXT_STEP_DELAY_MS = 5000;

const TEXT_STEP_LABELS = {
  '1': 'Загружаем',
  '2': 'Скоро всё загрузится',
  '3': 'Ещё чуть-чуть',
  '4': 'Сейчас всё покажем'
};

const LOGO_BAR_HEIGHTS = {
  '1': [80, 64, 64],
  '2': [64, 80, 64],
  '3': [64, 64, 80],
  '4': [64, 64, 64],
  '5': [64, 64, 80],
  '6': [64, 80, 64],
  '7': [80, 64, 64],
  '8': [64, 64, 64]
};

const LOGO_BAR_COLORS = [
  'var(--color-logo-line-1)',
  'var(--color-logo-line-2)',
  'var(--color-logo-line-3)'
];

const LONGEST_TEXT_LABEL = TEXT_STEP_SEQUENCE.reduce(function (longest, step) {
  return TEXT_STEP_LABELS[step].length > longest.length ? TEXT_STEP_LABELS[step] : longest;
}, TEXT_STEP_LABELS[TEXT_STEP_SEQUENCE[0]]);

function getNextLogoStep(step) {
  const currentIndex = LOGO_STEP_SEQUENCE.indexOf(step);

  return LOGO_STEP_SEQUENCE[(currentIndex + 1) % LOGO_STEP_SEQUENCE.length];
}

function getNextTextStep(step) {
  const currentIndex = TEXT_STEP_SEQUENCE.indexOf(step);

  return TEXT_STEP_SEQUENCE[(currentIndex + 1) % TEXT_STEP_SEQUENCE.length];
}

function resolveLogoStep(step) {
  return LOGO_BAR_HEIGHTS[step] ? step : LOADER_BRAND_LOGO_STEPS.step1;
}

function resolveTextStep(step) {
  return TEXT_STEP_LABELS[step] ? step : LOADER_BRAND_TEXT_STEPS.step1;
}

function LoaderBrand(props) {
  const {
    autoPlay = true,
    className,
    dataId,
    logoStep,
    textStep,
    ...rest
  } = props;

  const isLogoControlled = logoStep !== undefined;
  const isTextControlled = textStep !== undefined;
  const [internalLogoStep, setInternalLogoStep] = useState(LOADER_BRAND_LOGO_STEPS.step1);
  const [internalTextStep, setInternalTextStep] = useState(LOADER_BRAND_TEXT_STEPS.step1);
  const resolvedLogoStep = resolveLogoStep(logoStep != null ? logoStep : internalLogoStep);
  const resolvedTextStep = resolveTextStep(textStep != null ? textStep : internalTextStep);
  const [visibleTextStep, setVisibleTextStep] = useState(resolvedTextStep);
  const [exitingTextStep, setExitingTextStep] = useState(null);
  const dataIdValue = dataId || rest['data-id'];

  useEffect(function () {
    if (!autoPlay || isLogoControlled) {
      return undefined;
    }

    const holdDelay = LOGO_PAUSE_STEPS.has(resolvedLogoStep)
      ? LOGO_PAUSE_DELAY_MS
      : LOGO_IDLE_DELAY_MS;
    const timeoutId = window.setTimeout(function () {
      setInternalLogoStep(getNextLogoStep(resolvedLogoStep));
    }, holdDelay + LOGO_TRANSITION_DURATION_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [autoPlay, isLogoControlled, resolvedLogoStep]);

  useEffect(function () {
    if (!autoPlay || isTextControlled) {
      return undefined;
    }

    const timeoutId = window.setTimeout(function () {
      setInternalTextStep(function (currentStep) {
        return getNextTextStep(currentStep);
      });
    }, TEXT_STEP_DELAY_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [autoPlay, isTextControlled, resolvedTextStep]);

  useEffect(function () {
    if (resolvedTextStep === visibleTextStep) {
      return undefined;
    }

    setExitingTextStep(visibleTextStep);
    setVisibleTextStep(resolvedTextStep);

    const timeoutId = window.setTimeout(function () {
      setExitingTextStep(null);
    }, TEXT_TRANSITION_DURATION_MS);

    return function () {
      window.clearTimeout(timeoutId);
    };
  }, [resolvedTextStep, visibleTextStep]);

  const barHeights = LOGO_BAR_HEIGHTS[resolvedLogoStep];
  const barStyles = useMemo(function () {
    return barHeights.map(function (height, index) {
      return {
        '--rshb-legacy-loader-brand-bar-height': height + 'px',
        '--rshb-legacy-loader-brand-bar-color': LOGO_BAR_COLORS[index]
      };
    });
  }, [barHeights]);

  return (
    <div
      {...rest}
      aria-busy={rest['aria-busy'] != null ? rest['aria-busy'] : true}
      className={classNames('rshb-legacy-loader-brand', className)}
      data-id={dataIdValue}
      data-logo-step={resolvedLogoStep}
      data-text-step={resolvedTextStep}
    >
      <div aria-hidden="true" className="rshb-legacy-loader-brand__logo">
        {barStyles.map(function (style, index) {
          return (
            <span
              key={LOGO_BAR_COLORS[index]}
              className="rshb-legacy-loader-brand__bar"
              style={style}
            />
          );
        })}
      </div>

      <span className="rshb-legacy-loader-brand__text" role="status">
        <span aria-hidden="true" className="rshb-legacy-loader-brand__text-sizer">
          {LONGEST_TEXT_LABEL}
        </span>
        {exitingTextStep ? (
          <span
            aria-hidden="true"
            className="rshb-legacy-loader-brand__text-layer"
            data-phase="exiting"
            key={'exit-' + exitingTextStep}
          >
            {TEXT_STEP_LABELS[exitingTextStep]}
          </span>
        ) : null}
        <span
          className="rshb-legacy-loader-brand__text-layer"
          data-phase="entering"
          key={'enter-' + visibleTextStep}
        >
          {TEXT_STEP_LABELS[visibleTextStep]}
        </span>
      </span>
    </div>
  );
}

LoaderBrand.displayName = 'LoaderBrand';

LoaderBrand.logoSteps = LOADER_BRAND_LOGO_STEPS;
LoaderBrand.textSteps = LOADER_BRAND_TEXT_STEPS;

LoaderBrand.propTypes = {
  autoPlay: PropTypes.bool,
  className: PropTypes.string,
  dataId: PropTypes.string,
  logoStep: PropTypes.oneOf(LOGO_STEP_SEQUENCE),
  textStep: PropTypes.oneOf(TEXT_STEP_SEQUENCE)
};

export default LoaderBrand;
