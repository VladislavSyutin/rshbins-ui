import React from 'react';
import classNames from 'classnames';
import InputDate from '../input-date/index.js';
import './styles.css';

function shiftYears(today, years) {
  const year = today.getFullYear() + years;
  const month = today.getMonth();
  const day = Math.min(today.getDate(), new Date(year, month + 1, 0).getDate());
  return new Date(year, month, day);
}

const InputBirthDate = React.forwardRef(function InputBirthDate(props, ref) {
  const { className, label, ...rest } = props;
  const today = new Date();
  return (
    <InputDate
      {...rest}
      className={classNames('rshb-legacy-input-birth-date', className)}
      incompleteError="Некорректная дата рождения"
      rangeError="Возраст должен быть от 18 до 100 лет."
      label={label || 'Дата рождения'}
      minDate={shiftYears(today, -100)}
      maxDate={shiftYears(today, -18)}
      ref={ref}
    />
  );
});
InputBirthDate.displayName = 'InputBirthDate';
InputBirthDate.propTypes = InputDate.propTypes;
export default InputBirthDate;
