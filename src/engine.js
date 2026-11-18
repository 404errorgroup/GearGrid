import { SPORTS } from './data';

// KURAL MOTORU: hava koşulu -> ekipman. Yeni kural eklemek için RULES'a bir satır yeterli.
// sports: null = tüm sporlar. item yoksa kural bir uyarı üretir.
const RULES = [
  { sports: null, test: (w) => w.rain >= 40, why: (w) => `Yağış ihtimali %${w.rain}`,
    item: { id: 'a-rain', name: 'Su Geçirmez Ceket (Gore-Tex)', spec: 'Yağmura karşı', w: 380, must: true } },
  { sports: null, test: (w) => w.temp <= 4, why: (w) => `Gece sıcaklığı ${w.temp}°C`,
    item: { id: 'a-thermal', name: 'Termal İçlik & Bere', spec: 'Merinos yün', w: 420, must: true } },
  { sports: null, test: (w) => w.temp >= 28, why: (w) => `Sıcaklık ${w.temp}°C`,
    item: { id: 'a-sun', name: 'Güneş Kremi & Şapka', spec: 'UV koruması', w: 150, must: true } },
  { sports: ['camping', 'ultra-trail'], test: (w) => w.temp >= 28, why: (w) => `Sıcaklık ${w.temp}°C`,
    item: { id: 'a-water', name: 'Ekstra Su (1L)', spec: 'Susuzluğa karşı', w: 1000, must: true } },
  { sports: ['camping'], test: (w) => w.wind >= 30, why: (w) => `Rüzgar ${w.wind} km/s`,
    item: { id: 'a-stakes', name: 'Fırtına Kazığı & Gergi İpi', spec: 'Çadır sabitleme', w: 190, must: true } },
  { sports: ['camping', 'ultra-trail'], test: (w) => w.snow, why: () => 'Kar var',
    item: { id: 'a-snow', name: 'Kar Tozluğu & Mikro Krampon', spec: 'Karda tutunma', w: 450, must: true } },
  { sports: ['paragliding'], test: (w) => w.wind >= 30, why: (w) => `Rüzgar ${w.wind} km/s: uçuş önerilmez`, item: null },
  { sports: ['paragliding', 'rock-climbing'], test: (w) => w.snow, why: () => 'Kar/buz var: bu spor için güvenli değil', item: null },
  { sports: ['rock-climbing'], test: (w) => w.rain >= 40, why: (w) => `Yağış %${w.rain}: kaya ıslak ve kaygan olur`, item: null },
];

export function buildList(sportId, w, custom = []) {
  const sport = SPORTS.find((s) => s.id === sportId);
  const items = sport.base.map((i) => ({ ...i, why: 'Bu spor için temel ekipman' }));
  const warnings = [];
  RULES.filter((r) => !r.sports || r.sports.includes(sportId)).forEach((r) => {
    if (!r.test(w)) return;
    if (r.item) items.push({ ...r.item, auto: true, why: r.why(w) });
    else warnings.push(r.why(w));
  });
  custom.filter((c) => c.sportId === sportId).forEach((c) =>
    items.push({ ...c, must: false, custom: true, spec: 'Kendi eklediğin eşya', why: 'Senin eklediğin eşya' }));
  return { items, warnings };
}

// Hazır mısın kontrolü + ağırlık hesabı
export function status(items, packed, limit) {
  const inBag = items.filter((i) => packed[i.id]);
  const weight = inBag.reduce((s, i) => s + i.w, 0);
  const missing = items.filter((i) => i.must && !packed[i.id]);
  return { inBag, weight, missing, overweight: weight > limit, ready: missing.length === 0 };
}
