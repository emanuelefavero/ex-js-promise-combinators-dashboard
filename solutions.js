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
  const [[destination], [weather], [airport]] = await Promise.all([
    fetchJson(url([RESOURCES.destinations], { search })),
    fetchJson(url([RESOURCES.weathers], { search })),
    fetchJson(url([RESOURCES.airports], { search })),
  ]);

  if (!destination) throw new Error(`${CITY} not found`);

  return {
    city: destination.name,
    country: destination.country,
    temperature: weather.temperature,
    weather: weather.weather_description,
    airport: airport.name,
  };
};

// Run
const main = async () => {
  try {
    const data = await getDashboardData(CITY);
    console.log('Dashboard data:', data);
    console.log(
      `${data.city} is in ${data.country}.\n` +
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
        `The main airport is ${data.airport}.\n`,
    );
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();
