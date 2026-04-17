"use strict";

// Створюємо запит від імені сайту
fetch('https://api.chatkeeper.app/cabinet/v1/tg/getme', {
    method: 'POST',
    // Браузер автоматично додасть Cookie та інші заголовки сайту
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
    },
    // Якщо API очікує пустий об'єкт, передаємо його. 
    // Якщо нічого не очікує — можна закоментувати body.
    body: JSON.stringify({}) 
})
.then(async response => {
    const data = await response.json();
    console.log('📦 Отримано оригінальні дані:', data);
    
    // Тепер ми можемо маніпулювати цими даними локально
    // Наприклад, "підняти" собі ліцензію для аналізу інтерфейсу
    if (data.chats) {
        data.chats.forEach(chat => {
            chat.license_type = 3; // Міняємо на Ultimate
            chat.license_left = 365; // Додаємо рік "ліцензії"
        });
    }
    return data;
})
.then(modifiedData => {
    console.log('🛠 Модифікований об’єкт для твоїх тестів:', modifiedData);
})
.catch(err => console.error('❌ Помилка:', err));
