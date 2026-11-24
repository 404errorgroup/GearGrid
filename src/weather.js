// Hava servisi: Open-Meteo (canlı, API anahtarı gerekmez). Birimler: °C, km/s, mm.
// getPlaceWeather(yer) -> { points: [şu anki durum], worst: bugünün en zor koşulu }
// "worst" ekipman kural motoruna (engine.js) gider: günün en düşük sıcaklığı, en yüksek yağış ihtimali ve rüzgarı.
// Koordinatlar yaklaşıktır. Open-Meteo sıcaklığı noktanın rakımına göre hesaplar; Hava sekmesinde rakım yazar,
// beklediğinden farklıysa koordinatı düzelt (özellikle Uludağ, Erciyes, Kaçkar).
const PLACES = {
  'Babadağ': [36.517, 29.167], 'Ölüdeniz': [36.55, 29.117], 'Fethiye': [36.622, 29.116], 'Kaş': [36.202, 29.641],
  'Geyikbayırı': [36.878, 30.486], 'Antalya': [36.897, 30.713], 'Bodrum': [37.034, 27.431], 'Çeşme': [38.324, 26.307],
  'Alaçatı': [38.282, 26.374], 'İzmir': [38.424, 27.143], 'İstanbul': [41.008, 28.978], 'Bursa': [40.183, 29.067],
  'Uludağ': [40.09, 29.13], 'Bolu': [40.735, 31.606], 'Ankara': [39.933, 32.86], 'Kayseri': [38.731, 35.479],
  'Erciyes': [38.54, 35.48], 'Trabzon': [41.003, 39.717], 'Kaçkar': [40.84, 41.16],
};
export const CITIES = Object.keys(PLACES);

const BASE = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 10000;

export async function getPlaceWeather(place) {
  const pos = PLACES[place];
  if (!pos) throw new Error('Bilinmeyen konum: ' + place);
  const url = `${BASE}?latitude=${pos[0]}&longitude=${pos[1]}`
    + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,snowfall,wind_speed_10m,wind_gusts_10m'
    + '&hourly=precipitation_probability'
    + '&daily=temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,snowfall_sum'
    + '&forecast_days=1&timezone=auto';

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let d;
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error('Open-Meteo ' + res.status);
    d = await res.json();
  } finally { clearTimeout(timer); }
  if (d.error) throw new Error(d.reason || 'Open-Meteo hatası');

  const c = d.current, day = d.daily;
  // Yağış ihtimali saatlik gelir: şu anki saate denk gelen değeri al
  const idx = Math.max(0, d.hourly.time.indexOf(c.time.slice(0, 13) + ':00'));
  const rain = d.hourly.precipitation_probability[idx] ?? 0;
  const temp = Math.round(c.temperature_2m);
  const point = {
    label: 'Şu an', place, temp, feels: Math.round(c.apparent_temperature), rain,
    mm: Math.round(c.precipitation * 10) / 10, wind: Math.round(c.wind_speed_10m), gust: Math.round(c.wind_gusts_10m),
    humidity: Math.round(c.relative_humidity_2m),
    snow: c.snowfall > 0 || (temp <= 0 && rain >= 25),
    elevation: Math.round(d.elevation), time: c.time.slice(11, 16),
  };
  const minT = Math.round(day.temperature_2m_min[0]);
  const maxRain = day.precipitation_probability_max[0] ?? rain;
  const worst = {
    temp: minT, rain: maxRain,
    wind: Math.round(day.wind_speed_10m_max[0] ?? point.wind), gust: Math.round(day.wind_gusts_10m_max[0] ?? point.gust),
    snow: day.snowfall_sum[0] > 0 || (minT <= 0 && maxRain >= 25),
  };
  return { points: [point], worst };
}

export const wIcon = (p) => (p.snow ? '❄️' : p.rain >= 50 ? '🌧️' : p.wind >= 30 ? '💨' : p.temp >= 28 ? '🔥' : p.rain >= 25 ? '⛅' : '☀️');

// Spora göre uygunluk yorumu: ok / warn / bad
export function verdict(sportId, p) {
  const bad = (t) => ({ level: 'bad', text: t }), warn = (t) => ({ level: 'warn', text: t }), ok = { level: 'ok', text: 'Koşullar uygun' };
  if (sportId === 'paragliding') {
    if (p.wind >= 25 || p.gust >= 35 || p.rain >= 30 || p.snow) return bad('Uçuş önerilmez: rüzgar, yağış veya kar');
    return p.wind >= 18 ? warn('Rüzgar sınıra yakın') : ok;
  }
  if (sportId === 'rock-climbing') {
    if (p.rain >= 40 || p.snow) return bad('Kaya ıslak veya buzlu: tırmanma');
    return p.rain >= 20 || p.temp <= 0 || p.temp >= 33 ? warn('Kaya kaygan veya sıcaklık zor') : ok;
  }
  if (sportId === 'ultra-trail') {
    if (p.snow || p.temp <= -5 || p.temp >= 34 || p.wind >= 50) return bad('Koşu için aşırı koşullar');
    return p.rain >= 50 || p.temp <= 2 || p.temp >= 28 ? warn('Zorlayıcı koşullar, ekipmanı tam al') : ok;
  }
  if (p.wind >= 45 || (p.snow && p.temp <= -8)) return bad('Kamp için tehlikeli koşullar');
  return p.rain >= 50 || p.temp <= 3 || p.wind >= 30 ? warn('Soğuk, yağış veya rüzgar: ekipmanı artır') : ok;
}
