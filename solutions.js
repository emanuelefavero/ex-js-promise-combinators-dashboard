/** @fileoverview Exercise solutions */

// Config
const BASE_URL = 'http://localhost:3333';
const RESOURCES = ['destinations', 'weathers', 'airports'];
const CITY = 'london'; // Change to "vienna" to test partial data

const fetchJson = async url => {
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);

  return response.json();
};

// Exercise
const getDashboardData = async query => {
  const results = await Promise.allSettled(
    RESOURCES.map(resource =>
      fetchJson(`${BASE_URL}/${resource}?search=${query}`),
    ),
  );

  const [destination, weather, airport] = results.map((result, index) => {
    if (result.status === 'rejected')
      console.error(`Failed to fetch ${RESOURCES[index]}:`, result.reason);

    return result.value?.[0] ?? null;
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
