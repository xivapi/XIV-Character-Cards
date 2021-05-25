const fetch = require("node-fetch");
const fs = require("fs");
const { createCanvas, loadImage, registerFont } = require("canvas");

registerFont('SourceSansPro-Regular.ttf', { family: 'Source Sans Pro', style: 'Regular' });
registerFont('SourceSansPro-SemiBold.ttf', { family: 'Source Sans Pro', style: 'SemiBold' });

const primary = "rgba(178, 214, 249, 1)";
const white = "rgba(255, 255, 255,1)";
const grey = "#868686";
const black = "rgba(0,0,0,0.5)";
const small = '"18px "Source Sans Pro"';
const med = '30px "Source Sans Pro"';
const smed = '25px "Source Sans Pro"';
const large = '45px "Source Sans Pro SemiBold"';

const jobsRowStart = 495;
const jobsRowTextSize = 30;
const jobsRowTextSpacer = jobsRowTextSize * 2;

const fcCrestCol = 345;

class CardCreator {
  async init() {
    this.bgImage = await loadImage("./chara_n.png");

    this.imgMinion = await loadImage("./minion.png");
    this.imgMount = await loadImage("./mount.png");

    this.imgAlchemist = await loadImage("./cj/1/alchemist.png");
    this.imgArmorer = await loadImage("./cj/1/armorer.png");
    this.imgBlacksmith = await loadImage("./cj/1/blacksmith.png");
    this.imgCarpenter = await loadImage("./cj/1/carpenter.png");
    this.imgCulinarian = await loadImage("./cj/1/culinarian.png");
    this.imgGoldsmith = await loadImage("./cj/1/goldsmith.png");
    this.imgLeatherworker = await loadImage("./cj/1/leatherworker.png");
    this.imgWeaver = await loadImage("./cj/1/weaver.png");

    this.imgBotanist = await loadImage("./cj/1/botanist.png");
    this.imgFisher = await loadImage("./cj/1/fisher.png");
    this.imgMiner = await loadImage("./cj/1/miner.png");

    this.imgPaladin = await loadImage("./cj/1/paladin.png");
    this.imgWarrior = await loadImage("./cj/1/warrior.png");
    this.imgDarkKnight = await loadImage("./cj/1/darkknight.png");
    this.imgGunbreaker = await loadImage("./cj/1/gunbreaker.png");

    this.imgWhitemage = await loadImage("./cj/1/whitemage.png");
    this.imgScholar = await loadImage("./cj/1/scholar.png");
    this.imgAstrologian = await loadImage("./cj/1/astrologian.png");

    this.imgBard = await loadImage("./cj/1/bard.png");
    this.imgMachinist = await loadImage("./cj/1/machinist.png");
    this.imgDancer = await loadImage("./cj/1/dancer.png");

    this.imgDragoon = await loadImage("./cj/1/dragoon.png");
    this.imgMonk = await loadImage("./cj/1/monk.png");
    this.imgNinja = await loadImage("./cj/1/ninja.png");
    this.imgSamurai = await loadImage("./cj/1/samurai.png");

    this.imgBlackmage = await loadImage("./cj/1/blackmage.png");
    this.imgSummoner = await loadImage("./cj/1/summoner.png");
    this.imgRedmage = await loadImage("./cj/1/redmage.png");

    this.imgBluemage = await loadImage('./cj/1/bluemage.png');

    await this.countMountsMinions();
  }

  async countMountsMinions() {
    var response = await fetch(`https://xivapi.com/Companion`);
    var data = await response.json();

    this.countMinion = data.Pagination.ResultsTotal;

    var response = await fetch(`https://xivapi.com/Mount`);
    var data = await response.json();

    this.countMount = data.Pagination.ResultsTotal;

    console.log(`Refreshed counts: ${this.countMinion} - ${this.countMount}`);
  }

