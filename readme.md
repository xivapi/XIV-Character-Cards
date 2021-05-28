# XIV Character Cards
![npm Version](https://img.shields.io/npm/v/xiv-character-cards)
[![Documentation](https://img.shields.io/badge/docs-JSDoc-orange)](https://xivapi.github.io/XIV-Character-Cards/)

API to create fancy cards for FFXIV characters based on their Lodestone data, hosted at https://ffxiv-character-cards.herokuapp.com.

![Demo image](https://ffxiv-character-cards.herokuapp.com/characters/id/9575452.png)

## Endpoints

### Getting images

``https://ffxiv-character-cards.herokuapp.com/characters/id/<LODESTONE ID>.png``
<br>Get the PNG for a character by its Lodestone ID.

<br>

``https://ffxiv-character-cards.herokuapp.com/characters/name/<WORLD>/<CHARACTER NAME>.png``
<br>Get the PNG for a character by its world and name.

### Requesting images to be cached
If you are using this API together with an application that requires the API to respond very quickly, like Discord, you need to ask it to "prepare" the image for a character beforehand.

``https://ffxiv-character-cards.herokuapp.com/prepare/id/<LODESTONE ID>``
<br>Request a character image to be cached by its Lodestone ID.

<br>

``https://ffxiv-character-cards.herokuapp.com/prepare/name/<WORLD>/<CHARACTER NAME>``
<br>Request a character image to be cached by its world and name.

The API will reply with its status, and in case of success, the URL to the final image.
``{"status":"ok","url":"/characters/id/123456789.png"}``

## Using in your application

```
yarn add xiv-character-cards
# or
npm i xiv-character-cards
```

You will receive a PNG-buffer for you to use in your bot or application.<br>Check ``index.js`` for other usage examples.

### Example

```js
const { CardCreator } = require("xiv-character-cards");
const fs = require("fs");

const card = new CardCreator();
const lodestoneid = "13821878";

function example(cb) {
  card.ensureInit()
    .then(
      () => card.createCard(lodestoneid),
      (reason) => cb("Init failed: " + reason, null)
    )
    .then((image) =>
      cb(null, {
        binary: {
          image: image,
        },
      })
    )
    .catch((reason) => cb("createCard failed: " + reason, null));
}

example((err, response) => {
  const buffer = response.binary.image;
  fs.writeFileSync(`./${lodestoneid}.png`, response.binary.image, (err) => {
    if (err) {
      console.log(err);
    }
  });
});
```
