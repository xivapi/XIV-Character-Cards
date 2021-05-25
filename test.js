const fs = require("fs");
const createCard = require("./create-card").createCard;

createCard("9575452", (png) => {
    const data = png.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(data, "base64");
    fs.writeFile('test.png', buf, (err) => {
        console.log(err)
    })
  });

createCard("13821878", (png) => {
  const data = png.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  fs.writeFile('image.png', buf, (err) => {
      console.log(err)
  })
});
