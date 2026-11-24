// Spor ve ekipman verileri (adlar geargrid_expo_app_1.js dosyasından, gramajlar tahminidir). Yeni spor için bir blok eklemek yeterli.
export const SPORTS = [
  { id: 'camping', name: 'Doğa Kampı & Bushcraft (Campers)', icon: '⛺', category: 'Kara', themeColor: '#d97706', limit: 10500, hard: 16000, note: "Kamp çantası vücut ağırlığının yaklaşık %20-25'ini geçmemeli. 16 kg üstü diz ve beli yorar.",
    base: [
      { id: 'c1', name: '3 Mevsim Çadır', spec: 'Çift tenteli, 3000mm su sütunu', w: 2200, must: true },
      { id: 'c2', name: 'Uyku Tulumu (0°C konfor)', spec: 'Sıkıştırılabilir dolgu', w: 1100, must: true },
      { id: 'c3', name: 'Şişme Kamp Matı', spec: 'R-değeri 3+ zemin izolasyonu', w: 550, must: true },
      { id: 'c4', name: 'Kafa Lambası + Yedek Pil', spec: '200 lümen, kırmızı gece modu', w: 110, must: true },
      { id: 'c5', name: 'Kamp Ocağı & Kartuş', spec: 'Rüzgar korumalı brülör', w: 480, must: true },
      { id: 'c6', name: 'İlk Yardım Kiti', spec: 'Gazlı bez, sargı, antiseptik', w: 350, must: true }],
    meds: [{ id: 'cm1', name: 'Böcek / Kene Kovucu Sprey', spec: 'Ormanlık ve çalılık alan koruması', w: 120, must: true },
      { id: 'cm2', name: 'Antihistaminik Tablet', spec: 'Böcek ısırığı ve polen', w: 30, must: true }] },
  { id: 'ultra-trail', name: 'Ultra Trail & Dağ Koşusu', icon: '🏃‍♂️', category: 'Kara', themeColor: '#10b981', limit: 5000, hard: 7000, note: "Ultra trailde koşu çantası genelde 2-5 kg olur. Daha ağır çantayla koşulmaz, sadece zorunlu ekipmanı al.",
    base: [
      { id: 'ut-1', name: 'Arazi Koşu Ayakkabısı (Vibram Taban)', spec: 'Kaygan zemin tutuşu ve su tahliyeli yapı', w: 600, must: true },
      { id: 'ut-2', name: 'Hidrasyon Yeleği (1.5L Sıvı Kapasitesi)', spec: 'Çift soft flask ve düdük entegre', w: 400, must: true },
      { id: 'ut-3', name: 'Termal Acil Durum Battaniyesi', spec: '200x150cm yüksek ısı yansıtıcı', w: 60, must: true },
      { id: 'ut-4', name: 'Kafa Lambası (500 Lümen)', spec: 'IPX6 su geçirmez ve yedek bataryalı', w: 120, must: true }],
    meds: [{ id: 'ut-med-1', name: 'Elektrolit & Sodyum Tabletleri', spec: 'Uzun etaplarda sıvı kaybı ve kramp önleyici', w: 40, must: true },
      { id: 'ut-med-2', name: 'Pişik ve Sürtünme Önleyici Krem', spec: 'Uzun mesafe cilt tahriş koruması', w: 60, must: true }] },
  { id: 'paragliding', name: 'Yamaç Paraşütü (Paragliding)', icon: '🪂', category: 'Hava', themeColor: '#0284c7', limit: 11000, hard: 15000, note: "Kanat ve harness ile toplam yük genelde 10-14 kg olur. Daha ağırsa yürüyüşle kalkış zorlaşır.",
    base: [
      { id: 'pg-1', name: 'Sertifikalı Yamaç Paraşütü Kanadı', spec: 'Kilo limitine ve uçuş karakterine uygun', w: 4200, must: true },
      { id: 'pg-2', name: 'Sırt Korumalı Harnes (Airbag/Mousse)', spec: 'Darbe emici arka koruma ünitesi', w: 3000, must: true },
      { id: 'pg-3', name: 'Yedek Paraşüt Sistemi', spec: 'Son 6 ay içinde katlanmış ve onaylı', w: 1500, must: true },
      { id: 'pg-4', name: 'Sesli Variometre & Kask', spec: 'EN966 uçuş sertifikalı kask', w: 650, must: true }],
    meds: [{ id: 'pg-med-1', name: 'Uçuş / Hareket Bulantı Önleyici', spec: 'Yoğun termik ve türbülans için denge desteği', w: 20, must: true }] },
  { id: 'rock-climbing', name: 'Kaya Tırmanışı / Bouldering', icon: '🧗‍♂️', category: 'Kara', themeColor: '#ef4444', limit: 8000, hard: 12000, note: "Tırmanış çantası genelde 6-10 kg olur. Duvara yürüyüş için 12 kg üstü yorucudur.",
    base: [
      { id: 'rc-1', name: 'CE / UIAA Onaylı Emniyet Kemeri', spec: 'Ayarlanabilir bacak ve bel kolonları', w: 380, must: true },
      { id: 'rc-2', name: 'Dinamik Tırmanış İpi (9.5mm - 70m)', spec: 'Dry-treated su ve kir itici kaplama', w: 3500, must: true },
      { id: 'rc-3', name: 'Tırmanış Kaskı & Emniyet Aleti', spec: 'Düşen taş koruması ve kilitli karabina', w: 600, must: true }],
    meds: [{ id: 'rc-med-1', name: 'Parmak Tırmanış Bandı (Finger Tape)', spec: 'Tendon ve eklem zorlanmalarına karşı', w: 40, must: true },
      { id: 'rc-med-2', name: 'Antiseptik Yara Spreyi', spec: 'Kaya sürtünme çiziklerine ilk müdahale', w: 80, must: true }] },
];
