const fetch = require('node-fetch');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

const createIlvlFilter = require('./create-ilvl-filter');

function absolute(relativePath) {
  return path.join(__dirname, relativePath);
}

registerFont(absolute('./resources/SourceSansPro-Regular.ttf'), { family: 'Source Sans Pro', style: 'Regular' });
registerFont(absolute('./resources/SourceSansPro-SemiBold.ttf'), { family: 'Source Sans Pro', style: 'SemiBold' });

const primary = 'rgba(178, 214, 249, 1)';
const white = 'rgba(255, 255, 255,1)';
const grey = '#868686';
const black = 'rgba(0,0,0,0.5)';
const copyright = '11px "Source Sans Pro"';
const small = '18px "Source Sans Pro"';
const med = '30px "Source Sans Pro"';
const smed = '25px "Source Sans Pro"';
const large = '45px "Source Sans Pro SemiBold"';

const jobsRowTextStartX = 495;
const jobsRowTextSize = 30;
const jobsRowTextSpacer = jobsRowTextSize * 2;

const rectHeightRow1 = 120; // Title, Name, World
const rectHeightRow2 = 40; // Mounts, Minions
const rectHeightRow3 = 215; // Info
const rectHeightRow4 = 120; // Jobs
const rectHeightRow5 = 175; // Jobs

const rectSpacing = 8;
const rectHalfWidthSpacing = 10;

const rectFullWidth = 400;
const rectHalfWidth = (rectFullWidth / 2) - (rectHalfWidthSpacing / 2);

const rectStartX = 464;
const rectStartXHalf = rectStartX + rectHalfWidth + rectHalfWidthSpacing;

const rectStartRow1Y = 0;
const rectStartRow2Y = rectStartRow1Y + rectHeightRow1 + rectSpacing;
const rectStartRow3Y = rectStartRow2Y + rectHeightRow2 + rectSpacing;
const rectStartRow4Y = rectStartRow3Y + rectHeightRow3 + rectSpacing;
const rectStartRow5Y = rectStartRow4Y + rectHeightRow4 + rectSpacing;

const jobsStartSpacing = 10;
const jobsRowSpacing = 8;

const jobsRowIcon1Y = rectStartRow5Y + jobsStartSpacing;
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

const languageStrings = {
  en: {
    raceAndClan: 'Race & Clan',
    guardian: 'Guardian',
    grandCompany: 'Grand Company',
    freeCompany: 'Free Company',
    elementalLevel: 'Elemental Level',
    eurekaLevel: 'Level',
    resistanceRank: 'Resistance Rank',
    bozjaRank: 'Rank',
    mounts: 'Mounts',
    minions: 'Minions',
  },
  de: {
    raceAndClan: 'Volk & Stamm',
    guardian: 'Schutzgott',
    grandCompany: 'Staatliche Gesellschaft',
    freeCompany: 'Freie Gesellschaft',
    elementalLevel: 'Das Verbotene Land Eureka',
    eurekaLevel: 'Elementarstufe',
    resistanceRank: 'Bozja-Südfront',
    bozjaRank: 'Widerstandsstufe',
    mounts: 'Reittiere',
    minions: 'Begleiter',
  },
};

class CardCreator {
  /**
   * Creates a new card creator.
   * @constructor
   * @param {string} [xivApiKey] The API key for the XIV API to be used in all requests.
   */
  constructor(xivApiKey = undefined) {
    this.xivApiKey = typeof xivApiKey === 'string' && xivApiKey !== '' ? xivApiKey : undefined;
    this.initPromise = null;
  }

  /**
   * @typedef {Object} CardCreator~CanvasDimensions
   * @property {number} width The width of the canvas.
   * @property {number} height The height of the canvas.
   */

  /**
   * The canvas's dimensions.
   * @type {CardCreator~CanvasDimensions}
   */
  get canvasSize() {
    return {
      width: 890,
      height: 720,
    };
  }

  /**
   * Ensures that the instance is ready to generate character cards.
   * This function must be resolved before using character card
   * generation methods.
   * @returns {Promise} A promise representing the initialization state of this generator.
   */
  async ensureInit() {
    if (this.initPromise == null) this.initPromise = this.init();

    await this.initPromise;
  }

