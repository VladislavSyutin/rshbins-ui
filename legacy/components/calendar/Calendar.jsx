import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/index.js';
import './styles.css';
import chevronDownIcon from '../../icons/chevron-down.js';
import chevronLeftIcon from '../../icons/chevron-left.js';
import chevronRightIcon from '../../icons/chevron-right.js';

const NAVIGATION_ANIMATION_DURATION_MS = 150;

const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
];

const MONTH_NAMES_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const MONTH_NAMES_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
];

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const CALENDAR_DAY_CELL_SIZE_PX = 40;
const CALENDAR_GRID_GAP_PX = 2;
const CALENDAR_MONTH_YEAR_VIEW_MIN_HEIGHT_PX = 252;

const CALENDAR_VIEWS = {
  day: 'day',
  month: 'month',
  year: 'year'
};

const CALENDAR_VIEW_VALUES = [CALENDAR_VIEWS.day, CALENDAR_VIEWS.month, CALENDAR_VIEWS.year];


function normalizeDate(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const dayOfWeek = new Date(year, month, 1).getDay();

  return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
}

function getYearRangeStart(year) {
  return Math.floor(year / 12) * 12;
}

function getMonthBoundary(year, month, boundary) {
  if (boundary === 'start') {
    return normalizeDate(new Date(year, month, 1));
  }

  return normalizeDate(new Date(year, month + 1, 0));
}

function getYearBoundary(year, boundary) {
  if (boundary === 'start') {
    return normalizeDate(new Date(year, 0, 1));
  }

  return normalizeDate(new Date(year, 11, 31));
}

function rangesIntersect(rangeAStart, rangeAEnd, rangeBStart, rangeBEnd) {
  return rangeAStart <= rangeBEnd && rangeAEnd >= rangeBStart;
}

function getEffectiveRangeStart(minDate) {
  return minDate || new Date(-8640000000000000);
}

function getEffectiveRangeEnd(maxDate) {
  return maxDate || new Date(8640000000000000);
}

