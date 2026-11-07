import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
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
  User,
  Settings,
  X,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// --- SPORTS DATA ---
const EXTREME_SPORTS = [
  {
    id: 'ultra-trail',
    name: 'Ultra Trail & Dağ Koşusu',
    icon: '🏃‍♂️',
    category: 'Kara',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
    themeColor: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
  },
  {
    id: 'paragliding',
    name: 'Yamaç Paraşütü (Paragliding)',
    icon: '🪂',
    category: 'Hava',
    bgImage: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=1000&auto=format&fit=crop&q=80',
    themeColor: '#0284c7',
    badgeBg: 'rgba(2, 132, 199, 0.2)',
  },
  {
    id: 'rock-climbing',
    name: 'Kaya Tırmanışı / Bouldering',
    icon: '🧗‍♂️',
    category: 'Kara',
    bgImage: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1000&auto=format&fit=crop&q=80',
    themeColor: '#ef4444',
    badgeBg: 'rgba(239, 68, 68, 0.2)',
  },
  {
    id: 'kitesurf',
    name: 'Windsurf & Kitesurfing',
    icon: '🏄‍♂️',
    category: 'Su',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    themeColor: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.2)',
  },
  {
    id: 'mtb-downhill',
    name: 'Downhill MTB (Dağ Bisikleti)',
    icon: '🚵‍♂️',
    category: 'Kara',
    bgImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&auto=format&fit=crop&q=80',
    themeColor: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
  },
  {
    id: 'scuba',
    name: 'Derin Dalış (Scuba Diving)',
    icon: '🪸',
    category: 'Su',
    bgImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80',
    themeColor: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.2)',
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
        }
      },
      'Orta': {
        mandatory: [
          { id: 'ut-1', name: 'Arazi Koşu Ayakkabısı (Grip Taban)', spec: 'Vibram Megagrip, su tahliyeli' },
          { id: 'ut-2', name: 'Hidrasyon Yeleği (1.5L Sıvı)', spec: 'Esnek matara hazneli' },
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
        }
      },
      'Prof': {
        mandatory: [
          { id: 'ut-1-pro', name: 'Karbon Plakalı Trail Ayakkabısı', spec: 'Minimum ağırlık, maksimum tepki' },
          { id: 'ut-2-pro', name: 'Ultra-Light 5L Yelek + Soft Flask', spec: 'Ağırlıksız yarış ergonomisi' },
          { id: 'ut-3-pro', name: 'GPS Uydu Mayın / Beacon Transmitter', spec: 'Anlık uydu takip ve SOS sinyali' },
          { id: 'ut-4-pro', name: '900 Lümen Profesyonel Kafa Lambası', spec: 'Otomatik sensörlü parlaklık ayarı' }
        ],
        medication: {
          essential: [
            { id: 'ut-med-pro-1', name: 'Konsantre Glikoz & Elektrolit Shot', desc: 'Anında kan şekeri yüklemesi.' },
            { id: 'ut-med-pro-2', name: 'Laktik Asit Bloker', desc: 'Uzun etap performans koruması.' }
          ],
          optional: []
        }
      }
    }
  },
  'paragliding': {
    levels: {
      'Acemi': {
        mandatory: [
          { id: 'pg-1', name: 'EN-A Sınıfı Güvenli Başlangıç Kanadı', spec: 'Maksimum kapanma direnci' },
          { id: 'pg-2', name: 'Hava Yastıklı Harnes (Airbag)', spec: '17cm Kalın koruma köpüğü' },
          { id: 'pg-3', name: 'Yedek Paraşüt', spec: 'Kolay açılma mekanizmalı' }
        ],
        medication: {
          essential: [
            { id: 'pg-med-1', name: 'Hareket / Uçuş Bulantı Hapı', desc: 'Türbülanslı havalarda mide bulantısını engeller.' }
          ],
          optional: []
        }
      },
      'Orta': {
        mandatory: [
          { id: 'pg-1', name: 'EN-B Sınıfı Performans Kanadı', spec: 'Termik performanslı' },
          { id: 'pg-2', name: 'Standart Oturma Harnesi', spec: 'Sırt korumalı' },
          { id: 'pg-3', name: 'Vario & Kask Seti', spec: 'Yükseklik ölçer sesli vario' }
        ],
        medication: {
          essential: [
            { id: 'pg-med-1', name: 'Bulantı Önleyici Hap', desc: 'Uçuş tutmasını önler.' }
          ],
          optional: []
        }
      },
      'Prof': {
        mandatory: [
          { id: 'pg-1-pro', name: 'EN-D / CCC Yarış Kanadı', spec: 'Yüksek süzülme ve hız katsayısı' },
          { id: 'pg-2-pro', name: 'Aerodinamik Pod Yarış Harnesi', spec: 'Tam kapalı gövde ergonomisi' }
        ],
        medication: {
          essential: [
            { id: 'pg-med-pro-1', name: 'Oksijen Takviye Spreyi', desc: '3000m+ irtifa uçuşları için hipoksi önleyici.' }
          ],
          optional: []
        }
      }
    }
  }
};

