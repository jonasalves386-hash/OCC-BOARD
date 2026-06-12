/**
 * OCC Daily Board — Apps Script
 *
 * Como usar:
 * 1. Abra a planilha no Google Sheets.
 * 2. Vá em Extensões → Apps Script.
 * 3. Cole este código.
 * 4. Substitua BACKEND_URL pelo endereço real do seu servidor.
 * 5. Salve e autorize a execução.
 * 6. Crie um botão na planilha e associe à função publicarBoard().
 */

var BACKEND_URL = 'https://meudominio.com/api/reload';

function publicarBoard() {
  try {
    var options = {
      method: 'post',
      muteHttpExceptions: true,
    };

    var response = UrlFetchApp.fetch(BACKEND_URL, options);
    var code = response.getResponseCode();
    var body = JSON.parse(response.getContentText());

    if (code === 200 && body.success) {
      SpreadsheetApp.getUi().alert(
        '✅ Publicado com sucesso!\n\nAtualizado em: ' + body.updatedAt
      );
    } else {
      SpreadsheetApp.getUi().alert(
        '⚠️ Erro ao publicar.\n\nResposta: ' + response.getContentText()
      );
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('❌ Falha na conexão:\n\n' + e.message);
  }
}
