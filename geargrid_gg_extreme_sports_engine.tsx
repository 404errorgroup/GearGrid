import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Sun, 
  Wind, 
  Thermometer, 
  Compass, 
  Briefcase, 
  Pill, 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  MapPin, 
  RefreshCw, 
  ChevronRight, 
  Check, 
  Plus, 
  ShoppingBag, 
  PackageCheck, 
  User, 
  Settings, 
  X, 
  Bell, 
  Volume2, 
  Moon, 
  ArrowLeft, 
  Sparkles, 
  Info 
} from 'lucide-react';

// --- SPORTS DATA WITH DYNAMIC THEMING & NATURE BACKGROUNDS ---
const EXTREME_SPORTS = [
  { 
    id: 'ultra-trail', 
    name: 'Ultra Trail & Dağ Koşusu', 
    icon: '🏃‍♂️', 
    category: 'Kara', 
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    theme: {
      accent: 'emerald',
      bgGradient: 'from-emerald-950/95 via-slate-900/95 to-amber-950/90',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
    }
  },
  { 
    id: 'paragliding', 
    name: 'Yamaç Paraşütü (Paragliding)', 
    icon: '🪂', 
    category: 'Hava', 
    bgImage: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=1200&auto=format&fit=crop&q=80',
    theme: {
      accent: 'sky',
      bgGradient: 'from-sky-950/95 via-slate-900/95 to-cyan-950/90',
      border: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      buttonBg: 'bg-sky-500 hover:bg-sky-400 text-slate-950'
    }
  },
  { 
    id: 'rock-climbing', 
    name: 'Kaya Tırmanışı / Bouldering', 
    icon: '🧗‍♂️', 
    category: 'Kara', 
    bgImage: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1200&auto=format&fit=crop&q=80',
    theme: {
      accent: 'red',
      bgGradient: 'from-red-950/95 via-slate-900/95 to-amber-950/90',
      border: 'border-red-500/40',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
      buttonBg: 'bg-red-600 hover:bg-red-500 text-slate-100'
    }
  },
  { 
    id: 'kitesurf', 
    name: 'Windsurf & Kitesurfing', 
    icon: '🏄‍♂️', 
    category: 'Su', 
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    theme: {
      accent: 'cyan',
      bgGradient: 'from-cyan-950/95 via-slate-900/95 to-blue-950/90',
      border: 'border-cyan-500/40',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      buttonBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
    }
  },
  { 
    id: 'mtb-downhill', 
    name: 'Downhill MTB (Dağ Bisikleti)', 
    icon: '🚵‍♂️', 
    category: 'Kara', 
    bgImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80',
    theme: {
      accent: 'amber',
      bgGradient: 'from-amber-950/95 via-slate-900/95 to-stone-900/90',
      border: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      buttonBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950'
    }
  },
  { 
    id: 'scuba', 
    name: 'Derin Dalış (Scuba Diving)', 
    icon: '🪸', 
    category: 'Su', 
    bgImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80',
    theme: {
      accent: 'blue',
      bgGradient: 'from-blue-950/95 via-slate-900/95 to-cyan-950/90',
      border: 'border-blue-500/40',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white'
    }
  }
];

