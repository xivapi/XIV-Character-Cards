const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

function absolute(relativePath) {
    return path.join(__dirname, relativePath);
}

registerFont(absolute('SourceSansPro-Regular.ttf'), { family: 'Source Sans Pro', style: 'Regular' });
registerFont(absolute('SourceSansPro-SemiBold.ttf'), { family: 'Source Sans Pro', style: 'SemiBold' });

const primary = "rgba(178, 214, 249, 1)";
const white = "rgba(255, 255, 255,1)";
const grey = "#868686";
const black = "rgba(0,0,0,0.5)";
const small = '"18px "Source Sans Pro"';
const med = '30px "Source Sans Pro"';
const smed = '25px "Source Sans Pro"';
const large = '45px "Source Sans Pro SemiBold"';

const jobsRowTextStartX = 495;
const jobsRowTextSize = 30;
const jobsRowTextSpacer = jobsRowTextSize * 2;

const rectHeightRow1 = 120; // Title, Name, World
const rectHeightRow2 = 40; // Mounts, Minions
const rectHeightRow3 = 210; // Info
const rectHeightRow4 = 175; // Jobs

const rectSpacing = 8;
const rectHalfWidthSpacing = 10;

const rectFullWidth = 400;
const rectHalfWidth = (rectFullWidth / 2) - (rectHalfWidthSpacing / 2);

const rectStartX = 464;
const rectStartXHalf = rectStartX + rectHalfWidth + rectHalfWidthSpacing;

const rectStartRow1Y = 7;
const rectStartRow2Y = rectStartRow1Y + rectHeightRow1 + rectSpacing;
const rectStartRow3Y = rectStartRow2Y + rectHeightRow2 + rectSpacing;
const rectStartRow4Y = rectStartRow3Y + rectHeightRow3 + rectSpacing;

const jobsStartSpacing = 10;
const jobsRowSpacing = 8;

const jobsRowIcon1Y = rectStartRow4Y + jobsStartSpacing;
const jobsRowText1Y = jobsRowIcon1Y + 45;

const jobsRowIcon2Y = jobsRowText1Y + jobsRowSpacing;
const jobsRowText2Y = jobsRowIcon2Y + 45;

const jobsRowIcon3Y = jobsRowText2Y + jobsRowSpacing;
const jobsRowText3Y = jobsRowIcon3Y + 45;

const textTitleY = rectStartRow1Y + 34;
const textServerY = rectStartRow1Y + 104;
const textNameNoTitleY = rectStartRow1Y + 59;
const textNameTitleY = rectStartRow1Y + 79;

const textMountMinionY = rectStartRow2Y + 28;
const iconMountMinionY = rectStartRow2Y + 5;

console.log("rectStartRow2: " + rectStartRow2Y);
console.log("rectStartRow3: " + rectStartRow3Y);
console.log("rectStartRow4: " + rectStartRow4Y);

const deityIconY = rectStartRow3Y + 69;
const deityIconX = 805;

const gcRankIconY = rectStartRow3Y + 110;
const gcRankIconX = 799;

const fcCrestScale = 38;
const fcCrestY = rectStartRow3Y + 162;
const fcCrestX = 800;

const infoTextStartSpacing = 22;
const infoTextSmallStartY = rectStartRow3Y + infoTextStartSpacing;
const infoTextBigStartY = infoTextSmallStartY + 25;
const infoTextSpacing = 50;

console.log("infoTextStartY: " + infoTextSmallStartY);

class CardCreator {
  constructor() {
    this.isInit = false;
  }

  async ensureInit() {
    if (this.isInit) {
      return;
    }

    await this.init();
    this.isInit = true;
  }

