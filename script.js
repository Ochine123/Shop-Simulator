let money = 100;
let shopLevel = 1;
let rebirths = 0;

// INVENTORY
let apples = 0;
let sodas = 0;
let cookies = 0;
let pizzas = 0;
let games = 0;

// PERMANENT UPGRADES
let workUpgrade = 0;
let sellUpgrade = 0;
let stockUpgrade = 0;
let cheapUpgrade = 0;

// PRICES
const prices = {
    apple: {
        buy: 25,
        sell: 35
    },

    soda: {
        buy: 40,
        sell: 55
    },

    cookie: {
        buy: 60,
        sell: 80
    },

    pizza: {
        buy: 100,
        sell: 130
    },

    game: {
        buy: 250,
        sell: 325
    }
};


// STOCK

function randomStock() {
    return Math.floor(Math.random() * 5) + 1 + getStockBonus();
}

let appleStock = randomStock();
let sodaStock = randomStock();
let cookieStock = randomStock();
let pizzaStock = randomStock();
let gameStock = randomStock();


// ELEMENTS

const moneyDisplay =
    document.getElementById("moneyDisplay");

const levelDisplay =
    document.getElementById("levelDisplay");

const rebirthDisplay =
    document.getElementById("rebirthDisplay");

const shopTitle =
    document.getElementById("shopTitle");

const bonusDisplay =
    document.getElementById("bonusDisplay");

const message =
    document.getElementById("message");

const workButton =
    document.getElementById("workButton");

const buySection =
    document.getElementById("buySection");

const sellSection =
    document.getElementById("sellSection");

const buyTab =
    document.getElementById("buyTab");

const sellTab =
    document.getElementById("sellTab");

const upgradeButton =
    document.getElementById("upgradeButton");

const upgradePriceDisplay =
    document.getElementById("upgradePrice");

const rebirthButton =
    document.getElementById("rebirthButton");

const rebirthRequirement =
    document.getElementById("rebirthRequirement");


// LEVEL SYSTEM

function getMaxLevel() {
    return (rebirths + 1) * 5;
}


// REBIRTH BONUS

function getRebirthMultiplier() {
    return 1 + (rebirths * 0.10);
}


// WORK BONUS

function getWorkMultiplier() {
    return getRebirthMultiplier() +
           (workUpgrade * 0.25);
}


// SELL BONUS

function getSellMultiplier() {
    return getRebirthMultiplier() +
           (sellUpgrade * 0.20);
}


// STOCK BONUS

function getStockBonus() {
    return stockUpgrade * 2;
}


// CHEAP UPGRADE BONUS

function getUpgradeCostMultiplier() {
    return Math.max(
        0.25,
        1 - (cheapUpgrade * 0.10)
    );
}


// SHOP TITLE

function updateShopTitle() {

    if (shopLevel >= 25) {
        shopTitle.textContent =
            "👑 Shopping Empire";
    }

    else if (shopLevel >= 20) {
        shopTitle.textContent =
            "🏢 Mega Store";
    }

    else if (shopLevel >= 15) {
        shopTitle.textContent =
            "🏬 Supermarket";
    }

    else if (shopLevel >= 10) {
        shopTitle.textContent =
            "🏪 Big Store";
    }

    else if (shopLevel >= 5) {
        shopTitle.textContent =
            "🛍️ Popular Shop";
    }

    else if (shopLevel >= 3) {
        shopTitle.textContent =
            "🏪 Local Shop";
    }

    else {
        shopTitle.textContent =
            "🏚️ Tiny Shop";
    }
}


// SAVE GAME

function saveGame() {

    const saveData = {

        money: money,
        shopLevel: shopLevel,
        rebirths: rebirths,

        workUpgrade: workUpgrade,
        sellUpgrade: sellUpgrade,
        stockUpgrade: stockUpgrade,
        cheapUpgrade: cheapUpgrade,

        apples: apples,
        sodas: sodas,
        cookies: cookies,
        pizzas: pizzas,
        games: games,

        appleStock: appleStock,
        sodaStock: sodaStock,
        cookieStock: cookieStock,
        pizzaStock: pizzaStock,
        gameStock: gameStock
    };

    localStorage.setItem(
        "shopSimulatorSave",
        JSON.stringify(saveData)
    );
}


