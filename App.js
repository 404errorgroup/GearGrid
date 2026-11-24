import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Modal, SafeAreaView,
  StatusBar, Dimensions, Platform, TextInput, Animated, LogBox,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Sun, Compass, Briefcase, Pill, Navigation, Check, ShoppingBag, User, Settings, X,
  ArrowLeft, Sparkles, AlertTriangle, Home, Plus,
} from 'lucide-react-native';
import { SPORTS } from './src/data';
import { PHOTOS } from './src/photos';
import { LOCAL_PHOTOS } from './src/sportPhotos';
import { buildList, status, weightAdvice } from './src/engine';
import { getRouteWeather, wIcon, verdict, CITIES } from './src/weather';
import { matchConditions, healthFor, SUGGEST, INTERACTIONS } from './src/health';
import Scene from './src/scene';

LogBox.ignoreAllLogs(true); // geliştirme uyarı çubukları sunumda görünmesin (APK'da zaten yok)
const { width, height } = Dimensions.get('window');
const KEY = 'geargrid:v5';
const DIMS = { home: 0.4, equipment: 0.35, weather: 0.2 }; // sayfaya göre karartma (0 = foto olduğu gibi). Geçişten sonra da kalır.
const BLOODS = ['A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'];
const LVL = { d: ['#ef4444', 'Tehlikeli'], w: ['#f59e0b', 'Dikkat'], i: ['#38bdf8', 'Bilgi'], n: ['#10b981', 'Tanındı'], u: ['#64748b', 'Tanınmadı'] };
const VC = { ok: '#10b981', warn: '#f59e0b', bad: '#ef4444' };
const METRIC = { feels: ['🥶', 'Hissedilen', (p) => `${p.feels}°C`], temp: ['🌡️', 'Sıcaklık', (p) => `${p.temp}°C`], rain: ['🌧️', 'Yağış', (p) => `%${p.rain}`], wind: ['💨', 'Rüzgar', (p) => `${p.wind} km/s`],
  gust: ['🌬️', 'Hamle', (p) => `${p.gust} km/s`], humidity: ['💧', 'Nem', (p) => `%${p.humidity}`] };
const FOCUS = { camping: ['feels', 'rain'], 'ultra-trail': ['feels', 'humidity'], paragliding: ['wind', 'gust'], 'rock-climbing': ['rain', 'feels'] };
const DEFAULT_WEATHER = { temp: 15, rain: 0, wind: 0, snow: false };
const kg = (g) => (g / 1000).toFixed(2);

// Arka plan YALNIZCA seçilen sporun fotoğraflarından gelir (src/photos.js + varsa yerel dosya). Açılmayan adreste sıradaki denenir.
const randomBg = (sportId) => {
  const list = sportId
    ? [...(LOCAL_PHOTOS[sportId] || []), ...(PHOTOS[sportId] || []).map((uri) => ({ uri }))]
    : Object.values(PHOTOS).flat().map((uri) => ({ uri }));
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  return { key: Date.now(), seed: (Math.random() * 1e9) | 0, srcs: list.slice(0, 4) };
};

// GENEL KATMANLAR (her sayfada, en arkada). assets/ klasörüne resim koyup ekleyebilirsin. İlk eleman en arkada.
const LAYERS = [
  // { source: require('./assets/images.png'), style: { position: 'absolute', bottom: 0, width: '100%', height: 300 } },
];
function BackgroundLayers() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {LAYERS.map((l, i) => <Image key={i} source={l.source} style={l.style} resizeMode={l.resizeMode || 'cover'} />)}
    </View>
  );
}

// Fotoğraf tüm sayfayı kaplar (cover, şeritsiz). Yüklenmeden görünmez (yanıp sönme olmaz), yüklenince yumuşakça belirir.
// Adres açılmazsa sıradaki denenir; hepsi başarısızsa çizilen sahne gösterilir.
function Backdrop({ bg, sportId }) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [i, setI] = useState(0);
  const src = bg.srcs[i];
  const show = () => Animated.timing(fadeIn, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  useEffect(() => { if (!src) show(); }, [src]);
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeIn }]} pointerEvents="none">
      {src
        ? <Image key={`p${i}`} source={src} style={StyleSheet.absoluteFill} resizeMode="cover" onLoad={show} onError={() => setI((n) => (n === i ? n + 1 : n))} />
        : <Scene sportId={sportId || 'camping'} seed={bg.seed} />}
    </Animated.View>
  );
}

