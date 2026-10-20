/**
 * Тренажёр «Секретный код» — скрипт для Google Таблицы.
 *
 * КАК УСТАНОВИТЬ (5 минут):
 * 1. Создайте новую Google Таблицу: https://sheets.google.com → «Пустая таблица»
 * 2. Назовите её, например: «Результаты — Секретный код»
 * 3. Расширения → Apps Script
 * 4. Удалите содержимое файла Code.gs и вставьте этот код целиком
 * 5. Нажмите «Сохранить» (иконка дискеты)
 * 6. Нажмите «Развернуть» → «Новое развертывание»
 *    - Тип: «Веб-приложение»
 *    - Выполнять от имени: «Я»
 *    - Доступ: «Все»
 *    - «Развернуть» → разрешите доступ («Безопасно. Переход по ссылке...» → «Продолжить»)
 * 7. Скопируйте «URL веб-приложения» (вида https://script.google.com/macros/s/AKfycb.../exec)
 *    и вставьте его в файл index.html тренажёра в строке:
 *      var GOOGLE_SHEET_URL = "";
 * 8. Сохраните index.html, обновите страницу тренажёра — кнопка «Отправить результат» появится.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    var data = {};
    try { data = JSON.parse(e.postData.contents); } catch (err) {}

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Результаты');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Результаты');
    }

    // Первая строка — заголовки (добавляем один раз)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата и время',
        'Ученик',
        'Класс',
        'Задание 1 — Найди пару',
        'Задание 2 — Алфавитный поезд',
        'Задание 3 — Буквенный детектив',
        'Заданий выполнено (из 3)',
        'Ошибок',
        'Время (сек)',
        'Секретный код'
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#eaf4ff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.date || new Date().toLocaleString('ru-RU'),
      data.name || '',
      data.klass || '',
      data.task1 || '',
      data.task2 || '',
      data.task3 || '',
      data.score !== undefined ? data.score : '',
      data.errors !== undefined ? data.errors : '',
      data.timeSec !== undefined ? data.timeSec : '',
      data.code || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Проверка, что веб-приложение работает: откройте URL/exec в браузере
function doGet() {
  return ContentService.createTextOutput('Тренажёр «Секретный код»: сервер результатов работает ✅');
}
