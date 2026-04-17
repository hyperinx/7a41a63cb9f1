"use strict";

"use strict";

(function() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        // Логуємо взагалі всі запити, щоб зрозуміти, що сайт викликає насправді
        const url = (typeof args[0] === 'string') ? args[0] : args[0].url;
        
        const response = await originalFetch(...args);

        // Шукаємо будь-який запит, пов'язаний з інфо про чати
        if (url.includes('getchatsinfo')) {
            console.log("🎯 Впіймав ціль:", url);

            const clone = response.clone();
            let data;
            
            try {
                data = await clone.json();
            } catch (e) {
                return response; // Не JSON
            }

            // Модифікуємо об'єкт (підтримка і масиву chats, і поодинокого об'єкта chat)
            const processChat = (chat) => {
                console.log("🛠 Модифікую чат:", chat.group_title || chat.chat_id);
                chat.license_type = 3; // Спробуй 3 замість 2
                chat.license_left = 365;
                chat.is_group_owner = true;
                if (chat.limits) {
                    chat.limits.max_triggers = 999;
                    chat.limits.max_trigger_actions = 100;
                }
            };

            if (data.chats && Array.isArray(data.chats)) {
                data.chats.forEach(processChat);
            } else if (data.chat) {
                processChat(data.chat);
            }

            return new Response(JSON.stringify(data), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }

        return response;
    };
    console.log("🚀 Покращений перехоплювач запущено. Чекаю на запити...");
})();
