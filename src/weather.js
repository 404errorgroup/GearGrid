import { norm } from './health';

// CANLI HAVA SERVİSİ: Open-Meteo (ücretsiz, API anahtarı yok, kayıt yok). Docs: https://open-meteo.com/en/docs
// Akış: yazılan TEK konum -> koordinat (Geocoding API) -> o konumun BUGÜN SAAT 12:00 tahmini (Forecast API, saatlik veri).
// İnternet yoksa uygulama çökmesin diye eski simüle veriye düşer ve sonuçta offline: true döner.
// Çıktı: { place, time, temp, feels, rain, mm, wind, gust, humidity, snow, code, conf, source, updated, offline? } (hepsi bugün 12:00 değerleri)
// conf (tahmin doğruluğu) canlı veride yoktur (null): Open-Meteo bir güven yüzdesi vermez, uydurmuyoruz.

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 12000;
const SNOW_CODES = [71, 73, 75, 77, 85, 86];

export const CITIES = ['Babadağ', 'Ölüdeniz', 'Fethiye', 'Kaş', 'Geyikbayırı', 'Antalya', 'Bodrum', 'Çeşme', 'Alaçatı', 'İzmir', 'İstanbul', 'Bursa', 'Uludağ', 'Bolu', 'Ankara', 'Kayseri', 'Erciyes', 'Trabzon', 'Kaçkar'];

// Geocoding'in köy/ilçe ile karıştırabileceği DAĞ noktaları: koordinat + rakım elle verilir (rakım sıcaklığı doğru yapar).
// Yeni nokta için bir satır ekle: anahtar = norm() ile yazılmış ad (küçük harf, Türkçe karaktersiz).
const KNOWN = {
  babadag: { name: 'Babadağ', label: 'Babadağ (Fethiye)', lat: 36.51, lon: 29.16, elev: 1700 },
  uludag: { name: 'Uludağ', label: 'Uludağ (Bursa)', lat: 40.085, lon: 29.22, elev: 1850 },
  erciyes: { name: 'Erciyes', label: 'Erciyes (Kayseri)', lat: 38.53, lon: 35.45, elev: 2100 },
};

const fold = (t) => t.replace(/ğ/g, 'g').replace(/Ğ/g, 'G').replace(/ü/g, 'u').replace(/Ü/g, 'U').replace(/ş/g, 's').replace(/Ş/g, 'S')
  .replace(/ı/g, 'i').replace(/İ/g, 'I').replace(/ö/g, 'o').replace(/Ö/g, 'O').replace(/ç/g, 'c').replace(/Ç/g, 'C');

class NotFound extends Error {}

async function getJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error('Hava servisi yanıt vermiyor');
    return await res.json();
  } finally { clearTimeout(timer); }
}

async function findPlace(name) {
  const key = Object.keys(KNOWN).find((k) => norm(name).includes(k));
  if (key) return KNOWN[key];
  const search = async (q, tr) => {
    const data = await getJson(`${GEO_URL}?name=${encodeURIComponent(q)}&count=1&language=tr&format=json${tr ? '&countryCode=TR' : ''}`);
    const r = data.results && data.results[0];
    return r && { name: r.name, label: [r.name, r.admin1].filter((x, i, a) => x && a.indexOf(x) === i).join(', '), lat: r.latitude, lon: r.longitude, elev: typeof r.elevation === 'number' ? r.elevation : null };
  };
  const found = (await search(name, true)) || (await search(name, false)) || (fold(name) !== name ? await search(fold(name), false) : null);
  if (!found) throw new NotFound(`"${name}" bulunamadı. Yer adını kontrol et.`);
  return found;
}

