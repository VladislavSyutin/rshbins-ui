import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../components/button/index.js';
import Card from '../../components/card/index.js';
import Checkbox from '../../components/checkbox/index.js';
import Gender from '../../components/gender/index.js';
import Header from '../../components/header/index.js';
import InputBirthDate from '../../components/input-birth-date/index.js';
import InputCode from '../../components/input-code/index.js';
import InputMiddleName from '../../components/input-middle-name/index.js';
import DialogModal from '../../dialogs/modals/dialog-modal/index.js';
import InputName from '../../components/input-name/index.js';
import InputPhone from '../../components/input-phone/index.js';
import InputSurname from '../../components/input-surname/index.js';
import InputText from '../../components/input-text/index.js';
import SegmentedControl from '../../components/segmented-control/index.js';
import Tabs from '../../components/tabs/index.js';
import TextLink from '../../components/text-link/index.js';
import Toast from '../../components/toast/index.js';
import calendarIcon from '../../icons/calendar.js';
import propertyMortgageImage from './assets/property-mortgage.png';
import propertyHomeImage from './assets/property-home.png';
import propertyCardImage from './assets/property-card.png';
import propertyDepositImage from './assets/property-deposit.png';
import healthFamilyImage from './assets/health-family.png';
import healthTickImage from './assets/health-tick.png';
import workLossImage from './assets/work-loss.png';
import workSelfEmployedImage from './assets/work-self-employed.png';
import travelAbroadImage from './assets/travel-abroad.png';
import travelRussiaImage from './assets/travel-russia.png';
import animalsPetImage from './assets/animals-pet.png';
import animalsFarmImage from './assets/animals-farm.png';
import kidsProtectionImage from './assets/kids-protection.png';
import './styles.css';

const FAMILY_ACCIDENT_TITLE = 'Страхование от несчастных случаев для всей семьи';
const RESEND_TIMER_SECONDS = 59;
const FORM_SUBMIT_DELAY = 3000;
const PREFILLED_POLICYHOLDER_PHONE = '79999999991';
const PREFILLED_CHECK_PHONE = '79999999990';
const PROOF_IDENTITY_PHONE = '79999999992';
const CAPTCHA_PHONE = '79999999993';
const GOSUSLUGI_LOGIN_EMAIL = 'info@rshbins.ru';
const PROMO_CODE_VALUE = 'промо';
const PROMO_DISCOUNT = 0.2;
const PREFILLED_POLICYHOLDER = {
  birthDate: '02.06.2001',
  email: 'syutinvi@rshbins.ru',
  firstName: 'Владислав',
  gender: 'male',
  lastName: 'Сютин',
  middleName: 'Игоревич',
  noMiddleName: false
};
const PREFILLED_PASSPORT = {
  divisionCode: '000-000',
  issueDate: '20.07.1990',
  issuedBy: 'ГУ МВД РОССИИ ПО Г МОСКВЕ',
  number: '1234 567890'
};
function fillEmptyFields(currentValue, prefilledValue) {
  const nextValue = Object.assign({}, currentValue);

  Object.keys(prefilledValue).forEach(function (fieldName) {
    const currentFieldValue = nextValue[fieldName];

    if (
      currentFieldValue === undefined ||
      currentFieldValue === null ||
      currentFieldValue === ''
    ) {
      nextValue[fieldName] = prefilledValue[fieldName];
    }
  });

  return nextValue;
}
const PAYMENT_OPTIONS = [
  { value: 'yandex-pay', label: 'Яндекс Пэй' },
  { value: 'bank-card', label: 'Банковская карта' }
];

const CATEGORY_OPTIONS = [
  { value: 'property', label: 'Имущество и финансы' },
  { value: 'health', label: 'Здоровье' },
  { value: 'work', label: 'Работа' },
  { value: 'travel', label: 'Путешествия' },
  { value: 'animals', label: 'Животные' },
  { value: 'kids', label: 'Дети' }
];

const CATEGORY_CARDS = {
  property: [
    {
      title: 'Индивидуальное ипотечное и потребительское страхование',
      accent: 'Поможем обрести уверенность в завтрашнем дне и избавиться от переживаний, связанных с выплатой кредита!',
      text: 'Заключение индивидуального договора страхования позволит обеспечить финансовую безопасность и возмещение убытков в случае наступления страхового случая.',
      image: propertyMortgageImage
    },
    {
      title: 'Страхование квартиры или дома',
      accent: 'Защитите вашу собственность от непредвиденных обстоятельств, а чужую собственность - от своих случайных действий.',
      text: 'Этот страховой продукт поможет защитить вашу квартиру или дом от аварийных ситуаций, залива, пожара, краж. А также компенсируем ущерб вашим соседям, если неприятности произошли в вашем доме.',
      image: propertyHomeImage
    },
    {
      title: 'Защита денег на банковской карте',
      accent: 'Сохраним деньги на вашей карте в случае непредвиденных ситуаций.',
      text: 'Страховой продукт «Защита ваших денег на банковской карте» поможет защитить и вернуть ваши деньги, если они будут украдены с банковской карты или счета, через интернет или банкомат.',
      image: propertyCardImage
    },
    {
      title: 'Защита процентов по вкладам',
      accent: 'Мы выплатим компенсацию, если вам вынужденно придётся расторгнуть договор вклада и потерять проценты по нему.',
      text: 'Страховой продукт «Защита процентов по вкладам» - ваша возможность компенсировать недополученные проценты по банковскому вкладу, если вдруг возникнут непредвиденные обстоятельства.',
      image: propertyDepositImage
    }
  ],
  health: [
    {
      title: FAMILY_ACCIDENT_TITLE,
      accent: 'Поможем защитить вас и ваших близких от несчастных случаев.',
      text: 'Этот страховой продукт - возможность позаботиться о себе и самых близких людях и получить достойную денежную компенсацию, если вы или кто-то из вашего окружения пострадает в результате несчастного случая.',
      image: healthFamilyImage
    },
    {
      title: 'Защита от клеща',
      accent: 'Предотвратить укус клеща довольно сложно, зато можно застраховаться от его последствий.',
      text: 'Страховой продукт «Защита от клеща» позволит получить необходимую медицинскую и лекарственную помощь в случае укуса клеща, а при подключении дополнительной опции обеспечит финансовую защиту.',
      image: healthTickImage
    }
  ],
  work: [
    {
      title: 'Страхование от потери работы',
      accent: 'Начните думать о завтрашнем дне уже сегодня - оформите страхование от потери работы.',
      text: 'Продукт «Страхование от потери работы» предлагает финансовую поддержку в пределах утраченного дохода и распространяется дополнительно на ещё одного члена семьи.',
      image: workLossImage
    },
    {
      title: 'Защита самозанятых',
      accent: 'Поможем самозанятым чувствовать себя более защищёнными в случае непредвиденных ситуаций или болезни.',
      text: 'Страховой продукт «Работа под защитой» позволит самозанятым в случае болезни, несчастного случая или наступления гражданской ответственности получить достойную компенсацию.',
      image: workSelfEmployedImage
    }
  ],
  travel: [
    {
      title: 'Защита здоровья и денег в заграничных путешествиях',
      accent: 'Сохраним ваши деньги на банковской карте и возместим медицинские расходы за границей.',
      text: 'Комплексный страховой полис сочетает в себе защиту ваших денег на банковской карте, а в случае поездки за границу ваше здоровье будет под надёжной защитой.',
      image: travelAbroadImage
    },
    {
      title: 'Максимальная защита в путешествиях по России',
      accent: 'Возьмём на себя расходы, связанные с непредвиденными ситуациями в путешествии по России.',
      text: 'Страхование путешествующих по России - это возможность не думать ни о чем, кроме отдыха. Вы можете застраховаться от медицинских расходов и дополнительных рисков.',
      image: travelRussiaImage
    }
  ],
  animals: [
    {
      title: 'Защита питомца',
      accent: 'Вы получите профессиональную консультацию и/или денежную компенсацию, если ваш питомец заболеет, травмируется или пострадает от укуса клеща.',
      text: 'Благодаря страховому продукту «Защита вашего питомца» вы можете компенсировать ветеринарные расходы и получать дистанционные консультации ветеринара 24/7 из любой точки мира.',
      image: animalsPetImage
    },
    {
      title: 'Защита животных и птицы',
      accent: 'Получите консультацию или денежную компенсацию в случае болезни и падежа сельскохозяйственных животных.',
      text: 'Благодаря страхованию вы можете покрыть расходы, связанные с болезнью или падежом животных, содержащихся в личных подсобных хозяйствах, а также получить консультацию.',
      image: animalsFarmImage
    }
  ],
  kids: [
    {
      title: 'Ребёнок под защитой',
      accent: 'Защитите своих детей от непредвиденных ситуаций, связанных с причинением вреда жизни или здоровью в результате несчастного случая.',
      bullets: [
        'Страховая выплата - до 500 000 рублей',
        'Оформление за несколько минут без документов',
        'Занятия спортом включены в покрытие'
      ],
      image: kidsProtectionImage
    }
  ]
};

