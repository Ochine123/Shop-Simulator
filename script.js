"use strict";

// ==========================================
// SHOP SIMULATOR v1.1
// ==========================================

const SAVE_KEY = "shopSimulatorV11";

// ==========================================
// GAME DATA
// ==========================================

let money = 100;
let shopLevel = 1;
let rebirths = 0;

let inventory = {
apple: 0,
soda: 0,
cookie: 0,
pizza: 0,
game: 0
};

let stock = {
apple: 5,
soda: 5,
cookie: 5,
pizza: 5,
game: 5
};

let prices = {
apple:  { buy: 25,  sell: 35 },
soda:   { buy: 40,  sell: 55 },
cookie: { buy: 60,  sell: 80 },
pizza:  { buy: 100, sell: 130 },
game:   { buy: 250, sell: 325 }
};

let upgrades = {
work: 0,
sell: 0,
stock: 0,
cheap: 0
};

let worker = {
hired: false,
level: 0
};

let settings = {
background: "dark",
light: false
};

let stats = {
earned: 0,
spent: 0,
bought: 0,
sold: 0,
work: 0,
highestMoney: 100
};

let achievements = {};

// ==========================================
// PRODUCTS
// ==========================================

const PRODUCTS = [
"apple",
"soda",
"cookie",
"pizza",
"game"
];

// ==========================================
// ACHIEVEMENTS
// ==========================================

const ACHIEVEMENTS = [
{
id: "firstBuy",
title: "🛒 First Purchase",
description: "Buy your first item."
},
{
id: "firstSell",
title: "💰 First Sale",
description: "Sell your first item."
},
{
id: "work10",
title: "💼 Hard Worker",
description: "Work 10 times."
},
{
id: "money1000",
title: "💵 Big Money",
description: "Have $1,000."
},
{
id: "money10000",
title: "💎 Rich",
description: "Have $10,000."
},
{
id: "buy100",
title: "📦 Shopaholic",
description: "Buy 100 items."
},
{
id: "sell100",
title: "💰 Professional Seller",
description: "Sell 100 items."
},
{
id: "level5",
title: "⭐ Level 5",
description: "Reach level 5."
},
{
id: "rebirth1",
title: "🔄 Reborn",
description: "Rebirth for the first time."
},
{
id: "worker",
title: "👷 Employer",
description: "Hire your first worker."
},
{
id: "worker5",
title: "👷 Experienced Worker",
description: "Upgrade your worker to level 5."
}
];

// ==========================================
// DOM HELPER
// ==========================================

function $(id) {
return document.getElementById(id);
}

// ==========================================
// MESSAGES
// ==========================================

function message(text) {
$("message").textContent = text;
}

// ==========================================
// LEVEL SYSTEM
// ==========================================

function maxLevel() {
return (rebirths + 1) * 5;
}

// ==========================================
// BONUSES
// ==========================================

function rebirthMultiplier() {
return 1 + rebirths * 0.10;
}

function workMultiplier() {
return rebirthMultiplier() + upgrades.work * 0.25;
}

function sellMultiplier() {
return rebirthMultiplier() + upgrades.sell * 0.20;
}

function upgradeCostMultiplier() {
return Math.max(0.25, 1 - upgrades.cheap * 0.10);
}

function stockBonus() {
return upgrades.stock * 2;
}

function workerMultiplier() {
return 1 + worker.level * 0.20;
}

// ==========================================
// STOCK
// ==========================================

function randomStock() {
return Math.floor(Math.random() * 5) + 1 + stockBonus();
}

function refreshStock() {
for (const item of PRODUCTS) {
stock[item] = randomStock();
}

message("📦 Stock refreshed!");

update();
save();
}

// ==========================================
// DYNAMIC PRICES
// ==========================================

function randomizePrices() {
for (const item of PRODUCTS) {

const currentBuy = prices[item].buy;

const change = Math.random() * 0.4 - 0.2;

prices[item].buy = Math.max(
  5,
  Math.round(currentBuy * (1 + change))
);

prices[item].sell = Math.max(
  8,
  Math.round(prices[item].buy * 1.4)
);

}

message("📈 Market prices changed!");

update();
save();
}

