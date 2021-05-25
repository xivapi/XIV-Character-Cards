const fetch = require("node-fetch");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const args = process.argv.slice(2);

const canvas = createCanvas(900, 600);
const ctx = canvas.getContext("2d");

const primary = "rgba(178, 214, 249, 1)";
const white = "rgba(255, 255, 255,1)";
const black = "rgba(0,0,0,0.5)";
const small = "18px Sans";
const med = "30px Sans";
const large = "40px Sans";

let charaID = "13821878";

function createCard(charaID, callback) {
  let chara = "";
  fetch(`https://xivapi.com/character/${charaID}?extended=1&data=FC`)
    .then((response) => response.json())
    .then((data) => {
      ctx.clearRect(0, 0, 900, 600);
      loadImage("./chara.png").then((image) => {
        ctx.drawImage(image, 0, 0, 900, 600);
      });
      loadImage(data.Character.Portrait).then((image) => {
        ctx.drawImage(image, 0, 0, 441, 600);
        ctx.strokeStyle = white;
        ctx.fillStyle = black;
        ctx.beginPath();
        ctx.fillRect(464, 7, 400, 100);
        ctx.fillRect(464, 120, 400, 50);
        ctx.fillRect(464, 185, 400, 205);
        ctx.fillRect(464, 405, 400, 175);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.font = med;
        ctx.fillStyle = primary;
        ctx.fillText(data.Character.Title.Name, 665, 45);
        ctx.font = med;
        ctx.fillText(`${data.Character.Server} (${data.Character.DC})`, 665, 155);
        // Race, Clan, Guardian, GC, FC Titles
        ctx.font = small;
        ctx.textAlign = "left";
        ctx.fillText("Race & Clan", 480, 205);
        ctx.fillText("Guardian", 480, 255);
        if (data.Character.GrandCompany.Company != null) {
          ctx.fillText("Grand Company", 480, 305);
        }
        if (data.Character.FreeCompanyName != null) {
          ctx.fillText("Free Company", 480, 355);
        }
        ctx.fillStyle = white;
        ctx.font = large;
        ctx.textAlign = "center";
        // Chara Name
        if (data.Character.Title.Name == null || data.Character.Title.Name == "") {
          ctx.fillText(data.Character.Name, 665, 70);
        } else {
          ctx.fillText(data.Character.Name, 665, 90);
        }
        // Race, Clan, Guardian, GC, FC Info
        ctx.font = "25px Sans";
        ctx.textAlign = "left";
        ctx.fillText(`${data.Character.Race.Name}, ${data.Character.Tribe.Name}`, 480, 230);
        ctx.fillText(data.Character.GuardianDeity.Name, 480, 280);
        if (data.Character.GrandCompany.Company != null) {
          ctx.fillText(data.Character.GrandCompany.Company.Name, 480, 330);
        }
        if (data.Character.FreeCompanyName != null) {
          ctx.fillText(data.Character.FreeCompanyName, 480, 380);
        }

        // Why are there so many fucking jobs in this game?
        // Crafting
        ctx.font = "18px Sans";
        loadImage("./cj/1/alchemist.png").then((image) => {
          ctx.drawImage(image, 480, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[24].Level, 486, 565);

        loadImage("./cj/1/armorer.png").then((image) => {
          ctx.drawImage(image, 510, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[20].Level, 516, 565);

        loadImage("./cj/1/blacksmith.png").then((image) => {
          ctx.drawImage(image, 540, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[19].Level, 546, 565);

        loadImage("./cj/1/carpenter.png").then((image) => {
          ctx.drawImage(image, 570, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[18].Level, 576, 565);

        loadImage("./cj/1/culinarian.png").then((image) => {
          ctx.drawImage(image, 600, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[25].Level, 606, 565);

        loadImage("./cj/1/goldsmith.png").then((image) => {
          ctx.drawImage(image, 630, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[21].Level, 636, 565);

        loadImage("./cj/1/leatherworker.png").then((image) => {
          ctx.drawImage(image, 660, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[22].Level, 666, 565);

        loadImage("./cj/1/weaver.png").then((image) => {
          ctx.drawImage(image, 690, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[23].Level, 696, 565);

        // Gathering
        loadImage("./cj/1/botanist.png").then((image) => {
          ctx.drawImage(image, 750, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[27].Level, 756, 565);

        loadImage("./cj/1/fisher.png").then((image) => {
          ctx.drawImage(image, 780, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[28].Level, 786, 565);

        loadImage("./cj/1/miner.png").then((image) => {
          ctx.drawImage(image, 810, 520, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[26].Level, 816, 565);

        // Tanks
        loadImage("./cj/1/paladin.png").then((image) => {
          ctx.drawImage(image, 480, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[0].Level, 486, 460);

        loadImage("./cj/1/warrior.png").then((image) => {
          ctx.drawImage(image, 510, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[1].Level, 516, 460);

        loadImage("./cj/1/darkknight.png").then((image) => {
          ctx.drawImage(image, 540, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[2].Level, 546, 460);

        loadImage("./cj/1/gunbreaker.png").then((image) => {
          ctx.drawImage(image, 570, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[3].Level, 576, 460);

        // Healers
        loadImage("./cj/1/whitemage.png").then((image) => {
          ctx.drawImage(image, 630, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[8].Level, 636, 460);

        loadImage("./cj/1/scholar.png").then((image) => {
          ctx.drawImage(image, 660, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[9].Level, 666, 460);

        loadImage("./cj/1/astrologian.png").then((image) => {
          ctx.drawImage(image, 690, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[10].Level, 696, 460);

        // DPS
        // Ranged
        loadImage("./cj/1/bard.png").then((image) => {
          ctx.drawImage(image, 750, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[11].Level, 756, 460);

        loadImage("./cj/1/machinist.png").then((image) => {
          ctx.drawImage(image, 780, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[12].Level, 786, 460);

        loadImage("./cj/1/dancer.png").then((image) => {
          ctx.drawImage(image, 810, 415, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[13].Level, 816, 460);

        // Melee
        loadImage("./cj/1/dragoon.png").then((image) => {
          ctx.drawImage(image, 480, 465, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[5].Level, 486, 515);

        loadImage("./cj/1/monk.png").then((image) => {
          ctx.drawImage(image, 510, 465, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[4].Level, 516, 515);

        loadImage("./cj/1/ninja.png").then((image) => {
          ctx.drawImage(image, 540, 465, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[6].Level, 546, 515);

        loadImage("./cj/1/samurai.png").then((image) => {
          ctx.drawImage(image, 570, 465, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[7].Level, 576, 515);

        // Caster
        loadImage("./cj/1/blackmage.png").then((image) => {
          ctx.drawImage(image, 630, 465, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[14].Level, 636, 515);

        loadImage("./cj/1/summoner.png").then((image) => {
          ctx.drawImage(image, 660, 465, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[15].Level, 666, 515);

        loadImage("./cj/1/redmage.png").then((image) => {
          ctx.drawImage(image, 690, 465, 30, 30);
        });
        ctx.fillText(data.Character.ClassJobs[16].Level, 696, 515);

        // Limited
        loadImage("./cj/1/bluemage.png").then((image) => {
          ctx.drawImage(image, 780, 465, 33, 33);
        });
        ctx.fillText(data.Character.ClassJobs[17].Level, 786, 515);

        const png = canvas.toDataURL();

        callback(png);
      });
    });
}

exports.createCard = createCard;
