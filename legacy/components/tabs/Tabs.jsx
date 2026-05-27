import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

var groupIdCounter = 0;

function generateGroupId() {
  groupIdCounter += 1;
  return 'rshb-legacy-tabs-' + groupIdCounter;
}

function resolveSelectedValue(options, candidate) {
  const resolvedOptions = Array.isArray(options) ? options : [];

  if (candidate != null && resolvedOptions.some(function (option) { return option.value === candidate; })) {
    return candidate;
  }

  const firstEnabledOption = resolvedOptions.find(function (option) { return !option.disabled; });
  return firstEnabledOption ? firstEnabledOption.value : resolvedOptions[0] ? resolvedOptions[0].value : undefined;
}

function getEnabledIndexes(options, disabled) {
  if (disabled) {
    return [];
  }

  return options.reduce(function (indexes, option, index) {
    if (!option.disabled) {
      indexes.push(index);
    }

    return indexes;
  }, []);
}

function getNextIndex(indexes, currentIndex, direction) {
  if (!indexes.length) {
    return undefined;
  }

  const resolvedCurrentPosition = indexes.indexOf(currentIndex);
  const currentPosition = resolvedCurrentPosition === -1 ? 0 : resolvedCurrentPosition;
  const nextPosition = (currentPosition + direction + indexes.length) % indexes.length;

  return indexes[nextPosition];
}

const TabsItem = React.forwardRef(function TabsItem(props, ref) {
  const {
    className,
    dataId,
    disabled,
    label,
    leadingIcon,
    selected,
    trailingIcon,
    type,
    ...rest
  } = props;

  return (
    <button
      {...rest}
      aria-selected={selected}
      className={classNames('rshb-legacy-tab', 'rshb-legacy-tabs__item', className)}
      data-id={dataId || rest['data-id']}
      data-selected={selected ? 'true' : 'false'}
      disabled={Boolean(disabled)}
      ref={ref}
      role={rest.role != null ? rest.role : 'tab'}
      type={type || 'button'}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className="rshb-legacy-tab__icon">
          {leadingIcon}
        </span>
      ) : null}
      {label != null ? <span className="rshb-legacy-tab__label">{label}</span> : null}
      {trailingIcon ? (
        <span aria-hidden="true" className="rshb-legacy-tab__icon">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});

TabsItem.displayName = 'TabsItem';

function Tabs(props) {
  const {
    className,
    dataId,
    defaultValue,
    disabled,
    onChange,
    onKeyDown,
    options,
    tabProps,
    value,
    ...rest
  } = props;

  const resolvedOptions = Array.isArray(options) ? options : [];
  const resolvedDisabled = Boolean(disabled);
  const dataIdValue = dataId || rest['data-id'];
  const tabRefs = useRef([]);
  const [generatedGroupId] = useState(generateGroupId);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(function () {
    return resolveSelectedValue(resolvedOptions, defaultValue);
  });

  useEffect(function () {
    if (!isControlled) {
      setInternalValue(function (currentValue) {
        const nextValue = defaultValue !== undefined ? defaultValue : currentValue;
        return resolveSelectedValue(resolvedOptions, nextValue);
      });
    }
  }, [defaultValue, isControlled, resolvedOptions]);

  const resolvedValue = resolveSelectedValue(
    resolvedOptions,
    isControlled ? value : internalValue
  );
  const enabledIndexes = getEnabledIndexes(resolvedOptions, resolvedDisabled);

  function selectTab(nextValue, event) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    if (onChange) {
      onChange(nextValue, event);
    }
  }

  function focusTab(index, event) {
    const option = resolvedOptions[index];

    if (tabRefs.current[index]) {
      tabRefs.current[index].focus();
    }

    if (option && option.value !== resolvedValue) {
      selectTab(option.value, event);
    }
  }

  function handleKeyDown(event) {
    if (onKeyDown) {
      onKeyDown(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    const focusedIndex = tabRefs.current.findIndex(function (node) { return node === event.target; });
    const activeIndex = focusedIndex >= 0
      ? focusedIndex
      : resolvedOptions.findIndex(function (option) { return option.value === resolvedValue; });
    let nextIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = getNextIndex(enabledIndexes, activeIndex, 1);
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = getNextIndex(enabledIndexes, activeIndex, -1);
    }

    if (event.key === 'Home') {
      nextIndex = enabledIndexes[0];
    }

    if (event.key === 'End') {
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      focusTab(nextIndex, event);
    }
  }

  return (
    <div
      {...rest}
      aria-disabled={resolvedDisabled || undefined}
      aria-orientation="horizontal"
      className={classNames('rshb-legacy-tabs', className)}
      data-id={dataIdValue}
      onKeyDown={handleKeyDown}
      role={rest.role !== undefined ? rest.role : 'tablist'}
    >
      {resolvedOptions.map(function (option, index) {
        const mergedTabProps = Object.assign({}, tabProps);
        const selected = option.value === resolvedValue;
        const tabId = option.id != null ? option.id : generatedGroupId + '-tab-' + (index + 1);

        return (
          <TabsItem
            {...mergedTabProps}
            aria-controls={option.panelId}
            className={mergedTabProps.className}
            dataId={option.dataId || mergedTabProps.dataId}
            disabled={resolvedDisabled || option.disabled}
            id={tabId}
            key={option.id != null ? option.id : option.value}
            label={option.label}
            leadingIcon={option.leadingIcon}
            onClick={function (event) {
              if (mergedTabProps.onClick) {
                mergedTabProps.onClick(event);
              }

              if (!event.defaultPrevented && !resolvedDisabled && !option.disabled) {
                selectTab(option.value, event);
              }
            }}
            ref={function (node) {
              tabRefs.current[index] = node;
            }}
            selected={selected}
            tabIndex={selected ? 0 : -1}
            trailingIcon={option.trailingIcon}
          />
        );
      })}
    </div>
  );
}

Tabs.displayName = 'Tabs';

TabsItem.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.node,
  leadingIcon: PropTypes.node,
  selected: PropTypes.bool,
  trailingIcon: PropTypes.node,
  type: PropTypes.string
};

Tabs.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    dataId: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node.isRequired,
    leadingIcon: PropTypes.node,
    panelId: PropTypes.string,
    trailingIcon: PropTypes.node,
    value: PropTypes.string.isRequired
  })).isRequired,
  tabProps: PropTypes.shape({
    className: PropTypes.string,
    dataId: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string
  }),
  value: PropTypes.string
};

Tabs.defaultProps = {
  options: [],
  tabProps: undefined
};

export default Tabs;