// ==========================================
// SHOP TITLE
// ==========================================

function getShopTitle() {

if (shopLevel >= 25) {
return "👑 Shopping Empire";
}

if (shopLevel >= 20) {
return "🏢 Mega Store";
}

if (shopLevel >= 15) {
return "🏬 Supermarket";
}

if (shopLevel >= 10) {
return "🏪 Big Store";
}

if (shopLevel >= 5) {
return "🛍️ Popular Shop";
}

if (shopLevel >= 3) {
return "🏪 Local Shop";
}

return "🏚️ Tiny Shop";
}

// ==========================================
// BUY
// ==========================================

function buy(item) {

if (!stock[item] || stock[item] <= 0) {
message("❌ This item is out of stock!");
return;
}

const price = prices[item].buy;

if (money < price) {
message("❌ Not enough money!");
return;
}

money -= price;

inventory[item]++;
stock[item]--;

stats.spent += price;
stats.bought++;

checkAchievements();

message("🛒 Bought " + item + " for $" + price + "!");

update();
save();
}

// ==========================================
// SELL
// ==========================================

function sell(item, amount) {

const owned = inventory[item];

if (owned <= 0) {
message("❌ You don't have any of this item!");
return;
}

if (amount === "all") {
amount = owned;
}

amount = Math.min(amount, owned);

if (amount <= 0) {
return;
}

inventory[item] -= amount;

const earned = Math.floor(
prices[item].sell *
amount *
sellMultiplier()
);

money += earned;

stats.earned += earned;
stats.sold += amount;

if (money > stats.highestMoney) {
stats.highestMoney = money;
}

checkAchievements();

message(
"💰 Sold " +
amount +
" " +
item +
" for $" +
earned +
"!"
);

update();
save();
}

// ==========================================
// WORK
// ==========================================

function work() {

const earned = Math.floor(
10 * workMultiplier()
);

money += earned;

stats.earned += earned;
stats.work++;

if (money > stats.highestMoney) {
stats.highestMoney = money;
}

checkAchievements();

message("💼 You earned $" + earned + "!");

update();
save();
}

// ==========================================
// SHOP UPGRADE
// ==========================================

function upgradeShop() {

if (shopLevel >= maxLevel()) {
message(
"👑 MAX LEVEL! Rebirth to continue."
);
return;
}

const cost = Math.floor(
shopLevel *
200 *
upgradeCostMultiplier()
);

if (money < cost) {
message("❌ Not enough money!");
return;
}

money -= cost;
stats.spent += cost;

shopLevel++;

checkAchievements();

message(
"⬆️ Shop upgraded to Level " +
shopLevel +
"!"
);

update();
save();
}

// ==========================================
// PERMANENT UPGRADES
// ==========================================

function buyUpgrade(type, baseCost) {

const cost = Math.floor(
baseCost *
(upgrades[type] + 1) *
upgradeCostMultiplier()
);

if (money < cost) {
message("❌ Not enough money!");
return;
}

money -= cost;
stats.spent += cost;

upgrades[type]++;

message("⬆️ Upgrade purchased!");

update();
save();
}

// ==========================================
// WORKER
// ==========================================

function hireWorker() {

if (worker.hired) {
message("👷 You already have a worker!");
return;
}

const cost = 5000;

if (money < cost) {
message(
"❌ You need $5,000 to hire a Cashier/Seller!"
);
return;
}

money -= cost;
stats.spent += cost;

worker.hired = true;
worker.level = 1;

checkAchievements();

message("👷 Cashier/Seller hired!");

update();
save();
}

function upgradeWorker() {

if (!worker.hired) {
message("❌ Hire a worker first!");
return;
}

const cost = 3000 * worker.level;

if (money < cost) {
message("❌ Not enough money!");
return;
}

money -= cost;
stats.spent += cost;

worker.level++;

checkAchievements();

message(
"👷 Worker upgraded to Level " +
worker.level +
"!"
);

update();
save();
}

// ==========================================
// AUTOMATIC WORKER
// ==========================================

