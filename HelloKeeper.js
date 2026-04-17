"use strict";

(function() {
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;

    // Перехоплюємо відкриття запиту
    XHR.open = function(method, url) {
        this._url = url; // Зберігаємо URL для ідентифікації
        return open.apply(this, arguments);
    };

    // Перехоплюємо відправку та відповідь
    XHR.send = function() {
        this.addEventListener('readystatechange', function() {
            // 4 — запит завершено, URL містить ціль
            if (this.readyState === 4 && this._url.includes('getchatsinfo')) {
                console.log("🎯 Впіймав XHR запит до:", this._url);

                try {
                    // Отримуємо оригінальні дані
                    let data = JSON.parse(this.responseText);

                    if (data.chats && Array.isArray(data.chats)) {
                        data.chats.forEach(chat => {
                            console.log(`🛠 Патчу чат: ${chat.group_title}`);
                            
                            chat.license_type = 3; // Міняємо на Ultimate
                            chat.license_left = 365;
                            chat.is_group_owner = true;
                            
                            if (chat.limits) {
                                chat.limits.max_triggers = 999;
                                chat.limits.max_trigger_actions = 100;
                            }
                        });

                        // "Магія": підміняємо властивості об'єкта відповіді
                        Object.defineProperty(this, 'responseText', { value: JSON.stringify(data) });
                        Object.defineProperty(this, 'response', { value: JSON.stringify(data) });
                    }
                } catch (e) {
                    console.error("❌ Помилка при парсингу JSON:", e);
                }
            }
        }, false);
        return send.apply(this, arguments);
    };

    console.log("🚀 XHR-перехоплювач активовано. Спровокуй оновлення даних на сайті!");
})();
