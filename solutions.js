/** @fileoverview Exercise solutions */

// Config
const BASE_URL = 'http://localhost:3333';
const RESOURCES = Object.freeze({
  destinations: 'destinations',
  weathers: 'weathers',
  airports: 'airports',
});
const CITY = 'london';

// Utils
const url = (path, params) => {
  const endpoint = [BASE_URL, ...path].join('/');
  const query = new URLSearchParams(params).toString();
  return query ? `${endpoint}?${query}` : endpoint;
};

const fetchJson = async url => {
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);

  return await response.json();
};

// Exercise
const getDashboardData = async search => {
  const resources = Object.values(RESOURCES);

  const [[destination], [weather], [airport]] = await Promise.all(
    resources.map(resource => fetchJson(url([resource], { search }))),
  );

  if (!destination) throw new Error(`${search} not found`);

  return {
    city: destination.name,
    country: destination.country,
    temperature: weather?.temperature ?? null,
    weather: weather?.weather_description ?? null,
    airport: airport?.name ?? null,
  };
};

// Run
const main = async () => {
  try {
    const data = await getDashboardData(CITY);

    // console.log('Dashboard data:', data); // Debug

    const messages = [
      `${data.city} is in ${data.country}.`, // City

      data.temperature != null &&
        data.weather != null &&
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.`, // Weather

      data.airport && `The main airport is ${data.airport}.`, // Airport
    ];

    console.log(messages.filter(Boolean).join('\n'));
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();
