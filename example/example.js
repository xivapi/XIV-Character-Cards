const { writeFileSync } = require("fs");
const {CardCreator} = require("../src/create-card");

const creator = new CardCreator();
const lodestoneId = "13821878";

async function example() {
    await creator.ensureInit();
    return creator.createCard(lodestoneId);
}

example()
    .then(card => {
        writeFileSync(`./${lodestoneId}.png`, card);
    })
    .catch(error => {
        console.error('Creator initialization or card creation failed!');
        console.error(error);
    });