  async init() {
    const commonImagesPromise = Promise.all([
      loadImage(absolute('./resources/background.png')),
      loadImage(absolute('./resources/minion.png')),
      loadImage(absolute('./resources/mount.png')),
      loadImage(absolute('./resources/ilvl-icon.png')),
      loadImage(absolute('./resources/shadow.png')),
    ]).then(([background, minion, mount, ilvl, shadow]) => {
      this.images = {
        background, minion, mount, ilvl, shadow,
      };
    });

    const classJobs = [
      'alchemist', 'armorer', 'blacksmith', 'carpenter', 'culinarian', 'goldsmith', 'leatherworker', 'weaver',
      'botanist', 'fisher', 'miner',
      'gladiator', 'paladin', 'marauder', 'warrior', 'darkknight', 'gunbreaker',
      'conjurer', 'whitemage', 'scholar', 'astrologian',
      'archer', 'bard', 'machinist', 'dancer',
      'lancer', 'dragoon', 'pugilist', 'monk', 'rogue', 'ninja', 'samurai',
      'thaumaturge', 'blackmage', 'arcanist', 'summoner', 'redmage',
      'bluemage',
    ];

    const classJobIconsPromise = Promise.all(
      classJobs.map(name => loadImage(absolute(`./resources/class-jobs-icons/${name}.png`)))
    ).then(images => {
      this.cjIcons = {};
      images.forEach((image, index) => this.cjIcons[classJobs[index]] = image);
    });

    const jobBackgroundsPromise = Promise.all(
      Array.from({ length: 38 }, (_, index) => loadImage(absolute(`./resources/class-jobs-backgrounds/${index + 1}.png`)))
    ).then(images => this.jobBackgrounds = images);

    const ilevelFilterPromise = createIlvlFilter(this.xivApiKey).then(filterIds => this.ilvlFilterIds = filterIds);

    const minionCountPromise = fetch(`https://ffxivcollect.com/api/minions/`)
      .then(response => response.json())
      .then(data => this.minionCount = data.count);

    const mountCountPromise = fetch(`https://ffxivcollect.com/api/mounts/`)
      .then(response => response.json())
      .then(data => this.mountCount = data.count);

    await Promise.all([
      commonImagesPromise,
      classJobIconsPromise,
      jobBackgroundsPromise,
      ilevelFilterPromise,
      minionCountPromise,
      mountCountPromise,
    ]);
  }