// LOAD GAME

function loadGame() {

    const saved =
        localStorage.getItem("shopSimulatorSave");

    if (!saved) {
        return;
    }

    try {

        const data =
            JSON.parse(saved);

        money =
            data.money ?? 100;

        shopLevel =
            data.shopLevel ?? 1;

        rebirths =
            data.rebirths ?? 0;

        workUpgrade =
            data.workUpgrade ?? 0;

        sellUpgrade =
            data.sellUpgrade ?? 0;

        stockUpgrade =
            data.stockUpgrade ?? 0;

        cheapUpgrade =
            data.cheapUpgrade ?? 0;

        apples =
            data.apples ?? 0;

        sodas =
            data.sodas ?? 0;

        cookies =
            data.cookies ?? 0;

        pizzas =
            data.pizzas ?? 0;

        games =
            data.games ?? 0;

        appleStock =
            data.appleStock ?? randomStock();

        sodaStock =
            data.sodaStock ?? randomStock();

        cookieStock =
            data.cookieStock ?? randomStock();

        pizzaStock =
            data.pizzaStock ?? randomStock();

        gameStock =
            data.gameStock ?? randomStock();

    } catch (error) {

        console.log("Save file could not be loaded.");

    }
}


// DISPLAY

function updateDisplay() {

    const maxLevel =
        getMaxLevel();

    moneyDisplay.textContent =
        "Money: $" + money;

    levelDisplay.textContent =
        "Level: " +
        shopLevel +
        " / " +
        maxLevel;

    rebirthDisplay.textContent =
        "Rebirths: " +
        rebirths;

    bonusDisplay.textContent =
        "💰 Rebirth Bonus: +" +
        (rebirths * 10) +
        "%";


    upgradePriceDisplay.textContent =
        "Upgrade Price: $" +
        Math.floor(
            shopLevel *
            200 *
            getUpgradeCostMultiplier()
        );


    rebirthRequirement.textContent =
        "Reach Level " +
        maxLevel +
        " to rebirth.";


    // STOCK

    document.getElementById("appleStock")
        .textContent =
        "In stock: " + appleStock;

    document.getElementById("sodaStock")
        .textContent =
        "In stock: " + sodaStock;

    document.getElementById("cookieStock")
        .textContent =
        "In stock: " + cookieStock;

    document.getElementById("pizzaStock")
        .textContent =
        "In stock: " + pizzaStock;

    document.getElementById("gameStock")
        .textContent =
        "In stock: " + gameStock;


    // INVENTORY

    document.getElementById("appleOwned")
        .textContent =
        "Owned: " + apples;

    document.getElementById("sodaOwned")
        .textContent =
        "Owned: " + sodas;

    document.getElementById("cookieOwned")
        .textContent =
        "Owned: " + cookies;

    document.getElementById("pizzaOwned")
        .textContent =
        "Owned: " + pizzas;

    document.getElementById("gameOwned")
        .textContent =
        "Owned: " + games;


    // PERMANENT UPGRADES

    document.getElementById("workUpgradeInfo")
        .textContent =
        "Level " +
        workUpgrade +
        " | Cost: $" +
        (500 * (workUpgrade + 1)) +
        " | +25% work";

    document.getElementById("sellUpgradeInfo")
        .textContent =
        "Level " +
        sellUpgrade +
        " | Cost: $" +
        (750 * (sellUpgrade + 1)) +
        " | +20% selling";

    document.getElementById("stockUpgradeInfo")
        .textContent =
        "Level " +
        stockUpgrade +
        " | Cost: $" +
        (1000 * (stockUpgrade + 1)) +
        " | +2 stock";

    document.getElementById("cheapUpgradeInfo")
        .textContent =
        "Level " +
        cheapUpgrade +
        " | Cost: $" +
        (1500 * (cheapUpgrade + 1)) +
        " | -10% upgrade cost";


    updateShopTitle();
}


// WORK

workButton.addEventListener(
    "click",
    function() {

        const earnings =
            Math.floor(
                10 *
                getWorkMultiplier()
            );

        money += earnings;

        message.textContent =
            "💼 You earned $" +
            earnings +
            "!";

        updateDisplay();
        saveGame();
    }
);