function workerSell() {

if (!worker.hired) {
return;
}

let soldSomething = false;

for (const item of PRODUCTS) {

if (inventory[item] <= 0) {
  continue;
}

const amount = Math.min(
  inventory[item],
  worker.level
);

inventory[item] -= amount;

const earned = Math.floor(
  prices[item].sell *
  amount *
  sellMultiplier() *
  workerMultiplier()
);

money += earned;

stats.earned += earned;
stats.sold += amount;

soldSomething = true;

}

if (soldSomething) {

if (money > stats.highestMoney) {
  stats.highestMoney = money;
}

checkAchievements();

message(
  "👷 Your Cashier/Seller sold some items!"
);

update();
save();

}
}

// ==========================================
// REBIRTH
// ==========================================

function rebirth() {

const requiredLevel = maxLevel();

if (shopLevel < requiredLevel) {
message(
"🔒 You need Level " +
requiredLevel +
" to rebirth!"
);
return;
}

const confirmed = confirm(
"🔄 Rebirth?\n\n" +
"Your level and inventory will reset.\n" +
"YOUR MONEY WILL STAY.\n\n" +
"Continue?"
);

if (!confirmed) {
return;
}

rebirths++;

shopLevel = 1;

stats.rebirths =
(stats.rebirths || 0) + 1;

for (const item of PRODUCTS) {
inventory[item] = 0;
stock[item] = randomStock();
}

checkAchievements();

message(
"🔄 Rebirth #" +
rebirths +
" complete! " +
"You now have +" +
rebirths * 10 +
"% money bonus!"
);

update();
save();
}

// ==========================================
// ACHIEVEMENTS
// ==========================================

function checkAchievements() {

if (stats.bought >= 1) {
achievements.firstBuy = true;
}

if (stats.sold >= 1) {
achievements.firstSell = true;
}

if (stats.work >= 10) {
achievements.work10 = true;
}

if (money >= 1000) {
achievements.money1000 = true;
}

if (money >= 10000) {
achievements.money10000 = true;
}

if (stats.bought >= 100) {
achievements.buy100 = true;
}

if (stats.sold >= 100) {
achievements.sell100 = true;
}

if (shopLevel >= 5) {
achievements.level5 = true;
}

if (rebirths >= 1) {
achievements.rebirth1 = true;
}

if (worker.hired) {
achievements.worker = true;
}

if (worker.level >= 5) {
achievements.worker5 = true;
}

renderAchievements();
}

function renderAchievements() {

const container = $("achievementsList");

container.innerHTML = "";

for (const achievement of ACHIEVEMENTS) {

const unlocked =
  achievements[achievement.id] === true;

const div =
  document.createElement("div");

div.className =
  "achievement " +
  (unlocked ? "unlocked" : "locked");

div.innerHTML =
  "<strong>" +
  (unlocked ? "✅ " : "🔒 ") +
  achievement.title +
  "</strong>" +
  "<br>" +
  "<small>" +
  achievement.description +
  "</small>";

container.appendChild(div);

}
}

// ==========================================
// SETTINGS
// ==========================================

function applySettings() {

document.body.classList.remove(
"bg-dark",
"bg-blue",
"bg-green",
"bg-purple"
);

document.body.classList.add(
"bg-" + settings.background
);

document.body.classList.toggle(
"light",
settings.light
);

$("themeBtn").textContent =
settings.light
? "☀️ Light Mode"
: "🌙 Dark Mode";
}

function openSettings() {
$("settingsModal").classList.remove("hidden");
}

function closeSettings() {
$("settingsModal").classList.add("hidden");
}

function toggleTheme() {

settings.light = !settings.light;

applySettings();
save();
}

// ==========================================
// RESET SAVE
// ==========================================

function resetSave() {

const first =
confirm(
"⚠️ Are you sure you want to reset your save?"
);

if (!first) {
return;
}

const second =
confirm(
"🚨 FINAL WARNING!\n\n" +
"This deletes EVERYTHING:\n" +
"Money\n" +
"Levels\n" +
"Inventory\n" +
"Rebirths\n" +
"Upgrades\n" +
"Workers\n" +
"Achievements\n\n" +
"RESET?"
);

if (!second) {
return;
}

localStorage.removeItem(SAVE_KEY);

location.reload();
}

