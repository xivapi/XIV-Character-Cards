// noinspection JSUnresolvedVariable

const fetch = require('node-fetch');

const itemUICategory = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 84, 87, 88, 89, 96, 97, 98, 99, 105, 106, 107,
];

// Returns a list of item IDs that, when equipped, increase the iLvl by 1
async function createIlvlFilter(xivApiKey = undefined) {
  const itemIds = [];

  // Fetch for each category one after another to prevent rate limiting
  // This should only by needed on startup, so a longer caching time is ok
  for (const category of itemUICategory) {
    const url = new URL('https://xivapi.com/search');
    url.searchParams.set('indexes', 'item');
    url.searchParams.set('filters', `IsIndisposable=1,ItemUICategoryTargetID=${category}`);
    if (typeof xivApiKey === 'string' && xivApiKey !== '') url.searchParams.set('private_key', xivApiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data != null && Array.isArray(data.Results)) {
      for (const item of data.Results) {
        itemIds.push(item.ID);
      }
    }
  }
  return itemIds;
}

module.exports = createIlvlFilter
