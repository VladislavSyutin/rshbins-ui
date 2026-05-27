import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import Button from '../button/index.js';
import moonIcon from '../../icons/moon.js';
import sunIcon from '../../icons/sun.js';

var DEFAULT_STORAGE_KEY = 'rshbins-ui-theme';

const THEME_MODES = {
  light: 'light',
  dark: 'dark'
};

const THEME_MODE_VALUES = [THEME_MODES.light, THEME_MODES.dark];

function getDocumentMode() {
  if (typeof document === 'undefined') {
    return undefined;
  }
  if (document.documentElement.classList.contains('theme-dark')) {
    return THEME_MODES.dark;
  }
  if (document.documentElement.classList.contains('theme-light')) {
    return THEME_MODES.light;
  }
  return undefined;
}

function getStoredMode(storageKey) {
  if (typeof window === 'undefined') {
    return undefined;
  }
  var storedMode = window.localStorage.getItem(storageKey);
  return storedMode === THEME_MODES.dark || storedMode === THEME_MODES.light ? storedMode : undefined;
}

function getPreferredMode() {
  if (typeof window === 'undefined') {
    return THEME_MODES.light;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_MODES.dark : THEME_MODES.light;
}

function applyDocumentTheme(mode) {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.classList.toggle('theme-light', mode === THEME_MODES.light);
  document.documentElement.classList.toggle('theme-dark', mode === THEME_MODES.dark);
  document.documentElement.style.colorScheme = mode;
}

function ThemeIcon(props) {
  return (
    <span
      className="rshb-legacy-theme__icon"
      style={{ '--rshb-legacy-theme-icon': 'url("' + props.src + '")' }}
    />
  );
}

ThemeIcon.propTypes = {
  src: PropTypes.string.isRequired
};

function Theme(props) {
  const {
    applyToDocument,
    className,
    dataId,
    defaultMode,
    disabled,
    mode,
    onClick,
    onModeChange,
    storageKey,
    type,
    ...rest
  } = props;

  const resolvedApplyToDocument = applyToDocument !== undefined ? applyToDocument : true;
  const resolvedDisabled = Boolean(disabled);
  const resolvedStorageKey = storageKey || DEFAULT_STORAGE_KEY;
  const resolvedType = type || 'button';

  const isControlled = mode !== undefined;

  const internalModeState = useState(function () {
    return defaultMode || getStoredMode(resolvedStorageKey) || getDocumentMode() || getPreferredMode();
  });
  const internalMode = internalModeState[0];
  const setInternalMode = internalModeState[1];

  const resolvedMode = mode !== undefined ? mode : internalMode;
  const nextMode = resolvedMode === THEME_MODES.dark ? THEME_MODES.light : THEME_MODES.dark;

  useEffect(function () {
    if (!resolvedApplyToDocument) {
      return;
    }
    applyDocumentTheme(resolvedMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(resolvedStorageKey, resolvedMode);
    }
  }, [resolvedApplyToDocument, resolvedMode, resolvedStorageKey]);

  function handleClick(event) {
    if (onClick) {
      onClick(event);
    }
    if (event.defaultPrevented || resolvedDisabled) {
      return;
    }
    if (!isControlled) {
      setInternalMode(nextMode);
    }
    if (onModeChange) {
      onModeChange(nextMode);
    }
  }

  var ariaLabel = rest['aria-label'] ||
    ('Переключить на ' + (nextMode === THEME_MODES.dark ? 'темную' : 'светлую') + ' тему');

  return (
    <Button
      {...rest}
      aria-label={ariaLabel}
      aria-pressed={resolvedMode === THEME_MODES.dark}
      className={classNames('rshb-legacy-theme', className)}
      data-id={dataId || rest['data-id']}
      data-mode={resolvedMode}
      disabled={resolvedDisabled}
      iconOnly
      leadingIcon={<ThemeIcon key={resolvedMode} src={resolvedMode === THEME_MODES.dark ? sunIcon : moonIcon} />}
      onClick={handleClick}
      size="s"
      type={resolvedType}
      variant="flat-primary"
    />
  );
}

Theme.displayName = 'Theme';

Theme.modes = THEME_MODES;

Theme.propTypes = {
  applyToDocument: PropTypes.bool,
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultMode: PropTypes.oneOf(THEME_MODE_VALUES),
  disabled: PropTypes.bool,
  mode: PropTypes.oneOf(THEME_MODE_VALUES),
  onModeChange: PropTypes.func,
  storageKey: PropTypes.string,
  type: PropTypes.string
};

export default Theme;
