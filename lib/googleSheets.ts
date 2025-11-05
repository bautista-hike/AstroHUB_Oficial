import { google } from 'googleapis';

export async function getGoogleSheetsData() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
      throw new Error('Faltan credenciales de Google Sheets en .env.local');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'MASTER!A2:U', // Desde la fila 2 para saltar los headers
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return null;
    }

    // Procesar los datos
    const processedData = rows.map((row: any[]) => ({
      date: row[0] || '',
      account_id: row[1] || '',
      account_name: row[2] || '',
      campaign_id: row[3] || '',
      campaign_name: row[4] || '',
      campaign_type: row[5] || '',
      source_medium: row[6] || '',
      channel_group: row[7] || '',
      country: row[8] || '',
      cost: parseFloat(row[9]) || 0,
      impressions: parseInt(row[10]) || 0,
      clicks: parseInt(row[11]) || 0,
      installs: parseInt(row[12]) || 0,
      registration_complete: parseInt(row[13]) || 0,
      usd_savings_onboarding_completed: parseInt(row[14]) || 0,
      local_card_payment_completed: parseInt(row[15]) || 0,
      global_card_payment_completed: parseInt(row[16]) || 0,
      currency_exchange_completed: parseInt(row[17]) || 0,
      platform: row[18] || '',
      ftt: parseInt(row[19]) || 0,
      crypto_transfer: parseInt(row[20]) || 0,
    }));

    return processedData;
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    throw error;
  }
}

export function calculateMetrics(data: any[]) {
  // Total Cost
  const totalCost = data.reduce((sum, row) => sum + row.cost, 0);

  // Installs
  const totalInstalls = data.reduce((sum, row) => sum + row.installs, 0);

  // CPI (Cost Per Install)
  const cpi = totalInstalls > 0 ? totalCost / totalInstalls : 0;

  // Accounts Created (registration_complete)
  const accountsCreated = data.reduce((sum, row) => sum + row.registration_complete, 0);

  // CAC (Customer Acquisition Cost)
  const cac = accountsCreated > 0 ? totalCost / accountsCreated : 0;

  // Acc/Installs
  const accInstalls = totalInstalls > 0 ? (accountsCreated / totalInstalls) * 100 : 0;

  // FTT
  const totalFTT = data.reduce((sum, row) => sum + row.ftt, 0);

  // FTT/Acc
  const fttAcc = accountsCreated > 0 ? (totalFTT / accountsCreated) * 100 : 0;

  // Currency Exchange
  const currencyExchange = data.reduce((sum, row) => sum + row.currency_exchange_completed, 0);

  // Global Card Payment
  const globalCardPayment = data.reduce((sum, row) => sum + row.global_card_payment_completed, 0);

  // Local Card Payment
  const localCardPayment = data.reduce((sum, row) => sum + row.local_card_payment_completed, 0);

  // USDT Payment (usd_savings_onboarding_completed)
  const usdtPayment = data.reduce((sum, row) => sum + row.usd_savings_onboarding_completed, 0);

  // CPA Global
  const cpaGlobal = globalCardPayment > 0 ? totalCost / globalCardPayment : 0;

  // CPA Local
  const cpaLocal = localCardPayment > 0 ? totalCost / localCardPayment : 0;

  // CPA USDT
  const cpaUSDT = usdtPayment > 0 ? totalCost / usdtPayment : 0;

  // CPA FTT
  const cpaFTT = totalFTT > 0 ? totalCost / totalFTT : 0;

  return {
    totalCost,
    totalInstalls,
    cpi,
    fttAcc,
    accountsCreated,
    cac,
    accInstalls,
    currencyExchange,
    globalCardPayment,
    localCardPayment,
    usdtPayment,
    totalFTT,
    cpaGlobal,
    cpaLocal,
    cpaUSDT,
    cpaFTT,
  };
}

// Función para obtener creativos desde Google Sheets
export async function getCreativesData() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
      throw new Error('Faltan credenciales de Google Sheets en .env.local');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Intentar leer de la hoja CREATIVES, si no existe, retornar array vacío
    let response;
    try {
      response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'CREATIVES!A2:M', // Ajustar según las columnas que uses
      });
    } catch (error: any) {
      // Si la hoja no existe, retornar array vacío
      if (error.code === 400) {
        console.log('Hoja CREATIVES no encontrada, retornando array vacío');
        return [];
      }
      throw error;
    }

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Procesar los datos de creativos
    // Estructura esperada: creative_id, creative_name, image_url, campaign_name, campaign_id, platform, product, country, stage, status, date_created, notes
    const processedData = rows.map((row: any[]) => ({
      creative_id: row[0] || '',
      creative_name: row[1] || '',
      image_url: row[2] || '',
      campaign_name: row[3] || '',
      campaign_id: row[4] || '',
      platform: row[5] || '',
      product: row[6] || '',
      country: row[7] || '',
      stage: row[8] || '',
      status: row[9] || 'active',
      date_created: row[10] || '',
      notes: row[11] || '',
    }));

    return processedData;
  } catch (error) {
    console.error('Error al obtener creativos de Google Sheets:', error);
    throw error;
  }
}

