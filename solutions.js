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
// TODO handle search parameters in the URL
const url = (...args) => [BASE_URL, ...args].join('/');

const fetchJson = async url => {
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);

  return await response.json();
};

// Exercise
const getDashboardData = async query => {
  // TODO exercise
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
