import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

var CODE_INPUT_LENGTH = 4;
var idCounter = 0;

function generateDescriptionId() {
  idCounter += 1;
  return 'rshb-legacy-input-code-item-' + idCounter + '-description';
}

function createEmptyDigits() {
  return Array.from({ length: CODE_INPUT_LENGTH }, function () {
    return '';
  });
}

function getPreviewSnapshot(previewState) {
  if (previewState === 'typing') {
    return { digits: ['0', '', '', ''], activeIndex: 1, isLoading: false, showError: false };
  }

  if (previewState === 'loading') {
    return { digits: ['0', '0', '0', '0'], activeIndex: null, isLoading: true, showError: false };
  }

  if (previewState === 'error') {
    return { digits: createEmptyDigits(), activeIndex: 0, isLoading: false, showError: true };
  }

  return { digits: createEmptyDigits(), activeIndex: 0, isLoading: false, showError: false };
}

function resolveCellVisualState(params) {
  if (params.isLoading) {
    return 'loading';
  }

  if (params.activeIndex === params.index) {
    return 'focused';
  }

  return 'default';
}

function DefaultErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      className="rshb-legacy-input-code-item__default-icon"
      focusable="false"
      viewBox="0 0 16 16"
    >
      <path
        clipRule="evenodd"
        d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94771 7.44772 9.5 8 9.5C8.55228 9.5 9 9.94771 9 10.5ZM8.75 5C8.75 4.58579 8.41421 4.25 8 4.25C7.58579 4.25 7.25 4.58579 7.25 5V7.5C7.25 7.91421 7.58579 8.25 8 8.25C8.41421 8.25 8.75 7.91421 8.75 7.5V5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function InputCodeItem(props) {
  const {
    autoFocus,
    className,
    completionBehavior,
    complementaryIcon,
    complementaryText,
    dataId,
    loadingDuration,
    onComplete,
    onValueChange,
    previewState,
    showComplementaryIcon,
    showComplementaryText,
    ...rest
  } = props;

  const resolvedAutoFocus = autoFocus !== undefined ? autoFocus : true;
  const resolvedCompletionBehavior = completionBehavior || 'error';
  const resolvedComplementaryText =
    complementaryText !== undefined ? complementaryText : 'Вспомогательный текст';
  const resolvedLoadingDuration = loadingDuration !== undefined ? loadingDuration : 3000;
  const resolvedShowComplementaryIcon =
    showComplementaryIcon !== undefined ? showComplementaryIcon : false;
  const resolvedShowComplementaryText =
    showComplementaryText !== undefined ? showComplementaryText : true;
  const dataIdValue = dataId || rest['data-id'];

  const [digits, setDigits] = useState(function () {
    return createEmptyDigits();
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [focusRequestKey, setFocusRequestKey] = useState(0);
  const [descriptionId] = useState(generateDescriptionId);
  const containerRef = useRef(null);
  const inputRefs = useRef([]);
  const autofocusTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);
  const completionLockedRef = useRef(false);
  const pendingFocusIndexRef = useRef(null);
  const isInteractive = previewState === undefined;

  function focusCell(index) {
    pendingFocusIndexRef.current = index;
    setFocusRequestKey(function (value) {
      return value + 1;
    });
  }

  function clearAutofocusTimer() {
    if (autofocusTimerRef.current === null) {
      return;
    }

    window.clearTimeout(autofocusTimerRef.current);
    autofocusTimerRef.current = null;
  }

  function clearLoadingTimer() {
    if (loadingTimerRef.current === null) {
      return;
    }

    window.clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = null;
  }

  function blurInputs() {
    inputRefs.current.forEach(function (input) {
      if (input) {
        input.blur();
      }
    });
  }

  function updateDigits(nextDigits) {
    setDigits(nextDigits);
    if (onValueChange) {
      onValueChange(nextDigits.join(''));
    }
  }

  useEffect(function () {
    return function () {
      clearAutofocusTimer();
      clearLoadingTimer();
    };
  }, []);

  useEffect(
    function () {
      if (!isInteractive || !resolvedAutoFocus) {
        return undefined;
      }

      clearAutofocusTimer();
      autofocusTimerRef.current = window.setTimeout(function () {
        autofocusTimerRef.current = null;
        focusCell(0);
      }, 50);

      return clearAutofocusTimer;
    },
    [resolvedAutoFocus, isInteractive]
  );

  useEffect(
    function () {
      if (!isInteractive || isLoading || pendingFocusIndexRef.current === null) {
        return;
      }

      var focusIndex = pendingFocusIndexRef.current;
      pendingFocusIndexRef.current = null;
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    },
    [activeIndex, focusRequestKey, isInteractive, isLoading]
  );

  useEffect(
    function () {
      if (!isInteractive || isLoading || digits.some(function (digit) { return digit === ''; })) {
        return;
      }

      completionLockedRef.current = false;
    },
    [digits, isInteractive, isLoading]
  );

  useEffect(
    function () {
      if (
        !isInteractive ||
        isLoading ||
        completionLockedRef.current ||
        digits.some(function (digit) { return digit === ''; })
      ) {
        return;
      }

      completionLockedRef.current = true;
      var code = digits.join('');
      if (onComplete) {
        onComplete(code);
      }
      setIsLoading(true);
      setActiveIndex(null);
      blurInputs();
      clearLoadingTimer();
      loadingTimerRef.current = window.setTimeout(function () {
        loadingTimerRef.current = null;
        setDigits(createEmptyDigits());
        if (onValueChange) {
          onValueChange('');
        }
        setIsLoading(false);
        setShowError(resolvedCompletionBehavior === 'error');
        setActiveIndex(0);
        focusCell(0);
      }, resolvedLoadingDuration);
    },
    [
      digits,
      isInteractive,
      isLoading,
      onComplete,
      onValueChange,
      resolvedCompletionBehavior,
      resolvedLoadingDuration
    ]
  );

  function handleDigitEntry(index, digit) {
    if (!isInteractive || isLoading) {
      return;
    }

    if (index === 0 && showError) {
      setShowError(false);
    }

    var nextDigits = digits.slice();
    nextDigits[index] = digit;
    updateDigits(nextDigits);

    if (index < CODE_INPUT_LENGTH - 1) {
      var nextIndex = index + 1;
      setActiveIndex(nextIndex);
      focusCell(nextIndex);
      return;
    }

    setActiveIndex(index);
  }

  function handleKeyDown(index, event) {
    if (!isInteractive || isLoading) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      handleDigitEntry(index, event.key);
      return;
    }

    if (event.key !== 'Backspace') {
      return;
    }

    event.preventDefault();
    var nextDigits = digits.slice();

    if (nextDigits[index] !== '') {
      nextDigits[index] = '';
      updateDigits(nextDigits);
      setActiveIndex(index);
      return;
    }

    if (index === 0) {
      return;
    }

    var previousIndex = index - 1;
    nextDigits[previousIndex] = '';
    updateDigits(nextDigits);
    setActiveIndex(previousIndex);
    focusCell(previousIndex);
  }

  function handleChange(index, value) {
    if (!isInteractive || isLoading) {
      return;
    }

    var nextDigit = value.replace(/\D/g, '').slice(-1);

    if (!nextDigit) {
      return;
    }

    handleDigitEntry(index, nextDigit);
  }

  function handleContainerBlur(nextFocusedNode) {
    if (!isInteractive) {
      return;
    }

    if (containerRef.current && containerRef.current.contains(nextFocusedNode)) {
      return;
    }

    setActiveIndex(null);
  }

  var previewSnapshot = previewState ? getPreviewSnapshot(previewState) : null;
  var resolvedDigits = previewSnapshot ? previewSnapshot.digits : digits;
  var resolvedActiveIndex = previewSnapshot ? previewSnapshot.activeIndex : activeIndex;
  var resolvedIsLoading = previewSnapshot ? previewSnapshot.isLoading : isLoading;
  var resolvedShowError = previewSnapshot ? previewSnapshot.showError : showError;
  var resolvedVisualState =
    previewState ||
    (resolvedIsLoading
      ? 'loading'
      : resolvedShowError
      ? 'error'
      : resolvedDigits.some(Boolean)
      ? 'typing'
      : 'default');
  var complementaryDescriptionId =
    resolvedShowError && resolvedShowComplementaryText ? descriptionId : undefined;

  return (
    <div
      {...rest}
      className={classNames('rshb-legacy-input-code-item', className)}
      data-id={dataIdValue}
      data-state={resolvedVisualState}
      data-with-error={resolvedShowError ? 'true' : 'false'}
    >
      <div
        ref={containerRef}
        aria-describedby={complementaryDescriptionId}
        aria-label="Код подтверждения"
        className="rshb-legacy-input-code-item__cells"
        onBlur={function (event) {
          handleContainerBlur(event.relatedTarget);
        }}
        role="group"
      >
        {resolvedDigits.map(function (digit, index) {
          var isEmpty = digit === '';
          var visualState = resolveCellVisualState({
            activeIndex: resolvedActiveIndex,
            index: index,
            isLoading: resolvedIsLoading
          });

          return (
            <div
              className="rshb-legacy-input-code-item__cell"
              data-has-value={isEmpty ? 'false' : 'true'}
              data-state={visualState}
              key={index}
              onClick={function () {
                if (!isInteractive || resolvedIsLoading) {
                  return;
                }

                if (inputRefs.current[index]) {
                  inputRefs.current[index].focus();
                }
              }}
            >
              {!isEmpty ? (
                <span className="rshb-legacy-input-code-item__digit" aria-hidden="true">
                  {digit}
                </span>
              ) : null}

              {visualState === 'focused' && isEmpty ? (
                <span aria-hidden="true" className="rshb-legacy-input-code-item__cursor" />
              ) : null}

              <input
                aria-describedby={complementaryDescriptionId}
                aria-invalid={resolvedShowError || undefined}
                aria-label={'Цифра ' + (index + 1)}
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                className="rshb-legacy-input-code-item__native-input"
                disabled={!isInteractive || resolvedIsLoading}
                inputMode="numeric"
                onChange={function (event) {
                  handleChange(index, event.currentTarget.value);
                  event.currentTarget.value = '';
                }}
                onFocus={function () {
                  if (!isInteractive || resolvedIsLoading) {
                    return;
                  }

                  setActiveIndex(index);
                }}
                onKeyDown={function (event) {
                  handleKeyDown(index, event);
                }}
                pattern="[0-9]*"
                ref={function (input) {
                  inputRefs.current[index] = input;
                }}
                type="text"
              />
            </div>
          );
        })}
      </div>

      {resolvedShowError && (resolvedShowComplementaryText || resolvedShowComplementaryIcon) ? (
        <div
          className="rshb-legacy-input-code-item__complementary"
          id={resolvedShowComplementaryText ? descriptionId : undefined}
        >
          {resolvedShowComplementaryIcon ? (
            <span aria-hidden="true" className="rshb-legacy-input-code-item__complementary-icon">
              {complementaryIcon || <DefaultErrorIcon />}
            </span>
          ) : null}

          {resolvedShowComplementaryText ? (
            <span className="rshb-legacy-input-code-item__complementary-text">
              {resolvedComplementaryText}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

InputCodeItem.displayName = 'InputCodeItem';

InputCodeItem.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  completionBehavior: PropTypes.oneOf(['error', 'reset']),
  complementaryIcon: PropTypes.node,
  complementaryText: PropTypes.node,
  dataId: PropTypes.string,
  loadingDuration: PropTypes.number,
  onComplete: PropTypes.func,
  onValueChange: PropTypes.func,
  previewState: PropTypes.oneOf(['default', 'typing', 'loading', 'error']),
  showComplementaryIcon: PropTypes.bool,
  showComplementaryText: PropTypes.bool
};

export default InputCodeItem;
