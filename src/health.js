// SAĞLIK EŞLEŞTİRME: profilde yazılan hastalık -> spora göre uyarı + zorunlu ilaç/ekipman.
// sp sırası: [camping, ultra-trail, paragliding, rock-climbing]; seviye: d=tehlikeli, w=dikkat, i=bilgi
// Bu bir öneri aracıdır, tıbbi tavsiye değildir.
export const SPORT_IDX = { camping: 0, 'ultra-trail': 1, paragliding: 2, 'rock-climbing': 3 };
export const norm = (t = '') => t.replace(/İ/g, 'i').toLowerCase()
  .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').trim();

const C = (key, label, alias, item, sp) => ({ key, label, alias, item, sp });
export const CONDITIONS = [
  C('asthma', 'Astım', ['astim', 'asthma', 'nefes darligi'], ['Kurtarıcı inhaler (doktorunun verdiği)', 'Nefes darlığı anı için', 40], [
    ['w', 'Soğuk hava ve duman astımı tetikler. İnhaleri uyku tulumunun yanında tut.'],
    ['d', 'Yüksek tempolu uzun koşu atak riskini artırır. Tempoyu düşür, yalnız koşma, doktoruna danış.'],
    ['w', 'İrtifada soğuk ve kuru hava nefesi zorlar. Uçuştan önce inhaleri kontrol et.'],
    ['w', 'Magnezya tozu ve efor atak tetikleyebilir. Tozlu ortamdan kaçın.']]),
  C('diabetes', 'Diyabet', ['diyabet', 'diabet', 'seker', 'sekerim'], ['Glukometre & glukoz tableti', 'Şeker düşmesi için', 150], [
    ['w', 'Yemek saatlerini sabitle, yedek şekerli yiyecek al, insülini sıcaktan koru.'],
    ['d', 'Uzun eforda kan şekeri hızla düşer. Düzenli ölç, şekerli jel taşı.'],
    ['d', 'Havada şeker düşmesi çok tehlikelidir. Uçuştan önce ölç, düşükse uçma.'],
    ['d', 'Tırmanışta şeker düşmesi düşme riskidir. Önce ölç, tırmanışı kısa tut.']]),
  C('heart', 'Kalp hastalığı', ['kalp', 'aritmi', 'ritim', 'stent', 'bypass'], ['Kalp ilacı yedeği & tıbbi kimlik kartı', 'Doktor reçeteli ilaçlar', 60], [
    ['w', 'Yüksek rakıma çıkma, ağır yük taşımaktan kaçın.'],
    ['d', 'Yüksek tempolu uzun koşu kalp için risklidir. Önce doktor onayı al.'],
    ['d', 'İrtifa ve adrenalin kalbi zorlar. Uçuş için doktor onayı gerekir.'],
    ['d', 'Ani efor ve düşme stresi risklidir. Doktor onayı olmadan tırmanma.']]),
  C('hypertension', 'Yüksek tansiyon', ['hipertansiyon', 'yuksek tansiyon', 'tansiyon'], ['Tansiyon aleti & ilaç yedeği', 'Kontrol için', 250], [
    ['i', 'Tuzlu yiyecekleri azalt, tansiyon ilacını aksatma.'],
    ['w', 'Yüksek tempoda tansiyon yükselir. Nabzını izle, tempoyu düşük tut.'],
    ['w', 'Uçuş stresi tansiyonu artırır. Uçuştan önce ölç.'],
    ['w', 'Kasları sıkarak zorlanmak tansiyonu artırır. Nefesini tutma, sık dinlen.']]),
  C('epilepsy', 'Epilepsi', ['epilepsi', 'sara', 'nobet'], ['Tıbbi kimlik bileziği & ilaç yedeği', 'Nöbet durumu için', 60], [
    ['w', 'Yalnız kamp yapma. Ateş ve su kenarında nöbet riski vardır.'],
    ['d', 'Yorgunluk ve susuzluk nöbeti tetikleyebilir. Yalnız koşma, kimlik bileziği tak.'],
    ['d', 'Havada nöbet ölümcül olabilir. Uçuş önerilmez.'],
    ['d', 'Yükseklikte nöbet düşmeye yol açar. Tırmanış önerilmez.']]),
  C('anaphylaxis', 'Şiddetli alerji', ['ari', 'anafilaksi', 'epipen', 'besin alerjisi', 'fistik', 'alerji'], ['Adrenalin oto-enjektör & antihistaminik', 'Şiddetli alerji anı için', 70], [
    ['d', 'Arı ve böcek ısırığı riski yüksek. Oto-enjektörü kolay ulaşılır yerde tut.'],
    ['w', 'Çiçekli ve çalılık parkurlarda ısırık riski var. Yalnız koşma.'],
    ['w', 'Kalkış alanında çiçek ve arı olabilir. Önce çevreyi kontrol et.'],
    ['w', 'Kaya yarıklarında böcek olabilir. Elini körlemesine sokma.']]),
  C('pollen', 'Polen alerjisi', ['polen', 'saman nezlesi', 'alerjik rinit', 'mevsimsel'], ['Antihistaminik & göz damlası', 'Polen için', 40], [
    ['i', 'Bahar aylarında çiçekli alandan uzak kamp kur.'],
    ['w', 'Rüzgarlı ve polenli günlerde koşuyu ertele.'],
    ['i', 'Termal kalkışlarda polen yoğun olabilir. Gözlük kullan.'],
    ['i', 'Kaya duvarında sorun daha az. Antihistaminiği yanında tut.']]),
  C('knee', 'Eklem / diz sorunu', ['diz', 'eklem', 'kireclenme', 'menisk', 'artrit', 'romatizma', 'bilek'], ['Diz bandajı & trekking batonu', 'Eklem desteği', 450], [
    ['w', 'Ağır çanta dizi yorar. Çanta ağırlığını sınırın altında tut.'],
    ['d', 'İniş koşusu diz ve eklemi çok yorar. Batonla ve kısa mesafeyle başla.'],
    ['w', 'İniş darbesi diz için risklidir. Yumuşak iniş yap, diz koruyucu tak.'],
    ['w', 'Diz bükülmeli hareketler eklemi zorlar. Diz koruyucu kullan.']]),
  C('back', 'Bel / omurga sorunu', ['bel fitigi', 'fitik', 'bel', 'sirt', 'disk', 'skolyoz'], ['Bel destek kemeri', 'Omurga desteği', 300], [
    ['d', 'Ağır sırt çantası fıtığı kötüleştirir. Yükü hafif tut.'],
    ['w', 'Tekrarlı darbe belde ağrı yapar. Hafif yelek kullan, asfaltta koşma.'],
    ['d', 'İniş darbesi omurgaya zarar verebilir. Sırt koruyuculu harness şart.'],
    ['w', 'Aşırı geriye eğilme belde ağrı yapar. Isınmadan tırmanma.']]),
  C('migraine', 'Migren', ['migren', 'bas agrisi'], ['Güneş gözlüğü & kendi migren ilacın', 'Atak anı için', 100], [
    ['i', 'Parlak ışık ve susuzluk atak tetikler. Bol su iç.'],
    ['w', 'Güneş ve susuzluk atak tetikler. Şapka ve gözlük tak.'],
    ['d', 'Havada atak uçuşu bırakır. Atak belirtisi varsa uçma.'],
    ['w', 'Atakta denge kaybı olur. Atak belirtisi varsa tırmanma.']]),
  C('vertigo', 'Vertigo / denge sorunu', ['vertigo', 'bas donmesi', 'denge', 'yukseklik'], ['Tıbbi kimlik kartı', 'Acil durum bilgisi', 20], [
    ['i', 'Dik yamaç ve uçurum kenarından uzak dur.'],
    ['w', 'Dar ve uçurumlu patikalarda dikkatli ol, yavaş başla.'],
    ['d', 'Denge sorunu uçuşta tehlikelidir. Doktor onayı al.'],
    ['d', 'Yükseklikte baş dönmesi düşme riskidir. Önerilmez.']]),
  C('anemia', 'Anemi', ['anemi', 'kansizlik', 'demir eksikligi'], ['Enerji barı & demir takviyesi', 'Halsizlik için', 150], [
    ['i', 'Yüksek rakımda halsizlik artar. Sık ve bol yemek ye.'],
    ['w', 'Oksijen taşıma azalır, çabuk yorulursun. Kısa mesafeyle başla.'],
    ['w', 'İrtifada oksijen daha da azalır. Düşük irtifada uç.'],
    ['w', 'Çabuk yorulmak tutuşu zayıflatır. Sık dinlen.']]),
  C('cold', 'Soğuk hassasiyeti', ['raynaud', 'soguk', 'soguga'], ['Isıtıcı eldiven & el ısıtıcı', 'Soğuktan korunma', 120], [
    ['w', 'Gece soğuğunda parmaklar donabilir. Kalın eldiven ve ek mont al.'],
    ['w', 'Rüzgarlı soğukta parmaklar uyuşur. Yedek eldiven taşı.'],
    ['d', 'İrtifada soğuk çok artar. Isıtmalı eldiven kullan.'],
    ['d', 'Soğukta tutuş kaybı düşme riskidir. Isıtıcı eldiven al.']]),
  C('sun', 'Güneş / cilt hassasiyeti', ['gunes', 'egzama', 'cilt', 'vitiligo'], ['SPF50+ krem & UV kıyafet', 'Güneş korunması', 200], [
    ['w', 'Gün boyu açıkta kalırsın. Şapka ve uzun kollu giy.'],
    ['w', 'Uzun süre güneşte kalırsın. Kremi her 2 saatte yenile.'],
    ['w', 'İrtifada UV yoğundur. Kapalı kıyafet ve gözlük şart.'],
    ['i', 'Kayadan yansıyan güneşe dikkat et. Kremi yenile.']]),
  C('lowbp', 'Düşük tansiyon', ['dusuk tansiyon', 'hipotansiyon'], ['Elektrolit & tuzlu atıştırmalık', 'Tansiyon düşmesi için', 150], [
    ['i', 'Sıcakta ve ayağa kalkarken başın dönebilir. Bol sıvı al.'],
    ['w', 'Uzun eforda tansiyon düşebilir. Elektrolit içeceği taşı.'],
    ['w', 'Hızlı irtifa değişimi baygınlık yapabilir. Uçuştan önce yemek ye.'],
    ['w', 'Ani kalkışlarda baş dönmesi olur. Yavaş hareket et.']]),
];
export const INTERACTIONS = CONDITIONS.length * 4; // 15 durum x 4 spor = 60
export const SUGGEST = ['Astım', 'Diyabet', 'Kalp', 'Yüksek tansiyon', 'Epilepsi', 'Arı alerjisi', 'Diz sorunu', 'Bel fıtığı'];