const DEFAULT_PROFILE = {
  name: 'Kaan Yılmaz',
  title: 'Extreme Spor Tutkunu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 'Orta Düzey (Intermediate)',
  verifiedCount: 14,
  bloodType: 'A Rh+',
  emergencyContact: '+90 532 555 0199',
  medicalNotes: 'Arı sokmasına karşı hafif alerji (EpiPen taşır).',
  completedEvents: [
    { id: 1, title: 'Cappadocia Ultra Trail 38K', date: '14 Ekim 2025', sport: 'Ultra Trail' },
    { id: 2, title: 'Fethiye Ölüdeniz Yelkenkanat İnişi', date: '04 Ağustos 2025', sport: 'Yamaç Paraşütü' }
  ]
};

const ROUTE_SAMPLE = [
  { step: 'Start: Babadağ Zirve (1700m)', time: '09:00', temp: '14°C', wind: '18 km/s GB', status: 'Uygun' },
  { step: 'CP 1: Butterfly Valley Geçidi', time: '10:30', temp: '19°C', wind: '26 km/s BGB', status: 'Rüzgarlı' },
  { step: 'Finish: Ölüdeniz Sahil', time: '13:45', temp: '25°C', wind: '10 km/s GD', status: 'Mükemmel' }
];

export default function App() {
  const [selectedSportId, setSelectedSportId] = useState(null);
  const [viewMode, setViewMode] = useState('equipment'); // 'equipment' | 'weather'
  const [userSkillLevel, setUserSkillLevel] = useState('Orta');

  // Modals & Drawers
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBagDrawer, setShowBagDrawer] = useState(false);

  // Packed Gear State: { [sportId]: { [itemId]: boolean } }
  const [packedGearBySport, setPackedGearBySport] = useState({});
  const [profile] = useState(DEFAULT_PROFILE);

  const activeSportObj = useMemo(() => {
    return EXTREME_SPORTS.find((s) => s.id === selectedSportId) || null;
  }, [selectedSportId]);

  const currentSportData = useMemo(() => {
    if (!selectedSportId) return null;
    const sportInfo = GEAR_DATABASE[selectedSportId] || GEAR_DATABASE['ultra-trail'];
    return sportInfo.levels?.[userSkillLevel] || sportInfo.levels?.['Orta'];
  }, [selectedSportId, userSkillLevel]);

  const bagStats = useMemo(() => {
    if (!selectedSportId || !currentSportData) return { packed: 0, total: 0, isComplete: false };

    const currentSportPacked = packedGearBySport[selectedSportId] || {};
    const mandatoryItems = currentSportData.mandatory || [];
    const essentialMeds = currentSportData.medication?.essential || [];
    const totalRequired = mandatoryItems.length + essentialMeds.length;

    let packedCount = 0;
    mandatoryItems.forEach((item) => {
      if (currentSportPacked[item.id]) packedCount++;
    });
    essentialMeds.forEach((med) => {
      if (currentSportPacked[med.id]) packedCount++;
    });

    return {
      packed: packedCount,
      total: totalRequired,
      isComplete: totalRequired > 0 && packedCount === totalRequired,
    };
  }, [selectedSportId, currentSportData, packedGearBySport]);

  const handlePackItem = (itemId) => {
    if (!selectedSportId) return;
    setPackedGearBySport((prev) => ({
      ...prev,
      [selectedSportId]: {
        ...prev[selectedSportId],
        [itemId]: !prev[selectedSportId]?.[itemId],
      },
    }));
  };

  const defaultNatureBg = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80';
  const bgImageUri = activeSportObj ? activeSportObj.bgImage : defaultNatureBg;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <ImageBackground source={{ uri: bgImageUri }} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.darkOverlay} />

        {/* TOP HEADER BAR */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileBtn} onPress={() => setShowProfileModal(true)}>
            <User size={18} color="#10b981" />
            <Text style={styles.profileBtnText}>{profile.name.split(' ')[0]}</Text>
          </TouchableOpacity>

          <View style={styles.brandTitleContainer}>
            <Text style={styles.brandTitle}>GEARGRID</Text>
            <Text style={styles.brandSubTitle}>EXTREME ENGINE</Text>
          </View>

          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSettingsModal(true)}>
            <Settings size={18} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        {/* MODE NAVIGATION TABS */}
        <View style={styles.tabContainer}>
          <View style={styles.tabGroup}>
            <TouchableOpacity
              style={[styles.tabBtn, viewMode === 'equipment' && styles.activeTabBtn]}
              onPress={() => setViewMode('equipment')}
            >
              <Activity size={14} color={viewMode === 'equipment' ? '#ffffff' : '#94a3b8'} />
              <Text style={[styles.tabText, viewMode === 'equipment' && styles.activeTabText]}>
                Ekipman
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, viewMode === 'weather' && styles.activeTabBtnWeather]}
              onPress={() => setViewMode('weather')}
            >
              <Sun size={14} color={viewMode === 'weather' ? '#020617' : '#94a3b8'} />
              <Text style={[styles.tabText, viewMode === 'weather' && styles.activeTabTextWeather]}>
                Hava & Rota
              </Text>
            </TouchableOpacity>
          </View>

          {selectedSportId && (
            <TouchableOpacity
              style={[styles.bagBtn, bagStats.isComplete && styles.bagBtnComplete]}
              onPress={() => setShowBagDrawer(true)}
            >
              <ShoppingBag size={14} color={bagStats.isComplete ? '#020617' : '#f59e0b'} />
              <Text style={[styles.bagBtnText, bagStats.isComplete && styles.bagBtnTextComplete]}>
                {bagStats.packed}/{bagStats.total}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* MAIN BODY SCROLL VIEW */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {viewMode === 'equipment' && (
            <View>
              {/* SPORTS SELECTION LIST */}
              <View style={styles.sectionHeader}>
                <Compass size={14} color="#ef4444" />
                <Text style={styles.sectionTitle}>EXTREME SPOR SEÇİNİZ</Text>
                {selectedSportId && (
                  <TouchableOpacity style={styles.resetBtn} onPress={() => setSelectedSportId(null)}>
                    <ArrowLeft size={12} color="#0284c7" />
                    <Text style={styles.resetBtnText}>Sıfırla</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.sportsGrid}>
                {EXTREME_SPORTS.map((sport) => {
                  const isSelected = sport.id === selectedSportId;
                  const isOtherSelected = selectedSportId && !isSelected;

                  return (
                    <TouchableOpacity
                      key={sport.id}
                      onPress={() => setSelectedSportId(sport.id)}
                      style={[
                        styles.sportCard,
                        isSelected && { borderColor: sport.themeColor, borderWidth: 2, backgroundColor: 'rgba(15, 23, 42, 0.85)' },
                        isOtherSelected && { opacity: 0.35 },
                      ]}
                    >
                      <View style={styles.sportCardHeader}>
                        <Text style={styles.sportIcon}>{sport.icon}</Text>
                        <Text style={styles.sportCategory}>{sport.category}</Text>
                      </View>
                      <Text style={styles.sportName}>{sport.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* REVEALED EQUIPMENT ENGINE */}
              {!selectedSportId ? (
                <View style={styles.infoCard}>
                  <Sparkles size={24} color="#f59e0b" style={{ alignSelf: 'center' }} />
                  <Text style={styles.infoTitle}>Bir Spor Seçerek Başlayın</Text>
                  <Text style={styles.infoDesc}>
                    Spor seçtiğinizde arka planda o alana ait doğa fotoğrafı ön plana çıkacak ve ekipmanlar sıralanacaktır.
                  </Text>
                </View>
              ) : (
                currentSportData && (
                  <View style={styles.gearContainer}>
                    {/* LEVEL SWITCHER */}
                    <View style={styles.levelCard}>
                      <Text style={styles.levelTitle}>{activeSportObj?.name}</Text>
                      <View style={styles.levelBtnGroup}>
                        {['Acemi', 'Orta', 'Prof'].map((lvl) => (
                          <TouchableOpacity
                            key={lvl}
                            onPress={() => setUserSkillLevel(lvl)}
                            style={[styles.levelBtn, userSkillLevel === lvl && styles.levelBtnActive]}
                          >
                            <Text style={[styles.levelBtnText, userSkillLevel === lvl && styles.levelBtnTextActive]}>
                              {lvl}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* ZORUNLU EKİPMANLAR */}
                    <View style={styles.cardBox}>
                      <View style={styles.cardHeader}>
                        <Briefcase size={16} color="#10b981" />
                        <Text style={styles.cardTitle}>{userSkillLevel} Zorunlu Ekipmanlar</Text>
                      </View>

                      {currentSportData.mandatory.map((item) => {
                        const isPacked = packedGearBySport[selectedSportId]?.[item.id];
                        return (
                          <TouchableOpacity
                            key={item.id}
                            onPress={() => handlePackItem(item.id)}
                            style={[styles.gearItem, isPacked && styles.gearItemPacked]}
                          >
                            <View style={styles.gearItemLeft}>
                              <View style={[styles.checkbox, isPacked && styles.checkboxActive]}>
                                {isPacked && <Check size={12} color="#020617" />}
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.gearItemName, isPacked && styles.lineThrough]}>
                                  {item.name}
                                </Text>
                                <Text style={styles.gearItemSpec}>{item.spec}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* İLAÇLAR VE SAĞLIK */}
                    <View style={styles.cardBox}>
                      <View style={styles.cardHeader}>
                        <Pill size={16} color="#06b6d4" />
                        <Text style={styles.cardTitle}>{userSkillLevel} İlaç & Sağlık Reçetesi</Text>
                      </View>

                      {currentSportData.medication.essential.map((med) => {
                        const isPacked = packedGearBySport[selectedSportId]?.[med.id];
                        return (
                          <TouchableOpacity
                            key={med.id}
                            onPress={() => handlePackItem(med.id)}
                            style={[styles.gearItem, isPacked && styles.gearItemPacked]}
                          >
                            <View style={styles.gearItemLeft}>
                              <View style={[styles.checkbox, isPacked && styles.checkboxActive]}>
                                {isPacked && <Check size={12} color="#020617" />}
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.gearItemName, isPacked && styles.lineThrough]}>
                                  {med.name}
                                </Text>
                                <Text style={styles.gearItemSpec}>{med.desc}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                  </View>
                )
              )}
            </View>
          )}

          {/* WEATHER VIEW */}
          {viewMode === 'weather' && (
            <View style={styles.gearContainer}>
              <View style={styles.cardBox}>
                <View style={styles.cardHeader}>
                  <Navigation size={16} color="#0284c7" />
                  <Text style={styles.cardTitle}>Canlı Güzergah & Hava Tahmini</Text>
                </View>

                {ROUTE_SAMPLE.map((point, idx) => (
                  <View key={idx} style={styles.weatherItem}>
                    <Text style={styles.weatherStep}>{point.step}</Text>
                    <View style={styles.weatherRow}>
                      <Text style={styles.weatherBadge}>Saat: {point.time}</Text>
                      <Text style={styles.weatherBadge}>Sıcaklık: {point.temp}</Text>
                      <Text style={styles.weatherBadge}>Rüzgar: {point.wind}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* MODAL: PROFILE */}
        <Modal visible={showProfileModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sporcu Profili</Text>
                <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                  <X size={20} color="#cbd5e1" />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileTextName}>{profile.name}</Text>
              <Text style={styles.profileTextDetail}>Kan Grubu: {profile.bloodType}</Text>
              <Text style={styles.profileTextDetail}>Acil Durum: {profile.emergencyContact}</Text>
              <Text style={styles.profileTextDetail}>Alerji / Not: {profile.medicalNotes}</Text>
            </View>
          </View>
        </Modal>

        {/* MODAL: SETTINGS */}
        <Modal visible={showSettingsModal} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Ayarlar</Text>
                <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                  <X size={20} color="#cbd5e1" />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileTextDetail}>Versiyon: 1.0.0 Expo Release</Text>
              <Text style={styles.profileTextDetail}>Motor: GearGrid Extreme Engine</Text>
            </View>
          </View>
        </Modal>

      </ImageBackground>
    </SafeAreaView>
  );
}

// --- STYLES FOR REACT NATIVE / EXPO ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.75)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileBtnText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  brandTitleContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandSubTitle: {
    color: '#38bdf8',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#ef4444',
  },
  activeTabBtnWeather: {
    backgroundColor: '#38bdf8',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#ffffff',
  },
  activeTabTextWeather: {
    color: '#020617',
  },
  bagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bagBtnComplete: {
    backgroundColor: '#10b981',
    borderColor: '#34d399',
  },
  bagBtnText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
  bagBtnTextComplete: {
    color: '#020617',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetBtnText: {
    color: '#0284c7',
    fontSize: 10,
    fontWeight: '700',
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sportCard: {
    width: (width - 42) / 2,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    padding: 12,
    borderRadius: 16,
  },
  sportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportIcon: {
    fontSize: 22,
  },
  sportCategory: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sportName: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  infoTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  infoDesc: {
    color: '#94a3b8',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  gearContainer: {
    marginTop: 16,
    gap: 12,
  },
  levelCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
  },
  levelBtnGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  levelBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  levelBtnActive: {
    backgroundColor: '#10b981',
  },
  levelBtnText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  levelBtnTextActive: {
    color: '#020617',
  },
  cardBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
  },
  gearItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 12,
    padding: 10,
  },
  gearItemPacked: {
    opacity: 0.4,
  },
  gearItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  gearItemName: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  gearItemSpec: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 2,
  },
  weatherItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: 10,
    borderRadius: 10,
    gap: 6,
  },
  weatherStep: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
  },
  weatherRow: {
    flexDirection: 'row',
    gap: 8,
  },
  weatherBadge: {
    color: '#38bdf8',
    fontSize: 9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
  },
  profileTextName: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  profileTextDetail: {
    color: '#cbd5e1',
    fontSize: 11,
    marginBottom: 4,
  },
});