// --- LEVEL-BASED GEAR DATABASE ---
const GEAR_DATABASE = {
  'ultra-trail': {
    levels: {
      'Acemi': {
        mandatory: [
          { id: 'ut-1', name: 'Yüksek Bilekli Arazi Ayakkabısı', spec: 'Ekstra ayak bilek destekli' },
          { id: 'ut-2', name: 'Görünür Yoğunluklu Yelek & Düdük', spec: 'Reflektörlü acil durum kiti' },
          { id: 'ut-3', name: 'Termal Acil Durum Battaniyesi', spec: '200x150cm Isı koruma' },
          { id: 'ut-4', name: 'Başlangıç İlk Yardım Çantası', spec: 'Gazlı bez, dezenfektan, bantlar' }
        ],
        medication: {
          essential: [
            { id: 'ut-med-1', name: 'Elektrolit Efervesan Tablet', desc: 'Sıvı kaybına bağlı kramplar için.' },
            { id: 'ut-med-2', name: 'Pişik ve Sürtünme Önleyici Krem', desc: 'Bilek ve uyluk sürtünmelerini engeller.' }
          ],
          optional: [
            { id: 'ut-med-opt-1', name: 'Basit Ağrı Kesici (Parasetamol)', desc: 'Baş ve kas ağrıları için.' }
          ]
        },
        alternatives: [
          { core: 'Carbon Pro Baton', alt: 'Alüminyum Katlanır Ayarlı Baton', budgetDiff: '-%60 Bütçe' }
        ]
      },
      'Orta': {
        mandatory: [
          { id: 'ut-1', name: 'Arazi Koşu Ayakkabısı (Grip Taban)', spec: 'Vibram Megagrip, su tahliyeli' },
          { id: 'ut-2', name: 'Hidrasyon Yeleği (1.5L Sıvı Kapasitesi)', spec: 'Esnek matara hazneli' },
          { id: 'ut-3', name: 'Termal Acil Durum Battaniyesi', spec: 'Alüminyum yansıtıcı' },
          { id: 'ut-4', name: 'Kafa Lambası (300 Lümen)', spec: 'IPX6 Su geçirmezlik' }
        ],
        medication: {
          essential: [
            { id: 'ut-med-1', name: 'Sodyum / Elektrolit Tabletleri', desc: 'Uzun etap sıvı takviyesi.' },
            { id: 'ut-med-2', name: 'Sürtünme Önleyici Krem', desc: 'Cilt tahriş koruması.' }
          ],
          optional: [
            { id: 'ut-med-opt-1', name: 'İbuprofen / Anti-enflamatuar', desc: 'Kas iltihabı ve burkulma ağrısı.' }
          ]
        },
        alternatives: [
          { core: 'Gore-Tex Yağmurluk (20k)', alt: '2.5 Katman Nefes Alabilir Yağmurluk', budgetDiff: '-%35 Fiyat' }
        ]
      },
      'Prof': {
        mandatory: [
          { id: 'ut-1-pro', name: 'Hafif Karbon Plakalı Trail Ayakkabısı', spec: 'Minimum ağırlık, maksimum tepki' },
          { id: 'ut-2-pro', name: 'Ultra-Light 5L Yelek + Soft Flask', spec: 'Ağırlıksız yarış ergonomisi' },
          { id: 'ut-3-pro', name: 'GPS Uydu Mayın / Beacon Transmitter', spec: 'Anlık uydu takip ve SOS sinyali' },
          { id: 'ut-4-pro', name: '900 Lümen Profesyonel Kafa Lambası', spec: 'Otomatik sensörlü parlaklık ayarı' }
        ],
        medication: {
          essential: [
            { id: 'ut-med-pro-1', name: 'Konsantre Glikoz & Elektrolit Shot', desc: 'Anında kan şekeri ve sodyum yüklemesi.' },
            { id: 'ut-med-pro-2', name: 'Doku Hızlı Onarım & Laktik Asit Bloker', desc: 'Uzun etap performans koruması.' }
          ],
          optional: [
            { id: 'ut-med-pro-opt-1', name: 'Kas Gevşetici Enjeksiyon / Krem', desc: 'Bitiş sonrası acil müdahale.' }
          ]
        },
        alternatives: [
          { core: 'Titanyum Baton Kiti', alt: 'Ultra-Karbon Tek Parça Baton', budgetDiff: 'Yarış Odaklı' }
        ]
      }
    }
  },
  'paragliding': {
    levels: {
      'Acemi': {
        mandatory: [
          { id: 'pg-1', name: 'EN-A Sınıfı Güvenli Başlangıç Kanadı', spec: 'Maksimum kapanma direnci' },
          { id: 'pg-2', name: 'Büyük Boy Hava Yastıklı Harnes (Airbag)', spec: '17cm Kalın koruma köpüğü' },
          { id: 'pg-3', name: 'Geniş Limitli Yedek Paraşüt', spec: 'Kolay açılma mekanizmalı' },
          { id: 'pg-4', name: 'Tam Korumalı Çene Destekli Kask', spec: 'Telsiz kulaklık uyumlu' }
        ],
        medication: {
          essential: [
            { id: 'pg-med-1', name: 'Hareket / Uçuş Bulantı Hapı', desc: 'Türbülanslı havalarda mide bulantısını engeller.' },
            { id: 'pg-med-2', name: 'Göz Damlası (Nemlendirici)', desc: 'Rüzgardan kuruyan göz koruması.' }
          ],
          optional: []
        },
        alternatives: [
          { core: 'Akıllı GPS Vario', alt: 'Sesli Temel Variometre', budgetDiff: '-%50 Fiyat' }
        ]
      },
      'Orta': {
        mandatory: [
          { id: 'pg-1', name: 'EN-B Sınıfı Performans Kanadı', spec: 'Termik performanslı' },
          { id: 'pg-2', name: 'Standart Oturma Harnesi', spec: 'Sırt korumalı' },
          { id: 'pg-3', name: 'Yedek Paraşüt', spec: 'Kilo limitli' },
          { id: 'pg-4', name: 'Vario & Kask Seti', spec: 'Yükseklik ölçer sesli vario' }
        ],
        medication: {
          essential: [
            { id: 'pg-med-1', name: 'Bulantı Önleyici Hap', desc: 'Uçuş tutmasını önler.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Prof': {
        mandatory: [
          { id: 'pg-1-pro', name: 'EN-D / CCC Yarış Kanadı', spec: 'Yüksek süzülme ve hız katsayısı' },
          { id: 'pg-2-pro', name: 'Aerodinamik Pod Yarış Harnesi', spec: 'Tam kapalı gövde ergonomisi' },
          { id: 'pg-3-pro', name: 'Çift Yedek Paraşüt Sistemi', spec: 'Yüksek irtifa ve hızlı açılan ikili kaset' },
          { id: 'pg-4-pro', name: 'FLARM & ADS-B Uçuş Bilgisayarı', spec: 'Sivil havacılık radar entegre navigasyon' }
        ],
        medication: {
          essential: [
            { id: 'pg-med-pro-1', name: 'Yüksek İrtifa Oksijen Takviye Spreyi', desc: '3000m+ irtifa uçuşları için hipoksi önleyici.' }
          ],
          optional: []
        },
        alternatives: []
      }
    }
  },
  'rock-climbing': {
    levels: {
      'Acemi': {
        mandatory: [
          { id: 'rc-1', name: 'Dolgulu Rahat Emniyet Kemeri', spec: 'Geniş bel desteği' },
          { id: 'rc-2', name: 'Top-Rope İçin Kalın İp (10.2mm)', spec: 'Yüksek aşınma direnci' },
          { id: 'rc-3', name: 'Sert Kabuk Tırmanış Kaskı', spec: 'Düşen taşlara karşı tam üst koruma' },
          { id: 'rc-4', name: 'Otomatik Kilitli Emniyet Aleti', spec: 'İp kaçırmayan mekanizma' }
        ],
        medication: {
          essential: [
            { id: 'rc-med-1', name: 'Parmak ve Eklem Tırmanış Bandı', desc: 'Cilt soyulmalarını engeller.' },
            { id: 'rc-med-2', name: 'Yara Spreyi & Antiseptik', desc: 'Kaya sürtünme çizikleri için.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Orta': {
        mandatory: [
          { id: 'rc-1', name: 'Tırmanış Emniyet Kemer (Harnes)', spec: 'CE / UIAA onaylı' },
          { id: 'rc-2', name: 'Dinamik İp (9.5mm - 70m)', spec: 'Dry-treated kaplama' },
          { id: 'rc-3', name: 'Tırmanış Kaskı', spec: 'Darbe emici' },
          { id: 'rc-4', name: 'Ekspres Set (12 Adet)', spec: 'Karabina seti' }
        ],
        medication: {
          essential: [
            { id: 'rc-med-1', name: 'Finger Tape & Sıvı Magnezyum', desc: 'Tendon sabitleme.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Prof': {
        mandatory: [
          { id: 'rc-1-pro', name: 'Ultra-Light Agresif Tırmanış Harnesi', spec: 'Gram cinsinden hafifletilmiş yarış kemeri' },
          { id: 'rc-2-pro', name: 'İnce İideal Lider İp (8.9mm Triple Certified)', spec: 'Tek/Çift/İkiz kullanıma uygun' },
          { id: 'rc-3-pro', name: 'Mikro Takoz & Cam Seti (Friends)', spec: 'Geleneksel (Trad) tırmanış emniyet seti' },
          { id: 'rc-4-pro', name: 'Karbon Katlamalı Tırmanış Ayakkabısı', spec: 'Asimetrik ekstra hassas taban' }
        ],
        medication: {
          essential: [
            { id: 'rc-med-pro-1', name: 'Tendon İltihap Önleyici Merhem', desc: 'Şiddetli Parmak zorlanmalarına karşı.' }
          ],
          optional: []
        },
        alternatives: []
      }
    }
  },
  'kitesurf': {
    levels: {
      'Acemi': {
        mandatory: [
          { id: 'ks-1', name: 'Geniş Yüzeyli Eğitim Tahtası (Door Board)', spec: 'Kolay su kalkışı için' },
          { id: 'ks-2', name: 'Oturma Tipi Harnes (Seat Harness)', spec: 'Beli zorlamayan alt destek' },
          { id: 'ks-3', name: 'Yüksek Yüzdürmeli Can Yeleği & Kask', spec: 'Su üstü güvenlik' },
          { id: 'ks-4', name: 'Otomatik Bırakmalı Kitesurf Barı', spec: 'Çift güvenlik leashi' }
        ],
        medication: {
          essential: [
            { id: 'ks-med-1', name: 'Suya Dayanıklı Güneş Kremi (SPF 50+)', desc: 'Yoğun güneş yansıması koruması.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Orta': {
        mandatory: [
          { id: 'ks-1', name: 'Kitesurf Uçurtma (9m/12m Set)', spec: 'Rüzgara uygun' },
          { id: 'ks-2', name: 'Bar & 24m İp Seti', spec: 'Leash kiti' },
          { id: 'ks-3', name: 'Bel Harnesi', spec: 'Kanca korumalı' },
          { id: 'ks-4', name: 'Darbe Yeleği & Kask', spec: 'Yüzdürme destekli' }
        ],
        medication: {
          essential: [
            { id: 'ks-med-1', name: 'Güneş Kremi & Kulak Damlası', desc: 'Rüzgar ve su koruması.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Prof': {
        mandatory: [
          { id: 'ks-1-pro', name: 'Karbon Foil Tahtası & Hydrofoil', spec: 'Düşük rüzgarda su üstü uçuş' },
          { id: 'ks-2-pro', name: 'C-Kite Big Air Uçurtması', spec: 'Yüksek atlama ve megaloop performansı' },
          { id: 'ks-3-pro', name: 'Sert Karbon Spreader Bel Harnesi', spec: 'Maksimum yük dağılımı' }
        ],
        medication: {
          essential: [
            { id: 'ks-med-pro-1', name: 'Tuzlu Su Göz Tahriş Damlası', desc: 'Yüksek sürat ve sprey için.' }
          ],
          optional: []
        },
        alternatives: []
      }
    }
  },
  'mtb-downhill': {
    levels: {
      'Acemi': {
        mandatory: [
          { id: 'mtb-1', name: 'Full-Face Kask & Çene Koruması', spec: 'ASTM sertifikalı' },
          { id: 'mtb-2', name: 'Yumuşak D3O Göğüs & Sırt Zırhı', spec: 'Hareketi kısıtlamayan esnek yapı' },
          { id: 'mtb-3', name: 'Kalın Pedli Dizlik ve Dirseklik', spec: 'Sert plastik dış kabuk' },
          { id: 'mtb-4', name: 'Düz Taban MTB Ayakkabısı', spec: 'Pedala yapışan kauçuk taban' }
        ],
        medication: {
          essential: [
            { id: 'mtb-med-1', name: 'Çamur & Yara Dezenfektanı', desc: 'Düşme çiziklerine ilk müdahale.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Orta': {
        mandatory: [
          { id: 'mtb-1', name: 'Full-Face Downhill Kask', spec: 'Çene korumalı' },
          { id: 'mtb-2', name: 'Gövde & Göğüs Zırhı', spec: 'Omurga korumalı' },
          { id: 'mtb-3', name: 'Diz & Dirsek Pedleri', spec: 'Darbe emici' },
          { id: 'mtb-4', name: 'MTB Gözlük (Goggle)', spec: 'Çamur korumalı' }
        ],
        medication: {
          essential: [
            { id: 'mtb-med-1', name: 'Antiseptik & Soğutucu Sprey', desc: 'Ani ödem ve düşme yarası.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Prof': {
        mandatory: [
          { id: 'mtb-1-pro', name: 'Karbon Fiber DH Yarış Kaskı (MIPS)', spec: 'En hafif ve güvenli baş koruması' },
          { id: 'mtb-2-pro', name: 'Neck Brace (Boyun Koruması)', spec: 'Omurga ve boyun kırılma engelleyici' },
          { id: 'mtb-3-pro', name: 'Telemetri & Havalı Süspansiyon Kitleri', spec: 'Parkur verisi okuyucu sensörler' }
        ],
        medication: {
          essential: [
            { id: 'mtb-med-pro-1', name: 'Hızlı Travma Bandajı & Atel', desc: 'Şiddetli düşmelerde kırık/çıkık sabitleme.' }
          ],
          optional: []
        },
        alternatives: []
      }
    }
  },
  'scuba': {
    levels: {
      'Acemi': {
        mandatory: [
          { id: 'sc-1', name: 'Büyük Ekranlı Kolay Dalış Bilgisayarı', spec: 'Basit deko ve derinlik uyarısı' },
          { id: 'sc-2', name: 'Yüksek Kaldırma Kuvvetli BCD Yeleği', spec: 'Kolay dengeleme' },
          { id: 'sc-3', name: 'Temperli Cam Geniş Görüş Maskesi', spec: 'Su tahliye valfli' },
          { id: 'sc-4', name: 'Yedek Ahtapotlu Regülatör Seti', spec: 'Sarı renk yedek ağızlık' }
        ],
        medication: {
          essential: [
            { id: 'sc-med-1', name: 'Burun & Kulak Eşitleme Spreyi', desc: 'Basınç dengelemeyi kolaylaştırır.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Orta': {
        mandatory: [
          { id: 'sc-1', name: 'Dalış Bilgisayarı (Wrist Computer)', spec: 'Dekompresyon takibi' },
          { id: 'sc-2', name: 'Regülatör & Ahtapot Seti', spec: 'Yedek hava kaynağı' },
          { id: 'sc-3', name: 'BCD (Denge Yeleği)', spec: 'Enflatör entegre' },
          { id: 'sc-4', name: 'Maske, Şnorkel & Palet Seti', spec: 'Temperli cam' }
        ],
        medication: {
          essential: [
            { id: 'sc-med-1', name: 'Östaki Borusu Spreyi & Deniz Anası Jeli', desc: 'Kulak ve deniz Canlısı teması.' }
          ],
          optional: []
        },
        alternatives: []
      },
      'Prof': {
        mandatory: [
          { id: 'sc-1-pro', name: 'Trimix / Nitrox Teknik Dalış Bilgisayarı', spec: 'Çoklu gaz karışımı ve kapalı devre kaplama' },
          { id: 'sc-2-pro', name: 'Kanat Tipi BCD & Backplate Plaka', spec: 'Teknik dalış duruş ergonomisi' },
          { id: 'sc-3-pro', name: 'Çift Tüp Manifold Regülatör Seti', spec: 'Derin ve batan batık dalışları için' }
        ],
        medication: {
          essential: [
            { id: 'sc-med-pro-1', name: 'Acil Durum Oksijen İlkyardım Kiti', desc: 'Vurgun ve dekompresyon rahatsızlıkları için.' }
          ],
          optional: []
        },
        alternatives: []
      }
    }
  }
};

const DEFAULT_PROFILE = {
  name: 'Kaan Yılmaz',
  title: 'Extreme Spor Tutkunu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 'Orta Düzey (Intermediate)',
  experiencePoints: 1420,
  verifiedCount: 14,
  profileCompleteness: 85,
  bloodType: 'A Rh+',
  emergencyContact: '+90 532 555 0199',
  medicalNotes: 'Arı sokmasına karşı hafif alerji (EpiPen taşır), Sol ayak bileğinde geçmiş bağ yaralanması.',
  completedEvents: [
    { id: 1, title: 'Cappadocia Ultra Trail 38K', date: '14 Ekim 2025', sport: 'Ultra Trail', status: 'Onaylandı (+1)', badge: '🏃‍♂️' },
    { id: 2, title: 'Fethiye Ölüdeniz Yelkenkanat İnişi', date: '04 Ağustos 2025', sport: 'Yamaç Paraşütü', status: 'Onaylandı (+1)', badge: '🪂' },
    { id: 3, title: 'Geyikbayırı Solo Tırmanış Etabı', date: '12 Mayıs 2025', sport: 'Kaya Tırmanışı', status: 'Onaylandı (+1)', badge: '🧗‍♂️' },
    { id: 4, title: 'Alaçatı Kitesurf Fest', date: '22 Temmuz 2024', sport: 'Kitesurfing', status: 'Onaylandı (+1)', badge: '🏄‍♂️' }
  ]
};

const ROUTE_SAMPLE = [
  { step: 'Start: Babadağ Zirve (1700m)', time: '09:00', temp: '14°C', wind: '18 km/s GB', status: 'Uygun', icon: Sun },
  { step: 'CP 1: Butterfly Valley Geçidi', time: '10:30', temp: '19°C', wind: '26 km/s BGB', status: 'Dikkat (Rüzgar Artışı)', icon: Wind },
  { step: 'CP 2: Kabak Koyu Teras', time: '12:15', temp: '23°C', wind: '14 km/s G', status: 'Mükemmel', icon: Sun },
  { step: 'Finish: Ölüdeniz Sahil', time: '13:45', temp: '25°C', wind: '10 km/s GD', status: 'Uygun', icon: Sun }
];

export default function App() {
  // Navigation & Screen View States
  const [selectedSportId, setSelectedSportId] = useState(null); // NULL means no sport selected yet!
  const [viewMode, setViewMode] = useState('equipment'); // 'equipment' | 'weather'
  const [userSkillLevel, setUserSkillLevel] = useState('Orta');
  
  // Modals & Drawers
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBagDrawer, setShowBagDrawer] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // Packed Gear / Cart State keyed by sport: { [sportId]: { [itemId]: boolean } }
  const [packedGearBySport, setPackedGearBySport] = useState({});
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  // Weather Screen States
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [customRouteName, setCustomRouteName] = useState('Fethiye - Babadağ Trail & Flight Line');
  const [waypoints, setWaypoints] = useState(ROUTE_SAMPLE);
  const [newCheckpointName, setNewCheckpointName] = useState('');

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventSport, setNewEventSport] = useState('Ultra Trail');

  // Currently Active Sport Config
  const activeSportObj = useMemo(() => {
    return EXTREME_SPORTS.find(s => s.id === selectedSportId) || null;
  }, [selectedSportId]);

  // LEVEL-BASED CURRENT SPORT DATA RESOLUTION
  const currentSportData = useMemo(() => {
    if (!selectedSportId) return null;
    const sportInfo = GEAR_DATABASE[selectedSportId] || GEAR_DATABASE['ultra-trail'];
    const levelKey = userSkillLevel || 'Orta';
    
    // Fallback to 'Orta' if level key isn't directly present
    return sportInfo.levels?.[levelKey] || sportInfo.levels?.['Orta'];
  }, [selectedSportId, userSkillLevel]);

  // BAG PACKED STATS
  const bagStats = useMemo(() => {
    if (!selectedSportId || !currentSportData) return { packed: 0, total: 0, isComplete: false };
    
    const currentSportPacked = packedGearBySport[selectedSportId] || {};
    const mandatoryItems = currentSportData.mandatory || [];
    const essentialMeds = currentSportData.medication?.essential || [];
    const totalRequired = mandatoryItems.length + essentialMeds.length;

    let packedCount = 0;
    mandatoryItems.forEach(item => { if (currentSportPacked[item.id]) packedCount++; });
    essentialMeds.forEach(med => { if (currentSportPacked[med.id]) packedCount++; });

    return {
      packed: packedCount,
      total: totalRequired,
      isComplete: totalRequired > 0 && packedCount === totalRequired
    };
  }, [selectedSportId, currentSportData, packedGearBySport]);

  const handlePackItem = (itemId) => {
    if (!selectedSportId) return;
    setPackedGearBySport(prev => ({
      ...prev,
      [selectedSportId]: {
        ...prev[selectedSportId],
        [itemId]: !prev[selectedSportId]?.[itemId]
      }
    }));
  };

  const handleAddWaypoint = () => {
    if (!newCheckpointName.trim()) return;
    const newPoint = {
      step: newCheckpointName,
      time: '14:30',
      temp: '22°C',
      wind: '16 km/s K',
      status: 'Uygun',
      icon: Sun
    };
    setWaypoints([...waypoints, newPoint]);
    setNewCheckpointName('');
  };

  const handleAddVerifiedEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvt = {
      id: Date.now(),
      title: newEventTitle,
      date: 'Bugün',
      sport: newEventSport,
      status: 'Onaylandı (+1)',
      badge: '🏆'
    };

    setProfile(prev => ({
      ...prev,
      verifiedCount: prev.verifiedCount + 1,
      experiencePoints: prev.experiencePoints + 150,
      completedEvents: [newEvt, ...prev.completedEvents]
    }));

    setNewEventTitle('');
    setShowAddEventModal(false);
  };

  // Default All-in-One Nature Background Image for Unselected View
  const defaultNatureBg = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80';
  const currentBgImage = activeSportObj ? activeSportObj.bgImage : defaultNatureBg;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start font-sans antialiased p-0 sm:p-4 selection:bg-red-500 selection:text-white">
      {/* Outer Mobile Wrapper Frame */}
      <div className={`w-full max-w-md min-h-screen sm:min-h-[880px] sm:max-h-[920px] sm:rounded-3xl shadow-2xl border border-slate-800/80 flex flex-col overflow-hidden relative transition-all duration-700`}>
        
        {/* ==================== DYNAMIC NATURE BACKGROUND WITH BLEND OVERLAY ==================== */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url(${currentBgImage})` }}
        ></div>
        
        {/* Nature Blend Overlay with App Core Colors (Red, Brown, Green, Blue) */}
        <div className={`absolute inset-0 bg-gradient-to-b ${
          activeSportObj 
            ? activeSportObj.theme.bgGradient 
            : 'from-slate-950/90 via-[#3A1412]/85 via-40% to-[#0F291E]/90'
        } backdrop-blur-[3px] transition-all duration-700`}></div>

        {/* ==================== APP CONTENT WRAPPER ==================== */}
        <div className="relative z-10 flex flex-col h-full flex-1 overflow-hidden">
          
          {/* TOP BAR */}
          <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 p-3.5 sticky top-0 z-30 flex items-center justify-between">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 p-1.5 pr-3 rounded-full border border-slate-700/60 transition shadow-md group"
            >
              <img src={profile.avatar} alt="Profile" className="w-7 h-7 rounded-full object-cover ring-2 ring-red-500/50 group-hover:ring-emerald-400 transition" />
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200 leading-none">{profile.name.split(' ')[0]}</div>
                <div className="text-[9px] text-amber-400 font-mono leading-none mt-0.5">+{profile.verifiedCount} EXP</div>
              </div>
            </button>

            <div className="text-center">
              <h1 className="font-black text-base tracking-wider bg-gradient-to-r from-red-400 via-amber-200 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
                GEARGRID
              </h1>
              <div className="text-[9px] text-sky-300/80 font-semibold tracking-widest uppercase flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> EXTREME ENGINE
              </div>
            </div>

            <button 
              onClick={() => setShowSettingsModal(true)}
              className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full border border-slate-700/60 transition shadow-md"
              title="Ayarlar"
            >
              <Settings className="w-4 h-4" />
            </button>
          </header>

          {/* MODE SWITCHER */}
          <div className="bg-slate-950/70 backdrop-blur-md border-b border-slate-800/60 p-2.5 flex items-center justify-between px-4 z-20">
            <div className="flex gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button 
                onClick={() => setViewMode('equipment')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                  viewMode === 'equipment' 
                    ? 'bg-gradient-to-r from-red-600 to-emerald-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Ekipman Motoru
              </button>
              <button 
                onClick={() => setViewMode('weather')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                  viewMode === 'weather' 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Hava & Rota
              </button>
            </div>

            {selectedSportId && (
              <button
                onClick={() => setShowBagDrawer(true)}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition shadow-lg ${
                  bagStats.isComplete 
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-bounce' 
                    : 'bg-slate-900/90 text-amber-400 border-amber-500/40 hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Çanta</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${bagStats.isComplete ? 'bg-slate-950 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {bagStats.packed}/{bagStats.total}
                </span>
              </button>
            )}
          </div>

          {/* MAIN SCROLLABLE AREA */}
          <main className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar pb-10 relative z-10">
            
            {viewMode === 'equipment' && (
              <div className="space-y-4">
                
                {/* SPORTS SELECTION GRID */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 shadow-sm">
                      <Compass className="w-3.5 h-3.5 text-red-400" /> Extreme Spor Seçiniz
                    </h2>
                    {selectedSportId && (
                      <button 
                        onClick={() => setSelectedSportId(null)} 
                        className="text-[10px] text-sky-300 hover:underline flex items-center gap-0.5 bg-slate-950/60 px-2 py-1 rounded-md"
                      >
                        <ArrowLeft className="w-3 h-3" /> Seçimi Sıfırla
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {EXTREME_SPORTS.map((sport) => {
                      const isSelected = sport.id === selectedSportId;
                      const isOtherSelected = selectedSportId && !isSelected;

                      return (
                        <button
                          key={sport.id}
                          onClick={() => setSelectedSportId(sport.id)}
                          className={`p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-md ${
                            isSelected 
                              ? `${sport.theme.badgeBg} border-2 ${sport.theme.border} shadow-2xl scale-[1.02] ring-2 ring-white/30` 
                              : isOtherSelected 
                                ? 'bg-slate-950/40 border-slate-800/80 opacity-40 hover:opacity-80 grayscale-[40%]' 
                                : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800/90 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{sport.icon}</span>
                            <span className="text-[9px] uppercase tracking-wider font-bold opacity-80 px-1.5 py-0.5 rounded bg-slate-950/60">
                              {sport.category}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-bold leading-tight drop-shadow">{sport.name}</div>
                          </div>

                          {isSelected && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* UNSELECTED LANDING DISPLAY */}
                {!selectedSportId && (
                  <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 text-center space-y-3 shadow-2xl my-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-red-500/20 via-emerald-500/20 to-sky-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400 border border-slate-700">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Henüz Bir Spor Seçilmedi</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                        Doğa görseli arka planda dinamikleşecek şekilde istediğiniz extreme spora dokunun. Seviyenize göre (Acemi, Orta, Pro) özelleşmiş ekipmanlar anında yüklenecektir.
                      </p>
                    </div>
                  </div>
                )}

                {/* REVEALED EQUIPMENT ENGINE (DYNAMIC LEVEL DRIVEN) */}
                {selectedSportId && currentSportData && (
                  <div className="space-y-4 animate-fadeIn">
                    
                    {/* DYNAMIC LEVEL SELECTOR BAR */}
                    <div className={`p-3.5 rounded-2xl border ${activeSportObj?.theme.badgeBg} backdrop-blur-md flex items-center justify-between shadow-xl`}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{activeSportObj?.icon}</span>
                        <div>
                          <h3 className="text-xs font-extrabold text-white drop-shadow">{activeSportObj?.name}</h3>
                          <p className="text-[10px] opacity-90 text-amber-300 font-semibold">
                            {userSkillLevel} Düzey Ekipman Seti
                          </p>
                        </div>
                      </div>

                      {/* LEVEL SWITCHER BUTTONS */}
                      <div className="flex gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-700 text-[10px]">
                        {['Acemi', 'Orta', 'Prof'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setUserSkillLevel(lvl)}
                            className={`px-2 py-1 rounded-md font-bold transition ${
                              userSkillLevel === lvl 
                                ? 'bg-gradient-to-r from-red-500 to-emerald-500 text-white shadow-md scale-105' 
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* LEVEL EXPLANATION BADGE */}
                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl flex items-center gap-2 text-[11px] text-slate-300">
                      <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span>
                        {userSkillLevel === 'Acemi' && '⚠️ Acemi Modu: Güvenlik takviyeli, korumalı ve temel kitler önceliklendirildi.'}
                        {userSkillLevel === 'Orta' && '⚡ Orta Düzey: Performans ve standart teknik donanım dengelendi.'}
                        {userSkillLevel === 'Prof' && '🔥 Pro Modu: İleri seviye teknik cihazlar, hafifletilmiş ürünler ve özel sağlık kiti aktif.'}
                      </span>
                    </div>

                    {/* 1. MANDATORY EQUIPMENT */}
                    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-slate-800 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                            {userSkillLevel} Zorunlu Ekipmanlar
                          </h3>
                        </div>
                        <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                          Zorunlu
                        </span>
                      </div>

                      <div className="space-y-2">
                        {currentSportData.mandatory.map((item) => {
                          const isPacked = packedGearBySport[selectedSportId]?.[item.id];
                          return (
                            <div 
                              key={item.id}
                              onClick={() => handlePackItem(item.id)}
                              className={`p-3 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                                isPacked 
                                  ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-400 opacity-60' 
                                  : 'bg-slate-800/80 border-slate-700/60 hover:border-slate-500 text-slate-200'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                                  isPacked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600 bg-slate-900'
                                }`}>
                                  {isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <div>
                                  <div className={`text-xs font-semibold ${isPacked ? 'line-through' : ''}`}>
                                    {item.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{item.spec}</div>
                                </div>
                              </div>

                              <button className={`text-[10px] font-bold px-2 py-1 rounded-lg transition ${
                                isPacked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}>
                                {isPacked ? 'Çantada ✓' : '+ Çantaya At'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. MEDICATIONS & HEALTH */}
                    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-slate-800 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                            {userSkillLevel} Sağlık & İlaç Reçetesi
                          </h3>
                        </div>
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                          Özel Protokol
                        </span>
                      </div>

                      {/* KESİN ALINMASI GEREKENLER */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Kesin Alınması Gereken İlaçlar
                        </h4>
                        {currentSportData.medication.essential.map((med) => {
                          const isPacked = packedGearBySport[selectedSportId]?.[med.id];
                          return (
                            <div 
                              key={med.id}
                              onClick={() => handlePackItem(med.id)}
                              className={`p-3 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                                isPacked 
                                  ? 'bg-emerald-950/30 border-emerald-500/40 opacity-60' 
                                  : 'bg-slate-800/60 border-amber-500/30 hover:border-amber-500/60'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                                  isPacked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-amber-500/60 bg-slate-900'
                                }`}>
                                  {isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <div>
                                  <div className={`text-xs font-semibold ${isPacked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                    {med.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{med.desc}</div>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-2 py-1 rounded-md">
                                {isPacked ? 'Eklendi' : 'Kesin'}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* İSTEKSEL İLAÇLAR */}
                      {currentSportData.medication.optional.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-sky-400" /> İsteksel / Opsiyonel Sağlık Ürünleri
                          </h4>
                          {currentSportData.medication.optional.map((med) => (
                            <div key={med.id} className="bg-slate-800/40 border border-slate-700/50 p-2.5 rounded-xl">
                              <div className="text-xs font-semibold text-slate-300">{med.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{med.desc}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. GEAR ALTERNATIVES */}
                    {currentSportData.alternatives && currentSportData.alternatives.length > 0 && (
                      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 shadow-lg backdrop-blur-md">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-purple-400" />
                          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Bütçe Dostu Ekipman Alternatifleri</h3>
                        </div>
                        <div className="space-y-2">
                          {currentSportData.alternatives.map((alt, idx) => (
                            <div key={idx} className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 line-through">{alt.core}</span>
                                <span className="text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
                                  {alt.budgetDiff}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                                <span>Önerilen Alternatif: {alt.alt}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* ROUTE & WEATHER FORECAST VIEW */}
            {viewMode === 'weather' && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* Route Input & Mode Controls */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-sky-400" /> Güzergah & Konum Modu
                    </span>
                    
                    {/* GPS Toggle Switch */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
                      <button 
                        onClick={() => setGpsEnabled(true)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${gpsEnabled ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
                      >
                        Anlık GPS
                      </button>
                      <button 
                        onClick={() => setGpsEnabled(false)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition ${!gpsEnabled ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
                      >
                        Manuel Rota
                      </button>
                    </div>
                  </div>

                  {!gpsEnabled ? (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[10px] font-semibold text-slate-400">Etkinlik / Parkur Hat Adı</label>
                      <input 
                        type="text" 
                        value={customRouteName}
                        onChange={(e) => setCustomRouteName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                        placeholder="Örn: Uludağ Zirve Tırmanış Rotaları"
                      />
                    </div>
                  ) : (
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-sky-500/30 text-xs text-slate-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-sky-400 animate-bounce" />
                        <span>GPS Konum İzni Verildi</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">Hata: &lt;3m</span>
                    </div>
                  )}
                </div>

                {/* Weather Warning Notification */}
                <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-2xl backdrop-blur-md flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-300">Rüzgar Uyarısı</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      CP1 (Butterfly Valley) geçidinde saat 10:30 sonrasında türbülanslı yan rüzgar hızı 26 km/s üzerine çıkacaktır. Yamaç paraşütü ve dar sırt geçişlerinde dikkatli olun.
                    </p>
                  </div>
                </div>

                {/* Waypoint Timeline Weather Forecast */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-400" />
                      Tahmini Güzergah Saatlik Tablo
                    </h3>
                    <span className="text-[10px] text-slate-400">{waypoints.length} Durak Planlandı</span>
                  </div>

                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-700/60">
                    {waypoints.map((point, index) => {
                      return (
                        <div key={index} className="relative flex items-start gap-3 pl-8">
                          <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-sky-400 border-2 border-slate-900 ring-2 ring-sky-400/20"></div>
                          <div className="flex-1 bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-200">{point.step}</span>
                              <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md">
                                {point.time}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-1">
                              <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg text-[11px]">
                                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                                <span className="font-semibold text-slate-200">{point.temp}</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg text-[11px]">
                                <Wind className="w-3.5 h-3.5 text-sky-400" />
                                <span className="font-semibold text-slate-200">{point.wind}</span>
                              </div>
                              <div className="flex items-center justify-center bg-slate-950/60 p-1.5 rounded-lg text-[10px] font-medium text-emerald-400">
                                {point.status}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Checkpoint Input */}
                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <input 
                      type="text" 
                      value={newCheckpointName}
                      onChange={(e) => setNewCheckpointName(e.target.value)}
                      placeholder="Yeni Durak / Checkpoint Ekle..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                    />
                    <button 
                      onClick={handleAddWaypoint}
                      className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition"
                    >
                      <Plus className="w-4 h-4" /> Ekle
                    </button>
                  </div>
                </div>

              </div>
            )}

          </main>

          {/* ==================== MODAL 1: INTERACTIVE BAG / ÇANTA DRAWER ==================== */}
          {showBagDrawer && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col justify-end animate-fadeIn">
              <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl max-h-[85%] flex flex-col overflow-hidden shadow-2xl">
                
                {/* Drawer Header */}
                <div className={`p-4 border-b border-slate-800 flex items-center justify-between ${bagStats.isComplete ? 'bg-emerald-950/40' : ''}`}>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${bagStats.isComplete ? 'bg-emerald-500 text-slate-950 animate-bounce' : 'bg-amber-500/20 text-amber-400'}`}>
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">Ekipman Çantası (Sepet)</h3>
                      <p className="text-[11px] text-slate-400">
                        {activeSportObj ? activeSportObj.name : 'Spor Seçilmedi'}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowBagDrawer(false)}
                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Banner */}
                <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Hazırlık Durumu</span>
                    <span className={bagStats.isComplete ? 'text-emerald-400' : 'text-amber-400'}>
                      %{Math.round((bagStats.packed / (bagStats.total || 1)) * 100)} Tamamlandı
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${bagStats.isComplete ? 'bg-emerald-400' : 'bg-gradient-to-r from-red-500 to-amber-400'}`}
                      style={{ width: `${Math.min(100, (bagStats.packed / (bagStats.total || 1)) * 100)}%` }}
                    ></div>
                  </div>

                  {/* GREEN COMPLETION CELEBRATION */}
                  {bagStats.isComplete && (
                    <div className="bg-emerald-500 text-slate-950 font-extrabold text-xs p-2.5 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg animate-pulse">
                      <PackageCheck className="w-4 h-4" /> TÜM ZORUNLU EKİPMANLAR HAZIR! 🎉
                    </div>
                  )}
                </div>

                {/* Items List in Bag */}
                <div className="p-4 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
                  {(!selectedSportId || bagStats.packed === 0) ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      Çantaya henüz hiçbir zorunlu ekipman veya ilaç eklenmedi.
                    </div>
                  ) : (
                    <>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Çantadakiler</h4>
                      {currentSportData?.mandatory.filter(i => packedGearBySport[selectedSportId]?.[i.id]).map(item => (
                        <div key={item.id} className="bg-slate-800/90 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-slate-200 font-medium">📦 {item.name}</span>
                          <button 
                            onClick={() => handlePackItem(item.id)}
                            className="text-[10px] text-red-400 hover:underline"
                          >
                            Çıkar
                          </button>
                        </div>
                      ))}
                      {currentSportData?.medication.essential.filter(m => packedGearBySport[selectedSportId]?.[m.id]).map(med => (
                        <div key={med.id} className="bg-slate-800/90 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-slate-200 font-medium">💊 {med.name}</span>
                          <button 
                            onClick={() => handlePackItem(med.id)}
                            className="text-[10px] text-red-400 hover:underline"
                          >
                            Çıkar
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950">
                  <button 
                    onClick={() => setShowBagDrawer(false)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs"
                  >
                    Kapat
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ==================== MODAL 2: USER PROFILE SCREEN ==================== */}
          {showProfileModal && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col p-4 overflow-y-auto custom-scrollbar animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl my-auto">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-red-400" />
                    <h3 className="text-sm font-bold text-slate-100">Sporcu Profili</h3>
                  </div>
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* User Avatar Card */}
                <div className="text-center space-y-2">
                  <img src={profile.avatar} alt="Profile" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-red-500/40 mx-auto shadow-lg" />
                  <div>
                    <h2 className="text-base font-extrabold text-slate-100">{profile.name}</h2>
                    <p className="text-xs text-slate-400">{profile.title} • <span className="text-emerald-400">{profile.level}</span></p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-center">
                    <div className="text-lg font-black text-amber-400">{profile.verifiedCount}</div>
                    <div className="text-[9px] text-slate-400 font-medium">Onaylı (+1)</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-center">
                    <div className="text-lg font-black text-sky-400">%{profile.profileCompleteness}</div>
                    <div className="text-[9px] text-slate-400 font-medium">Profil Skoru</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-center">
                    <div className="text-lg font-black text-emerald-400">{profile.experiencePoints}</div>
                    <div className="text-[9px] text-slate-400 font-medium">GG Puanı</div>
                  </div>
                </div>

                {/* Medical File */}
                <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-red-400">
                    <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Medikal Künye</span>
                    <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono">Kan: {profile.bloodType}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{profile.medicalNotes}</p>
                  <div className="text-[10px] text-slate-400 border-t border-slate-700/50 pt-1.5">
                    <strong>Acil Durum İrtibat:</strong> {profile.emergencyContact}
                  </div>
                </div>

                {/* Completed Events Log with (+1) Verification System */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-400" /> Onaylı Geçmiş Etkinlikler
                    </h4>
                    <button 
                      onClick={() => setShowAddEventModal(true)}
                      className="text-[10px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Etkinlik (+1)
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                    {profile.completedEvents.map((evt) => (
                      <div key={evt.id} className="bg-slate-800/80 p-2 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>{evt.badge}</span>
                          <div>
                            <div className="font-bold text-slate-200">{evt.title}</div>
                            <div className="text-[9px] text-slate-400">{evt.date}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                          {evt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== MODAL 3: SETTINGS (AYARLAR) ==================== */}
          {showSettingsModal && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col p-4 overflow-y-auto custom-scrollbar animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl my-auto">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-sky-400" />
                    <h3 className="text-sm font-bold text-slate-100">GearGrid Ayarları</h3>
                  </div>
                  <button 
                    onClick={() => setShowSettingsModal(false)}
                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  
                  {/* Setting Row 1 */}
                  <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span>Hava Durumu ve Rüzgar Bildirimleri</span>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                  </div>

                  {/* Setting Row 2 */}
                  <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Sesli Vario / GPS İkazları</span>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                  </div>

                  {/* Setting Row 3 */}
                  <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-sky-400" />
                      <span>Otomatik Tema Geçişleri</span>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                  </div>

                  {/* Info Block */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span>GearGrid v2.4 Extreme Engine • Çevrimdışı Harita İndirmeleri Aktif</span>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ==================== MODAL 4: ADD EVENT MODAL (+1) ==================== */}
          {showAddEventModal && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-400" /> Tamamlanan Etkinlik Onayı (+1)
                  </h3>
                  <button 
                    onClick={() => setShowAddEventModal(false)}
                    className="text-slate-400 hover:text-slate-200 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddVerifiedEvent} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Etkinlik / Yarış Adı</label>
                    <input 
                      type="text" 
                      required
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Örn: Kaş Open Water & Deep Dive"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Spor Kategorisi</label>
                    <select 
                      value={newEventSport}
                      onChange={(e) => setNewEventSport(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                    >
                      {EXTREME_SPORTS.map(s => (
                        <option key={s.id} value={s.name.split(' ')[0]}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-xl text-[10px] text-emerald-300">
                    ⚡ Etkinlik kaydı doğrudan GPS/Strava sistemi veya organizatör koduyla doğrulanarak (+1) onay alacaktır.
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowAddEventModal(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-xl"
                    >
                      İptal
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2 rounded-xl shadow-lg shadow-emerald-500/20"
                    >
                      Onayla & Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}