// Tek nokta için BUGÜN SAAT 12:00 (öğlen, o yerin yerel saatiyle) verisi. Rüzgar km/s, sıcaklık °C, yağış mm.
const NOON = 12;
async function fetchPoint(p) {
  const elev = p.elev != null ? `&elevation=${p.elev}` : '';
  const url = `${FORECAST_URL}?latitude=${p.lat}&longitude=${p.lon}${elev}`
    + '&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,snowfall,weather_code,wind_speed_10m,wind_gusts_10m'
    + '&forecast_days=1&timezone=auto';
  const data = await getJson(url);
  const h = data.hourly; if (!h || !h.time || !h.time.length) throw new Error('Tahmin verisi alınamadı');
  let i = h.time.findIndex((x) => String(x).endsWith(`T${String(NOON).padStart(2, '0')}:00`));
  if (i < 0) i = Math.min(NOON, h.time.length - 1);
  const v = (a, def = 0) => (a && a[i] != null ? a[i] : def);
  const precip = v(h.precipitation), code = v(h.weather_code);
  let rain = v(h.precipitation_probability, null);
  if (rain == null) rain = precip >= 1 ? 60 : precip > 0 ? 30 : 0; // olasılık yoksa saatlik yağıştan tahmin et
  return {
    time: h.time[i], // örn. 2026-11-24T12:00
    temp: Math.round(v(h.temperature_2m)), feels: Math.round(v(h.apparent_temperature, v(h.temperature_2m))),
    rain: Math.round(rain), mm: Math.round(precip * 10) / 10, // mm/sa: o saatteki yağış
    wind: Math.round(v(h.wind_speed_10m)), gust: Math.round(v(h.wind_gusts_10m)), humidity: Math.round(v(h.relative_humidity_2m, 50)),
    snow: v(h.snowfall) > 0 || SNOW_CODES.includes(code), code, conf: null, source: 'live',
  };
}

export async function getWeather(place) {
  const name = (place || '').trim();
  if (!name) return null;
  try {
    const found = await findPlace(name);
    const w = await fetchPoint(found);
    const d = new Date();
    return { place: found.label || found.name, ...w, fetchedAt: Date.now(), updated: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` };
  } catch (e) {
    if (e instanceof NotFound) throw e;                          // yazım hatası: kullanıcıya göster
    return { place: name, ...simPoint(name), offline: true };    // internet yok / servis kapalı: simüle veriye düş
  }
}

export const wIcon = (p) => (p.snow ? '❄️' : p.code >= 95 ? '⛈️' : p.rain >= 50 ? '🌧️' : p.wind >= 30 ? '💨' : p.temp >= 28 ? '🔥' : p.rain >= 25 ? '⛅' : '☀️');

// Spora göre uygunluk yorumu: ok / warn / bad
export function verdict(sportId, p) {
  const bad = (x) => ({ level: 'bad', text: x }), warn = (x) => ({ level: 'warn', text: x }), ok = { level: 'ok', text: 'Koşullar uygun' };
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

// ---------------------------------------------------------------------------------------------
// ÇEVRİMDIŞI YEDEK (SİMÜLE): sadece internet yokken kullanılır; gerçek veri değildir, uygulama bunu uyarıyla gösterir.
// ---------------------------------------------------------------------------------------------
const CITY = { alacati: [14, 40, 30], cesme: [13, 40, 28], bodrum: [13, 40, 20], kas: [14, 40, 14], babadag: [4, 45, 26], geyikbayiri: [12, 40, 12],
  istanbul: [9, 55, 28], bursa: [7, 50, 15], uludag: [-4, 60, 40], izmir: [11, 35, 18], ankara: [1, 30, 14], antalya: [12, 40, 12],
  kayseri: [-1, 25, 16], erciyes: [-9, 35, 38], trabzon: [9, 70, 16], kackar: [-6, 55, 30], mugla: [8, 45, 12], fethiye: [13, 45, 14],
  oludeniz: [13, 40, 15], bolu: [3, 45, 12] };
const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const rand = (seed) => { let a = seed; return () => (a = (a * 1664525 + 1013904223) >>> 0) / 4294967296; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function simPoint(name) {
  const n = norm(name); const h = hash(n); const key = Object.keys(CITY).find((k) => n.includes(k));
  const b = key ? CITY[key] : [(h % 20) - 6, 20 + ((h >> 3) % 50), 8 + ((h >> 5) % 30)];
  const r = rand(h + Math.floor(Date.now() / 864e5));
  const temp = Math.round(b[0] + (r() - 0.5) * 4), rain = clamp(Math.round(b[1] + (r() - 0.5) * 30), 0, 100), wind = Math.max(0, Math.round(b[2] + (r() - 0.5) * 10));
  return { temp, feels: temp - (wind >= 20 ? 3 : 1), rain, mm: rain >= 30 ? Math.max(1, Math.round(rain / 12)) : 0, wind, gust: Math.round(wind * 1.35),
    humidity: clamp(Math.round(40 + rain * 0.5), 20, 100), snow: temp <= 0 && rain >= 25, code: 0, conf: 55, source: 'sim' };
}
