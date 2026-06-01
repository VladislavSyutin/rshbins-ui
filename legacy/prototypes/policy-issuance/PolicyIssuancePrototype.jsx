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
import InputName from '../../components/input-name/index.js';
import InputPhone from '../../components/input-phone/index.js';
import InputSurname from '../../components/input-surname/index.js';
import SegmentedControl from '../../components/segmented-control/index.js';
import Tabs from '../../components/tabs/index.js';
import TextLink from '../../components/text-link/index.js';
import Toast from '../../components/toast/index.js';
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

function getPhoneDigits(value) {
  return String(value || '').replace(/\D/g, '');
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
  const { sum, tariff, term } = props;
  const price = getPrice(tariff, term, sum);

  return (
    <Card className="rshb-policy-issuance__total" dataId="policy-total">
      <SummaryItem label="Название полиса" value={FAMILY_ACCIDENT_TITLE} />
      <SummaryItem label="Тариф" value={getOptionLabel(TARIFF_OPTIONS, tariff)} />
      <SummaryItem label="Срок страхования" value={getTermPeriod(term)} />
      <SummaryItem label="Страховая сумма" value={getOptionLabel(SUM_OPTIONS, sum)} />
      <div className="rshb-policy-issuance__summary-item">
        <p className="rshb-policy-issuance__summary-label">Страховая премия</p>
        <div className="rshb-policy-issuance__price-row">
          <span className="rshb-policy-issuance__price"><Money value={price.price} /></span>
          {price.oldPrice ? (
            <span className="rshb-policy-issuance__old-price"><Money value={price.oldPrice} /></span>
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
  const { sum, tariff, term } = props;

  return (
    <aside className="rshb-policy-issuance__information">
      <Total sum={sum} tariff={tariff} term={term} />
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
    onPhoneChange,
    onRecipientChange,
    onResendCode,
    onSubmitCode,
    onSubmitPhone,
    onSumChange,
    onTariffChange,
    onTermChange,
    phone,
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
            ) : (
              <>
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
        <Information sum={sum} tariff={tariff} term={term} />
      </div>
    </section>
  );
}

function PolicyIssuancePrototype(props) {
  const { className, dataId, defaultCategory, ...rest } = props;
  const [category, setCategory] = useState(defaultCategory || 'property');
  const [screen, setScreen] = useState('selection');
  const [step, setStep] = useState('phone');
  const [recipient, setRecipient] = useState('myself');
  const [tariff, setTariff] = useState('individual');
  const [term, setTerm] = useState('2');
  const [sum, setSum] = useState('250000');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [beneficiary, setBeneficiary] = useState({
    birthDate: '',
    firstName: '',
    gender: undefined,
    lastName: '',
    middleName: '',
    noMiddleName: false
  });
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_TIMER_SECONDS);
  const [showToast, setShowToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const phoneTimerRef = useRef(null);
  const codeTimerRef = useRef(null);
  const cards = CATEGORY_CARDS[category] || CATEGORY_CARDS.property;
  const dataIdValue = dataId || rest['data-id'];

  useEffect(function () {
    return function () {
      if (phoneTimerRef.current !== null) {
        window.clearTimeout(phoneTimerRef.current);
      }
      if (codeTimerRef.current !== null) {
        window.clearTimeout(codeTimerRef.current);
      }
    };
  }, []);

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
    if (card.title !== FAMILY_ACCIDENT_TITLE) {
      return;
    }

    setScreen('customization');
    setStep('phone');
    setRecipient('myself');
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
  }

  function handleSubmitPhone() {
    if (getPhoneDigits(phone).length !== 10 || isSubmittingPhone) {
      return;
    }

    setIsSubmittingPhone(true);
    phoneTimerRef.current = window.setTimeout(function () {
      phoneTimerRef.current = null;
      setIsSubmittingPhone(false);
      setStep('code');
      setCode('');
      setResendSeconds(RESEND_TIMER_SECONDS);
    }, FORM_SUBMIT_DELAY);
  }

  function handleSubmitCode() {
    if (code.length !== 4 || isSubmittingCode) {
      return;
    }

    setIsSubmittingCode(true);
    codeTimerRef.current = window.setTimeout(function () {
      codeTimerRef.current = null;
      setIsSubmittingCode(false);
    }, FORM_SUBMIT_DELAY);
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
    setToastKey(function (currentValue) {
      return currentValue + 1;
    });
    setShowToast(true);
    setResendSeconds(RESEND_TIMER_SECONDS);
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
      <Header className="rshb-policy-issuance__header" size="l" />
      <main className="rshb-policy-issuance__main">
        {screen === 'customization' ? (
          <CustomizeScreen
            beneficiary={beneficiary}
            code={code}
            consentChecked={consentChecked}
            isSubmittingCode={isSubmittingCode}
            isSubmittingPhone={isSubmittingPhone}
            onBackToSelection={handleBackToSelection}
            onBeneficiaryChange={setBeneficiary}
            onChangePhone={handleChangePhone}
            onCodeChange={setCode}
            onConsentChange={setConsentChecked}
            onPhoneChange={setPhone}
            onRecipientChange={handleRecipientChange}
            onResendCode={handleResendCode}
            onSubmitCode={handleSubmitCode}
            onSubmitPhone={handleSubmitPhone}
            onSumChange={setSum}
            onTariffChange={setTariff}
            onTermChange={setTerm}
            phone={phone}
            recipient={recipient}
            resendSeconds={resendSeconds}
            step={step}
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
        {showToast ? (
          <Toast
            autoCloseDuration={2500}
            key={toastKey}
            onClose={function () {
              setShowToast(false);
            }}
            placement="top-center"
            variant="success"
          >
            Новый код отправлен
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
  onBackToSelection: PropTypes.func.isRequired,
  onBeneficiaryChange: PropTypes.func.isRequired,
  onChangePhone: PropTypes.func.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  onConsentChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
  onRecipientChange: PropTypes.func.isRequired,
  onResendCode: PropTypes.func.isRequired,
  onSubmitCode: PropTypes.func.isRequired,
  onSubmitPhone: PropTypes.func.isRequired,
  onSumChange: PropTypes.func.isRequired,
  onTariffChange: PropTypes.func.isRequired,
  onTermChange: PropTypes.func.isRequired,
  phone: PropTypes.string.isRequired,
  recipient: PropTypes.oneOf(['myself', 'gift']).isRequired,
  resendSeconds: PropTypes.number.isRequired,
  step: PropTypes.oneOf(['phone', 'code']).isRequired,
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
