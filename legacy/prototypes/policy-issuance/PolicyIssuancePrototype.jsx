import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../components/button/index.js';
import Card from '../../components/card/index.js';
import Header from '../../components/header/index.js';
import Tabs from '../../components/tabs/index.js';
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
      text: 'Заключение индивидуального договора страхования позволит обеспечить финансовую безопасность и возмещение убытков в случае наступления страхового случая. Оформление полиса происходит с использованием сервиса «Лёгкая ипотека», предоставленного АО СК «РСХБ-Страхование» компанией ООО «ЭсАрДжи-Айти».',
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

function PolicyCard(props) {
  const { card, index } = props;

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

function PolicyIssuancePrototype(props) {
  const { className, dataId, defaultCategory, ...rest } = props;
  const [category, setCategory] = useState(defaultCategory || 'property');
  const cards = CATEGORY_CARDS[category] || CATEGORY_CARDS.property;
  const dataIdValue = dataId || rest['data-id'];

  return (
    <div
      {...rest}
      className={classNames('rshb-policy-issuance', 'theme-light', className)}
      data-id={dataIdValue}
    >
      <Header className="rshb-policy-issuance__header" size="l" />
      <main className="rshb-policy-issuance__main">
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
          <div className="rshb-policy-issuance__cards">
            {cards.map(function (card, index) {
              return <PolicyCard card={card} index={index} key={card.title} />;
            })}
          </div>
        </section>
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
  index: PropTypes.number.isRequired
};

PolicyIssuancePrototype.displayName = 'PolicyIssuancePrototype';

PolicyIssuancePrototype.propTypes = {
  className: PropTypes.string,
  dataId: PropTypes.string,
  defaultCategory: PropTypes.oneOf(CATEGORY_OPTIONS.map(function (option) { return option.value; }))
};

export default PolicyIssuancePrototype;
