const fetch = require("node-fetch");

const itemUICategory = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 84, 87, 88, 89, 96, 97, 98, 99,
  105, 106, 107,
];

async function createilvlfilter() {
  let results = [];
  for (const category of itemUICategory) {
    let url = `https://xivapi.com/search?indexes=item&filters=IsIndisposable=1,ItemUICategoryTargetID=${category}`;
    const response = await fetch(url);
    const data = response.json();
    data.then((payload) => {
      if (payload.Pagination.Results === 0) {
        return;
      }
      for (const item of payload.Results) {
        let part = item.ID
        results.push(part);
      }
    });
  }
  return results;
}

module.exports = createilvlfilter