// BUY FUNCTION

function buyItem(item) {

    let stock = 0;

    if (item === "apple")
        stock = appleStock;

    if (item === "soda")
        stock = sodaStock;

    if (item === "cookie")
        stock = cookieStock;

    if (item === "pizza")
        stock = pizzaStock;

    if (item === "game")
        stock = gameStock;


    if (stock <= 0) {

        message.textContent =
            "❌ Out of stock!";

        return;
    }


    if (money < prices[item].buy) {

        message.textContent =
            "❌ Not enough money!";

        return;
    }


    money -= prices[item].buy;


    if (item === "apple") {

        apples++;
        appleStock--;

    }

    if (item === "soda") {

        sodas++;
        sodaStock--;

    }

    if (item === "cookie") {

        cookies++;
        cookieStock--;

    }

    if (item === "pizza") {

        pizzas++;
        pizzaStock--;

    }

    if (item === "game") {

        games++;
        gameStock--;

    }


    message.textContent =
        "🛒 Bought " +
        item +
        "!";

    updateDisplay();
    saveGame();
}


// BUY BUTTONS

document.getElementById("appleBuy")
    .addEventListener("click", function() {

        buyItem("apple");

    });

document.getElementById("sodaBuy")
    .addEventListener("click", function() {

        buyItem("soda");

    });

document.getElementById("cookieBuy")
    .addEventListener("click", function() {

        buyItem("cookie");

    });

document.getElementById("pizzaBuy")
    .addEventListener("click", function() {

        buyItem("pizza");

    });

document.getElementById("gameBuy")
    .addEventListener("click", function() {

        buyItem("game");

    });


// SELL FUNCTION

function sellItem(item, amount) {

    let owned = 0;


    if (item === "apple")
        owned = apples;

    if (item === "soda")
        owned = sodas;

    if (item === "cookie")
        owned = cookies;

    if (item === "pizza")
        owned = pizzas;

    if (item === "game")
        owned = games;


    if (owned <= 0) {

        message.textContent =
            "❌ You don't own any!";

        return;
    }


    if (amount === "all") {
        amount = owned;
    }


    if (item === "apple")
        apples -= amount;

    if (item === "soda")
        sodas -= amount;

    if (item === "cookie")
        cookies -= amount;

    if (item === "pizza")
        pizzas -= amount;

    if (item === "game")
        games -= amount;


    const earnings =
        Math.floor(
            prices[item].sell *
            amount *
            getSellMultiplier()
        );


    money += earnings;


    message.textContent =
        "💰 Sold " +
        amount +
        " " +
        item +
        " for $" +
        earnings +
        "!";


    updateDisplay();
    saveGame();
}


// SELL ONE

document.getElementById("appleSell")
    .addEventListener("click", function() {

        sellItem("apple", 1);

    });

document.getElementById("sodaSell")
    .addEventListener("click", function() {

        sellItem("soda", 1);

    });

document.getElementById("cookieSell")
    .addEventListener("click", function() {

        sellItem("cookie", 1);

    });

document.getElementById("pizzaSell")
    .addEventListener("click", function() {

        sellItem("pizza", 1);

    });

document.getElementById("gameSell")
    .addEventListener("click", function() {

        sellItem("game", 1);

    });


// SELL ALL

document.getElementById("appleSellAll")
    .addEventListener("click", function() {

        sellItem("apple", "all");

    });

document.getElementById("sodaSellAll")
    .addEventListener("click", function() {

        sellItem("soda", "all");

    });

document.getElementById("cookieSellAll")
    .addEventListener("click", function() {

        sellItem("cookie", "all");

    });

document.getElementById("pizzaSellAll")
    .addEventListener("click", function() {

        sellItem("pizza", "all");

    });

document.getElementById("gameSellAll")
    .addEventListener("click", function() {

        sellItem("game", "all");

    });


// BUY TAB

buyTab.addEventListener(
    "click",
    function() {

        buySection.style.display =
            "block";

        sellSection.style.display =
            "none";
    }
);


// SELL TAB

