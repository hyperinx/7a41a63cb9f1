"use strict";

(function() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        
        // Перевіряємо, чи запит йде до потрібного ендпоінту
        if (args[0] && args[0].includes('/v1/tg/getchatsinfo')) {
            const clone = response.clone();
            let data = await clone.json();

            console.log("💉 intercepting getchatsinfo...");

            // Обробляємо масив чатів
            if (data.chats && Array.isArray(data.chats)) {
                data.chats.forEach(chat => {
                    // Максимальний рівень ліцензії
                    chat.license_type = 3; 
                    chat.license_left = 365;
                    chat.is_group_owner = true;

                    // Розблоковуємо всі ліміти
                    if (chat.limits) {
                        chat.limits.max_triggers = 999;
                        chat.limits.max_trigger_actions = 100;
                        chat.limits.max_trigger_conditions = 100;
                    }
                    
                    // Якщо є діагностика, "лікуємо" її, щоб інтерфейс не сварився
                    if (chat.diagnostic) {
                        Object.keys(chat.diagnostic).forEach(key => {
                            if (typeof chat.diagnostic[key] === 'boolean') {
                                chat.diagnostic[key] = false; 
                            }
                        });
                    }
                });
            }

            // Повертаємо модифіковану відповідь
            return new Response(JSON.stringify(data), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }
        return response;
    };
    console.log("✅ Скрипт активовано. Тепер клікни на будь-який чат у панелі.");
})();