  async createCard(charaId) {
    var response = await fetch(`https://xivapi.com/character/${charaId}?extended=1&data=FC,mimo`);
    var data = await response.json();

    const canvas = createCanvas(890, 600);
    const ctx = canvas.getContext("2d");

    var portrait = await loadImage(data.Character.Portrait);

    ctx.drawImage(this.bgImage, 441, 0, 900, 600);

    ctx.drawImage(portrait, 0, 0, 441, 600);

    ctx.strokeStyle = white;
    ctx.fillStyle = black;
    ctx.beginPath();
    ctx.fillRect(464, 7, 400, 120);

    ctx.fillRect(464, 135, 195, 40);
    ctx.fillRect(669, 135, 195, 40);

    ctx.fillRect(464, 183, 400, 210);
    ctx.fillRect(464, 405, 400, 175);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.font = med;
    ctx.fillStyle = primary;
    ctx.fillText(data.Character.Title.Name, 665, 45);
    ctx.font = small;
    ctx.fillText(`${data.Character.Server} (${data.Character.DC})`, 665, 115);


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
    ctx.font = smed;
    ctx.textAlign = "left";
    ctx.fillText(`${data.Character.Race.Name}, ${data.Character.Tribe.Name}`, 480, 230);

    ctx.fillText(data.Character.GuardianDeity.Name, 480, 280);
    var measure = ctx.measureText(data.Character.GuardianDeity.Name);
    var deityIcon = await loadImage('https://xivapi.com/' + data.Character.GuardianDeity.Icon);
    ctx.drawImage(deityIcon, 480 + measure.width + 20, 252, 28, 28);

    if (data.Character.GrandCompany.Company != null) {
      ctx.fillText(data.Character.GrandCompany.Company.Name, 480, 330);

      var measure = ctx.measureText(data.Character.GrandCompany.Company.Name);
      var gcRankIcon = await loadImage('https://xivapi.com/' + data.Character.GrandCompany.Rank.Icon);
      ctx.drawImage(gcRankIcon, 480 + measure.width + 20, 300, 40, 40);
    }
    if (data.Character.FreeCompanyName != null) {
      var measure = ctx.measureText(data.Character.FreeCompanyName);

      var crestLayer2 = await loadImage(data.FreeCompany.Crest[0]);
      ctx.drawImage(crestLayer2, 480 + measure.width + 20, fcCrestCol, 38, 38);

      var crestLayer1 = await loadImage(data.FreeCompany.Crest[1]);
      ctx.drawImage(crestLayer1, 480 + measure.width + 20, fcCrestCol, 38, 38);

      var crestLayer0 = await loadImage(data.FreeCompany.Crest[2]);
      ctx.drawImage(crestLayer0, 480 + measure.width + 20, fcCrestCol, 38, 38);

      ctx.fillText(data.Character.FreeCompanyName, 480, 380);
    }

    // Minion & Mount percentages
    const mountsPct = Math.ceil((data.Mounts.length / this.countMount) * 100);
    const minionsPct = Math.ceil((data.Minions.length / this.countMinion) * 100);

    const mountsMeasure = ctx.measureText(`${mountsPct}%`);
    const minionsMeasure = ctx.measureText(`${minionsPct}%`);

    ctx.fillText(`${mountsPct}%`, 480, 163);
    ctx.fillText(`${minionsPct}%`, 685, 163);

    ctx.fillStyle = grey;
    ctx.font = small;

    ctx.fillText("Mounts", 480 + mountsMeasure.width + 5, 163);
    ctx.fillText("Minions", 685 + minionsMeasure.width + 5, 163);

    ctx.drawImage(this.imgMount, 620, 140, 32, 32);
    ctx.drawImage(this.imgMinion, 834, 140, 19, 32);

    ctx.fillStyle = white;
    

    // Why are there so many fucking jobs in this game?
    // Crafting
    ctx.textAlign = "center";

    var cJobsRowX = jobsRowStart;
    ctx.drawImage(this.imgAlchemist, 480, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[24].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgArmorer, 510, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[20].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgBlacksmith, 540, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[19].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgCarpenter, 570, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[18].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgCulinarian, 600, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[25].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgGoldsmith, 630, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[21].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgLeatherworker, 660, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[22].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgWeaver, 690, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[23].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSpacer;

    // Gathering
    ctx.drawImage(this.imgBotanist, 750, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[27].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgFisher, 780, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[28].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgMiner, 810, 520, 30, 30);
    ctx.fillText(data.Character.ClassJobs[26].Level, cJobsRowX, 565);
    cJobsRowX += jobsRowTextSize;

    // Tanks
    cJobsRowX = jobsRowStart;

    ctx.drawImage(this.imgPaladin, 480, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[0].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgWarrior, 510, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[1].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgDarkKnight, 540, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[2].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgGunbreaker, 570, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[3].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSpacer;

    // Healers
    ctx.drawImage(this.imgWhitemage, 630, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[8].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgScholar, 660, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[9].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgAstrologian, 690, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[10].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSpacer;

    // DPS
    // Ranged
    ctx.drawImage(this.imgBard, 750, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[11].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgMachinist, 780, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[12].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgDancer, 810, 415, 30, 30);
    ctx.fillText(data.Character.ClassJobs[13].Level, cJobsRowX, 460);
    cJobsRowX += jobsRowTextSize;

    // Melee
    cJobsRowX = jobsRowStart;

    ctx.drawImage(this.imgDragoon, 480, 465, 30, 30);
    ctx.fillText(data.Character.ClassJobs[5].Level, cJobsRowX, 515);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgMonk, 510, 465, 30, 30);
    ctx.fillText(data.Character.ClassJobs[4].Level, cJobsRowX, 515);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgNinja, 540, 465, 30, 30);
    ctx.fillText(data.Character.ClassJobs[6].Level, cJobsRowX, 515);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgSamurai, 570, 465, 30, 30);
    ctx.fillText(data.Character.ClassJobs[7].Level, cJobsRowX, 515);
    cJobsRowX += jobsRowTextSpacer;

    // Caster
    ctx.drawImage(this.imgBlackmage, 630, 465, 30, 30);
    ctx.fillText(data.Character.ClassJobs[14].Level, cJobsRowX, 515);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgSummoner, 660, 465, 30, 30);
    ctx.fillText(data.Character.ClassJobs[15].Level, cJobsRowX, 515);
    cJobsRowX += jobsRowTextSize;

    ctx.drawImage(this.imgRedmage, 690, 465, 30, 30);
    ctx.fillText(data.Character.ClassJobs[16].Level, cJobsRowX, 515);
    cJobsRowX += jobsRowTextSize;

    // Limited
    ctx.drawImage(this.imgBluemage, 780, 465, 33, 33);
    ctx.fillText(data.Character.ClassJobs[17].Level, 796, 515);

    return canvas.toBuffer();
  }
}

exports.CardCreator = CardCreator;