const RECIPIENT_OPTIONS = [
  { value: 'myself', label: 'Для себя', leadingIcon: <PersonIcon /> },
  { value: 'gift', label: 'В подарок', leadingIcon: <GiftIcon /> }
];

const TARIFF_OPTIONS = [
  { value: 'individual', label: 'Индивидуальный' },
  { value: 'family', label: 'Семейный' }
];

const TERM_OPTIONS = [
  { value: '1', label: '1 год' },
  { value: '2', label: '2 года' }
];

const SUM_OPTIONS = [
  { value: '150000', label: '150 000 ₽' },
  { value: '250000', label: '250 000 ₽' },
  { value: '500000', label: '500 000 ₽' },
  { value: '1000000', label: '1 000 000 ₽' }
];

const PRICE_TABLE = {
  individual: {
    1: {
      150000: { price: 1575 },
      250000: { price: 2625 },
      500000: { price: 5250 },
      1000000: { price: 10500 }
    },
    2: {
      150000: { price: 2925, oldPrice: 3150 },
      250000: { price: 4875, oldPrice: 5250 },
      500000: { price: 9750, oldPrice: 10500 },
      1000000: { price: 19500, oldPrice: 21000 }
    }
  },
  family: {
    1: {
      150000: { price: 1875 },
      250000: { price: 3125 },
      500000: { price: 6250 },
      1000000: { price: 12500 }
    },
    2: {
      150000: { price: 3450, oldPrice: 3750 },
      250000: { price: 5750, oldPrice: 6250 },
      500000: { price: 11500, oldPrice: 12500 },
      1000000: { price: 23000, oldPrice: 24000 }
    }
  }
};

function PersonIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M9 9.25C11.0711 9.25 12.75 7.57107 12.75 5.5C12.75 3.42893 11.0711 1.75 9 1.75C6.92893 1.75 5.25 3.42893 5.25 5.5C5.25 7.57107 6.92893 9.25 9 9.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M3.75 16.25C3.75 13.3505 6.10051 11 9 11C11.8995 11 14.25 13.3505 14.25 16.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M2.5 8.25H15.5V15.5C15.5 15.9142 15.1642 16.25 14.75 16.25H3.25C2.83579 16.25 2.5 15.9142 2.5 15.5V8.25Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M9 5.5V16.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path
        d="M1.75 5.5H16.25V8.25H1.75V5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8.75 5.5H5.75C4.64543 5.5 3.75 4.60457 3.75 3.5C3.75 2.67157 4.42157 2 5.25 2C7 2 8.75 5.5 8.75 5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9.25 5.5H12.25C13.3546 5.5 14.25 4.60457 14.25 3.5C14.25 2.67157 13.5784 2 12.75 2C11 2 9.25 5.5 9.25 5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M4.5 6.75L9 11.25L13.5 6.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M5.25 1.75H10.3L14.25 5.7V15.5C14.25 15.9142 13.9142 16.25 13.5 16.25H5.25C4.42157 16.25 3.75 15.5784 3.75 14.75V3.25C3.75 2.42157 4.42157 1.75 5.25 1.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M10.25 1.75V5.75H14.25" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M6.5 9.5H11.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M6.5 12.25H10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function PhonePaymentIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M6.25 2.25H11.75C12.5784 2.25 13.25 2.92157 13.25 3.75V14.25C13.25 15.0784 12.5784 15.75 11.75 15.75H6.25C5.42157 15.75 4.75 15.0784 4.75 14.25V3.75C4.75 2.92157 5.42157 2.25 6.25 2.25Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M8 12.75H10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function CardPaymentIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M2.75 5.25C2.75 4.42157 3.42157 3.75 4.25 3.75H13.75C14.5784 3.75 15.25 4.42157 15.25 5.25V12.75C15.25 13.5784 14.5784 14.25 13.75 14.25H4.25C3.42157 14.25 2.75 13.5784 2.75 12.75V5.25Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M3 7H15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 11.25H8.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function CalendarAdornment() {
  return (
    <span className="rshb-policy-issuance__input-adornment">
      <span
        aria-hidden="true"
        className="rshb-policy-issuance__input-icon"
        style={{ '--rshb-policy-issuance-input-icon': 'url("' + calendarIcon + '")' }}
      />
    </span>
  );
}

function formatMoneyNumber(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function Money(props) {
  const { value } = props;

  return (
    <>
      {formatMoneyNumber(value)}
      {' '}
      <span className="rshb-policy-issuance__currency">₽</span>
    </>
  );
}

function padDateSegment(value) {
  return String(value).padStart(2, '0');
}

function addYears(value, years) {
  const nextDate = new Date(value);
  nextDate.setFullYear(nextDate.getFullYear() + Number(years));

  return nextDate;
}

function formatDate(value) {
  return (
    padDateSegment(value.getDate()) +
    '.' +
    padDateSegment(value.getMonth() + 1) +
    '.' +
    value.getFullYear()
  );
}

function getTermPeriod(term) {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() + 1);

  const endDate = addYears(startDate, term);
  endDate.setDate(endDate.getDate() - 1);

  return formatDate(startDate) + '–' + formatDate(endDate);
}

function getOptionLabel(options, value) {
  const match = options.find(function (option) {
    return option.value === value;
  });

  return match ? match.label : '';
}

function getPrice(tariff, term, sum) {
  return PRICE_TABLE[tariff][term][sum];
}

function getPromoPrice(price) {
  return Math.round(price * (1 - PROMO_DISCOUNT));
}

function getPhoneDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function updateObjectField(currentValue, fieldName, value) {
  return Object.assign({}, currentValue, { [fieldName]: value });
}

function formatFullName(person) {
  const parts = [
    person.lastName,
    person.firstName,
    person.noMiddleName ? '' : person.middleName
  ].filter(Boolean);

  return parts.join(' ');
}

function formatGender(value) {
  if (value === 'male') {
    return 'Мужчина';
  }

  if (value === 'female') {
    return 'Женщина';
  }

  return '';
}

function formatPhone(value) {
  const digits = getPhoneDigits(value);

  if (digits.length !== 10) {
    return value;
  }

  return (
    '+7 (' +
    digits.slice(0, 3) +
    ') ' +
    digits.slice(3, 6) +
    '-' +
    digits.slice(6, 8) +
    '-' +
    digits.slice(8)
  );
}

function resolveDataValue(value) {
  return value || 'Не указано';
}

function isPhoneMatch(phoneDigits, fullPhoneDigits) {
  return phoneDigits === fullPhoneDigits || phoneDigits === fullPhoneDigits.slice(1);
}

function resolvePolicyholderForPhone(phone, policyholder) {
  const phoneDigits = getPhoneDigits(phone);

  if (isPhoneMatch(phoneDigits, PREFILLED_POLICYHOLDER_PHONE)) {
    return Object.assign({}, policyholder, PREFILLED_POLICYHOLDER);
  }

  return policyholder;
}

function PolicyCard(props) {
  const { card, index, onCalculate } = props;

  function handleCalculate() {
    onCalculate(card);
  }

  return (
    <Card className="rshb-policy-issuance__card" dataId={'policy-card-' + (index + 1)}>
      <div className="rshb-policy-issuance__card-content">
        <div className="rshb-policy-issuance__card-copy">
          <h2 className="rshb-policy-issuance__card-title">{card.title}</h2>
          <p className="rshb-policy-issuance__card-accent">{card.accent}</p>
          {card.bullets ? (
            <ul className="rshb-policy-issuance__card-list">
              {card.bullets.map(function (item) {
                return <li key={item}>{item}</li>;
              })}
            </ul>
          ) : (
            <p className="rshb-policy-issuance__card-text">{card.text}</p>
          )}
        </div>
        <div className="rshb-policy-issuance__actions">
          <Button
            className="rshb-policy-issuance__button"
            dataId={'policy-card-' + (index + 1) + '-calculate'}
            onClick={handleCalculate}
            onMouseDown={handleCalculate}
          >
            Рассчитать стоимость
          </Button>
          <Button
            buttonType="secondary"
            className="rshb-policy-issuance__button"
            dataId={'policy-card-' + (index + 1) + '-details'}
          >
            Подробнее
          </Button>
        </div>
      </div>
      <div className="rshb-policy-issuance__image-wrap">
        <img alt="" className="rshb-policy-issuance__image" src={card.image} />
      </div>
    </Card>
  );
}