  async init() {
    this.bgImage = await loadImage(absolute("./chara.png"));

    this.imgMinion = await loadImage(absolute("./minion.png"));
    this.imgMount = await loadImage(absolute("./mount.png"));

    this.imgAlchemist = await loadImage(absolute("./cj/1/alchemist.png"));
    this.imgArmorer = await loadImage(absolute("./cj/1/armorer.png"));
    this.imgBlacksmith = await loadImage(absolute("./cj/1/blacksmith.png"));
    this.imgCarpenter = await loadImage(absolute("./cj/1/carpenter.png"));
    this.imgCulinarian = await loadImage(absolute("./cj/1/culinarian.png"));
    this.imgGoldsmith = await loadImage(absolute("./cj/1/goldsmith.png"));
    this.imgLeatherworker = await loadImage(absolute("./cj/1/leatherworker.png"));
    this.imgWeaver = await loadImage(absolute("./cj/1/weaver.png"));

    this.imgBotanist = await loadImage(absolute("./cj/1/botanist.png"));
    this.imgFisher = await loadImage(absolute("./cj/1/fisher.png"));
    this.imgMiner = await loadImage(absolute("./cj/1/miner.png"));

    this.imgPaladin = await loadImage(absolute("./cj/1/paladin.png"));
    this.imgWarrior = await loadImage(absolute("./cj/1/warrior.png"));
    this.imgDarkKnight = await loadImage(absolute("./cj/1/darkknight.png"));
    this.imgGunbreaker = await loadImage(absolute("./cj/1/gunbreaker.png"));

    this.imgWhitemage = await loadImage(absolute("./cj/1/whitemage.png"));
    this.imgScholar = await loadImage(absolute("./cj/1/scholar.png"));
    this.imgAstrologian = await loadImage(absolute("./cj/1/astrologian.png"));

    this.imgBard = await loadImage(absolute("./cj/1/bard.png"));
    this.imgMachinist = await loadImage(absolute("./cj/1/machinist.png"));
    this.imgDancer = await loadImage(absolute("./cj/1/dancer.png"));

    this.imgDragoon = await loadImage(absolute("./cj/1/dragoon.png"));
    this.imgMonk = await loadImage(absolute("./cj/1/monk.png"));
    this.imgNinja = await loadImage(absolute("./cj/1/ninja.png"));
    this.imgSamurai = await loadImage(absolute("./cj/1/samurai.png"));

    this.imgBlackmage = await loadImage(absolute("./cj/1/blackmage.png"));
    this.imgSummoner = await loadImage(absolute("./cj/1/summoner.png"));
    this.imgRedmage = await loadImage(absolute("./cj/1/redmage.png"));

    this.imgBluemage = await loadImage(absolute('./cj/1/bluemage.png'));

    await this.countMountsMinions();
  }

  async countMountsMinions() {
    var response = await fetch(`https://ffxivcollect.com/api/minions/`);
    var data = await response.json();

    this.countMinion = data.count;

    var response = await fetch(`https://ffxivcollect.com/api/mounts/`);
    var data = await response.json();

    this.countMount = data.count;

    console.log(`Refreshed counts: ${this.countMinion} - ${this.countMount}`);
  }

  async createCrest(crestAry) {
    const canvas = createCanvas(fcCrestScale, fcCrestScale);
    const ctx = canvas.getContext("2d");

    var crestLayer2 = await loadImage(crestAry[0]);
    ctx.drawImage(crestLayer2, 0, 0, fcCrestScale, fcCrestScale);

    var crestLayer1 = await loadImage(crestAry[1]);
    ctx.drawImage(crestLayer1, 0, 0, fcCrestScale, fcCrestScale);

    var crestLayer0 = await loadImage(crestAry[2]);
    ctx.drawImage(crestLayer0, 0, 0, fcCrestScale, fcCrestScale);

    var imgd = ctx.getImageData(0, 0, fcCrestScale, fcCrestScale),
      pix = imgd.data,
      newColor = { r: 0, g: 0, b: 0, a: 0 };

    for (var i = 0, n = pix.length; i < n; i += 4) {
      var r = pix[i],
        g = pix[i + 1],
        b = pix[i + 2];

      // If its white then change it
      if (r == 64 && g == 64 && b == 64) {
        // Change the white to whatever.
        pix[i] = newColor.r;
        pix[i + 1] = newColor.g;
        pix[i + 2] = newColor.b;
        pix[i + 3] = newColor.a;
      }
    }

    ctx.putImageData(imgd, 0, 0);

    return canvas;
  }