sellTab.addEventListener(
    "click",
    function() {

        buySection.style.display =
            "none";

        sellSection.style.display =
            "block";
    }
);


// NORMAL SHOP UPGRADE

upgradeButton.addEventListener(
    "click",
    function() {

        const maxLevel =
            getMaxLevel();

        const upgradePrice =
            Math.floor(
                shopLevel *
                200 *
                getUpgradeCostMultiplier()
            );


        if (shopLevel >= maxLevel) {

            message.textContent =
                "👑 MAX LEVEL! Rebirth to unlock more levels!";

            return;
        }


        if (money < upgradePrice) {

            message.textContent =
                "❌ Not enough money!";

            return;
        }


        money -= upgradePrice;

        shopLevel++;


        message.textContent =
            "⬆️ Shop upgraded to Level " +
            shopLevel +
            "!";


        updateDisplay();
        saveGame();
    }
);


// BETTER WORK

document.getElementById(
    "workUpgradeButton"
).addEventListener(
    "click",
    function() {

        const cost =
            500 *
            (workUpgrade + 1);


        if (money < cost) {

            message.textContent =
                "❌ Not enough money!";

            return;
        }


        money -= cost;

        workUpgrade++;


        message.textContent =
            "💼 Better Work is now Level " +
            workUpgrade +
            "!";


        updateDisplay();
        saveGame();
    }
);


// BETTER SELLING

document.getElementById(
    "sellUpgradeButton"
).addEventListener(
    "click",
    function() {

        const cost =
            750 *
            (sellUpgrade + 1);


        if (money < cost) {

            message.textContent =
                "❌ Not enough money!";

            return;
        }


        money -= cost;

        sellUpgrade++;


        message.textContent =
            "💰 Better Selling is now Level " +
            sellUpgrade +
            "!";


        updateDisplay();
        saveGame();
    }
);


// MORE STOCK

document.getElementById(
    "stockUpgradeButton"
).addEventListener(
    "click",
    function() {

        const cost =
            1000 *
            (stockUpgrade + 1);


        if (money < cost) {

            message.textContent =
                "❌ Not enough money!";

            return;
        }


        money -= cost;

        stockUpgrade++;


        message.textContent =
            "📦 More Stock is now Level " +
            stockUpgrade +
            "!";


        updateDisplay();
        saveGame();
    }
);


// CHEAP UPGRADES

document.getElementById(
    "cheapUpgradeButton"
).addEventListener(
    "click",
    function() {

        const cost =
            1500 *
            (cheapUpgrade + 1);


        if (money < cost) {

            message.textContent =
                "❌ Not enough money!";

            return;
        }


        money -= cost;

        cheapUpgrade++;


        message.textContent =
            "🏪 Cheap Upgrades is now Level " +
            cheapUpgrade +
            "!";


        updateDisplay();
        saveGame();
    }
);


// REBIRTH

rebirthButton.addEventListener(
    "click",
    function() {

        const maxLevel =
            getMaxLevel();


        if (shopLevel < maxLevel) {

            message.textContent =
                "🔒 You need Level " +
                maxLevel +
                " to rebirth!";

            return;
        }


        rebirths++;

        shopLevel = 1;


        apples = 0;
        sodas = 0;
        cookies = 0;
        pizzas = 0;
        games = 0;


        appleStock = randomStock();
        sodaStock = randomStock();
        cookieStock = randomStock();
        pizzaStock = randomStock();
        gameStock = randomStock();


        message.textContent =
            "🔄 REBIRTH #" +
            rebirths +
            "! +" +
            (rebirths * 10) +
            "% bonus!";


        updateDisplay();
        saveGame();
    }
);


// STOCK REFRESH EVERY 2 MINUTES

setInterval(
    function() {

        appleStock = randomStock();
        sodaStock = randomStock();
        cookieStock = randomStock();
        pizzaStock = randomStock();
        gameStock = randomStock();


        message.textContent =
            "📦 Stock refreshed!";


        updateDisplay();
        saveGame();

    },
    120000
);


// AUTOSAVE EVERY 5 SECONDS

setInterval(
    function() {

        saveGame();

    },
    5000
);


// START

loadGame();

sellSection.style.display =
    "none";

updateDisplay();