// ==========================================
// TABS
// ==========================================

function showSection(section) {

$("buySection").classList.add("hidden");
$("sellSection").classList.add("hidden");
$("statsSection").classList.add("hidden");
$("achievementsSection").classList.add("hidden");

$(section).classList.remove("hidden");
}

// ==========================================
// UPDATE UI
// ==========================================

function update() {

$("money").textContent =
"💵 $" + Math.floor(money);

$("level").textContent =
"⭐ Level " +
shopLevel +
" / " +
maxLevel();

$("rebirths").textContent =
"🔄 Rebirths: " +
rebirths;

$("shopTitle").textContent =
getShopTitle();

$("rebirthBonus").textContent =
"💰 Rebirth Bonus: +" +
rebirths * 10 +
"%";

// Products
for (const item of PRODUCTS) {

$(item + "Info").textContent =
  "Buy: $" +
  prices[item].buy +
  " | Sell: $" +
  Math.floor(
    prices[item].sell *
    sellMultiplier()
  ) +
  " | Stock: " +
  stock[item];

$(item + "Owned").textContent =
  "Owned: " +
  inventory[item];

}

// Shop
if (shopLevel >= maxLevel()) {

$("shopUpgradeInfo").textContent =
  "👑 MAX LEVEL";

$("shopUpgradeBtn").textContent =
  "👑 MAX LEVEL";

} else {

const cost = Math.floor(
  shopLevel *
  200 *
  upgradeCostMultiplier()
);

$("shopUpgradeInfo").textContent =
  "Next upgrade: $" + cost;

$("shopUpgradeBtn").textContent =
  "⬆️ Upgrade ($" + cost + ")";

}

// Upgrades
$("workUpgradeInfo").textContent =
"Level " +
upgrades.work +
" | +25% work per level";

$("sellUpgradeInfo").textContent =
"Level " +
upgrades.sell +
" | +20% selling per level";

$("stockUpgradeInfo").textContent =
"Level " +
upgrades.stock +
" | +2 stock per level";

$("cheapUpgradeInfo").textContent =
"Level " +
upgrades.cheap +
" | -10% upgrade costs";

// Worker
if (worker.hired) {

$("workerInfo").textContent =
  "👷 Level " +
  worker.level +
  " | Automatically sells inventory.";

$("hireWorkerBtn").textContent =
  "✅ Hired";

$("upgradeWorkerBtn").textContent =
  "⬆️ Upgrade ($" +
  3000 * worker.level +
  ")";

} else {

$("workerInfo").textContent =
  "Hire a Cashier/Seller for $5,000.";

$("hireWorkerBtn").textContent =
  "👷 Hire ($5,000)";

$("upgradeWorkerBtn").textContent =
  "⬆️ Upgrade";

}

// Rebirth
$("rebirthInfo").textContent =
"Reach Level " +
maxLevel() +
" to rebirth. " +
"Your money stays.";

// Statistics
$("totalEarned").textContent =
"💰 Total Earned: $" +
stats.earned;

$("totalSpent").textContent =
"💸 Total Spent: $" +
stats.spent;

$("itemsBought").textContent =
"🛒 Items Bought: " +
stats.bought;

$("itemsSold").textContent =
"💰 Items Sold: " +
stats.sold;

$("timesWorked").textContent =
"💼 Times Worked: " +
stats.work;

$("highestMoney").textContent =
"👑 Highest Money: $" +
stats.highestMoney;
}

// ==========================================
// SAVE
// ==========================================

function save() {

const data = {
money,
shopLevel,
rebirths,
inventory,
stock,
prices,
upgrades,
worker,
settings,
stats,
achievements
};

localStorage.setItem(
SAVE_KEY,
JSON.stringify(data)
);
}

// ==========================================
// LOAD
// ==========================================