  async createCard(charaId) {
    var response = await fetch(`https://xivapi.com/character/${charaId}?extended=1&data=FC,mimo`);
    var data = await response.json();

    const canvas = createCanvas(890, 600);
    const ctx = canvas.getContext("2d");

    var portrait = await loadImage(data.Character.Portrait);

    ctx.drawImage(this.bgImage, 0, 0, 900, 600);

    ctx.drawImage(portrait, 0, 0, 441, 600);

    ctx.strokeStyle = white;
    ctx.fillStyle = black;
    ctx.beginPath();
    ctx.fillRect(rectStartX, rectStartRow1Y, rectFullWidth, rectHeightRow1);

    ctx.fillRect(rectStartX, rectStartRow2Y, rectHalfWidth, rectHeightRow2);
    ctx.fillRect(rectStartXHalf, rectStartRow2Y, rectHalfWidth, rectHeightRow2);

    ctx.fillRect(rectStartX, rectStartRow3Y, rectFullWidth, rectHeightRow3);
    ctx.fillRect(rectStartX, rectStartRow4Y, rectFullWidth, rectHeightRow4);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = med;
    ctx.fillStyle = primary;
    ctx.fillText(data.Character.Title.Name, 665, textTitleY);
    ctx.font = small;
    ctx.fillText(`${data.Character.Server} (${data.Character.DC})`, 665, textServerY);


    // Race, Clan, Guardian, GC, FC Titles
    ctx.font = small;
    ctx.textAlign = "left";
    ctx.fillText("Race & Clan", 480, infoTextSmallStartY);
    ctx.fillText("Guardian", 480, infoTextSmallStartY + infoTextSpacing);
    if (data.Character.GrandCompany.Company != null) {
      ctx.fillText("Grand Company", 480, infoTextSmallStartY + infoTextSpacing * 2);
    }
    if (data.Character.FreeCompanyName != null) {
      ctx.fillText("Free Company", 480, infoTextSmallStartY + infoTextSpacing * 3);
    }

    ctx.fillStyle = white;
    ctx.font = large;
    ctx.textAlign = "center";
    // Chara Name
    if (data.Character.Title.Name == null || data.Character.Title.Name == "") {
      ctx.fillText(data.Character.Name, 665, textNameNoTitleY);
    } else {
      ctx.fillText(data.Character.Name, 665, textNameTitleY);
    }
    // Race, Clan, Guardian, GC, FC Info
    ctx.font = smed;
    ctx.textAlign = "left";
    ctx.fillText(`${data.Character.Race.Name}, ${data.Character.Tribe.Name}`, 480, infoTextBigStartY);

    ctx.fillText(data.Character.GuardianDeity.Name, 480, infoTextBigStartY + infoTextSpacing);
    var deityIcon = await loadImage('https://xivapi.com/' + data.Character.GuardianDeity.Icon);
    ctx.drawImage(deityIcon, deityIconX, deityIconY, 28, 28);

    if (data.Character.GrandCompany.Company != null) {
      ctx.fillText(data.Character.GrandCompany.Company.Name, 480, infoTextBigStartY + infoTextSpacing * 2);

      var gcRankIcon = await loadImage('https://xivapi.com/' + data.Character.GrandCompany.Rank.Icon);
      ctx.drawImage(gcRankIcon, gcRankIconX, gcRankIconY, 40, 40);
    }
    if (data.Character.FreeCompanyName != null) {
      var crestImage = await this.createCrest(data.FreeCompany.Crest);
      ctx.drawImage(crestImage, fcCrestX, fcCrestY, fcCrestScale, fcCrestScale);

      ctx.fillText(data.Character.FreeCompanyName, 480, infoTextBigStartY + infoTextSpacing * 3);
    }

    // Minion & Mount percentages
    var mountsPct = '??';
    if (data.Mounts !== null) {
      mountsPct = Math.ceil((data.Mounts.length / this.countMount) * 100);
    }
    
    var minionsPct = '??';
    if (data.Minions !== null) {
      minionsPct = Math.ceil((data.Minions.length / this.countMinion) * 100);
    }

    const mountsMeasure = ctx.measureText(`${mountsPct}%`);
    const minionsMeasure = ctx.measureText(`${minionsPct}%`);

    ctx.fillText(`${mountsPct}%`, 480, textMountMinionY);
    ctx.fillText(`${minionsPct}%`, 685, textMountMinionY);

    ctx.fillStyle = grey;
    ctx.font = small;

    ctx.fillText("Mounts", 480 + mountsMeasure.width + 5, textMountMinionY);
    ctx.fillText("Minions", 685 + minionsMeasure.width + 5, textMountMinionY);

    ctx.drawImage(this.imgMount, 620, iconMountMinionY, 32, 32);
    ctx.drawImage(this.imgMinion, 834, iconMountMinionY, 19, 32);

    ctx.fillStyle = white;


    // Why are there so many fucking jobs in this game?
    // Crafting
    ctx.textAlign = "center";

    var cJobsRowTextX = jobsRowTextStartX;
    ctx.drawImage(this.imgAlchemist, 480, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[24].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgArmorer, 510, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[20].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgBlacksmith, 540, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[19].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgCarpenter, 570, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[18].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgCulinarian, 600, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[25].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgGoldsmith, 630, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[21].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgLeatherworker, 660, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[22].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgWeaver, 690, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[23].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSpacer;

    // Gathering
    ctx.drawImage(this.imgBotanist, 750, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[27].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgFisher, 780, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[28].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgMiner, 810, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[26].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    // Tanks
    cJobsRowTextX = jobsRowTextStartX;

    ctx.drawImage(this.imgPaladin, 480, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[0].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgWarrior, 510, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[1].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgDarkKnight, 540, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[2].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgGunbreaker, 570, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[3].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSpacer;

    // Healers
    ctx.drawImage(this.imgWhitemage, 630, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[8].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgScholar, 660, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[9].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgAstrologian, 690, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[10].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSpacer;

    // DPS
    // Ranged
    ctx.drawImage(this.imgBard, 750, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[11].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgMachinist, 780, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[12].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgDancer, 810, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[13].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    // Melee
    cJobsRowTextX = jobsRowTextStartX;

    ctx.drawImage(this.imgDragoon, 480, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[5].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgMonk, 510, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[4].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgNinja, 540, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[6].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgSamurai, 570, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[7].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSpacer;

    // Caster
    ctx.drawImage(this.imgBlackmage, 630, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[14].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgSummoner, 660, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[15].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.imgRedmage, 690, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[16].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    // Limited
    ctx.drawImage(this.imgBluemage, 780, jobsRowIcon2Y, 33, 33);
    ctx.fillText(data.Character.ClassJobs[17].Level, 796, jobsRowText2Y);

    return canvas.toBuffer();
  }
}

exports.CardCreator = CardCreator;
