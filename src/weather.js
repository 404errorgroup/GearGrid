import { SCENARIOS } from './data';

// Hava durumu servisi. Şimdilik simüle senaryo döndürür.
// TODO (API): burada konuma göre canlı veri çekilip { temp, rain, wind, snow, label, icon } döndürülecek.
// Uygulamanın geri kalanı bu fonksiyonun çıktı biçimine bağlı, o yüzden sadece burası değişecek.
export async function getWeather(location, scenarioId) {
  return SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
}