function load() {

const raw =
localStorage.getItem(SAVE_KEY);

if (!raw) {
return;
}

try {

const data =
  JSON.parse(raw);

money =
  typeof data.money === "number"
    ? data.money
    : 100;

shopLevel =
  typeof data.shopLevel === "number"
    ? data.shopLevel
    : 1;

rebirths =
  typeof data.rebirths === "number"
    ? data.rebirths
    : 0;

inventory =
  data.inventory || inventory;

stock =
  data.stock || stock;

prices =
  data.prices || prices;

upgrades =
  data.upgrades || upgrades;

worker =
  data.worker || worker;

settings =
  data.settings || settings;

stats =
  data.stats || stats;

achievements =
  data.achievements || {};

} catch (error) {

console.error(
  "Save failed to load:",
  error
);

}
}

// ==========================================
// BUTTON EVENTS
// ==========================================

// Work
$("workBtn")
.addEventListener("click", work);

// Buy
$("appleBuy")
.addEventListener("click", () => buy("apple"));

$("sodaBuy")
.addEventListener("click", () => buy("soda"));

$("cookieBuy")
.addEventListener("click", () => buy("cookie"));

$("pizzaBuy")
.addEventListener("click", () => buy("pizza"));

$("gameBuy")
.addEventListener("click", () => buy("game"));

// Sell 1
$("appleSell")
.addEventListener("click", () => sell("apple", 1));

$("sodaSell")
.addEventListener("click", () => sell("soda", 1));

$("cookieSell")
.addEventListener("click", () => sell("cookie", 1));

$("pizzaSell")
.addEventListener("click", () => sell("pizza", 1));

$("gameSell")
.addEventListener("click", () => sell("game", 1));

// Sell all
$("appleSellAll")
.addEventListener("click", () => sell("apple", "all"));

$("sodaSellAll")
.addEventListener("click", () => sell("soda", "all"));

$("cookieSellAll")
.addEventListener("click", () => sell("cookie", "all"));

$("pizzaSellAll")
.addEventListener("click", () => sell("pizza", "all"));

$("gameSellAll")
.addEventListener("click", () => sell("game", "all"));

// Shop
$("shopUpgradeBtn")
.addEventListener("click", upgradeShop);

// Permanent upgrades
$("workUpgradeBtn")
.addEventListener(
"click",
() => buyUpgrade("work", 500)
);

$("sellUpgradeBtn")
.addEventListener(
"click",
() => buyUpgrade("sell", 750)
);

$("stockUpgradeBtn")
.addEventListener(
"click",
() => buyUpgrade("stock", 1000)
);

$("cheapUpgradeBtn")
.addEventListener(
"click",
() => buyUpgrade("cheap", 1500)
);

// Worker
$("hireWorkerBtn")
.addEventListener("click", hireWorker);

$("upgradeWorkerBtn")
.addEventListener("click", upgradeWorker);

// Rebirth
$("rebirthBtn")
.addEventListener("click", rebirth);

// Tabs
$("buyTab")
.addEventListener(
"click",
() => showSection("buySection")
);

$("sellTab")
.addEventListener(
"click",
() => showSection("sellSection")
);

$("statsTab")
.addEventListener(
"click",
() => showSection("statsSection")
);

$("achievementsTab")
.addEventListener(
"click",
() => showSection("achievementsSection")
);

// Settings
$("settingsBtn")
.addEventListener("click", openSettings);

$("closeSettings")
.addEventListener("click", closeSettings);

$("themeBtn")
.addEventListener("click", toggleTheme);

$("saveBtn")
.addEventListener("click", () => {
save();
message("💾 Game saved!");
});

$("resetBtn")
.addEventListener("click", resetSave);

// Backgrounds
document
.querySelectorAll("[data-background]")
.forEach(button => {

button.addEventListener(
  "click",
  () => {

    settings.background =
      button.dataset.background;

    applySettings();
    save();
  }
);

});

// ==========================================
// TIMERS
// ==========================================

// Worker acts every 15 seconds
setInterval(workerSell, 15000);

// Stock refreshes every 2 minutes
setInterval(refreshStock, 120000);

// Market changes every 3 minutes
setInterval(randomizePrices, 180000);

// Autosave every 5 seconds
setInterval(save, 5000);

// ==========================================
// START GAME
// ==========================================

load();

applySettings();

update();

checkAchievements();

console.log(
"🛒 Shop Simulator v1.1 loaded!"
);
