// Хранилище данных игрока (База данных сессии)
let user = {
    balance: 0,
    mmr: 0,
    rank: "Кадет",
    owned_skins: ["civilian_ussr"],
    owned_hats: [],
    active_skin: "civilian_ussr",
    active_hat: null,
    is_vip: false,
    is_admin: true // Создатель автоматически Администратор
};

// Реестр промокодов
const promoCodes = {
    "USHA_FREE": { item: "hat_ushanka", type: "multi" },
    "CYBER_GLITCH": { item: "promo_cyber_glasses", type: "single", used: false },
    "SECRET_CROWN": { item: "promo_fire_crown", type: "single", used: false }
};

// Функция админ-команды в чате
function sendAdminCommand(commandText) {
    if (!user.is_admin) return "Ошибка: вы не администратор!";
    
    if (commandText === "/give_money_999") {
        user.balance += 999;
        updateUI();
        return "💰 Админ-код активирован: +999 монет на баланс!";
    }
    return "Неизвестная команда.";
}

// Функция активации промокодов
function activatePromo(code) {
    let cleanCode = code.trim().toUpperCase();
    if (!promoCodes[cleanCode]) return "❌ Код не существует!";
    
    let promo = promoCodes[cleanCode];
    if (promo.type === "single" && promo.used) return "❌ Этот код уже кто-то забрал!";
    
    if (user.owned_hats.includes(promo.item)) return "⚠️ У вас уже есть эта шапка!";
    
    user.owned_hats.push(promo.item);
    if (promo.type === "single") promo.used = true;
    
    return `🎉 Код успешно активирован! Вы получили: ${promo.item}`;
}

// Симуляция ИИ-Ботов и катки
function simulateMatchWithBots() {
    let roles = ["Мирный житель", "Мафия", "Доктор", "Шериф", "Путана", "Самурай", "Вампир"];
    let message = "🤖 ИИ-Боты добавлены! Начат тестовый ранговый матч.\n";
    message += "🩸 Роль Вампира активирована: укус безрольных доступен раз в 2 дня.\n";
    message += "⚔️ Роль Самурая активирована: защита целей и контрудар катаной включены.";
    return message;
}

// Обновление интерфейса на экране
function updateUI() {
    document.getElementById("coins").innerText = user.balance;
    document.getElementById("rank").innerText = `${user.rank} (${user.mmr} MMR)`;
}