  async createCrest(crests) {
    if (!Array.isArray(crests) || crests.length == 0) return null;

    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext('2d');

    const crestLayers = await Promise.all(crests.map(crest => loadImage(crest)));

    for (const layer of crestLayers) {
      ctx.drawImage(layer, 0, 0, 128, 128);
    }

    const imageData = ctx.getImageData(0, 0, 128, 128);
    const pixelData = imageData.data;
    
    // Iterate over all pixels, where one consists of 4 numbers: r, g, b and a
    for (let index = 0; index < pixelData.length; index += 4) {
      const [r, g, b] = pixelData.slice(index, index + 3);
      
      // If the pixel is a special grey, change it to be transparent (a = 0)
      if (r == 64 && g == 64 && b == 64) {
        pixelData[index] = 0;
        pixelData[index + 1] = 0;
        pixelData[index + 2] = 0;
        pixelData[index + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  getItemLevel(gearset) {
    let ilvl = 0;
    let cnt = 0;
    let mainHandLvl = 0;
    let hasOffHand = false;

    for (const [key, piece] of Object.entries(gearset)) {
      if (key == 'SoulCrystal')
        continue;

      if (key == 'MainHand')
        mainHandLvl = piece.Item.LevelItem;

      if (key == 'OffHand')
        hasOffHand = true;

      if (this.ilvlFilterIds.includes(piece.Item.ID) == true) {
        ilvl += 1;
      } else {
        ilvl += piece.Item.LevelItem;
      }

      cnt++;
    }

    if (!hasOffHand) {
      ilvl += mainHandLvl;
      cnt++;
    }

    if (cnt == 0)
      return 0;

    // ilvl division is always out of 13 items
    // mainhand counts twice if there's no offhand
    // job stones are ignored
    return this.pad(Math.floor(ilvl / 13), 4);
  }

  pad(num, size) {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
  }

  /**
   * Creates a character card for a character.
   * @param {number | string} charaId The Lodestone ID of the character to generate a card for.
   * @param {string | Buffer | null | undefined} customImage Optional parameter providing a custom
   * image to be drawn between the background of the character card and the black information boxes.
   * The image should be the same resolution as the default image. The default image size can be
   * retrieved with {@link CardCreator#canvasSize}. May be a URL, `data: `URI, a local file path,
   * or a Buffer instance.
   * @param {string} [language] The language that the cards should be in use for the request
   * @example
   * const fs = require('fs');
   * 
   * const card = new CardCreator();
   * const lodestoneId = '13821878';
   * 
   * await card.ensureInit();
   * const png = await card.createCard(lodestoneId);
   * 
   * fs.writeFile('./test.png', png, err => {
   *   if (err) console.error(err);
   * });
   * @returns {Promise<Buffer>} A promise representating the construction of the card's image data.
   */
  async createCard(charaId, customImage, language = 'en') {
    const strings = Object.keys(languageStrings).includes(language) ? languageStrings[language] : languageStrings.en;

    const characterInfoUrl = `https://xivapi.com/character/${charaId}?language=${language}&extended=1&data=FC,mimo`;
    let response = await fetch(characterInfoUrl);
    if (!response.ok) {
      // Retry once if the request fails
      response = await fetch(characterInfoUrl);
    }
    const data = await response.json();

    const canvasSize = this.canvasSize;
    const canvas = createCanvas(canvasSize.width, canvasSize.height);
    const ctx = canvas.getContext('2d');

    const portrait = await loadImage(data.Character.Portrait);

    ctx.drawImage(this.images.background, 0, 0, canvasSize.width, canvasSize.height + 2);

    ctx.drawImage(portrait, 0, 120, 441, 600);

    if (customImage != null) {
      const bg = await loadImage(customImage);

      ctx.drawImage(bg, 0, 0, canvasSize.width, canvasSize.height);
    }

    ctx.strokeStyle = white;
    ctx.fillStyle = black;
    ctx.beginPath();
    // Name, Title, Server Rect
    ctx.fillRect(25, 10, 840, 100);

    // BLU returns a null UnlockedState.ID so we can't use it to pick the job image.
    if (data.Character.ActiveClassJob.UnlockedState.ID != null) {
      ctx.drawImage(this.jobBackgrounds[data.Character.ActiveClassJob.UnlockedState.ID], 450, 4, rectFullWidth, 110);
    } else {
      ctx.drawImage(this.jobBackgrounds[36], 450, 4, rectFullWidth, 110);
    }

    ctx.fillRect(rectStartX, rectStartRow2Y, rectHalfWidth, rectHeightRow2);
    ctx.fillRect(rectStartXHalf, rectStartRow2Y, rectHalfWidth, rectHeightRow2);

    ctx.fillRect(rectStartX, rectStartRow3Y, rectFullWidth, rectHeightRow3); //info
    ctx.fillRect(rectStartX, rectStartRow4Y, rectFullWidth, rectHeightRow4); // bozja
    ctx.fillRect(rectStartX, rectStartRow5Y, rectFullWidth, rectHeightRow5);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = med;
    ctx.fillStyle = primary;

    if (data.Character.Title.Name !== undefined)
      ctx.fillText(data.Character.Title.Name, 450, 40);

    ctx.font = small;
    ctx.fillText(`${data.Character.Server} (${data.Character.DC})`, 450, 100);

    // Race, Clan, Guardian, GC, FC Titles
    ctx.font = small;
    ctx.textAlign = 'left';
    ctx.fillText(strings.raceAndClan, 480, infoTextSmallStartY);
    ctx.fillText(strings.guardian, 480, infoTextSmallStartY + infoTextSpacing);
    if (data.Character.GrandCompany.Company != null) {
      ctx.fillText(strings.grandCompany, 480, infoTextSmallStartY + infoTextSpacing * 2);
    }
    if (data.Character.FreeCompanyName != null) {
      ctx.fillText(strings.freeCompany, 480, infoTextSmallStartY + infoTextSpacing * 3);
    }
    ctx.fillText(strings.elementalLevel, 480, 425);
    ctx.fillText(strings.resistanceRank, 480, 475);


    ctx.fillStyle = grey;
    ctx.font = smed;

    const ilvl = this.getItemLevel(data.Character.GearSet.Gear);
    ctx.drawImage(this.images.shadow, 441 - 143, 110, 170, 90);
    ctx.drawImage(this.images.ilvl, 441 - 92, 132, 24, 27);
    ctx.fillText(ilvl, 441 - 65, 155);

    ctx.fillStyle = white;
    ctx.font = large;

    ctx.textAlign = 'center';
    // Chara Name
    if (data.Character.Title === undefined || data.Character.Title.Name == null || data.Character.Title.Name == '') {
      ctx.fillText(data.Character.Name, 450, 80);
    } else {
      ctx.fillText(data.Character.Name, 450, 80);
    }
    // Race, Clan, Guardian, GC, FC Info
    ctx.font = smed;
    ctx.textAlign = 'left';
    ctx.fillText(`${data.Character.Race.Name}, ${data.Character.Tribe.Name}`, 480, infoTextBigStartY);

    ctx.fillText(data.Character.GuardianDeity.Name, 480, infoTextBigStartY + infoTextSpacing);
    const deityIcon = await loadImage('https://xivapi.com/' + data.Character.GuardianDeity.Icon);
    ctx.drawImage(deityIcon, deityIconX, deityIconY, 28, 28);

    if (data.Character.GrandCompany.Company != null) {
      ctx.fillText(data.Character.GrandCompany.Company.Name.replace('[p]', ''), 480, infoTextBigStartY + infoTextSpacing * 2);

      const gcRankIcon = await loadImage('https://xivapi.com/' + data.Character.GrandCompany.Rank.Icon);
      ctx.drawImage(gcRankIcon, gcRankIconX, gcRankIconY, 40, 40);
    }

    if (data.Character.FreeCompanyName != null) {
      const crestImage = await this.createCrest(data.FreeCompany.Crest);

      if (crestImage !== null)
        ctx.drawImage(crestImage, fcCrestX, fcCrestY, fcCrestScale, fcCrestScale);


      const fcMeasure = ctx.measureText(data.Character.FreeCompanyName);
      ctx.fillText(data.Character.FreeCompanyName, 480, infoTextBigStartY + infoTextSpacing * 3);

      ctx.fillStyle = grey;
      ctx.font = small;
      ctx.fillText(`«${data.FreeCompany.Tag}»`, 480 + fcMeasure.width + 10, infoTextBigStartY + infoTextSpacing * 3);
    }

    ctx.font = smed;
    ctx.fillStyle = white;

    if (data.Character.ClassJobsElemental.Level != null) {
      ctx.fillText(`${strings.eurekaLevel} ${data.Character.ClassJobsElemental.Level}`, 480, 450);
    } else {
      ctx.fillText(`${strings.eurekaLevel} 0`, 480, 450);
    }

    if (data.Character.ClassJobsBozjan.Level != null) {
      ctx.fillText(`${strings.bozjaRank} ${data.Character.ClassJobsBozjan.Level}`, 480, 500);
    } else {
      ctx.fillText(`${strings.bozjaRank} 0`, 480, 500);
    }

    // Minion & Mount percentages
    let mountsPct = '0';
    if (data.Mounts !== null) {
      mountsPct = Math.ceil((data.Mounts.length / this.mountCount) * 100);
    }

    let minionsPct = '0';
    if (data.Minions !== null) {
      minionsPct = Math.ceil((data.Minions.length / this.minionCount) * 100);
    }

    const mountsMeasure = ctx.measureText(`${mountsPct}%`);
    const minionsMeasure = ctx.measureText(`${minionsPct}%`);

    ctx.fillText(`${mountsPct}%`, 480, textMountMinionY);
    ctx.fillText(`${minionsPct}%`, 685, textMountMinionY);

    ctx.fillStyle = grey;
    ctx.font = small;

    ctx.fillText(strings.mounts, 480 + mountsMeasure.width + 5, textMountMinionY);
    ctx.fillText(strings.minions, 685 + minionsMeasure.width + 5, textMountMinionY);

    ctx.drawImage(this.images.mount, 620, iconMountMinionY, 32, 32);
    ctx.drawImage(this.images.minion, 834, iconMountMinionY, 19, 32);

    ctx.fillStyle = white;


    // Why are there so many fucking jobs in this game?
    // Crafting
    ctx.textAlign = 'center';

    let cJobsRowTextX = jobsRowTextStartX;
    ctx.drawImage(this.cjIcons.alchemist, 480, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[24].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.armorer, 510, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[20].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.blacksmith, 540, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[19].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.carpenter, 570, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[18].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.culinarian, 600, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[25].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.goldsmith, 630, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[21].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.leatherworker, 660, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[22].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.weaver, 690, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[23].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSpacer;

    // Gathering
    ctx.drawImage(this.cjIcons.botanist, 750, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[27].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.fisher, 780, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[28].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.miner, 810, jobsRowIcon3Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[26].Level, cJobsRowTextX, jobsRowText3Y);
    cJobsRowTextX += jobsRowTextSize;

    // Tanks
    cJobsRowTextX = jobsRowTextStartX;

    if (data.Character.ClassJobs[0].UnlockedState.ID == 19) {
      ctx.drawImage(this.cjIcons.paladin, 480, jobsRowIcon1Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.gladiator, 480, jobsRowIcon1Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[0].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    if (data.Character.ClassJobs[1].UnlockedState.ID == 21) {
      ctx.drawImage(this.cjIcons.warrior, 510, jobsRowIcon1Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.marauder, 510, jobsRowIcon1Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[1].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.darkknight, 540, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[2].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.gunbreaker, 570, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[3].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSpacer;

    // Healers
    if (data.Character.ClassJobs[8].UnlockedState.ID == 24) {
      ctx.drawImage(this.cjIcons.whitemage, 630, jobsRowIcon1Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.conjurer, 630, jobsRowIcon1Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[8].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.scholar, 660, jobsRowIcon1Y, 30, 30);
    if (data.Character.ClassJobs[9].Level >= 30) {
      ctx.fillText(data.Character.ClassJobs[9].Level, cJobsRowTextX, jobsRowText1Y);
    } else {
      ctx.fillText('0', cJobsRowTextX, jobsRowText1Y);
    }
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.astrologian, 690, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[10].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSpacer;

    // DPS
    // Ranged
    if (data.Character.ClassJobs[11].UnlockedState.ID == 23) {
      ctx.drawImage(this.cjIcons.bard, 750, jobsRowIcon1Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.archer, 750, jobsRowIcon1Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[11].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.machinist, 780, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[12].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.dancer, 810, jobsRowIcon1Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[13].Level, cJobsRowTextX, jobsRowText1Y);
    cJobsRowTextX += jobsRowTextSize;

    // Melee
    cJobsRowTextX = jobsRowTextStartX;

    if (data.Character.ClassJobs[5].UnlockedState.ID == 22) {
      ctx.drawImage(this.cjIcons.dragoon, 480, jobsRowIcon2Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.lancer, 480, jobsRowIcon2Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[5].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    if (data.Character.ClassJobs[4].UnlockedState.ID == 20) {
      ctx.drawImage(this.cjIcons.monk, 510, jobsRowIcon2Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.pugilist, 510, jobsRowIcon2Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[4].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    if (data.Character.ClassJobs[6].UnlockedState.ID == 30) {
      ctx.drawImage(this.cjIcons.ninja, 540, jobsRowIcon2Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.rogue, 540, jobsRowIcon2Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[6].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.samurai, 570, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[7].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSpacer;

    // Caster
    if (data.Character.ClassJobs[14].UnlockedState.ID == 25) {
      ctx.drawImage(this.cjIcons.blackmage, 630, jobsRowIcon2Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.thaumaturge, 630, jobsRowIcon2Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[14].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    if (data.Character.ClassJobs[15].UnlockedState.ID == 27) {
      ctx.drawImage(this.cjIcons.summoner, 660, jobsRowIcon2Y, 30, 30);
    } else {
      ctx.drawImage(this.cjIcons.arcanist, 660, jobsRowIcon2Y, 30, 30);
    }
    ctx.fillText(data.Character.ClassJobs[15].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    ctx.drawImage(this.cjIcons.redmage, 690, jobsRowIcon2Y, 30, 30);
    ctx.fillText(data.Character.ClassJobs[16].Level, cJobsRowTextX, jobsRowText2Y);
    cJobsRowTextX += jobsRowTextSize;

    // Limited
    ctx.drawImage(this.cjIcons.bluemage, 780, jobsRowIcon2Y, 33, 33);
    ctx.fillText(data.Character.ClassJobs[17].Level, 796, jobsRowText2Y);

    ctx.textAlign = 'left';
    ctx.fillStyle = black;
    ctx.font = copyright;

    ctx.fillText(`© 2010 - ${new Date().getFullYear()} SQUARE ENIX CO., LTD. All Rights Reserved`, rectStartX, 720 - 5);

    return canvas.toBuffer();
  }
}

exports.CardCreator = CardCreator;
