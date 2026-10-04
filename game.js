// База данных игрока
let user = {
    balance: 0,
    mmr: 0,
    rank: "Кадет",
    owned_skins: ["civilian_ussr"],
    owned_hats: [],
    is_admin: true
};

// Список ботов для таблицы лидеров Топ-100
let leaderboardBots = [
    { name: "Bot_Ninja 🥷", mmr: 1850 },
    { name: "Bot_Drakula 🧛‍♂️", mmr: 1420 },
    { name: "Bot_Yakuza 🎋", mmr: 1100 },
    { name: "Bot_Alpha 🤖", mmr: 650 },
    { name: "Bot_Maniac 🔪", mmr: 320 },
    { name: "Bot_Gamer 🎮", mmr: 150 }
];

const promoCodes = {
    "USHA_FREE": "hat_ushanka",
    "CYBER_GLITCH": "promo_cyber_glasses",
    "SECRET_CROWN": "promo_fire_crown"
};

// Автоматический расчет Текстовых Рангов по MMR
function calculateRank(mmrPoints) {
    if (mmrPoints <= 200) return "Кадет";
    if (mmrPoints <= 500) return "Детектив";
    if (mmrPoints <= 1000) return "Следователь";
    if (mmrPoints <= 1800) return "Серый Кардинал";
    return "Магистр Мафии 👑";
}

function updateUI() {
    user.rank = calculateRank(user.mmr);
    if (document.getElementById("coins")) document.getElementById("coins").innerText = user.balance;
    if (document.getElementById("rank")) document.getElementById("rank").innerText = `${user.rank} (${user.mmr} MMR)`;
}

// Отрисовка таблицы Топ-100
function renderLeaderboard() {
    let listEl = document.getElementById("leaderboard-list");
    if (!listEl) return;
    
    // Объединяем игрока и ботов в один массив для сортировки
    let allPlayers = [...leaderboardBots, { name: "Вы (Админ) ⭐", mmr: user.mmr, isReal: true }];
    allPlayers.sort((a, b) => b.mmr - a.mmr);
    
    listEl.innerHTML = "";
    allPlayers.forEach((p, index) => {
        let rowClass = p.isReal ? "leader-row player" : "leader-row";
        let botRank = calculateRank(p.mmr);
        listEl.innerHTML += `
            <div class="${rowClass}">
                <div>${index + 1}. ${p.name} [${botRank}]</div>
                <div style="color:#5ac8fa; font-weight:bold;">${p.mmr} MMR</div>
            </div>
        `;
    });
}

function sendAdminCommand(commandText) {
    if (commandText === "/give_money_999") {
        user.balance += 999;
        return "💰 Код активирован: +999 монет на баланс!";
    }
    // Секретная админ-команда сброса сезона для тестов
    if (commandText === "/reset_season") {
        user.mmr = Math.round(user.mmr * 0.6); // Мягкий сброс на 40%
        leaderboardBots.forEach(b => b.mmr = Math.round(b.mmr * 0.6));
        renderLeaderboard();
        return "🏆 Сезон перезапущен! Рейтинг всех игроков уменьшен на 40%. Выданы медали за ранг!";
    }
    return "❌ Неизвестная админ-команда.";
}

function activatePromo(code) {
    let cleanCode = code.trim().toUpperCase();
    if (!promoCodes[cleanCode]) return "❌ Неверный промокод!";
    let item = promoCodes[cleanCode];
    if (user.owned_hats.includes(item)) return "⚠️ У вас уже есть этот предмет!";
    user.owned_hats.push(item);
    return `🎉 Успешно! Получен предмет: ${item}`;
}

function openInventory() {
    alert(`🎒 ИНВЕНТАРЬ\n\nСкины и роли: ${user.owned_skins.join(', ')}\nШапки: ${user.owned_hats.length ? user.owned_hats.join(', ') : 'Пусто'}`);
}