function hasSelectableMonth(year, month, minDate, maxDate) {
  return rangesIntersect(
    getMonthBoundary(year, month, 'start'),
    getMonthBoundary(year, month, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function hasSelectableYear(year, minDate, maxDate) {
  return rangesIntersect(
    getYearBoundary(year, 'start'),
    getYearBoundary(year, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function hasSelectableYearRange(yearRangeStart, minDate, maxDate) {
  return rangesIntersect(
    getYearBoundary(yearRangeStart, 'start'),
    getYearBoundary(yearRangeStart + 11, 'end'),
    getEffectiveRangeStart(minDate),
    getEffectiveRangeEnd(maxDate)
  );
}

function createInitialState(value, view) {
  const normalizedValue = normalizeDate(value);

  return {
    displayDate: normalizedValue,
    selectedDate: normalizedValue,
    selectedDay: normalizedValue.getDate(),
    selectedMonth: normalizedValue.getMonth(),
    selectedYear: normalizedValue.getFullYear(),
    view: view,
    yearRangeStart: getYearRangeStart(normalizedValue.getFullYear())
  };
}

function createNextDate(year, month, day) {
  return normalizeDate(new Date(year, month, day));
}

function createSnapshot(state) {
  return {
    displayDate: state.displayDate,
    view: state.view,
    yearRangeStart: state.yearRangeStart
  };
}

function buildDayGrid(displayDate) {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const totalWeeks = Math.ceil((firstDay + daysInMonth) / 7);
  const previousMonth = month === 0 ? 11 : month - 1;
  const previousYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const daysInPreviousMonth = getDaysInMonth(previousYear, previousMonth);
  const grid = [];
  let currentDay = 1;
  let nextMonthDay = 1;

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex += 1) {
    const week = [];

    for (let weekdayIndex = 0; weekdayIndex < 7; weekdayIndex += 1) {
      const cellIndex = weekIndex * 7 + weekdayIndex;

      if (cellIndex < firstDay) {
        week.push({
          anotherMonth: true,
          day: daysInPreviousMonth - firstDay + weekdayIndex + 1,
          month: previousMonth,
          year: previousYear
        });
        continue;
      }

      if (currentDay <= daysInMonth) {
        week.push({
          anotherMonth: false,
          day: currentDay,
          month: month,
          year: year
        });
        currentDay += 1;
        continue;
      }

      week.push({
        anotherMonth: true,
        day: nextMonthDay,
        month: nextMonth,
        year: nextYear
      });
      nextMonthDay += 1;
    }

    grid.push(week);
  }

  return grid;
}

function getDayViewMinHeight(displayDate) {
  const weeksCount = buildDayGrid(displayDate).length;

  return CALENDAR_DAY_CELL_SIZE_PX + weeksCount * CALENDAR_DAY_CELL_SIZE_PX + weeksCount * CALENDAR_GRID_GAP_PX;
}

function getViewMinHeight(snapshot) {
  if (snapshot.view === CALENDAR_VIEWS.day) {
    return getDayViewMinHeight(snapshot.displayDate);
  }

  return CALENDAR_MONTH_YEAR_VIEW_MIN_HEIGHT_PX;
}

function CalendarIcon(props) {
  const direction = props.direction;
  const icon = direction === 'left'
    ? chevronLeftIcon
    : direction === 'right'
      ? chevronRightIcon
      : chevronDownIcon;

  return (
    <span
      aria-hidden="true"
      className="rshb-legacy-calendar__icon-svg"
      style={{ '--rshb-legacy-calendar-icon': 'url("' + icon + '")' }}
    />
  );
}

CalendarIcon.propTypes = {
  direction: PropTypes.oneOf(['down', 'left', 'right'])
};

function CalendarDayItem(props) {
  const {
    anotherMonth,
    className,
    dataId,
    day,
    selected,
    type
  } = props;
  const buttonProps = Object.assign({}, props);
  delete buttonProps.anotherMonth;
  delete buttonProps.className;
  delete buttonProps.dataId;
  delete buttonProps.day;
  delete buttonProps.selected;

  return (
    <button
      {...buttonProps}
      aria-pressed={Boolean(selected)}
      className={classNames('rshb-legacy-calendar-day-item', className)}
      data-another-month={anotherMonth ? 'true' : 'false'}
      data-id={dataId || buttonProps['data-id']}
      data-selected={selected ? 'true' : 'false'}
      type={type || 'button'}
    >
      <span className="rshb-legacy-calendar-day-item__label">{day}</span>
    </button>
  );
}

CalendarDayItem.displayName = 'CalendarDayItem';

CalendarDayItem.propTypes = {
  anotherMonth: PropTypes.bool,
  className: PropTypes.string,
  dataId: PropTypes.string,
  day: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

function CalendarPeriodItem(props) {
  const {
    className,
    dataId,
    label,
    selected,
    type
  } = props;
  const buttonProps = Object.assign({}, props);
  delete buttonProps.className;
  delete buttonProps.dataId;
  delete buttonProps.label;
  delete buttonProps.selected;

  return (
    <button
      {...buttonProps}
      aria-pressed={Boolean(selected)}
      className={classNames('rshb-legacy-calendar-period-item', className)}
      data-id={dataId || buttonProps['data-id']}
      data-selected={selected ? 'true' : 'false'}
      type={type || 'button'}
    >
      <span className="rshb-legacy-calendar-period-item__label">{label}</span>
    </button>
  );
}

CalendarPeriodItem.displayName = 'CalendarPeriodItem';

CalendarPeriodItem.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

function Calendar(props) {
  const {
    className,
    dataId,
    defaultValue,
    initialView,
    maxDate,
    minDate,
    onChange,
    value
  } = props;
  const rootProps = Object.assign({}, props);
  delete rootProps.className;
  delete rootProps.dataId;
  delete rootProps.defaultValue;
  delete rootProps.initialView;
  delete rootProps.maxDate;
  delete rootProps.minDate;
  delete rootProps.onChange;
  delete rootProps.value;

  const seedDate = value || defaultValue || new Date();
  const [state, setState] = useState(function initState() {
    return createInitialState(seedDate, initialView || CALENDAR_VIEWS.day);
  });
  const [animationState, setAnimationState] = useState({
    direction: 1,
    outgoingSnapshot: null,
    running: false
  });
  const animationTimerRef = useRef(null);
  const resolvedMinDate = minDate ? normalizeDate(minDate) : null;
  const resolvedMaxDate = maxDate ? normalizeDate(maxDate) : null;
  const controlledValueKey = value ? value.getTime() : null;
  const currentSnapshot = useMemo(function memoSnapshot() {
    return createSnapshot(state);
  }, [state.displayDate, state.view, state.yearRangeStart]);
  const contentStyle = useMemo(function memoContentStyle() {
    const snapshots = animationState.outgoingSnapshot ? [animationState.outgoingSnapshot, currentSnapshot] : [currentSnapshot];

    return {
      minHeight: Math.max.apply(
        null,
        snapshots.map(function mapSnapshot(snapshot) {
          return getViewMinHeight(snapshot);
        })
      )
    };
  }, [animationState.outgoingSnapshot, currentSnapshot]);
  const canNavigatePrevious = useMemo(function memoCanNavigatePrevious() {
    if (state.view === CALENDAR_VIEWS.day) {
      return hasSelectableMonth(
        state.displayDate.getFullYear(),
        state.displayDate.getMonth() - 1,
        resolvedMinDate,
        resolvedMaxDate
      );
    }

    if (state.view === CALENDAR_VIEWS.month) {
      return hasSelectableYear(state.displayDate.getFullYear() - 1, resolvedMinDate, resolvedMaxDate);
    }

    return hasSelectableYearRange(state.yearRangeStart - 12, resolvedMinDate, resolvedMaxDate);
  }, [resolvedMinDate, resolvedMaxDate, state.displayDate, state.view, state.yearRangeStart]);
  const canNavigateNext = useMemo(function memoCanNavigateNext() {
    if (state.view === CALENDAR_VIEWS.day) {
      return hasSelectableMonth(
        state.displayDate.getFullYear(),
        state.displayDate.getMonth() + 1,
        resolvedMinDate,
        resolvedMaxDate
      );
    }

    if (state.view === CALENDAR_VIEWS.month) {
      return hasSelectableYear(state.displayDate.getFullYear() + 1, resolvedMinDate, resolvedMaxDate);
    }

    return hasSelectableYearRange(state.yearRangeStart + 12, resolvedMinDate, resolvedMaxDate);
  }, [resolvedMinDate, resolvedMaxDate, state.displayDate, state.view, state.yearRangeStart]);

  useEffect(function syncControlledValue() {
    if (controlledValueKey === null) {
      return undefined;
    }

    const nextValue = normalizeDate(value);

    setState(function updateState(previousState) {
      return {
        ...previousState,
        displayDate: nextValue,
        selectedDate: nextValue,
        selectedDay: nextValue.getDate(),
        selectedMonth: nextValue.getMonth(),
        selectedYear: nextValue.getFullYear(),
        yearRangeStart: getYearRangeStart(nextValue.getFullYear())
      };
    });
    setAnimationState({
      direction: 1,
      outgoingSnapshot: null,
      running: false
    });

    return undefined;
  }, [controlledValueKey, value]);

  useEffect(function cleanupAnimationTimer() {
    return function cleanup() {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  function emitChange(nextDate) {
    if (onChange) {
      onChange(normalizeDate(nextDate));
    }
  }

  function startNavigationAnimation(direction, outgoingSnapshot) {
    if (animationTimerRef.current !== null) {
      window.clearTimeout(animationTimerRef.current);
    }

    setAnimationState({
      direction: direction,
      outgoingSnapshot: outgoingSnapshot,
      running: true
    });

    animationTimerRef.current = window.setTimeout(function clearAnimation() {
      animationTimerRef.current = null;
      setAnimationState({
        direction: direction,
        outgoingSnapshot: null,
        running: false
      });
    }, NAVIGATION_ANIMATION_DURATION_MS);
  }

  function handlePrevious() {
    if (!canNavigatePrevious) {
      return;
    }

    const outgoingSnapshot = createSnapshot(state);

    setState(function updateState(previousState) {
      if (previousState.view === CALENDAR_VIEWS.day) {
        return {
          ...previousState,
          displayDate: new Date(previousState.displayDate.getFullYear(), previousState.displayDate.getMonth() - 1, 1)
        };
      }

      if (previousState.view === CALENDAR_VIEWS.month) {
        const nextDisplayDate = new Date(
          previousState.displayDate.getFullYear() - 1,
          previousState.displayDate.getMonth(),
          1
        );

        return {
          ...previousState,
          displayDate: nextDisplayDate,
          selectedYear: nextDisplayDate.getFullYear()
        };
      }

      return {
        ...previousState,
        yearRangeStart: previousState.yearRangeStart - 12
      };
    });

    if (state.view !== CALENDAR_VIEWS.month) {
      startNavigationAnimation(-1, outgoingSnapshot);
    }
  }

  function handleNext() {
    if (!canNavigateNext) {
      return;
    }

    const outgoingSnapshot = createSnapshot(state);

    setState(function updateState(previousState) {
      if (previousState.view === CALENDAR_VIEWS.day) {
        return {
          ...previousState,
          displayDate: new Date(previousState.displayDate.getFullYear(), previousState.displayDate.getMonth() + 1, 1)
        };
      }

      if (previousState.view === CALENDAR_VIEWS.month) {
        const nextDisplayDate = new Date(
          previousState.displayDate.getFullYear() + 1,
          previousState.displayDate.getMonth(),
          1
        );

        return {
          ...previousState,
          displayDate: nextDisplayDate,
          selectedYear: nextDisplayDate.getFullYear()
        };
      }

      return {
        ...previousState,
        yearRangeStart: previousState.yearRangeStart + 12
      };
    });

    if (state.view !== CALENDAR_VIEWS.month) {
      startNavigationAnimation(1, outgoingSnapshot);
    }
  }

  function handleTitleClick() {
    if (animationTimerRef.current !== null) {
      window.clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }

    setAnimationState({
      direction: 1,
      outgoingSnapshot: null,
      running: false
    });

    setState(function updateState(previousState) {
      if (previousState.view === CALENDAR_VIEWS.day) {
        return {
          ...previousState,
          view: CALENDAR_VIEWS.month
        };
      }

      if (previousState.view === CALENDAR_VIEWS.month) {
        return {
          ...previousState,
          view: CALENDAR_VIEWS.year,
          yearRangeStart: getYearRangeStart(previousState.displayDate.getFullYear())
        };
      }

      return {
        ...previousState,
        displayDate: new Date(previousState.selectedYear, previousState.selectedMonth, 1),
        view: CALENDAR_VIEWS.day
      };
    });
  }

  function handleDaySelect(day, month, year, anotherMonth) {
    const nextSelectedDate = createNextDate(year, month, day);

    setState(function updateState(previousState) {
      return {
        ...previousState,
        displayDate: anotherMonth ? new Date(year, month, 1) : previousState.displayDate,
        selectedDate: nextSelectedDate,
        selectedDay: day,
        selectedMonth: month,
        selectedYear: year
      };
    });

    emitChange(nextSelectedDate);
  }

  function handleMonthSelect(month) {
    const year = state.displayDate.getFullYear();
    const validDay = Math.min(state.selectedDay, getDaysInMonth(year, month));
    const nextSelectedDate = createNextDate(year, month, validDay);

    setState(function updateState(previousState) {
      return {
        ...previousState,
        selectedDate: nextSelectedDate,
        selectedDay: validDay,
        selectedMonth: month,
        selectedYear: year
      };
    });

    emitChange(nextSelectedDate);
  }

  function handleYearSelect(year) {
    let nextMonth = state.selectedMonth;
    let nextDay = state.selectedDay;

    if (state.selectedMonth === 1 && state.selectedDay === 29 && getDaysInMonth(year, 1) < 29) {
      nextMonth = 2;
      nextDay = 1;
    }

    const nextSelectedDate = createNextDate(year, nextMonth, nextDay);

    setState(function updateState(previousState) {
      return {
        ...previousState,
        selectedDate: nextSelectedDate,
        selectedDay: nextDay,
        selectedMonth: nextMonth,
        selectedYear: year
      };
    });

    emitChange(nextSelectedDate);
  }

  function getTitleLabel() {
    if (state.view === CALENDAR_VIEWS.day) {
      return MONTH_NAMES[state.displayDate.getMonth()] + ' ' + state.displayDate.getFullYear();
    }

    if (state.view === CALENDAR_VIEWS.month) {
      return String(state.displayDate.getFullYear());
    }

    return state.selectedDay + ' ' + MONTH_NAMES_GENITIVE[state.selectedMonth];
  }

  function renderDayView(snapshot) {
    return (
      <React.Fragment>
        <div className="rshb-legacy-calendar__weekdays">
          {DAY_NAMES.map(function renderWeekday(dayName) {
            return (
              <div className="rshb-legacy-calendar__weekday" key={dayName}>
                <span className="rshb-legacy-calendar__weekday-label">{dayName}</span>
              </div>
            );
          })}
        </div>
        <div className="rshb-legacy-calendar__weeks">
          {buildDayGrid(snapshot.displayDate).map(function renderWeek(week, weekIndex) {
            return (
              <div
                className="rshb-legacy-calendar__week"
                key={snapshot.displayDate.getFullYear() + '-' + snapshot.displayDate.getMonth() + '-' + weekIndex}
              >
                {week.map(function renderCell(cell) {
                  const isSelected =
                    cell.day === state.selectedDay && cell.month === state.selectedMonth && cell.year === state.selectedYear;
                  const cellDate = normalizeDate(new Date(cell.year, cell.month, cell.day));
                  const isOutOfRange =
                    (resolvedMinDate !== null && cellDate < resolvedMinDate) ||
                    (resolvedMaxDate !== null && cellDate > resolvedMaxDate);
                  const ariaLabel = cell.day + ' ' + MONTH_NAMES_GENITIVE[cell.month] + ' ' + cell.year;

                  return (
                    <CalendarDayItem
                      aria-label={ariaLabel}
                      anotherMonth={cell.anotherMonth}
                      day={cell.day}
                      disabled={isOutOfRange}
                      key={cell.year + '-' + cell.month + '-' + cell.day}
                      onClick={
                        isOutOfRange
                          ? undefined
                          : function onClick() {
                              handleDaySelect(cell.day, cell.month, cell.year, cell.anotherMonth);
                            }
                      }
                      selected={isSelected}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }

  function renderPeriodView(snapshot, items) {
    return (
      <div className="rshb-legacy-calendar__periods">
        {Array.from({ length: 4 }, function createRowIndex(_, rowIndex) {
          return rowIndex * 3;
        }).map(function renderRow(startIndex) {
          return (
            <div className="rshb-legacy-calendar__period-row" key={startIndex}>
              {items.slice(startIndex, startIndex + 3).map(function renderPeriod(label, itemIndex) {
                const index = startIndex + itemIndex;
                const isSelected =
                  snapshot.view === CALENDAR_VIEWS.month
                    ? state.selectedMonth === index && state.selectedYear === snapshot.displayDate.getFullYear()
                    : state.selectedYear === snapshot.yearRangeStart + index;
                const optionStart =
                  snapshot.view === CALENDAR_VIEWS.month
                    ? getMonthBoundary(snapshot.displayDate.getFullYear(), index, 'start')
                    : getYearBoundary(snapshot.yearRangeStart + index, 'start');
                const optionEnd =
                  snapshot.view === CALENDAR_VIEWS.month
                    ? getMonthBoundary(snapshot.displayDate.getFullYear(), index, 'end')
                    : getYearBoundary(snapshot.yearRangeStart + index, 'end');
                const rangeStart = getEffectiveRangeStart(resolvedMinDate);
                const rangeEnd = getEffectiveRangeEnd(resolvedMaxDate);
                const isDisabled = !rangesIntersect(optionStart, optionEnd, rangeStart, rangeEnd);

                return (
                  <CalendarPeriodItem
                    disabled={isDisabled}
                    key={label}
                    label={label}
                    onClick={
                      isDisabled
                        ? undefined
                        : function onClick() {
                            if (snapshot.view === CALENDAR_VIEWS.month) {
                              handleMonthSelect(index);
                            } else {
                              handleYearSelect(snapshot.yearRangeStart + index);
                            }
                          }
                    }
                    selected={isSelected}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  function renderContent(snapshot) {
    if (snapshot.view === CALENDAR_VIEWS.day) {
      return renderDayView(snapshot);
    }

    if (snapshot.view === CALENDAR_VIEWS.month) {
      return renderPeriodView(snapshot, MONTH_NAMES_SHORT.slice());
    }

    return renderPeriodView(
      snapshot,
      Array.from({ length: 12 }, function createYearLabel(_, index) {
        return String(snapshot.yearRangeStart + index);
      })
    );
  }

  return (
    <div
      {...rootProps}
      className={classNames('rshb-legacy-calendar', className)}
      data-id={dataId || rootProps['data-id']}
      data-view={state.view}
    >
      <div className="rshb-legacy-calendar__header">
        <Button
          buttonType="flat-primary"
          className="rshb-legacy-calendar__title-button"
          dataId={dataId ? dataId + '-title' : undefined}
          onClick={handleTitleClick}
          size="s"
          trailingIcon={
            <span className="rshb-legacy-calendar__icon rshb-legacy-calendar__icon--title">
              <CalendarIcon direction="down" />
            </span>
          }
          type="button"
        >
          <span className="rshb-legacy-calendar__title-label">{getTitleLabel()}</span>
        </Button>

        <div className="rshb-legacy-calendar__actions">
          <Button
            aria-label="Предыдущий период"
            buttonType="flat-primary"
            className="rshb-legacy-calendar__action-button"
            dataId={dataId ? dataId + '-previous' : undefined}
            disabled={!canNavigatePrevious}
            iconOnly
            leadingIcon={
              <span className="rshb-legacy-calendar__icon rshb-legacy-calendar__icon--arrow">
                <CalendarIcon direction="left" />
              </span>
            }
            onClick={handlePrevious}
            size="s"
            type="button"
          />
          <Button
            aria-label="Следующий период"
            buttonType="flat-primary"
            className="rshb-legacy-calendar__action-button"
            dataId={dataId ? dataId + '-next' : undefined}
            disabled={!canNavigateNext}
            iconOnly
            leadingIcon={
              <span className="rshb-legacy-calendar__icon rshb-legacy-calendar__icon--arrow">
                <CalendarIcon direction="right" />
              </span>
            }
            onClick={handleNext}
            size="s"
            type="button"
          />
        </div>
      </div>

      <div
        className="rshb-legacy-calendar__content"
        data-animating={animationState.running ? 'true' : 'false'}
        data-current-view={state.view}
        data-direction={animationState.direction === -1 ? 'backward' : 'forward'}
        style={contentStyle}
      >
        {animationState.outgoingSnapshot ? (
          <div className="rshb-legacy-calendar__content-panel rshb-legacy-calendar__content-panel--outgoing">
            {renderContent(animationState.outgoingSnapshot)}
          </div>
        ) : null}
        <div
          className={classNames(
            'rshb-legacy-calendar__content-panel',
            animationState.running && 'rshb-legacy-calendar__content-panel--incoming'
          )}
        >
          {renderContent(currentSnapshot)}
        </div>
      </div>
    </div>
  );
}

Calendar.displayName = 'Calendar';

Calendar.views = CALENDAR_VIEWS;

Calendar.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultValue: PropTypes.instanceOf(Date),
  initialView: PropTypes.oneOf(CALENDAR_VIEW_VALUES),
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  value: PropTypes.instanceOf(Date)
};

export { CalendarDayItem, CalendarPeriodItem };
export default Calendar;