function GearItem({ item, isPacked, onPress }) {
  const sub = item.auto ? `Hava Durumuna Göre Otomatik Eklendi (${item.why})` : item.health ? `${item.spec} · ${item.why}` : item.spec;
  return (
    <TouchableOpacity onPress={onPress} style={[s.gearItem, isPacked && s.gearItemPacked]}>
      <View style={s.gearItemLeft}>
        <View style={[s.checkbox, isPacked && s.checkboxActive]}>{isPacked && <Check size={12} color="#020617" />}</View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[s.gearItemName, isPacked && s.lineThrough, item.auto && { color: '#38bdf8' }, item.health && { color: '#fca5a5' }]}>{item.name}</Text>
            <Text style={s.weightText}>+{item.w}g</Text>
          </View>
          <Text style={s.gearItemSpec}>{sub}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('home'); // 'home' | 'equipment' | 'weather'
  const [sportId, setSportId] = useState(null);
  const [bg, setBg] = useState(() => randomBg(null));
  const [from, setFrom] = useState('Babadağ');
  const [to, setTo] = useState('Ölüdeniz');
  const [route, setRoute] = useState(null);
  const [packed, setPacked] = useState({});
  const [profile, setProfile] = useState({ name: 'Kaan Yılmaz', blood: 'A Rh+', conds: [], done: false });
  const [newCond, setNewCond] = useState('');
  const [modal, setModal] = useState(null);
  const dim = useRef(new Animated.Value(DIMS.home)).current;
  const timer = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (!raw) return; const d = JSON.parse(raw);
      setSportId(d.sportId ?? null); if (d.sportId) setBg(randomBg(d.sportId)); setFrom(d.from || 'Babadağ'); setTo(d.to || 'Ölüdeniz'); setPacked(d.packed || {}); if (d.profile) setProfile(d.profile);
    }).catch(() => {}).finally(() => setLoaded(true));
    return () => clearTimeout(timer.current);
  }, []);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEY, JSON.stringify({ sportId, from, to, packed, profile })).catch(() => {}); }, [loaded, sportId, from, to, packed, profile]);
  useEffect(() => { getRouteWeather(from, to).then(setRoute); }, [from, to]); // TODO: canlı API gelince src/weather.js değişecek

  const sport = SPORTS.find((x) => x.id === sportId);
  const limit = sport ? sport.limit : 0;
  const worst = route ? route.worst : DEFAULT_WEATHER;
  const healthDone = profile.done || profile.conds.length > 0;
  const health = useMemo(() => (sport ? healthFor(sportId, profile.conds) : { notes: [], items: [] }), [sportId, profile.conds]);
  const { mandatory, meds, warnings } = useMemo(() => (sport ? buildList(sportId, worst, health.items) : { mandatory: [], meds: [], warnings: [] }), [sportId, route, health]);
  const st = useMemo(() => status([...mandatory, ...meds], packed, limit), [mandatory, meds, packed, limit]);
  const matches = useMemo(() => matchConditions(profile.conds, sport ? sportId : null), [profile.conds, sportId]);
  const autoAlerts = [...mandatory.filter((i) => i.auto).map((i) => `${i.why}: ${i.name} listeye eklendi.`), ...warnings];
  const dangers = health.notes.filter((n) => n.level === 'd');
  const advice = sport ? weightAdvice(sport, st.weight) : null;

  const fade = (v) => Animated.timing(dim, { toValue: v, duration: 300, useNativeDriver: true }).start();
  const goTab = (id) => { clearTimeout(timer.current); fade(DIMS[id]); setTab(id); };
  // TEK otomatik geçiş: spora basınca yeni arka plan, ~1 sn sonra Ekipman sayfası
  const pickSport = (id) => {
    clearTimeout(timer.current); setSportId(id); setBg(randomBg(id)); fade(0.12);
    timer.current = setTimeout(() => { setTab('equipment'); fade(DIMS.equipment); }, 1000);
  };
  const togglePack = (id) => setPacked((p) => ({ ...p, [id]: !p[id] }));
  const addCond = (t) => {
    const v = (t ?? newCond).trim(); if (!v || profile.conds.includes(v)) return;
    setProfile((p) => ({ ...p, conds: [...p.conds, v] })); setNewCond('');
  };

  const focus = FOCUS[sportId] || ['temp', 'rain'];
  const small = ['temp', 'feels', 'wind', 'gust', 'humidity'].filter((m) => !focus.includes(m));

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
    <BackgroundLayers />
    <Backdrop key={bg.key} bg={bg} sportId={sportId} />
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#020617', opacity: dim }]} />
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* TOP HEADER BAR */}
      <View style={s.header}>
        <TouchableOpacity style={s.profileBtn} onPress={() => setModal('profile')}>
          <User size={18} color="#d97706" />
          <Text style={s.profileBtnText}>{profile.name.split(' ')[0] || 'Profil'}</Text>
          {!healthDone && <View style={s.dot} />}
        </TouchableOpacity>
        <View style={s.brandTitleContainer}>
          <Text style={s.brandTitle}>GEARGRID</Text>
          <Text style={s.brandSubTitle}>SMART INVENTORY ENGINE</Text>
        </View>
        <TouchableOpacity style={s.iconBtn} onPress={() => setModal('settings')}><Settings size={18} color="#cbd5e1" /></TouchableOpacity>
      </View>

      {/* MODE NAVIGATION TABS */}
      <View style={s.tabContainer}>
        <View style={s.tabGroup}>
          {[['home', 'Ana', Home], ['equipment', 'Ekipman', Briefcase], ['weather', 'Hava', Sun]].map(([id, label, Icon]) => {
            const on = tab === id; const w = id === 'weather';
            return (
              <TouchableOpacity key={id} style={[s.tabBtn, on && (w ? s.activeTabBtnWeather : s.activeTabBtn)]} onPress={() => goTab(id)}>
                <Icon size={14} color={on ? (w ? '#020617' : '#ffffff') : '#94a3b8'} />
                <Text style={[s.tabText, on && (w ? s.activeTabTextWeather : s.activeTabText)]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {sport && (
          <View style={[s.bagBadge, st.ready && s.bagBadgeComplete]}>
            <ShoppingBag size={13} color={st.ready ? '#020617' : '#f59e0b'} />
            <Text style={[s.bagBadgeText, st.ready && s.bagBadgeTextComplete]}>{st.packedCount}/{st.total} ({kg(st.weight)} kg)</Text>
          </View>
        )}
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* ANA SAYFA */}
        {tab === 'home' && (
          <View>
            <View style={s.weatherSummaryCard}>
              <Text style={s.weatherSummaryTitle}>{from} → {to}</Text>
              <Text style={s.weatherDetailText}>{wIcon(worst)} En düşük {worst.temp}°C · 🌧️ %{worst.rain} · 💨 {worst.wind} km/s</Text>
              <Text style={s.gearItemSpec}>Rotadaki en zor koşul. Rotayı Hava sekmesinden değiştirebilirsin.</Text>
            </View>
            <View style={[s.sectionHeader, { marginTop: 14 }]}>
              <Compass size={14} color="#d97706" />
              <Text style={s.sectionTitle}>AKTİVİTE / SPOR SEÇİNİZ</Text>
              {sportId && (
                <TouchableOpacity style={s.resetBtn} onPress={() => { clearTimeout(timer.current); setSportId(null); }}>
                  <ArrowLeft size={12} color="#38bdf8" /><Text style={s.resetBtnText}>Sıfırla</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={s.sportsGrid}>
              {SPORTS.map((x) => {
                const sel = x.id === sportId;
                return (
                  <TouchableOpacity key={x.id} onPress={() => pickSport(x.id)}
                    style={[s.sportCard, sel && { borderColor: x.themeColor, borderWidth: 2, backgroundColor: 'rgba(15, 23, 42, 0.9)' }, sportId && !sel && { opacity: 0.35 }]}>
                    <View style={s.sportCardHeader}><Text style={s.sportIcon}>{x.icon}</Text><Text style={s.sportCategory}>{x.category}</Text></View>
                    <Text style={s.sportName}>{x.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={s.infoCard}>
              <Sparkles size={24} color="#f59e0b" />
              <Text style={s.infoTitle}>Bir spora dokun, ekipman sayfası açılsın</Text>
              <Text style={s.infoDesc}>Seçimden yaklaşık 1 saniye sonra rotadaki hava koşullarına göre hazırlanan zorunlu ekipman listesi açılır.</Text>
            </View>
          </View>
        )}

        {/* EKİPMAN */}
        {tab === 'equipment' && (!sport ? (
          <View style={s.infoCard}>
            <Sparkles size={24} color="#f59e0b" />
            <Text style={s.infoTitle}>Önce bir spor seçin</Text>
            <Text style={s.infoDesc}>Ana sayfadan bir spora dokunun.</Text>
          </View>
        ) : (
          <View style={s.gearContainer}>
            {!healthDone && (
              <View style={s.promptCard}>
                <Text style={s.promptTitle}>Sağlık durumunu doldurdun mu?</Text>
                <Text style={s.alertDesc}>Astım, diyabet, kalp gibi bir durumun varsa bu spora göre uyarı ve ilaç önerisi çıkarırız.</Text>
                <View style={s.promptRow}>
                  <TouchableOpacity style={s.promptBtn} onPress={() => setModal('profile')}><Text style={s.promptBtnText}>Profili doldur</Text></TouchableOpacity>
                  <TouchableOpacity style={s.promptBtnGhost} onPress={() => setProfile((p) => ({ ...p, done: true }))}><Text style={s.promptGhostText}>Sağlık sorunum yok</Text></TouchableOpacity>
                </View>
              </View>
            )}
            {dangers.length > 0 && (
              <TouchableOpacity style={[s.alertCard, { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.18)' }]} onPress={() => scrollRef.current && scrollRef.current.scrollToEnd({ animated: true })}>
                <AlertTriangle size={16} color="#ef4444" />
                <View style={{ flex: 1 }}>
                  <Text style={[s.alertTitle, { color: '#ef4444' }]}>Sağlık uyarısı</Text>
                  <Text style={s.alertDesc}>{dangers.map((d) => d.label).join(', ')} bu spor için riskli olabilir. Ayrıntı en altta (dokun).</Text>
                </View>
              </TouchableOpacity>
            )}
            {autoAlerts.length > 0 && (
              <View style={s.alertCard}>
                <AlertTriangle size={16} color="#f59e0b" />
                <View style={{ flex: 1 }}>
                  <Text style={s.alertTitle}>Hava Durumu Otomasyonu (Simüle)</Text>
                  {autoAlerts.map((a, i) => <Text key={i} style={s.alertDesc}>• {a}</Text>)}
                </View>
              </View>
            )}

            <View style={s.levelCard}>
              <View style={{ flex: 1 }}>
                <Text style={s.levelTitle}>{sport.name}</Text>
                <Text style={s.weightLimitText}>
                  Çanta Ağırlığı: <Text style={{ color: st.overweight ? '#ef4444' : '#10b981', fontWeight: '800' }}>{kg(st.weight)} kg</Text> / Sınır: {(limit / 1000).toFixed(1)} kg
                </Text>
              </View>
              <Text style={[s.weightLimitText, { color: st.ready ? '#10b981' : '#f59e0b', fontWeight: '800' }]}>{st.ready ? '✓ Hazır' : `${st.missing.length} eksik`}</Text>
            </View>
            {advice && (
              <View style={[s.alertCard, { borderColor: VC[advice.level], backgroundColor: VC[advice.level] + '26' }]}>
                <AlertTriangle size={16} color={VC[advice.level]} />
                <View style={{ flex: 1 }}><Text style={[s.alertTitle, { color: VC[advice.level] }]}>Ağırlık uyarısı</Text><Text style={s.alertDesc}>{advice.text}</Text></View>
              </View>
            )}

            <View style={s.cardBox}>
              <View style={s.cardHeader}><Briefcase size={16} color="#10b981" /><Text style={s.cardTitle}>Zorunlu & Dinamik Ekipmanlar</Text></View>
              {mandatory.map((i) => <GearItem key={i.id} item={i} isPacked={packed[i.id]} onPress={() => togglePack(i.id)} />)}
            </View>

            <View style={s.cardBox}>
              <View style={s.cardHeader}><Pill size={16} color="#06b6d4" /><Text style={s.cardTitle}>Sağlık & İlaç Reçetesi</Text></View>
              {meds.map((i) => <GearItem key={i.id} item={i} isPacked={packed[i.id]} onPress={() => togglePack(i.id)} />)}
              {health.notes.length > 0 ? (
                <View style={{ gap: 6, marginTop: 4 }}>
                  <Text style={s.smallTitle}>Sağlık durumuna göre uyarılar</Text>
                  {health.notes.map((n) => (
                    <View key={n.key} style={[s.noteRow, { borderLeftColor: LVL[n.level][0] }]}>
                      <Text style={s.noteText}><Text style={{ fontWeight: '800', color: LVL[n.level][0] }}>{n.label} · {LVL[n.level][1]}: </Text>{n.msg}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={s.noteText}>{healthDone ? 'Sağlık sorunu yok olarak işaretlendi. Değiştirmek için profile dokun.' : 'Sağlık durumu henüz girilmedi. Profilden doldurabilirsin.'}</Text>
              )}
            </View>
          </View>
        ))}

        {/* HAVA & ROTA */}
        {tab === 'weather' && (
          <View style={s.gearContainer}>
            <View style={s.cardBox}>
              <View style={s.cardHeader}><Navigation size={16} color="#0284c7" /><Text style={s.cardTitle}>Rota Hava Analizi (Simüle)</Text></View>
              <Text style={s.smallTitle}>Nereden</Text>
              <View style={s.cityGrid}>{CITIES.map((c) => (
                <TouchableOpacity key={c} style={[s.cityBtn, from === c && s.cityBtnOn]} onPress={() => setFrom(c)}><Text style={[s.cityText, from === c && s.cityTextOn]}>{c}</Text></TouchableOpacity>))}</View>
              <Text style={s.smallTitle}>Nereye</Text>
              <View style={s.cityGrid}>{CITIES.map((c) => (
                <TouchableOpacity key={c} style={[s.cityBtn, to === c && s.cityBtnOn]} onPress={() => setTo(c)}><Text style={[s.cityText, to === c && s.cityTextOn]}>{c}</Text></TouchableOpacity>))}</View>
              <Text style={s.gearItemSpec}>{sport ? `${sport.icon} ${sport.name} için gösteriliyor.` : 'Ana sayfadan spor seçersen değerler o spora göre öne çıkar.'}</Text>
            </View>
            {route && route.points.map((p) => {
              const v = verdict(sportId, p);
              const cc = p.conf >= 80 ? '#10b981' : p.conf >= 65 ? '#f59e0b' : '#ef4444';
              return (
                <View key={p.label} style={s.weatherSummaryCard}>
                  <View style={s.pointHeader}>
                    <Text style={[s.weatherSummaryTitle, { flex: 1 }]}>{wIcon(p)} {p.label}: {p.place}</Text>
                    <Text style={[s.confBadge, { color: cc, borderColor: cc }]}>Doğruluk %{p.conf}</Text>
                  </View>
                  <View style={[s.verdict, { backgroundColor: VC[v.level] + '33', borderColor: VC[v.level] }]}><Text style={s.verdictText}>{v.text}</Text></View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {focus.map((m) => (
                      <View key={m} style={s.bigTile}><Text style={s.gearItemSpec}>{METRIC[m][0]} {METRIC[m][1]}</Text><Text style={s.bigNum}>{METRIC[m][2](p)}</Text></View>
                    ))}
                  </View>
                  <View style={s.statGrid}>{small.map((m) => (
                    <Text key={m} style={s.statCell}>{METRIC[m][0]} {METRIC[m][1]}: <Text style={s.statVal}>{METRIC[m][2](p)}</Text></Text>))}</View>
                  <Text style={[s.weatherDetailText, p.rain >= 40 && { color: '#f59e0b', fontWeight: '700' }]}>
                    {p.rain >= 20 ? `🌧️ Yağış ihtimali %${p.rain} · yaklaşık ${p.mm} mm/sa${p.snow ? ' (kar)' : ''}` : `🌤️ Yağış beklenmiyor (%${p.rain})`}
                  </Text>
                  <View style={s.confTrack}><View style={[s.confFill, { width: `${p.conf}%`, backgroundColor: cc }]} /></View>
                  <Text style={s.gearItemSpec}>Tahmin doğruluğu {p.conf >= 80 ? 'yüksek' : p.conf >= 65 ? 'orta' : 'düşük'}{p.estimated ? ' (rota ortası, iki uç noktadan tahmin edilir)' : ''}</Text>
                </View>
              );
            })}
            {sport && autoAlerts.length > 0 && (
              <View style={s.alertCard}><Text style={[s.alertDesc, { color: '#f59e0b' }]}>⚠️ Sistem rotadaki en zor koşula göre {mandatory.filter((i) => i.auto).length} ekipmanı otomatik ekledi.</Text></View>
            )}
          </View>
        )}
      </ScrollView>

      {/* MODAL: PROFILE */}
      <Modal visible={modal === 'profile'} animationType="slide" transparent onRequestClose={() => setModal(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Sporcu Profili</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={20} color="#cbd5e1" /></TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: height * 0.72 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={s.fieldLabel}>Kullanıcı adı</Text>
              <TextInput style={s.nameInput} value={profile.name} onChangeText={(v) => setProfile((p) => ({ ...p, name: v }))} placeholder="Adın" placeholderTextColor="#64748b" />

              <View style={s.healthRow}>
                <TouchableOpacity style={s.bloodBox} onPress={() => setProfile((p) => ({ ...p, blood: BLOODS[(BLOODS.indexOf(p.blood) + 1) % BLOODS.length] }))}>
                  <Text style={s.fieldLabel}>Kan grubu</Text>
                  <Text style={s.bloodText}>{profile.blood}</Text>
                  <Text style={s.hintText}>değiştirmek için dokun</Text>
                </TouchableOpacity>
                <View style={s.condPanel}>
                  <Text style={s.fieldLabel}>Özel durum / hastalık</Text>
                  <View style={s.condChips}>
                    {matches.length === 0 && <Text style={s.hintText}>Henüz eklenmedi</Text>}
                    {matches.map((m) => (
                      <TouchableOpacity key={m.text} style={[s.condChip, { borderColor: LVL[m.level][0] }]} onPress={() => setProfile((p) => ({ ...p, conds: p.conds.filter((c) => c !== m.text) }))}>
                        <Text style={s.condChipText}>{m.text}{m.cond && m.cond.label.toLowerCase() !== m.text.toLowerCase() ? ` (${m.cond.label})` : ''}</Text><X size={10} color="#94a3b8" />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={s.condInputRow}>
                    <TextInput style={s.condInput} value={newCond} onChangeText={setNewCond} onSubmitEditing={() => addCond()} placeholder="Örn. astım, bel fıtığı" placeholderTextColor="#64748b" />
                    <TouchableOpacity style={s.addBtn} onPress={() => addCond()}><Plus size={16} color="#fff" /></TouchableOpacity>
                  </View>
                </View>
              </View>

              <Text style={[s.fieldLabel, { marginTop: 10 }]}>Hızlı ekle</Text>
              <View style={s.condChips}>
                {SUGGEST.filter((x) => !profile.conds.includes(x)).map((x) => (
                  <TouchableOpacity key={x} style={s.suggestChip} onPress={() => addCond(x)}><Text style={s.condChipText}>+ {x}</Text></TouchableOpacity>
                ))}
              </View>
              {profile.conds.length === 0 && (
                <TouchableOpacity style={[s.promptBtnGhost, { marginTop: 10, alignSelf: 'flex-start' }]} onPress={() => setProfile((p) => ({ ...p, done: !p.done }))}>
                  <Text style={s.promptGhostText}>{profile.done ? '✓ Sağlık sorunum yok (geri al)' : 'Sağlık sorunum yok'}</Text>
                </TouchableOpacity>
              )}
              <Text style={[s.hintText, { marginTop: 10 }]}>Çerçeve rengi seçili spora göre risk gösterir: kırmızı tehlikeli, sarı dikkat, mavi bilgi, gri tanınmadı.</Text>
              {sport && health.notes.length > 0 && (
                <View style={{ gap: 6, marginTop: 10 }}>
                  <Text style={s.smallTitle}>{sport.name} için uyarılar</Text>
                  {health.notes.map((n) => (
                    <View key={n.key} style={[s.noteRow, { borderLeftColor: LVL[n.level][0] }]}>
                      <Text style={s.noteText}><Text style={{ fontWeight: '800', color: LVL[n.level][0] }}>{n.label}: </Text>{n.msg}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text style={[s.hintText, { marginTop: 10 }]}>{INTERACTIONS} spor-sağlık eşleşmesi tanımlı. GearGrid bir öneri aracıdır, tıbbi tavsiye değildir. Doktoruna danış.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: SETTINGS */}
      <Modal visible={modal === 'settings'} animationType="fade" transparent onRequestClose={() => setModal(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Ayarlar</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={20} color="#cbd5e1" /></TouchableOpacity>
            </View>
            <Text style={s.profileTextDetail}>Versiyon: 6.0 Demo</Text>
            <Text style={s.profileTextDetail}>Motor: GearGrid Smart Inventory Manager</Text>
            <TouchableOpacity style={[s.promptBtnGhost, { marginTop: 12, alignSelf: 'flex-start' }]} onPress={() => { setPacked({}); setModal(null); }}>
              <Text style={s.promptGhostText}>Çantayı sıfırla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </View>
  );
}

const glass = 'rgba(15, 23, 42, 0.85)';
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(51, 65, 85, 0.4)' },
  profileBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: glass, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  profileBtnText: { color: '#f8fafc', fontSize: 12, fontWeight: '700' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  brandTitleContainer: { alignItems: 'center' },
  brandTitle: { color: '#d97706', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  brandSubTitle: { color: '#38bdf8', fontSize: 7, fontWeight: '700', letterSpacing: 0.5 },
  iconBtn: { padding: 8, backgroundColor: glass, borderRadius: 20 },
  tabContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  tabGroup: { flexDirection: 'row', backgroundColor: glass, borderRadius: 12, padding: 4 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8 },
  activeTabBtn: { backgroundColor: '#d97706' },
  activeTabBtnWeather: { backgroundColor: '#38bdf8' },
  tabText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  activeTabText: { color: '#ffffff' },
  activeTabTextWeather: { color: '#020617' },
  bagBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(15, 23, 42, 0.9)', borderWidth: 1, borderColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  bagBadgeComplete: { backgroundColor: '#10b981', borderColor: '#34d399' },
  bagBadgeText: { color: '#f59e0b', fontSize: 11, fontWeight: '700' },
  bagBadgeTextComplete: { color: '#020617' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: '#f8fafc', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.85)', textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 } },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resetBtnText: { color: '#38bdf8', fontSize: 10, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.85)', textShadowRadius: 4 },
  sportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sportCard: { width: (width - 42) / 2, backgroundColor: 'rgba(15, 23, 42, 0.7)', borderWidth: 1, borderColor: 'rgba(51, 65, 85, 0.6)', padding: 12, borderRadius: 16 },
  sportCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sportIcon: { fontSize: 22 },
  sportCategory: { color: '#94a3b8', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  sportName: { color: '#f8fafc', fontSize: 11, fontWeight: '700', marginTop: 8 },
  infoCard: { backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: 16, padding: 20, marginTop: 16, alignItems: 'center' },
  infoTitle: { color: '#f8fafc', fontSize: 13, fontWeight: '700', marginTop: 8 },
  infoDesc: { color: '#94a3b8', fontSize: 10, textAlign: 'center', marginTop: 4 },
  gearContainer: { gap: 12 },
  alertCard: { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: '#f59e0b', borderRadius: 14, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  alertTitle: { color: '#f59e0b', fontSize: 11, fontWeight: '800', marginBottom: 2 },
  alertDesc: { color: '#cbd5e1', fontSize: 10 },
  promptCard: { backgroundColor: 'rgba(56, 189, 248, 0.14)', borderWidth: 1, borderColor: '#38bdf8', borderRadius: 14, padding: 12, gap: 6 },
  promptTitle: { color: '#38bdf8', fontSize: 12, fontWeight: '800' },
  promptRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  promptBtn: { backgroundColor: '#38bdf8', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  promptBtnText: { color: '#020617', fontSize: 11, fontWeight: '800' },
  promptBtnGhost: { borderWidth: 1, borderColor: '#64748b', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  promptGhostText: { color: '#cbd5e1', fontSize: 11, fontWeight: '700' },
  levelCard: { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  levelTitle: { color: '#f8fafc', fontSize: 12, fontWeight: '800' },
  weightLimitText: { color: '#94a3b8', fontSize: 10, marginTop: 2 },
  cardBox: { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: 16, padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { color: '#f8fafc', fontSize: 12, fontWeight: '800' },
  gearItem: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, padding: 10 },
  gearItemPacked: { opacity: 0.4 },
  gearItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#64748b', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  gearItemName: { color: '#f8fafc', fontSize: 11, fontWeight: '700', flex: 1 },
  lineThrough: { textDecorationLine: 'line-through' },
  gearItemSpec: { color: '#94a3b8', fontSize: 9, marginTop: 2 },
  weightText: { color: '#f59e0b', fontSize: 10, fontWeight: '700' },
  smallTitle: { color: '#94a3b8', fontSize: 10, fontWeight: '800' },
  noteRow: { borderLeftWidth: 3, backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 6, paddingVertical: 5, paddingHorizontal: 8 },
  noteText: { color: '#cbd5e1', fontSize: 9 },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cityBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: 'rgba(30, 41, 59, 0.8)' },
  cityBtnOn: { backgroundColor: '#38bdf8' },
  cityText: { color: '#94a3b8', fontSize: 10, fontWeight: '700' },
  cityTextOn: { color: '#020617' },
  weatherSummaryCard: { backgroundColor: 'rgba(30, 41, 59, 0.75)', padding: 12, borderRadius: 12, gap: 6 },
  weatherSummaryTitle: { color: '#f8fafc', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  weatherDetailText: { color: '#38bdf8', fontSize: 10 },
  verdict: { borderWidth: 1, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 },
  verdictText: { color: '#f8fafc', fontSize: 10, fontWeight: '700' },
  pointHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  confBadge: { fontSize: 9, fontWeight: '800', borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  statCell: { width: '48%', color: '#94a3b8', fontSize: 10 },
  statVal: { color: '#f8fafc', fontWeight: '700' },
  confTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(51, 65, 85, 0.8)', overflow: 'hidden' },
  confFill: { height: '100%', borderRadius: 3 },
  bigTile: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: 10, padding: 10 },
  bigNum: { color: '#f8fafc', fontSize: 22, fontWeight: '900', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0f172a', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '800' },
  profileTextDetail: { color: '#cbd5e1', fontSize: 11, marginBottom: 4 },
  fieldLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '700', marginBottom: 4 },
  nameInput: { backgroundColor: 'rgba(30, 41, 59, 0.9)', color: '#d97706', fontSize: 16, fontWeight: '800', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  healthRow: { flexDirection: 'row', gap: 10, marginTop: 12, alignItems: 'stretch' },
  bloodBox: { width: 92, backgroundColor: 'rgba(30, 41, 59, 0.9)', borderRadius: 12, padding: 10, alignItems: 'center', justifyContent: 'center' },
  bloodText: { color: '#ef4444', fontSize: 20, fontWeight: '900', marginVertical: 4 },
  hintText: { color: '#94a3b8', fontSize: 9 },
  condPanel: { flex: 1, borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 10, backgroundColor: 'rgba(30, 41, 59, 0.5)' },
  condChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, minHeight: 44, marginBottom: 8 },
  condChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(15, 23, 42, 0.9)', borderWidth: 2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  condChipText: { color: '#f8fafc', fontSize: 10 },
  suggestChip: { backgroundColor: 'rgba(30, 41, 59, 0.9)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  condInputRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  condInput: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#f8fafc', fontSize: 11, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  addBtn: { backgroundColor: '#d97706', padding: 8, borderRadius: 8 },
});