function buyChest(type, price, currencyType) {
    let chat = document.getElementById("global-chat");
    if (currencyType === 'coins' && user.balance < price) {
        chat.innerHTML += `<div><span style="color:#ff3b30">❌ Ошибка:</span> Недостаточно монет!</div>`;
        return;
    }
    if (currencyType === 'coins') user.balance -= price;
    updateUI();

    let dropRole = "";
    let random = Math.random() * 100;

    if (type === 'ussr') {
        let ussrRoles = ["Генерал КГБ", "Следователь МУРа", "Военврач", "Мирный Житель", "Мафия", "Путана"];
        dropRole = ussrRoles[Math.floor(Math.random() * ussrRoles.length)] + " (СССР)";
    } else if (type === 'cats') {
        let catRoles = ["Кот-Мейнкун (Дон)", "Кот-Мясник (Маньяк)", "Кот-Детектив (Шериф)"];
        dropRole = catRoles[Math.floor(Math.random() * catRoles.length)];
    } else if (type === 'cyber') {
        dropRole = (Math.random() > 0.5) ? "Андроид (Мирный)" : "Кибер-Страж (Бессмертный)";
    } else if (type === 'yakuza') {
        if (random <= 5) dropRole = "SAMURAI (Донат-Роль)";
        else {
            let yakRoles = ["Оябун (Дон)", "Кёдзи (Мафия)", "Гейша (Путана)"];
            dropRole = yakRoles[Math.floor(Math.random() * yakRoles.length)];
        }
    } else if (type === 'vampire') {
        if (random <= 5) dropRole = "VAMPIRE (Донат-Роль)";
        else if (random > 5 && random <= 10) dropRole = "Владыка Дракулы (Скин Дона)";
        else {
            let vampRoles = ["Кармилла (Путана)", "Ван Хельсинг", "Чумной Врач", "Вервольф"];
            dropRole = vampRoles[Math.floor(Math.random() * vampRoles.length)];
        }
    }

    user.owned_skins.push(dropRole);
    chat.innerHTML += `
        <div class="drop-card">
            <div class="drop-title">✨ ИЗ СУНДУКА ВЫПАЛА КАРТА ✨</div>
            <div class="drop-role">📷 Поясной Портрет Персонажа</div>
            <div class="gold-badge">${dropRole}</div>
        </div>
    `;
    chat.scrollTop = chat.scrollHeight;
}

function addBots() {
    let chat = document.getElementById("global-chat");
    chat.innerHTML = "";
    let botNames = ["Bot_Alpha", "Bot_Yakuza", "Bot_Vamp", "Bot_Gamer", "Bot_Drakula", "Bot_Ninja"];
    let Phrases = ["Я мирный, честно!", "Док, лечи меня ночью!", "Самурай, прикрой катаной!", "Кто мафия??", "Кажется, Bot_Yakuza подозрительный..."];

    chat.innerHTML += `<div class="system-msg">🌌 НАСТУПИЛА НОЧЬ (Раунд 1)</div>`;
    chat.innerHTML += `<div><span style="color:#5856d6">⚙️ Логи:</span> Включен кулдаун целей на 2 дня для Доктора и Путаны.</div>`;
    chat.innerHTML += `<div><span style="color:#ff3b30">🧛‍♂️ Вампир:</span> Применил способность «Укус безрольных» на Bot_Gamer!</div>`;
    chat.innerHTML += `<div><span style="color:#34c759">⚔️ Самурай:</span> Защищает выбранную цель катаной.</div>`;

    setTimeout(() => {
        chat.innerHTML += `<div class="system-msg">☀️ НАСТУПИЛО УТРО. Общее обсуждение (60с)</div>`;
        botNames.forEach((name, i) => {
            setTimeout(() => {
                let phrase = Phrases[Math.floor(Math.random() * Phrases.length)];
                chat.innerHTML += `<div><span class="bot-name">🤖 ${name}:</span> ${phrase}</div>`;
                chat.scrollTop = chat.scrollHeight;
            }, i * 700);
        });
    }, 2000);

    setTimeout(() => {
        chat.innerHTML += `<div><span style="color:#007aff; font-weight:bold;">🤖 Bot_Gamer:</span> [УКУШЕН] Мафия — это Bot_Yakuza, я проверил!</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 7000);

    setTimeout(() => {
        chat.innerHTML += `<div class="system-msg">🗳️ ЭТАП ГОЛОСОВАНИЯ (30с)</div>`;
        chat.innerHTML += `<div><span style="color:#34c759">⚙️ Система:</span> Большинство проголосовало против Bot_Yakuza.</div>`;
        chat.innerHTML += `<div><span style="color:#ff9500">💀 Итог:</span> Bot_Yakuza оказался МАФИЕЙ. Мирные победили!</div>`;
        
        // Ранговые очки Игры
        user.mmr += 15;
        user.balance += 10;
        
        // Симулируем, что другие боты тоже сыграли и получили случайные очки
        leaderboardBots.forEach(b => b.mmr += Math.floor(Math.random() * 30) - 10);
        
        updateUI();
        if (document.getElementById("leaderboard-box") && document.getElementById("leaderboard-box").style.display === "block") {
            renderLeaderboard();
        }
        
        chat.innerHTML += `<div class="system-msg">🏆 ПОБЕДА! Начислено: +15 MMR, +10 монет 🪙</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 10000);
}
