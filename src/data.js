// Spor, ekipman ve hava senaryosu verileri (ekip buraya yeni spor/ekipman ekleyebilir)
export const LEVELS = ['Acemi', 'Orta', 'Prof'];

const g = (id, name, spec, w, must = true) => ({ id, name, spec, w, must });

export const SPORTS = [
  {
    id: 'camping', name: 'Doğa Kampı & Bushcraft', icon: '⛺', category: 'Kara', color: '#d97706',
    bg: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000&auto=format&fit=crop&q=80',
    limits: { Acemi: 14000, Orta: 10500, Prof: 6800 },
    base: [
      g('c1', '3 Mevsim Çadır', 'Çift tenteli, 3000mm su sütunu', 2200),
      g('c2', 'Uyku Tulumu (0°C konfor)', 'Sıkıştırılabilir dolgu', 1100),
      g('c3', 'Şişme Kamp Matı', 'R-değeri 3+ zemin izolasyonu', 550),
      g('c4', 'Kafa Lambası + Yedek Pil', '200 lümen, kırmızı gece modu', 110),
      g('c5', 'Kamp Ocağı & Kartuş', 'Rüzgar korumalı brülör', 480),
      g('c6', 'İlk Yardım Kiti', 'Gazlı bez, sargı, antiseptik', 350),
      g('c7', 'Su Filtresi', '0.1 mikron', 95, false),
    ],
  },
  {
    id: 'ultra-trail', name: 'Ultra Trail & Dağ Koşusu', icon: '🏃‍♂️', category: 'Kara', color: '#10b981',
    bg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
    limits: { Acemi: 6000, Orta: 5000, Prof: 3500 },
    base: [
      g('u1', 'Hidrasyon Yeleği (1.5L)', 'Esnek matara', 400),
      g('u2', 'Termal Acil Battaniye', 'Alüminyum yansıtıcı', 50),
      g('u3', 'Kafa Lambası (300 lümen)', 'IPX6 su geçirmez', 120),
      g('u4', 'Düdük & Görünür Yelek', 'Reflektörlü', 120),
      g('u5', 'İlk Yardım Seti', 'Temel set', 150),
      g('u6', 'Elektrolit Tabletleri', 'Kramp önleyici', 40, false),
    ],
  },
  {
    id: 'paragliding', name: 'Yamaç Paraşütü', icon: '🪂', category: 'Hava', color: '#0284c7',
    bg: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=1000&auto=format&fit=crop&q=80',
    limits: { Acemi: 9000, Orta: 8000, Prof: 7000 },
    base: [
      g('p1', 'Paraşüt (Kanat)', 'Sertifikalı, kontrol edilmiş', 4200),
      g('p2', 'Harness + Yedek Paraşüt', 'Koruma köpüklü', 3000),
      g('p3', 'Kask', 'Sertifikalı', 450),
      g('p4', 'Vario & GPS', 'İrtifa takibi', 200),
      g('p5', 'Telsiz', 'Yer ekibiyle iletişim', 180, false),
    ],
  },
  {
    id: 'rock-climbing', name: 'Kaya Tırmanışı / Bouldering', icon: '🧗‍♂️', category: 'Kara', color: '#ef4444',
    bg: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1000&auto=format&fit=crop&q=80',
    limits: { Acemi: 9000, Orta: 8000, Prof: 7000 },
    base: [
      g('r1', 'Tırmanış Ayakkabısı', 'Sıkı oturan, yapışkan taban', 600),
      g('r2', 'Kask', 'Düşen taşlara karşı', 350),
      g('r3', 'Harness', 'Ayarlanabilir', 380),
      g('r4', 'Dinamik İp (60m)', 'Kontrol edilmiş', 3500),
      g('r5', 'Emniyet Aleti & Kilitli Karabina', 'Grigri / ATC', 250),
      g('r6', 'Magnezya & Torba', 'Ter kontrolü', 120, false),
    ],
  },
];

// Hava senaryoları (şimdilik simüle; canlı API sonra weather.js'e bağlanacak)
export const SCENARIOS = [
  { id: 'sunny', label: 'Açık & Ilık', icon: '☀️', temp: 14, rain: 5, wind: 10, snow: false },
  { id: 'rainy', label: 'Yağmurlu & Rüzgarlı', icon: '🌧️', temp: 3, rain: 60, wind: 35, snow: false },
  { id: 'snow', label: 'Kar & Soğuk', icon: '❄️', temp: -6, rain: 30, wind: 20, snow: true },
  { id: 'hot', label: 'Sıcak Hava', icon: '🔥', temp: 31, rain: 0, wind: 12, snow: false },
];
