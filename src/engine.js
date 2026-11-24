import { SPORTS } from './data';

// KURAL MOTORU: hava koşulu -> ekipman. Yeni kural için RULES'a bir satır eklemek yeterli. item yoksa kural bir uyarı üretir.
const ALL = ['camping', 'ultra-trail', 'paragliding', 'rock-climbing'];
const T = (w) => `Sıcaklık ${w.temp}°C`;
const RULES = [
  { sports: ALL, test: (w) => w.rain >= 40, why: (w) => `Yağış ihtimali %${w.rain}`, item: { id: 'a-rain', name: 'Su Geçirmez Ceket (Gore-Tex)', spec: 'Yağmura karşı', w: 380 } },
  { sports: ALL, test: (w) => w.temp <= 4, why: T, item: { id: 'a-thermal', name: 'Termal İçlik & Bere', spec: 'Merinos yün', w: 420 } },
  { sports: ALL, test: (w) => w.temp >= 28, why: T, item: { id: 'a-sun', name: 'Güneş Kremi & Şapka', spec: 'UV koruması', w: 150 } },
  { sports: ['camping', 'ultra-trail', 'rock-climbing'], test: (w) => w.temp >= 28, why: T, item: { id: 'a-water', name: 'Ekstra Su (1L)', spec: 'Susuzluğa karşı', w: 1000 } },
  { sports: ['camping'], test: (w) => w.wind >= 30, why: (w) => `Rüzgar ${w.wind} km/s`, item: { id: 'a-stakes', name: 'Fırtına Kazığı & Gergi İpi', spec: 'Çadır sabitleme', w: 190 } },
  { sports: ['camping', 'ultra-trail'], test: (w) => w.snow, why: () => 'Kar var', item: { id: 'a-snow', name: 'Kar Tozluğu & Mikro Krampon', spec: 'Karda tutunma', w: 450 } },
  { sports: ['paragliding'], test: (w) => w.wind >= 30, why: (w) => `Rüzgar ${w.wind} km/s: uçuş önerilmez`, item: null },
  { sports: ['paragliding', 'rock-climbing'], test: (w) => w.snow, why: () => 'Kar/buz var: bu spor için güvenli değil', item: null },
  { sports: ['rock-climbing'], test: (w) => w.rain >= 40, why: (w) => `Yağış %${w.rain}: kaya ıslak ve kaygan olur`, item: null },
];

export function buildList(sportId, w, health = []) {
  const sport = SPORTS.find((x) => x.id === sportId);
  const mandatory = sport.base.map((i) => ({ ...i }));
  const warnings = [];
  RULES.filter((r) => r.sports.includes(sportId)).forEach((r) => {
    if (!r.test(w)) return;
    if (r.item) mandatory.push({ ...r.item, must: true, auto: true, why: r.why(w) });
    else warnings.push(r.why(w));
  });
  const meds = [...sport.meds, ...health.map((h) => ({ ...h, must: true, health: true }))];
  return { mandatory, meds, warnings };
}

// Hazır mısın kontrolü + ağırlık hesabı
export function status(items, packed, limit) {
  const inBag = items.filter((i) => packed[i.id]);
  const weight = inBag.reduce((s, i) => s + i.w, 0);
  const missing = items.filter((i) => !packed[i.id]);
  return { packedCount: inBag.length, total: items.length, weight, missing, overweight: weight > limit, ready: items.length > 0 && missing.length === 0 };
}

// Spora göre ağırlık uyarısı: önerilen sınır (limit) ve üst sınır (hard). Örn. 20 kg ile ultra trail koşusu uyarısı.
export function weightAdvice(sport, weight) {
  if (!sport || weight <= 0) return null;
  const kg = (weight / 1000).toFixed(1);
  if (weight > sport.hard) return { level: 'bad', text: `${kg} kg bu spor için fazla ağır. ${sport.note}` };
  if (weight > sport.limit) return { level: 'warn', text: `${kg} kg önerilen sınırın (${(sport.limit / 1000).toFixed(1)} kg) üstünde. ${sport.note}` };
  return null;
}