const lev = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};

// Eşleştirme: yazı içinde en uzun takma ad (alias) kazanır; yazım hatası 1 harfe kadar tolere edilir.
export function matchOne(text) {
  const t = norm(text); let best = null, bestLen = 0;
  CONDITIONS.forEach((c) => c.alias.forEach((a) => {
    const hit = t.includes(a) || t.split(/\s+/).some((w) => w.length >= 5 && a.length >= 5 && lev(w, a) <= 1);
    if (hit && a.length > bestLen) { best = c; bestLen = a.length; }
  }));
  return best;
}

export function matchConditions(texts, sportId) {
  return texts.map((text) => {
    const cond = matchOne(text);
    const level = cond ? (sportId ? cond.sp[SPORT_IDX[sportId]][0] : 'n') : 'u';
    return { text, cond, level };
  });
}

export function healthFor(sportId, texts) {
  const notes = [], items = [], seen = {};
  const order = { d: 0, w: 1, i: 2 };
  matchConditions(texts, sportId).forEach(({ cond }) => {
    if (!cond || seen[cond.key]) return; seen[cond.key] = 1;
    const [level, msg] = cond.sp[SPORT_IDX[sportId]];
    notes.push({ key: cond.key, label: cond.label, level, msg });
    items.push({ id: 'h-' + cond.key, name: cond.item[0], spec: cond.item[1], w: cond.item[2], why: 'Sağlık: ' + cond.label });
  });
  return { notes: notes.sort((a, b) => order[a.level] - order[b.level]), items };
}
