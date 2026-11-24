import { norm } from './health';

// Hava servisi (SİMÜLE). Konum/GPS API'si yok: yazılan yer adına göre tutarlı, günlük değişen veri üretir.
// TODO (API): placeWeather(...) çağrıları canlı hava API'sine bağlanacak. Dönüş biçimi sabit kaldığı sürece uygulamanın geri kalanı değişmez.
// Her nokta: temp, feels (hissedilen), rain (%), mm (yağış şiddeti), wind, gust, humidity, snow, conf (tahmin doğruluğu %).
const CITY = { alacati: [14, 40, 30], cesme: [13, 40, 28], bodrum: [13, 40, 20], kas: [14, 40, 14], babadag: [4, 45, 26], geyikbayiri: [12, 40, 12],
  istanbul: [9, 55, 28], bursa: [7, 50, 15], uludag: [-4, 60, 40], izmir: [11, 35, 18], ankara: [1, 30, 14], antalya: [12, 40, 12],
  kayseri: [-1, 25, 16], erciyes: [-9, 35, 38], trabzon: [9, 70, 16], kackar: [-6, 55, 30], mugla: [8, 45, 12], fethiye: [13, 45, 14],
  oludeniz: [13, 40, 15], denizli: [5, 30, 12], eskisehir: [2, 30, 18], konya: [1, 20, 15], erzurum: [-7, 30, 14], edirne: [6, 45, 20],
  canakkale: [9, 40, 30], bolu: [3, 45, 12], mersin: [12, 35, 12], samsun: [8, 60, 20], sakarya: [8, 55, 14], aydin: [10, 35, 10], adana: [11, 35, 10] };
const MOUNTAIN = ['uludag', 'erciyes', 'kackar', 'babadag']; // dağ havası daha az öngörülebilir

export const CITIES = ['Babadağ', 'Ölüdeniz', 'Fethiye', 'Kaş', 'Geyikbayırı', 'Antalya', 'Bodrum', 'Çeşme', 'Alaçatı', 'İzmir', 'İstanbul', 'Bursa', 'Uludağ', 'Bolu', 'Ankara', 'Kayseri', 'Erciyes', 'Trabzon', 'Kaçkar'];

const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const rand = (seed) => { let a = seed; return () => (a = (a * 1664525 + 1013904223) >>> 0) / 4294967296; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Hissedilen sıcaklık: soğukta rüzgar etkisi (wind chill), diğer durumlarda nem ve rüzgarlı görünür sıcaklık.
const feelsLike = (T, rh, v) => {
  if (T <= 10 && v >= 5) { const p = Math.pow(v, 0.16); return Math.round(13.12 + 0.6215 * T - 11.37 * p + 0.3965 * T * p); }
  const e = (rh / 100) * 6.105 * Math.exp((17.27 * T) / (237.7 + T));
  return Math.round(T + 0.33 * e - 0.7 * (v / 3.6) - 4);
};

function build(temp, rain, wind, r, mountain) {
  const humidity = clamp(Math.round(40 + rain * 0.5 + r() * 12), 20, 100);
  return {
    temp, rain, wind, humidity, gust: Math.round(wind * 1.35), snow: temp <= 0 && rain >= 25,
    feels: feelsLike(temp, humidity, wind), mm: rain >= 30 ? Math.max(1, Math.round(rain / 12)) : 0,
    conf: clamp(Math.round(92 - rain * 0.12 - wind * 0.25 - (mountain ? 8 : 0) + (r() - 0.5) * 6), 52, 97), // tahmin doğruluğu %
  };
}
function placeWeather(name) {
  const n = norm(name); const h = hash(n);
  const key = Object.keys(CITY).find((k) => n.includes(k));
  const b = key ? CITY[key] : [(h % 20) - 6, 20 + ((h >> 3) % 50), 8 + ((h >> 5) % 30)];
  const r = rand(h + Math.floor(Date.now() / 864e5)); // günlük değişir
  return build(Math.round(b[0] + (r() - 0.5) * 4), clamp(Math.round(b[1] + (r() - 0.5) * 30), 0, 100), Math.max(0, Math.round(b[2] + (r() - 0.5) * 10)), r, !key || MOUNTAIN.includes(key));
}

export async function getRouteWeather(from, to) {
  const f = (from || '').trim(), t = (to || '').trim();
  if (!f && !t) return null;
  const a = placeWeather(f || t), b = placeWeather(t || f);
  const points = [{ label: 'Başlangıç', place: f || t, ...a }];
  if (f && t && norm(f) !== norm(t)) {
    const r = rand(hash(norm(f + t)));
    const m = build(Math.round((a.temp + b.temp) / 2 + (r() - 0.5) * 3), Math.round((a.rain + b.rain) / 2), Math.round((a.wind + b.wind) / 2), r, false);
    points.push({ label: 'Rota ortası', place: `${f} – ${t}`, ...m, conf: Math.min(a.conf, b.conf, m.conf) - 6, estimated: true });
    points.push({ label: 'Varış', place: t, ...b });
  }
  const worst = { temp: Math.min(...points.map((p) => p.temp)), rain: Math.max(...points.map((p) => p.rain)),
    wind: Math.max(...points.map((p) => p.wind)), snow: points.some((p) => p.snow) };
  return { points, worst };
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