function PolicySelect(props) {
  const { dataId, label, onChange, options, value } = props;
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedLabel = getOptionLabel(options, value);

  useEffect(function () {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return function () {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen]);

  function handleSelect(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div className="rshb-policy-issuance__select" data-open={isOpen ? 'true' : 'false'} ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="rshb-policy-issuance__select-control"
        data-filled={selectedLabel ? 'true' : 'false'}
        data-id={dataId}
        onClick={function () {
          setIsOpen(!isOpen);
        }}
        type="button"
      >
        <span className="rshb-policy-issuance__select-content">
          <span className="rshb-policy-issuance__select-label">{label}</span>
          <span className="rshb-policy-issuance__select-value">{selectedLabel}</span>
        </span>
        <span aria-hidden="true" className="rshb-policy-issuance__select-arrow">
          <ChevronDownIcon />
        </span>
      </button>
      {isOpen ? (
        <div className="rshb-policy-issuance__dropdown" role="listbox">
          {options.map(function (option) {
            const isSelected = option.value === value;

            return (
              <button
                aria-selected={isSelected}
                className="rshb-policy-issuance__dropdown-item"
                data-selected={isSelected ? 'true' : 'false'}
                key={option.value}
                onClick={function () {
                  handleSelect(option.value);
                }}
                role="option"
                type="button"
              >
                <span className="rshb-policy-issuance__dropdown-text">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Parameters(props) {
  const { sum, tariff, term, onSumChange, onTariffChange, onTermChange } = props;

  return (
    <div className="rshb-policy-issuance__params">
      <PolicySelect
        dataId="policy-tariff-select"
        label="Тариф"
        onChange={onTariffChange}
        options={TARIFF_OPTIONS}
        value={tariff}
      />
      <PolicySelect
        dataId="policy-term-select"
        label="Срок страхования"
        onChange={onTermChange}
        options={TERM_OPTIONS}
        value={term}
      />
      <PolicySelect
        dataId="policy-sum-select"
        label="Страховая сумма"
        onChange={onSumChange}
        options={SUM_OPTIONS}
        value={sum}
      />
    </div>
  );
}

function Total(props) {
  const { promoApplied, sum, tariff, term } = props;
  const price = getPrice(tariff, term, sum);
  const shownPrice = promoApplied ? getPromoPrice(price.price) : price.price;
  const oldPrice = promoApplied ? price.price : price.oldPrice;

  return (
    <Card className="rshb-policy-issuance__total" dataId="policy-total">
      <SummaryItem label="Название полиса" value={FAMILY_ACCIDENT_TITLE} />
      <SummaryItem label="Тариф" value={getOptionLabel(TARIFF_OPTIONS, tariff)} />
      <SummaryItem label="Срок страхования" value={getTermPeriod(term)} />
      <SummaryItem label="Страховая сумма" value={getOptionLabel(SUM_OPTIONS, sum)} />
      <div className="rshb-policy-issuance__summary-item">
        <p className="rshb-policy-issuance__summary-label">Страховая премия</p>
        <div className="rshb-policy-issuance__price-row">
          <span className="rshb-policy-issuance__price"><Money value={shownPrice} /></span>
          {oldPrice ? (
            <span className="rshb-policy-issuance__old-price"><Money value={oldPrice} /></span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function SummaryItem(props) {
  const { label, value } = props;

  return (
    <div className="rshb-policy-issuance__summary-item">
      <p className="rshb-policy-issuance__summary-label">{label}</p>
      <p className="rshb-policy-issuance__summary-value">{value}</p>
    </div>
  );
}

function Documents() {
  return (
    <div className="rshb-policy-issuance__documents">
      <button className="rshb-policy-issuance__document" data-id="policy-rules-document" type="button">
        <span className="rshb-policy-issuance__document-icon">
          <DocumentIcon />
        </span>
        <span className="rshb-policy-issuance__document-copy">
          <span className="rshb-policy-issuance__document-title">Правила страхования</span>
          <span className="rshb-policy-issuance__document-meta">10 МБ</span>
        </span>
      </button>
    </div>
  );
}

function Information(props) {
  const { promoApplied, sum, tariff, term } = props;

  return (
    <aside className="rshb-policy-issuance__information">
      <Total promoApplied={promoApplied} sum={sum} tariff={tariff} term={term} />
      <Documents />
    </aside>
  );
}

function PhoneConsent(props) {
  const {
    checkboxDataId,
    consentChecked,
    disabledPhone,
    onConsentChange,
    onPhoneChange,
    phone,
    policyText,
    showConsent
  } = props;

  return (
    <div className="rshb-policy-issuance__phone-stack">
      <InputPhone
        className="rshb-policy-issuance__field"
        dataId="policy-phone"
        disabled={disabledPhone}
        onValueChange={onPhoneChange}
        value={phone}
        width="100%"
      />
      <p className="rshb-policy-issuance__field-hint">
        По этому номеру телефона мы узнаем, регистрировались ли вы ранее.
      </p>
      {showConsent ? (
        <Checkbox
          checked={consentChecked}
          className="rshb-policy-issuance__consent"
          dataId={checkboxDataId}
          label={(
            <>
              Соглашаюсь на{' '}
              <span className="rshb-policy-issuance__inline-link">
                передачу и обработку
              </span>{' '}
              {policyText}
            </>
          )}
          onChange={function (event) {
            onConsentChange(event.target.checked);
          }}
          size="s"
        />
      ) : null}
    </div>
  );
}

function PromoCodeField(props) {
  const { onApplyPromoCode, onPromoCodeChange, promoCode } = props;
  const isApplyDisabled = promoCode.trim().length === 0;

  return (
    <div className="rshb-policy-issuance__promo">
      <InputText
        className="rshb-policy-issuance__field rshb-policy-issuance__promo-field"
        dataId="policy-promo-code"
        label="Промокод"
        onValueChange={onPromoCodeChange}
        value={promoCode}
        width="100%"
      />
      <Button
        buttonType="secondary"
        className="rshb-policy-issuance__promo-button"
        dataId="policy-apply-promo-code"
        disabled={isApplyDisabled}
        onClick={onApplyPromoCode}
      >
        Применить
      </Button>
    </div>
  );
}

function CodeForm(props) {
  const {
    code,
    isSubmittingCode,
    onBack,
    onChangePhone,
    onCodeChange,
    onSubmitCode,
    onResendCode,
    phone,
    resendSeconds
  } = props;
  const canSubmit = code.length === 4 && !isSubmittingCode;

  return (
    <div className="rshb-policy-issuance__code-stack">
      <InputPhone
        className="rshb-policy-issuance__field"
        dataId="policy-phone-confirmed"
        disabled
        value={phone}
        width="100%"
      />
      <p className="rshb-policy-issuance__field-hint">
        По этому номеру телефона мы узнаем, регистрировались ли вы ранее.
      </p>
      <InputCode
        className="rshb-policy-issuance__field"
        dataId="policy-code"
        onValueChange={onCodeChange}
        value={code}
        width="100%"
      />
      <div className="rshb-policy-issuance__timer">
        {resendSeconds > 0 ? (
          <span>Получить новый код через {resendSeconds} сек</span>
        ) : (
          <TextLink as="button" dataId="policy-resend-code" onClick={onResendCode} size="s">
            Получить новый код
          </TextLink>
        )}
      </div>
      <TextLink
        as="button"
        className="rshb-policy-issuance__change-phone"
        dataId="policy-change-phone"
        onClick={onChangePhone}
        size="s"
      >
        Изменить номер телефона
      </TextLink>
      <ButtonsRow
        canContinue={canSubmit}
        isLoading={isSubmittingCode}
        onBack={onBack}
        onContinue={onSubmitCode}
      />
    </div>
  );
}

function ButtonsRow(props) {
  const { canContinue, isLoading, onBack, onContinue } = props;

  return (
    <div className="rshb-policy-issuance__form-buttons">
      <Button
        buttonType="flat-primary"
        className="rshb-policy-issuance__form-button"
        dataId="policy-back"
        onClick={onBack}
      >
        Назад
      </Button>
      <Button
        className="rshb-policy-issuance__form-button"
        dataId="policy-continue"
        disabled={!canContinue}
        loading={isLoading}
        onClick={onContinue}
      >
        Продолжить
      </Button>
    </div>
  );
}

function GiftForm(props) {
  const { beneficiary, onBeneficiaryChange } = props;

  function setBeneficiaryField(fieldName, value) {
    onBeneficiaryChange(Object.assign({}, beneficiary, { [fieldName]: value }));
  }

  return (
    <div className="rshb-policy-issuance__section">
      <div className="rshb-policy-issuance__section-copy">
        <p className="rshb-policy-issuance__section-title">Данные выгодоприобретателя</p>
        <p className="rshb-policy-issuance__section-description">
          Выгодоприобретатель — тот, кто получит выплату при наступлении страхового случая.
        </p>
      </div>
      <div className="rshb-policy-issuance__fields">
        <InputSurname
          className="rshb-policy-issuance__field"
          dataId="beneficiary-last-name"
          onValueChange={function (value) {
            setBeneficiaryField('lastName', value);
          }}
          value={beneficiary.lastName}
          width="100%"
        />
        <InputName
          className="rshb-policy-issuance__field"
          dataId="beneficiary-first-name"
          onValueChange={function (value) {
            setBeneficiaryField('firstName', value);
          }}
          value={beneficiary.firstName}
          width="100%"
        />
        <InputMiddleName
          className="rshb-policy-issuance__field"
          dataId="beneficiary-middle-name"
          onSwitchChange={function (checked) {
            setBeneficiaryField('noMiddleName', checked);
          }}
          onValueChange={function (value) {
            setBeneficiaryField('middleName', value);
          }}
          switchChecked={beneficiary.noMiddleName}
          value={beneficiary.middleName}
          width="100%"
        />
        <div className="rshb-policy-issuance__date-gender">
          <InputBirthDate
            className="rshb-policy-issuance__field"
            dataId="beneficiary-birth-date"
            label="Дата рождения"
            onValueChange={function (value) {
              setBeneficiaryField('birthDate', value);
            }}
            value={beneficiary.birthDate}
            width="100%"
          />
          <Gender
            className="rshb-policy-issuance__gender"
            dataId="beneficiary-gender"
            onChange={function (value) {
              setBeneficiaryField('gender', value);
            }}
            value={beneficiary.gender}
          />
        </div>
      </div>
    </div>
  );
}

function PassportForm(props) {
  const { passport, onPassportChange } = props;

  function setPassportField(fieldName, value) {
    onPassportChange(updateObjectField(passport, fieldName, value));
  }

  return (
    <div className="rshb-policy-issuance__details-section">
      <div className="rshb-policy-issuance__section-copy">
        <p className="rshb-policy-issuance__details-heading">Паспортные данные</p>
        <p className="rshb-policy-issuance__section-description">Нужны для заключения договора.</p>
      </div>
      <div className="rshb-policy-issuance__fields">
        <InputText
          className="rshb-policy-issuance__field"
          dataId="policy-passport-number"
          label="Серия и номер"
          onValueChange={function (value) {
            setPassportField('number', value);
          }}
          value={passport.number}
          width="100%"
        />
        <div className="rshb-policy-issuance__two-fields">
          <InputText
            className="rshb-policy-issuance__field"
            dataId="policy-passport-code"
            label="Код подразделения"
            onValueChange={function (value) {
              setPassportField('divisionCode', value);
            }}
            value={passport.divisionCode}
            width="100%"
          />
          <InputText
            className="rshb-policy-issuance__field"
            dataId="policy-passport-date"
            endAdornment={<CalendarAdornment />}
            label="Дата выдачи"
            onValueChange={function (value) {
              setPassportField('issueDate', value);
            }}
            value={passport.issueDate}
            width="100%"
          />
        </div>
        <InputText
          className="rshb-policy-issuance__field"
          dataId="policy-passport-issued-by"
          label="Кем выдан"
          onValueChange={function (value) {
            setPassportField('issuedBy', value);
          }}
          value={passport.issuedBy}
          width="100%"
        />
      </div>
    </div>
  );
}

function PolicyholderDetailsForm(props) {
  const { policyholder, onPolicyholderChange } = props;

  function setPolicyholderField(fieldName, value) {
    onPolicyholderChange(updateObjectField(policyholder, fieldName, value));
  }

  return (
    <div className="rshb-policy-issuance__details-section">
      <div className="rshb-policy-issuance__section-copy">
        <p className="rshb-policy-issuance__details-heading">Данные страхователя</p>
        <p className="rshb-policy-issuance__section-description">
          Страхователь — тот, кто оформляет полис.
        </p>
      </div>
      <div className="rshb-policy-issuance__fields">
        <InputSurname
          className="rshb-policy-issuance__field"
          dataId="policyholder-last-name"
          onValueChange={function (value) {
            setPolicyholderField('lastName', value);
          }}
          value={policyholder.lastName}
          width="100%"
        />
        <InputName
          className="rshb-policy-issuance__field"
          dataId="policyholder-first-name"
          onValueChange={function (value) {
            setPolicyholderField('firstName', value);
          }}
          value={policyholder.firstName}
          width="100%"
        />
        <InputMiddleName
          className="rshb-policy-issuance__field"
          dataId="policyholder-middle-name"
          onSwitchChange={function (checked) {
            setPolicyholderField('noMiddleName', checked);
          }}
          onValueChange={function (value) {
            setPolicyholderField('middleName', value);
          }}
          switchChecked={policyholder.noMiddleName}
          value={policyholder.middleName}
          width="100%"
        />
        <div className="rshb-policy-issuance__date-gender">
          <InputBirthDate
            className="rshb-policy-issuance__field"
            dataId="policyholder-birth-date"
            label="Дата рождения"
            onValueChange={function (value) {
              setPolicyholderField('birthDate', value);
            }}
            value={policyholder.birthDate}
            width="100%"
          />
          <Gender
            className="rshb-policy-issuance__gender"
            dataId="policyholder-gender"
            onChange={function (value) {
              setPolicyholderField('gender', value);
            }}
            value={policyholder.gender}
          />
        </div>
        <InputText
          className="rshb-policy-issuance__field"
          dataId="policyholder-email"
          label="Адрес электронной почты"
          onValueChange={function (value) {
            setPolicyholderField('email', value);
          }}
          value={policyholder.email}
          width="100%"
        />
        <p className="rshb-policy-issuance__field-hint">
          По этому адресу мы отправим вам документы.
        </p>
      </div>
    </div>
  );
}

function DetailsActions(props) {
  const { consentChecked, isLoading, onBack, onConsentChange, onSubmit } = props;

  return (
    <div className="rshb-policy-issuance__details-actions">
      <Checkbox
        checked={consentChecked}
        className="rshb-policy-issuance__consent rshb-policy-issuance__details-consent"
        dataId="policy-details-personal-data"
        label={(
          <>
            Соглашаюсь на{' '}
            <span className="rshb-policy-issuance__inline-link">
              передачу и обработку
            </span>{' '}
            персональных данных.
          </>
        )}
        onChange={function (event) {
          onConsentChange(event.target.checked);
        }}
        size="s"
      />
      <ButtonsRow
        canContinue={consentChecked}
        isLoading={isLoading}
        onBack={onBack}
        onContinue={onSubmit}
      />
    </div>
  );
}

function ProofIdentityModal(props) {
  const {
    isLoading,
    onClose,
    onSubmit,
    onSurnameChange,
    surname
  } = props;

  return (
    <DialogModal
      closeOnPrimaryAction={false}
      dataId="policy-proof-identity-modal"
      inputProps={{
        dataId: 'policy-proof-identity-surname',
        onValueChange: onSurnameChange,
        value: surname
      }}
      onClose={onClose}
      onPrimaryAction={onSubmit}
      onTertiaryAction={onClose}
      placement="top-center"
      primaryActionDisabled={!surname || isLoading}
      primaryActionLoading={isLoading}
      template="proof-of-identity"
      tertiaryActionDisabled={isLoading}
    />
  );
}

function CaptchaModal(props) {
  const {
    captchaValue,
    isLoading,
    onCaptchaChange,
    onClose,
    onSubmit,
    template
  } = props;

  const isTimeout = template === 'timeout';

  return (
    <DialogModal
      captchaLabel="8К7МН4"
      closeOnPrimaryAction={false}
      dataId="policy-captcha-modal"
      inputProps={
        isTimeout
          ? undefined
          : {
              dataId: 'policy-captcha-code',
              onValueChange: onCaptchaChange,
              value: captchaValue
            }
      }
      onClose={onClose}
      onPrimaryAction={isTimeout ? undefined : onSubmit}
      onTertiaryAction={onClose}
      placement="top-center"
      primaryActionDisabled={isTimeout ? undefined : !captchaValue || isLoading}
      primaryActionLoading={isTimeout ? undefined : isLoading}
      template={template}
      tertiaryActionDisabled={isLoading}
    />
  );
}

function LogInThroughTheGosuslugiModal(props) {
  const { onClose, onCreateAccount } = props;

  return (
    <DialogModal
      dataId="policy-log-in-through-gosuslugi-modal"
      onClose={onClose}
      onSecondaryAction={onCreateAccount}
      onTertiaryAction={onClose}
      placement="top-center"
      template="log-in-through-the-gosuslugi"
    />
  );
}

function EnterInformationScreen(props) {
  const {
    consentChecked,
    includePolicyholder,
    isSubmittingDetails,
    onBackToCustomization,
    onConsentChange,
    onPassportChange,
    onPolicyholderChange,
    onSubmitDetails,
    passport,
    policyholder,
    promoApplied,
    sum,
    tariff,
    term
  } = props;

  return (
    <section className="rshb-policy-issuance__customization" aria-labelledby="policy-enter-title">
      <div className="rshb-policy-issuance__custom-title-block">
        <p className="rshb-policy-issuance__eyebrow">Шаг 3 из 4</p>
        <h1 className="rshb-policy-issuance__title" id="policy-enter-title">
          Укажите информацию
        </h1>
      </div>
      <div className="rshb-policy-issuance__custom-grid">
        <Card className="rshb-policy-issuance__details-card" dataId="policy-enter-details-card">
          {includePolicyholder ? (
            <PolicyholderDetailsForm
              onPolicyholderChange={onPolicyholderChange}
              policyholder={policyholder}
            />
          ) : null}
          <PassportForm onPassportChange={onPassportChange} passport={passport} />
          <DetailsActions
            consentChecked={consentChecked}
            isLoading={isSubmittingDetails}
            onBack={onBackToCustomization}
            onConsentChange={onConsentChange}
            onSubmit={onSubmitDetails}
          />
        </Card>
        <Information promoApplied={promoApplied} sum={sum} tariff={tariff} term={term} />
      </div>
    </section>
  );
}

function CheckDataRow(props) {
  const { label, text } = props;

  return (
    <div className="rshb-policy-issuance__check-row">
      <p className="rshb-policy-issuance__check-label">{label}</p>
      <p className="rshb-policy-issuance__check-value">{resolveDataValue(text)}</p>
    </div>
  );
}

function CheckDataGroup(props) {
  const { children, title } = props;

  return (
    <div className="rshb-policy-issuance__check-group">
      {title ? <p className="rshb-policy-issuance__check-subheading">{title}</p> : null}
      <div className="rshb-policy-issuance__check-rows">
        {children}
      </div>
    </div>
  );
}

function PaymentMethod(props) {
  const { checked, label, onChange, value } = props;

  return (
    <label className="rshb-policy-issuance__payment-method" data-checked={checked ? 'true' : 'false'}>
      <input
        checked={checked}
        className="rshb-policy-issuance__payment-input"
        name="policy-payment-method"
        onChange={function () {
          onChange(value);
        }}
        type="radio"
        value={value}
      />
      <span aria-hidden="true" className="rshb-policy-issuance__payment-icon">
        {value === 'yandex-pay' ? <PhonePaymentIcon /> : <CardPaymentIcon />}
      </span>
      <span className="rshb-policy-issuance__payment-label">{label}</span>
      <span aria-hidden="true" className="rshb-policy-issuance__payment-radio">
        <span className="rshb-policy-issuance__payment-radio-dot" />
      </span>
    </label>
  );
}

function PaymentMethods(props) {
  const { onPaymentMethodChange, paymentMethod } = props;

  return (
    <div className="rshb-policy-issuance__payment">
      <p className="rshb-policy-issuance__check-heading">Выберите способ оплаты</p>
      <div className="rshb-policy-issuance__payment-list" role="radiogroup" aria-label="Способ оплаты">
        {PAYMENT_OPTIONS.map(function (option) {
          return (
            <PaymentMethod
              checked={option.value === paymentMethod}
              key={option.value}
              label={option.label}
              onChange={onPaymentMethodChange}
              value={option.value}
            />
          );
        })}
      </div>
    </div>
  );
}

function CheckPolicyholderData(props) {
  const { phone, policyholder } = props;
  const resolvedPolicyholder = resolvePolicyholderForPhone(phone, policyholder);

  return (
    <div className="rshb-policy-issuance__check-section">
      <div className="rshb-policy-issuance__check-copy">
        <p className="rshb-policy-issuance__check-heading">Данные страхователя</p>
        <p className="rshb-policy-issuance__section-description">
          Страхователь — тот, кто оформляет полис.
        </p>
      </div>
      <CheckDataGroup title="Персональные данные">
        <CheckDataRow label="ФИО" text={formatFullName(resolvedPolicyholder)} />
        <CheckDataRow label="Дата рождения" text={resolvedPolicyholder.birthDate} />
        <CheckDataRow label="Пол" text={formatGender(resolvedPolicyholder.gender)} />
      </CheckDataGroup>
    </div>
  );
}

function CheckContactData(props) {
  const { phone, policyholder } = props;
  const resolvedPolicyholder = resolvePolicyholderForPhone(phone, policyholder);

  return (
    <CheckDataGroup title="Контактные данные">
      <CheckDataRow label="Номер телефона" text={formatPhone(phone)} />
      <CheckDataRow label="Адрес электронной почты" text={resolvedPolicyholder.email} />
    </CheckDataGroup>
  );
}

function CheckPassportData(props) {
  const { passport } = props;

  return (
    <CheckDataGroup title="Паспортные данные">
      <CheckDataRow label="Серия и номер" text={passport.number} />
      <CheckDataRow label="Код подразделения" text={passport.divisionCode} />
      <CheckDataRow label="Дата выдачи" text={passport.issueDate} />
      <CheckDataRow label="Кем выдан" text={passport.issuedBy} />
    </CheckDataGroup>
  );
}

function CheckBeneficiaryData(props) {
  const { beneficiary } = props;

  return (
    <div className="rshb-policy-issuance__check-section">
      <div className="rshb-policy-issuance__check-copy">
        <p className="rshb-policy-issuance__check-heading">Данные выгодоприобретателя</p>
        <p className="rshb-policy-issuance__section-description">
          Выгодоприобретатель — тот, кто получит выплату при наступлении страхового случая.
        </p>
      </div>
      <CheckDataGroup>
        <CheckDataRow label="ФИО" text={formatFullName(beneficiary)} />
        <CheckDataRow label="Дата рождения" text={beneficiary.birthDate} />
        <CheckDataRow label="Пол" text={formatGender(beneficiary.gender)} />
      </CheckDataGroup>
    </div>
  );
}

function CheckActions(props) {
  const { onEdit } = props;

  return (
    <div className="rshb-policy-issuance__check-actions">
      <Button
        buttonType="flat-primary"
        className="rshb-policy-issuance__check-button"
        dataId="policy-check-edit"
        onClick={onEdit}
      >
        Изменить
      </Button>
      <Button
        className="rshb-policy-issuance__check-button"
        dataId="policy-check-pay"
      >
        Перейти к оплате
      </Button>
    </div>
  );
}

function CheckDataScreen(props) {
  const {
    beneficiary,
    includeBeneficiary,
    includePassport,
    onEdit,
    onPaymentMethodChange,
    passport,
    paymentMethod,
    phone,
    policyholder,
    promoApplied,
    sum,
    tariff,
    term
  } = props;

  return (
    <section className="rshb-policy-issuance__customization" aria-labelledby="policy-check-title">
      <div className="rshb-policy-issuance__custom-title-block">
        <p className="rshb-policy-issuance__eyebrow">Шаг 4 из 4</p>
        <h1 className="rshb-policy-issuance__title" id="policy-check-title">
          Проверьте данные
        </h1>
      </div>
      <div className="rshb-policy-issuance__custom-grid">
        <Card className="rshb-policy-issuance__check-card" dataId="policy-check-card">
          <CheckPolicyholderData phone={phone} policyholder={policyholder} />
          {includePassport ? <CheckPassportData passport={passport} /> : null}
          <CheckContactData phone={phone} policyholder={policyholder} />
          {includeBeneficiary ? <CheckBeneficiaryData beneficiary={beneficiary} /> : null}
          <PaymentMethods
            onPaymentMethodChange={onPaymentMethodChange}
            paymentMethod={paymentMethod}
          />
          <CheckActions onEdit={onEdit} />
        </Card>
        <Information promoApplied={promoApplied} sum={sum} tariff={tariff} term={term} />
      </div>
    </section>
  );
}

function ParametersSection(props) {
  const { children, hasDivider, title } = props;

  return (
    <div
      className={classNames(
        'rshb-policy-issuance__section',
        hasDivider && 'rshb-policy-issuance__section--with-divider'
      )}
    >
      {title ? (
        <div className="rshb-policy-issuance__section-copy">
          <p className="rshb-policy-issuance__section-title">{title}</p>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function PolicyholderSection(props) {
  const { afterDivider, children, isGift } = props;

  return (
    <div
      className={classNames(
        'rshb-policy-issuance__section',
        afterDivider && 'rshb-policy-issuance__section--after-divider'
      )}
    >
      {isGift ? (
        <div className="rshb-policy-issuance__section-copy">
          <p className="rshb-policy-issuance__section-title">Данные страхователя</p>
          <p className="rshb-policy-issuance__section-description">
            Страхователь — тот, кто оформляет полис.
          </p>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function CustomizeScreen(props) {
  const {
    beneficiary,
    code,
    consentChecked,
    isSubmittingCode,
    isSubmittingPhone,
    onBackToSelection,
    onBeneficiaryChange,
    onChangePhone,
    onCodeChange,
    onConsentChange,
    onApplyPromoCode,
    onPhoneChange,
    onPromoCodeChange,
    onRecipientChange,
    onResendCode,
    onSubmitCode,
    onSubmitPhone,
    onSumChange,
    onTariffChange,
    onTermChange,
    phone,
    promoApplied,
    promoCode,
    recipient,
    resendSeconds,
    sum,
    tariff,
    term
  } = props;
  const isGift = recipient === 'gift';
  const isCodeStep = Boolean(phone) && props.step === 'code';
  const isBeneficiaryComplete = !isGift || (
    beneficiary.lastName.trim().length > 0 &&
    beneficiary.firstName.trim().length > 0 &&
    (beneficiary.noMiddleName || beneficiary.middleName.trim().length > 0) &&
    beneficiary.birthDate.trim().length === 10 &&
    Boolean(beneficiary.gender)
  );
  const canSubmitPhone = (
    getPhoneDigits(phone).length === 10 &&
    consentChecked &&
    isBeneficiaryComplete &&
    !isSubmittingPhone
  );

  return (
    <section className="rshb-policy-issuance__customization" aria-labelledby="policy-customization-title">
      <div className="rshb-policy-issuance__custom-title-block">
        <p className="rshb-policy-issuance__eyebrow">Шаг 2 из 4</p>
        <h1 className="rshb-policy-issuance__title" id="policy-customization-title">
          Настройте полис
        </h1>
      </div>
      <div className="rshb-policy-issuance__custom-grid">
        <Card className="rshb-policy-issuance__custom-card" dataId="policy-customization-card">
          <p className="rshb-policy-issuance__custom-heading">Параметры</p>
          <SegmentedControl
            className="rshb-policy-issuance__recipient"
            dataId="policy-recipient"
            onChange={onRecipientChange}
            options={RECIPIENT_OPTIONS}
            value={recipient}
          />
          {isGift ? (
            <GiftForm
              beneficiary={beneficiary}
              onBeneficiaryChange={onBeneficiaryChange}
            />
          ) : null}
          <ParametersSection hasDivider={!isGift} title={isGift ? 'Условия полиса' : undefined}>
            <Parameters
              onSumChange={onSumChange}
              onTariffChange={onTariffChange}
              onTermChange={onTermChange}
              sum={sum}
              tariff={tariff}
              term={term}
            />
            {!isGift ? <div className="rshb-policy-issuance__divider" /> : null}
          </ParametersSection>
          <PolicyholderSection afterDivider={!isGift} isGift={isGift}>
            {isCodeStep ? (
              <div className="rshb-policy-issuance__phone-stack">
                <PromoCodeField
                  onApplyPromoCode={onApplyPromoCode}
                  onPromoCodeChange={onPromoCodeChange}
                  promoCode={promoCode}
                />
                <CodeForm
                  code={code}
                  isSubmittingCode={isSubmittingCode}
                  onBack={onBackToSelection}
                  onChangePhone={onChangePhone}
                  onCodeChange={onCodeChange}
                  onResendCode={onResendCode}
                  onSubmitCode={onSubmitCode}
                  phone={phone}
                  resendSeconds={resendSeconds}
                />
              </div>
            ) : (
              <>
                <div className="rshb-policy-issuance__phone-stack">
                  <PromoCodeField
                    onApplyPromoCode={onApplyPromoCode}
                    onPromoCodeChange={onPromoCodeChange}
                    promoCode={promoCode}
                  />
                  <PhoneConsent
                    checkboxDataId="policy-personal-data"
                    consentChecked={consentChecked}
                    disabledPhone={false}
                    onConsentChange={onConsentChange}
                    onPhoneChange={onPhoneChange}
                    phone={phone}
                    policyText="персональных данных."
                    showConsent
                  />
                </div>
                <ButtonsRow
                  canContinue={canSubmitPhone}
                  isLoading={isSubmittingPhone}
                  onBack={onBackToSelection}
                  onContinue={onSubmitPhone}
                />
              </>
            )}
          </PolicyholderSection>
        </Card>
        <Information promoApplied={promoApplied} sum={sum} tariff={tariff} term={term} />
      </div>
    </section>
  );
}

function PolicyIssuancePrototype(props) {
  const { className, dataId, defaultCategory, ...rest } = props;
  const [category, setCategory] = useState(defaultCategory || 'property');
  const [screen, setScreen] = useState('selection');
  const [checkSourceScreen, setCheckSourceScreen] = useState('customization');
  const [step, setStep] = useState('phone');
  const [recipient, setRecipient] = useState('myself');
  const [tariff, setTariff] = useState('individual');
  const [term, setTerm] = useState('2');
  const [sum, setSum] = useState('250000');
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [code, setCode] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('yandex-pay');
  const [beneficiary, setBeneficiary] = useState({
    birthDate: '',
    firstName: '',
    gender: undefined,
    lastName: '',
    middleName: '',
    noMiddleName: false
  });
  const [policyholder, setPolicyholder] = useState({
    birthDate: '',
    email: '',
    firstName: '',
    gender: undefined,
    lastName: '',
    middleName: '',
    noMiddleName: false
  });
  const [passport, setPassport] = useState({
    divisionCode: '',
    issueDate: '',
    issuedBy: '',
    number: ''
  });
  const [detailsConsentChecked, setDetailsConsentChecked] = useState(false);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_TIMER_SECONDS);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Новый код отправлен');
  const [toastVariant, setToastVariant] = useState('success');
  const [toastKey, setToastKey] = useState(0);
  const [isProofIdentityOpen, setIsProofIdentityOpen] = useState(false);
  const [proofIdentitySurname, setProofIdentitySurname] = useState('');
  const [isSubmittingProofIdentity, setIsSubmittingProofIdentity] = useState(false);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaTemplate, setCaptchaTemplate] = useState('captcha');
  const [isSubmittingCaptcha, setIsSubmittingCaptcha] = useState(false);
  const [isLogInThroughGosuslugiOpen, setIsLogInThroughGosuslugiOpen] = useState(false);
  const phoneTimerRef = useRef(null);
  const codeTimerRef = useRef(null);
  const detailsTimerRef = useRef(null);
  const proofIdentityTimerRef = useRef(null);
  const captchaTimerRef = useRef(null);
  const cards = CATEGORY_CARDS[category] || CATEGORY_CARDS.property;
  const dataIdValue = dataId || rest['data-id'];

  useEffect(function () {
    return function () {
      clearSubmitTimers();
    };
  }, []);

  function clearSubmitTimers() {
    if (phoneTimerRef.current !== null) {
      window.clearTimeout(phoneTimerRef.current);
      phoneTimerRef.current = null;
    }
    if (codeTimerRef.current !== null) {
      window.clearTimeout(codeTimerRef.current);
      codeTimerRef.current = null;
    }
    if (detailsTimerRef.current !== null) {
      window.clearTimeout(detailsTimerRef.current);
      detailsTimerRef.current = null;
    }

    if (proofIdentityTimerRef.current !== null) {
      window.clearTimeout(proofIdentityTimerRef.current);
      proofIdentityTimerRef.current = null;
    }

    if (captchaTimerRef.current !== null) {
      window.clearTimeout(captchaTimerRef.current);
      captchaTimerRef.current = null;
    }
  }

  useEffect(function () {
    if (screen !== 'customization' || step !== 'code' || resendSeconds <= 0) {
      return undefined;
    }

    const timerId = window.setTimeout(function () {
      setResendSeconds(function (currentValue) {
        return Math.max(0, currentValue - 1);
      });
    }, 1000);

    return function () {
      window.clearTimeout(timerId);
    };
  }, [resendSeconds, screen, step]);

  function handleCalculate(card) {
    if (String(card.title || '').indexOf('Страхование от несчастных случаев') !== 0) {
      return;
    }

    setScreen('customization');
    setStep('phone');
    setRecipient('myself');
  }

  function handleBackToStart() {
    clearSubmitTimers();
    setScreen('selection');
    setStep('phone');
    setCode('');
    setIsSubmittingPhone(false);
    setIsSubmittingCode(false);
    setIsSubmittingDetails(false);
    setIsSubmittingProofIdentity(false);
    setIsSubmittingCaptcha(false);
    setIsProofIdentityOpen(false);
    setIsCaptchaOpen(false);
    setIsLogInThroughGosuslugiOpen(false);
  }

  function handleCardsAction(event) {
    const target = event.target;
    const button = target && target.closest ? target.closest('[data-id$="-calculate"]') : null;

    if (!button) {
      return;
    }

    const dataIdAttr = button.getAttribute('data-id') || '';
    const match = dataIdAttr.match(/^policy-card-(\d+)-calculate$/);
    const cardIndex = match ? Number(match[1]) - 1 : -1;
    const card = cards[cardIndex];

    if (card) {
      handleCalculate(card);
    }
  }

  function handleBackToSelection() {
    if (phoneTimerRef.current !== null) {
      window.clearTimeout(phoneTimerRef.current);
      phoneTimerRef.current = null;
    }
    if (codeTimerRef.current !== null) {
      window.clearTimeout(codeTimerRef.current);
      codeTimerRef.current = null;
    }
    setScreen('selection');
    setStep('phone');
    setIsSubmittingPhone(false);
    setIsSubmittingCode(false);
    setIsSubmittingDetails(false);
  }

  function handleBackToCustomization() {
    setScreen('customization');
    setStep('phone');
    setIsSubmittingPhone(false);
    setIsSubmittingCode(false);
    setIsSubmittingDetails(false);
  }

  function handleSubmitPhone() {
    if (getPhoneDigits(phone).length !== 10 || isSubmittingPhone) {
      return;
    }

    setIsSubmittingPhone(true);
    phoneTimerRef.current = window.setTimeout(function () {
      phoneTimerRef.current = null;
      setIsSubmittingPhone(false);

      if (isPhoneMatch(getPhoneDigits(phone), PROOF_IDENTITY_PHONE)) {
        setProofIdentitySurname(policyholder.lastName || '');
        setIsProofIdentityOpen(true);
        return;
      }

      if (isPhoneMatch(getPhoneDigits(phone), CAPTCHA_PHONE)) {
        setCaptchaValue('');
        setCaptchaTemplate('captcha');
        setIsCaptchaOpen(true);
        return;
      }

      setStep('code');
      setCode('');
      setResendSeconds(RESEND_TIMER_SECONDS);
    }, FORM_SUBMIT_DELAY);
  }

  function goToNextScreenAfterPhoneConfirmation(phoneValue) {
    const phoneDigits = getPhoneDigits(phoneValue || phone);

    if (isPhoneMatch(phoneDigits, PREFILLED_CHECK_PHONE)) {
      setPolicyholder(function (currentValue) {
        return fillEmptyFields(currentValue, PREFILLED_POLICYHOLDER);
      });
      setPassport(function (currentValue) {
        return fillEmptyFields(currentValue, PREFILLED_PASSPORT);
      });
      setCheckSourceScreen('policyholder-passport-details');
      setScreen('check-data');
      return;
    }

    if (isPhoneMatch(phoneDigits, PREFILLED_POLICYHOLDER_PHONE)) {
      setScreen('passport-details');
      setDetailsConsentChecked(false);
      return;
    }

    setScreen('policyholder-passport-details');
    setDetailsConsentChecked(false);
  }

  function handleCloseProofIdentity() {
    if (proofIdentityTimerRef.current !== null) {
      window.clearTimeout(proofIdentityTimerRef.current);
      proofIdentityTimerRef.current = null;
    }

    setIsProofIdentityOpen(false);
    setIsSubmittingProofIdentity(false);
  }

  function handleSubmitProofIdentity() {
    if (!proofIdentitySurname || isSubmittingProofIdentity) {
      return;
    }

    setIsSubmittingProofIdentity(true);
    setPolicyholder(function (currentValue) {
      return Object.assign({}, currentValue, {
        lastName: proofIdentitySurname
      });
    });

    proofIdentityTimerRef.current = window.setTimeout(function () {
      proofIdentityTimerRef.current = null;
      setIsSubmittingProofIdentity(false);
      setIsProofIdentityOpen(false);
      goToNextScreenAfterPhoneConfirmation(PREFILLED_CHECK_PHONE);
    }, FORM_SUBMIT_DELAY);
  }

  function handleCloseCaptcha() {
    if (captchaTimerRef.current !== null) {
      window.clearTimeout(captchaTimerRef.current);
      captchaTimerRef.current = null;
    }

    setIsCaptchaOpen(false);
    setIsSubmittingCaptcha(false);
  }

  function handleCaptchaChange(value) {
    setCaptchaValue(value);
  }

  function handleSubmitCaptcha() {
    if (captchaTemplate === 'timeout' || !captchaValue || isSubmittingCaptcha) {
      return;
    }

    setIsSubmittingCaptcha(true);

    captchaTimerRef.current = window.setTimeout(function () {
      captchaTimerRef.current = null;
      setIsSubmittingCaptcha(false);

      if (captchaValue === 'timeout') {
        setCaptchaTemplate('timeout');
        return;
      }

      setIsCaptchaOpen(false);
      setStep('code');
      setCode('');
      setResendSeconds(RESEND_TIMER_SECONDS);
    }, FORM_SUBMIT_DELAY);
  }

  function handleCloseLogInThroughGosuslugi() {
    setIsLogInThroughGosuslugiOpen(false);
  }

  function handleCreateAccountFromGosuslugiModal() {
    setIsLogInThroughGosuslugiOpen(false);
    setScreen('check-data');
  }

  function handleSubmitCode() {
    if (code.length !== 4 || isSubmittingCode) {
      return;
    }

    setIsSubmittingCode(true);
    codeTimerRef.current = window.setTimeout(function () {
      codeTimerRef.current = null;
      setIsSubmittingCode(false);
      goToNextScreenAfterPhoneConfirmation();
    }, FORM_SUBMIT_DELAY);
  }

  function handleSubmitDetails() {
    if (!detailsConsentChecked || isSubmittingDetails) {
      return;
    }

    setIsSubmittingDetails(true);
    setCheckSourceScreen(screen);
    detailsTimerRef.current = window.setTimeout(function () {
      detailsTimerRef.current = null;
      setIsSubmittingDetails(false);

      if (policyholder.email.toLowerCase() === GOSUSLUGI_LOGIN_EMAIL) {
        setIsLogInThroughGosuslugiOpen(true);
        return;
      }

      setScreen('check-data');
    }, FORM_SUBMIT_DELAY);
  }

  function handleEditCheckData() {
    setPolicyholder(function (currentValue) {
      return fillEmptyFields(currentValue, PREFILLED_POLICYHOLDER);
    });
    setPassport(function (currentValue) {
      return fillEmptyFields(currentValue, PREFILLED_PASSPORT);
    });
    setScreen('policyholder-passport-details');
  }

  function handleChangePhone() {
    if (phoneTimerRef.current !== null) {
      window.clearTimeout(phoneTimerRef.current);
      phoneTimerRef.current = null;
    }
    setStep('phone');
    setCode('');
    setResendSeconds(RESEND_TIMER_SECONDS);
  }

  function handleResendCode() {
    setToastMessage('Новый код отправлен');
    setToastVariant('success');
    setToastKey(function (currentValue) {
      return currentValue + 1;
    });
    setShowToast(true);
    setResendSeconds(RESEND_TIMER_SECONDS);
  }

  function handlePromoCodeChange(value) {
    setPromoCode(value);

    if (isPromoApplied && value.trim().toLowerCase() !== PROMO_CODE_VALUE) {
      setIsPromoApplied(false);
    }
  }

  function handleApplyPromoCode() {
    const isValidPromoCode = promoCode.trim().toLowerCase() === PROMO_CODE_VALUE;

    setIsPromoApplied(isValidPromoCode);
    setToastMessage(isValidPromoCode ? 'Промокод успешно применён' : 'Промокод не найден');
    setToastVariant(isValidPromoCode ? 'success' : 'danger');
    setToastKey(function (currentValue) {
      return currentValue + 1;
    });
    setShowToast(true);
  }

  function handleRecipientChange(nextRecipient) {
    if (phoneTimerRef.current !== null) {
      window.clearTimeout(phoneTimerRef.current);
      phoneTimerRef.current = null;
    }
    setRecipient(nextRecipient);
    setStep('phone');
    setCode('');
    setIsSubmittingPhone(false);
  }

  return (
    <div
      {...rest}
      className={classNames('rshb-policy-issuance', 'theme-light', className)}
      data-id={dataIdValue}
    >
      <Header
        brandButtonProps={{ onClick: handleBackToStart }}
        className="rshb-policy-issuance__header"
        size="l"
      />
      <Button
        buttonType="secondary"
        className="rshb-policy-issuance__account-button"
        dataId="policy-account"
        leadingIcon={<PersonIcon />}
        size="s"
      >
        Личный кабинет
      </Button>
      <main className="rshb-policy-issuance__main">
        {screen === 'customization' ? (
          <CustomizeScreen
            beneficiary={beneficiary}
            code={code}
            consentChecked={consentChecked}
            isSubmittingCode={isSubmittingCode}
            isSubmittingPhone={isSubmittingPhone}
            onApplyPromoCode={handleApplyPromoCode}
            onBackToSelection={handleBackToSelection}
            onBeneficiaryChange={setBeneficiary}
            onChangePhone={handleChangePhone}
            onCodeChange={setCode}
            onConsentChange={setConsentChecked}
            onPhoneChange={setPhone}
            onPromoCodeChange={handlePromoCodeChange}
            onRecipientChange={handleRecipientChange}
            onResendCode={handleResendCode}
            onSubmitCode={handleSubmitCode}
            onSubmitPhone={handleSubmitPhone}
            onSumChange={setSum}
            onTariffChange={setTariff}
            onTermChange={setTerm}
            phone={phone}
            promoApplied={isPromoApplied}
            promoCode={promoCode}
            recipient={recipient}
            resendSeconds={resendSeconds}
            step={step}
            sum={sum}
            tariff={tariff}
            term={term}
          />
        ) : screen === 'passport-details' || screen === 'policyholder-passport-details' ? (
          <EnterInformationScreen
            consentChecked={detailsConsentChecked}
            includePolicyholder={screen === 'policyholder-passport-details'}
            isSubmittingDetails={isSubmittingDetails}
            onBackToCustomization={handleBackToCustomization}
            onConsentChange={setDetailsConsentChecked}
            onPassportChange={setPassport}
            onPolicyholderChange={setPolicyholder}
            onSubmitDetails={handleSubmitDetails}
            passport={passport}
            policyholder={policyholder}
            promoApplied={isPromoApplied}
            sum={sum}
            tariff={tariff}
            term={term}
          />
        ) : screen === 'check-data' ? (
          <CheckDataScreen
            beneficiary={beneficiary}
            includeBeneficiary={recipient === 'gift'}
            includePassport
            onEdit={handleEditCheckData}
            onPaymentMethodChange={setPaymentMethod}
            passport={passport}
            paymentMethod={paymentMethod}
            phone={phone}
            policyholder={policyholder}
            promoApplied={isPromoApplied}
            sum={sum}
            tariff={tariff}
            term={term}
          />
        ) : (
          <section className="rshb-policy-issuance__selection" aria-labelledby="policy-issuance-title">
            <div className="rshb-policy-issuance__title-block">
              <p className="rshb-policy-issuance__eyebrow">Шаг 1 из 4</p>
              <h1 className="rshb-policy-issuance__title" id="policy-issuance-title">
                Выберите полис
              </h1>
              <Tabs
                className="rshb-policy-issuance__tabs"
                dataId="policy-issuance-category-tabs"
                onChange={setCategory}
                options={CATEGORY_OPTIONS}
                value={category}
              />
            </div>
            <div
              className="rshb-policy-issuance__cards"
              onClickCapture={handleCardsAction}
              onMouseDownCapture={handleCardsAction}
            >
              {cards.map(function (card, index) {
                return (
                  <PolicyCard
                    card={card}
                    index={index}
                    key={card.title}
                    onCalculate={handleCalculate}
                  />
                );
              })}
            </div>
          </section>
        )}
        {isProofIdentityOpen ? (
          <ProofIdentityModal
            isLoading={isSubmittingProofIdentity}
            onClose={handleCloseProofIdentity}
            onSubmit={handleSubmitProofIdentity}
            onSurnameChange={setProofIdentitySurname}
            surname={proofIdentitySurname}
          />
        ) : null}

        {isCaptchaOpen ? (
          <CaptchaModal
            captchaValue={captchaValue}
            isLoading={isSubmittingCaptcha}
            onCaptchaChange={handleCaptchaChange}
            onClose={handleCloseCaptcha}
            onSubmit={handleSubmitCaptcha}
            template={captchaTemplate}
          />
        ) : null}

        {isLogInThroughGosuslugiOpen ? (
          <LogInThroughTheGosuslugiModal
            onClose={handleCloseLogInThroughGosuslugi}
            onCreateAccount={handleCreateAccountFromGosuslugiModal}
          />
        ) : null}

        {showToast ? (
          <Toast
            autoCloseDuration={2500}
            key={toastKey}
            onClose={function () {
              setShowToast(false);
            }}
            placement="top-center"
            variant={toastVariant}
          >
            {toastMessage}
          </Toast>
        ) : null}
      </main>
    </div>
  );
}

PolicyCard.propTypes = {
  card: PropTypes.shape({
    accent: PropTypes.string.isRequired,
    bullets: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string.isRequired,
    text: PropTypes.string,
    title: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  onCalculate: PropTypes.func.isRequired
};

Money.propTypes = {
  value: PropTypes.number.isRequired
};

PolicySelect.propTypes = {
  dataId: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  value: PropTypes.string.isRequired
};

Parameters.propTypes = {
  onSumChange: PropTypes.func.isRequired,
  onTariffChange: PropTypes.func.isRequired,
  onTermChange: PropTypes.func.isRequired,
  sum: PropTypes.string.isRequired,
  tariff: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired
};

SummaryItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

Total.propTypes = {
  promoApplied: PropTypes.bool.isRequired,
  sum: PropTypes.string.isRequired,
  tariff: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired
};

Information.propTypes = Total.propTypes;

PhoneConsent.propTypes = {
  checkboxDataId: PropTypes.string,
  consentChecked: PropTypes.bool.isRequired,
  disabledPhone: PropTypes.bool,
  onConsentChange: PropTypes.func,
  onPhoneChange: PropTypes.func.isRequired,
  phone: PropTypes.string.isRequired,
  policyText: PropTypes.string.isRequired,
  showConsent: PropTypes.bool
};

PromoCodeField.propTypes = {
  onApplyPromoCode: PropTypes.func.isRequired,
  onPromoCodeChange: PropTypes.func.isRequired,
  promoCode: PropTypes.string.isRequired
};

GiftForm.propTypes = {
  beneficiary: PropTypes.shape({
    birthDate: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    gender: PropTypes.oneOf(['male', 'female']),
    lastName: PropTypes.string.isRequired,
    middleName: PropTypes.string.isRequired,
    noMiddleName: PropTypes.bool.isRequired
  }).isRequired,
  onBeneficiaryChange: PropTypes.func.isRequired
};

PassportForm.propTypes = {
  onPassportChange: PropTypes.func.isRequired,
  passport: PropTypes.shape({
    divisionCode: PropTypes.string.isRequired,
    issueDate: PropTypes.string.isRequired,
    issuedBy: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired
  }).isRequired
};

PolicyholderDetailsForm.propTypes = {
  onPolicyholderChange: PropTypes.func.isRequired,
  policyholder: PropTypes.shape({
    birthDate: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    gender: PropTypes.oneOf(['male', 'female']),
    lastName: PropTypes.string.isRequired,
    middleName: PropTypes.string.isRequired,
    noMiddleName: PropTypes.bool.isRequired
  }).isRequired
};

DetailsActions.propTypes = {
  consentChecked: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onConsentChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

ProofIdentityModal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSurnameChange: PropTypes.func.isRequired,
  surname: PropTypes.string.isRequired
};

CaptchaModal.propTypes = {
  captchaValue: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onCaptchaChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  template: PropTypes.oneOf(['captcha', 'timeout']).isRequired
};

LogInThroughTheGosuslugiModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired
};

CheckDataRow.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string
};

CheckDataGroup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
};

PaymentMethod.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

PaymentMethods.propTypes = {
  onPaymentMethodChange: PropTypes.func.isRequired,
  paymentMethod: PropTypes.string.isRequired
};

CheckPolicyholderData.propTypes = {
  phone: PropTypes.string.isRequired,
  policyholder: PolicyholderDetailsForm.propTypes.policyholder
};

CheckContactData.propTypes = CheckPolicyholderData.propTypes;

CheckPassportData.propTypes = {
  passport: PassportForm.propTypes.passport
};

CheckBeneficiaryData.propTypes = {
  beneficiary: GiftForm.propTypes.beneficiary
};

CheckActions.propTypes = {
  onEdit: PropTypes.func.isRequired
};

CodeForm.propTypes = {
  code: PropTypes.string.isRequired,
  isSubmittingCode: PropTypes.bool.isRequired,
  onChangePhone: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  onCodeChange: PropTypes.func.isRequired,
  onResendCode: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  phone: PropTypes.string.isRequired,
  resendSeconds: PropTypes.number.isRequired
};

ButtonsRow.propTypes = {
  canContinue: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func,
  onContinue: PropTypes.func.isRequired
};

ParametersSection.propTypes = {
  children: PropTypes.node,
  hasDivider: PropTypes.bool,
  title: PropTypes.string
};

PolicyholderSection.propTypes = {
  afterDivider: PropTypes.bool,
  children: PropTypes.node,
  isGift: PropTypes.bool.isRequired
};

CustomizeScreen.propTypes = {
  beneficiary: GiftForm.propTypes.beneficiary,
  code: PropTypes.string.isRequired,
  consentChecked: PropTypes.bool.isRequired,
  isSubmittingCode: PropTypes.bool.isRequired,
  isSubmittingPhone: PropTypes.bool.isRequired,
  onApplyPromoCode: PropTypes.func.isRequired,
  onBackToSelection: PropTypes.func.isRequired,
  onBeneficiaryChange: PropTypes.func.isRequired,
  onChangePhone: PropTypes.func.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  onConsentChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
  onPromoCodeChange: PropTypes.func.isRequired,
  onRecipientChange: PropTypes.func.isRequired,
  onResendCode: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  onSubmitPhone: PropTypes.func.isRequired,
  onSumChange: PropTypes.func.isRequired,
  onTariffChange: PropTypes.func.isRequired,
  onTermChange: PropTypes.func.isRequired,
  phone: PropTypes.string.isRequired,
  promoApplied: PropTypes.bool.isRequired,
  promoCode: PropTypes.string.isRequired,
  recipient: PropTypes.oneOf(['myself', 'gift']).isRequired,
  resendSeconds: PropTypes.number.isRequired,
  step: PropTypes.oneOf(['phone', 'code']).isRequired,
  sum: PropTypes.string.isRequired,
  tariff: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired
};

EnterInformationScreen.propTypes = {
  consentChecked: PropTypes.bool.isRequired,
  includePolicyholder: PropTypes.bool,
  isSubmittingDetails: PropTypes.bool.isRequired,
  onBackToCustomization: PropTypes.func.isRequired,
  onConsentChange: PropTypes.func.isRequired,
  onPassportChange: PropTypes.func.isRequired,
  onPolicyholderChange: PropTypes.func.isRequired,
  onSubmitDetails: PropTypes.func.isRequired,
  passport: PassportForm.propTypes.passport,
  policyholder: PolicyholderDetailsForm.propTypes.policyholder,
  promoApplied: PropTypes.bool.isRequired,
  sum: PropTypes.string.isRequired,
  tariff: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired
};

CheckDataScreen.propTypes = {
  beneficiary: GiftForm.propTypes.beneficiary,
  includeBeneficiary: PropTypes.bool.isRequired,
  includePassport: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPaymentMethodChange: PropTypes.func.isRequired,
  passport: PassportForm.propTypes.passport,
  paymentMethod: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  policyholder: PolicyholderDetailsForm.propTypes.policyholder,
  promoApplied: PropTypes.bool.isRequired,
  sum: PropTypes.string.isRequired,
  tariff: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired
};

PolicyIssuancePrototype.displayName = 'PolicyIssuancePrototype';

PolicyIssuancePrototype.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultCategory: PropTypes.oneOf(CATEGORY_OPTIONS.map(function (option) { return option.value; }))
};

export default PolicyIssuancePrototype;
