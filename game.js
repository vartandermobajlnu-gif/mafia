// База данных игрока на бэкенде лобби
let user = {
    balance: 0,
    mmr: 0,
    rank: "Кадет",
    owned_skins: ["civilian_ussr"],
    owned_hats: [],
    is_admin: true
};

// Реестр промокодов
const promoCodes = {
    "USHA_FREE": "hat_ushanka",
    "CYBER_GLITCH": "promo_cyber_glasses",
    "SECRET_CROWN": "promo_fire_crown"
};

// Обновление цифр на экране телефона
function updateUI() {
    if (document.getElementById("coins")) document.getElementById("coins").innerText = user.balance;
    if (document.getElementById("rank")) document.getElementById("rank").innerText = `${user.rank} (${user.mmr} MMR)`;
}

// Скрытые Админ-команды
function sendAdminCommand(commandText) {
    if (commandText === "/give_money_999") {
        user.balance += 999;
        return "💰 Код активирован: +999 монет на баланс!";
    }
    return "❌ Неизвестная админ-команда.";
}

// Система промокодов
function activatePromo(code) {
    let cleanCode = code.trim().toUpperCase();
    if (!promoCodes[cleanCode]) return "❌ Неверный промокод!";
    let item = promoCodes[cleanCode];
    if (user.owned_hats.includes(item)) return "⚠️ У вас уже есть этот предмет!";
    user.owned_hats.push(item);
    return `🎉 Успешно! Получен предмет: ${item}`;
}

// Открытие инвентаря через alert
function openInventory() {
    alert(`🎒 ИНВЕНТАРЬ\n\nСкины и роли: ${user.owned_skins.join(', ')}\nШапки: ${user.owned_hats.length ? user.owned_hats.join(', ') : 'Пусто'}`);
}

// Математика сундуков с точными шансами 5% на Самурая и Вампира
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
        if (random <= 5) dropRole = "SAMURAI (Донат-Роль)"; // Строго 5%
        else {
            let yakRoles = ["Оябун (Дон)", "Кёдзи (Мафия)", "Гейша (Путана)"];
            dropRole = yakRoles[Math.floor(Math.random() * yakRoles.length)];
        }
    } else if (type === 'vampire') {
        if (random <= 5) dropRole = "VAMPIRE (Донат-Роль)"; // Строго 5%
        else if (random > 5 && random <= 10) dropRole = "Владыка Дракулы (Скин Дона)"; // Строго 5%
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

// Автономная симуляция матча ботами в чате лобби
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
        chat.innerHTML += `<div><span style="color:#007aff; font-weight:bold;">🤖 Bot_Gamer:</span> [УКУШЕН] Мафия — это Bot_Yakuza, я проверил! (Сообщение отправлено Вампиром)</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 7000);

    setTimeout(() => {
        chat.innerHTML += `<div class="system-msg">🗳️ ЭТАП ГОЛОСОВАНИЯ (30с)</div>`;
        chat.innerHTML += `<div><span style="color:#34c759">⚙️ Система:</span> Большинство проголосовало против Bot_Yakuza.</div>`;
        chat.innerHTML += `<div><span style="color:#ff9500">💀 Итог:</span> Bot_Yakuza оказался МАФИЕЙ. Мирные победили!</div>`;
        
        user.mmr += 15;
        user.balance += 10;
        if (user.mmr > 200) user.rank = "Детектив";
        updateUI();
        
        chat.innerHTML += `<div class="system-msg">🏆 ПОБЕДА! Начислено: +15 MMR, +10 монет 🪙</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 10000);
}
