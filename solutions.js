/** @fileoverview Exercise solutions */

// Config
const BASE_URL = 'http://localhost:3333';
const RESOURCES = Object.freeze(['destinations', 'weathers', 'airports']);
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
  const results = await Promise.allSettled(
    RESOURCES.map(resource => fetchJson(url([resource], { search }))),
  );

  const [destination, weather, airport] = results.map((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Failed to fetch ${RESOURCES[index]}:`, result.reason);
      return null;
    }

    return result.value[0] ?? null;
  });

  return {
    city: destination?.name ?? null,
    country: destination?.country ?? null,
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
      data.city && data.country && `${data.city} is in ${data.country}.`,

      data.temperature != null &&
        data.weather != null &&
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.`,

      data.airport && `The main airport is ${data.airport}.`,
    ];

    console.log(messages.filter(Boolean).join('\n'));
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();
