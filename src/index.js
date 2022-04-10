import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import './css/styles.css';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  search: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.search.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const countryName = refs.search.value.trim();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  if (countryName) {
    fetchCountries(countryName)
      .then(renderMarkup)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        console.log(error);
      });
  }

  function renderMarkup(countryName) {
    if (countryName.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }

    doMarkup(countryName);
  }

  function doMarkup(countryName) {
    const markupManyCountries = countryName
      .map(({ flags: { png }, name: { official } }) => {
        return `<li class="country"><img src="${png}" alt="${official}" />${official}</li>`;
      })
      .join('');

    if (countryName.length === 1) {
      const markupSingleCountry = `
      <p><span>Capital:</span> ${countryName[0].capital}</p>
      <p><span>Population:</span> ${countryName[0].population}</p>
      <p><span>Languages:</span> ${Object.values(countryName[0].languages)}</p>
      `;

      refs.countryInfo.insertAdjacentHTML('afterbegin', markupSingleCountry);
    }

    return refs.countryList.insertAdjacentHTML('afterbegin', markupManyCountries);
  }
}
