import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground, Modal,
  SafeAreaView, StatusBar, Platform, TextInput, PanResponder, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User, Settings, Compass, Briefcase, ShoppingBag, Check, X, AlertTriangle,
  Plus, Trash2, GripVertical, Sparkles,
} from 'lucide-react-native';
import { SPORTS, SCENARIOS, LEVELS } from './src/data';
import { buildList, status } from './src/engine';
import { getWeather } from './src/weather';

const KEY = 'geargrid:v1';
const PROFILE = {
  name: 'Kaan Yılmaz', bloodType: 'A Rh+', emergencyContact: '+90 532 555 0199',
  medicalNotes: 'Arı sokmasına karşı hafif alerji (EpiPen taşır).',
};
const DEFAULT_BG = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80';
const kg = (g) => (g / 1000).toFixed(2);

// Sürüklenebilir satır: sadece tutamaç (⋮⋮) sürüklemeyi başlatır, liste normal kayar.
function DragRow({ item, onStart, onMove, onEnd }) {
  const cb = useRef({});
  cb.current = { item, onStart, onMove, onEnd };
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (e) => cb.current.onStart(cb.current.item, e.nativeEvent.pageX, e.nativeEvent.pageY),
    onPanResponderMove: (e, g) => cb.current.onMove(g.moveX, g.moveY),
    onPanResponderRelease: (e, g) => cb.current.onEnd(cb.current.item, g.moveY),
    onPanResponderTerminate: () => cb.current.onEnd(cb.current.item, -1),
  })).current;
  return (
    <View style={s.gearItem}>
      <View {...pan.panHandlers} style={s.handle}><GripVertical size={20} color="#94a3b8" /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.itemName}>{item.name}</Text>
        <Text style={s.itemSpec}>{item.must ? 'Zorunlu' : 'Önerilen'} · {item.w} g</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('trip');
  const [sportId, setSportId] = useState(null);
  const [level, setLevel] = useState('Orta');
  const [scenarioId, setScenarioId] = useState('rainy');
  const [location, setLocation] = useState('Uludağ');
  const [packed, setPacked] = useState({});
  const [custom, setCustom] = useState([]);
  const [weather, setWeather] = useState(SCENARIOS[1]);
  const [newName, setNewName] = useState('');
  const [newGram, setNewGram] = useState('');
  const [modal, setModal] = useState(null); // 'profile' | 'settings'
  const [drag, setDrag] = useState(null);
  const ghost = useRef(new Animated.ValueXY()).current;
  const bagRef = useRef(null);
  const bagBox = useRef({ y: 0, h: 0 });

  // Cihazda saklama (hesap/giriş yok)
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (!raw) return;
      const d = JSON.parse(raw);
      setSportId(d.sportId ?? null); setLevel(d.level || 'Orta'); setScenarioId(d.scenarioId || 'rainy');
      setLocation(d.location || ''); setPacked(d.packed || {}); setCustom(d.custom || []);
    }).catch(() => {}).finally(() => setLoaded(true));
  }, []);
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify({ sportId, level, scenarioId, location, packed, custom })).catch(() => {});
  }, [loaded, sportId, level, scenarioId, location, packed, custom]);

  // Hava durumu (şimdilik simüle; canlı API gelince src/weather.js değişecek)
  useEffect(() => { getWeather(location, scenarioId).then(setWeather); }, [location, scenarioId]);

  const sport = SPORTS.find((x) => x.id === sportId);
  const limit = sport ? sport.limits[level] : 0;
  const { items, warnings } = useMemo(
    () => (sport ? buildList(sportId, weather, custom) : { items: [], warnings: [] }),
    [sportId, weather, custom]);
  const st = useMemo(() => status(items, packed, limit), [items, packed, limit]);
  const mustTotal = items.filter((i) => i.must).length;

  const toggle = (id) => setPacked((p) => ({ ...p, [id]: !p[id] }));
  const setPack = (id, v) => setPacked((p) => ({ ...p, [id]: v }));
  const addCustom = () => {
    const w = parseInt(newGram, 10);
    if (!newName.trim() || !w || !sportId) return;
    setCustom((c) => [...c, { id: 'x' + Date.now(), name: newName.trim(), w, sportId }]);
    setNewName(''); setNewGram('');
  };
  const delCustom = (id) => setCustom((c) => c.filter((x) => x.id !== id));

  // Sürükle-bırak
  const measureBag = () => bagRef.current && bagRef.current.measureInWindow((x, y, w, h) => { bagBox.current = { y, h }; });
  const onStart = (item, px, py) => { measureBag(); ghost.setValue({ x: px - 120, y: py - 36 }); setDrag(item); };
  const onMove = (mx, my) => ghost.setValue({ x: mx - 120, y: my - 36 });
  const onEnd = (item, my) => {
    setDrag(null);
    const { y, h } = bagBox.current;
    if (my >= y && my <= y + h) setPack(item.id, true);
  };

  const Row = ({ item }) => (
    <View style={s.gearItem}>
      <TouchableOpacity style={[s.checkbox, packed[item.id] && s.checkboxOn]} onPress={() => toggle(item.id)}>
        {packed[item.id] && <Check size={14} color="#020617" />}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={[s.itemName, item.auto && { color: '#38bdf8' }, packed[item.id] && s.struck]}>{item.name}</Text>
        <Text style={s.itemSpec}>{item.spec}</Text>
        <Text style={s.itemWhy}>Neden: {item.why}</Text>
      </View>
      <Text style={s.weight}>{item.w} g</Text>
      {item.custom && <TouchableOpacity onPress={() => delCustom(item.id)} style={{ paddingLeft: 10 }}><Trash2 size={16} color="#ef4444" /></TouchableOpacity>}
    </View>
  );

  const needSport = (
    <View style={s.infoCard}>
      <Sparkles size={24} color="#f59e0b" />
      <Text style={s.infoTitle}>Önce bir spor seç</Text>
      <Text style={s.infoDesc}>Gezi sekmesinden spor ve hava senaryosunu seçince liste otomatik oluşur.</Text>
    </View>
  );

  const unpacked = items.filter((i) => !packed[i.id]);
  const pct = limit ? Math.min(st.weight / limit, 1) * 100 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <SafeAreaView style={s.container}>
        <StatusBar barStyle="light-content" backgroundColor="#020617" />
        <ImageBackground source={{ uri: sport ? sport.bg : DEFAULT_BG }} style={{ flex: 1 }} resizeMode="cover">
          <View style={s.overlay} />

          <View style={s.header}>
            <TouchableOpacity style={s.profileBtn} onPress={() => setModal('profile')}>
              <User size={18} color="#d97706" /><Text style={s.profileBtnText}>{PROFILE.name.split(' ')[0]}</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={s.brand}>GEARGRID</Text>
              <Text style={s.brandSub}>SMART INVENTORY ENGINE</Text>
            </View>
            <TouchableOpacity style={s.iconBtn} onPress={() => setModal('settings')}><Settings size={18} color="#cbd5e1" /></TouchableOpacity>
          </View>

          <View style={s.tabs}>
            {[['trip', 'Gezi', Compass], ['list', 'Liste', Briefcase], ['bag', 'Çanta', ShoppingBag]].map(([id, label, Icon]) => (
              <TouchableOpacity key={id} style={[s.tabBtn, tab === id && s.tabOn]} onPress={() => setTab(id)}>
                <Icon size={15} color={tab === id ? '#fff' : '#94a3b8'} />
                <Text style={[s.tabText, tab === id && { color: '#fff' }]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {sport && (
            <View style={[s.badge, st.ready && s.badgeOk]}>
              <Text style={[s.badgeText, st.ready && { color: '#020617' }]}>
                {st.ready ? 'HAZIRSIN ✓' : `${mustTotal - st.missing.length}/${mustTotal} zorunlu`} · {kg(st.weight)} / {kg(limit)} kg
              </Text>
            </View>
          )}

          {tab === 'bag' ? (
            <View style={{ flex: 1, padding: 16 }}>
              {!sport ? needSport : (<>
                <View ref={bagRef} onLayout={measureBag} style={[s.bagZone, drag && s.bagZoneActive]}>
                  <View style={s.bar}><View style={[s.barFill, { width: `${pct}%`, backgroundColor: st.overweight ? '#ef4444' : '#10b981' }]} /></View>
                  <Text style={[s.itemSpec, { marginTop: 4 }, st.overweight && { color: '#ef4444' }]}>
                    {st.overweight ? `Sınırı ${((st.weight - limit) / 1000).toFixed(2)} kg aştın` : `${kg(limit - st.weight)} kg boşluk kaldı`}
                  </Text>
                  <View style={[s.status, st.ready ? s.statusOk : s.statusBad]}>
                    <Text style={s.statusText}>
                      {st.ready ? 'Tüm zorunlu ekipman çantada. Yola hazırsın.' : `Eksik zorunlu (${st.missing.length}): ${st.missing.map((m) => m.name).join(', ')}`}
                    </Text>
                  </View>
                  <View style={s.chips}>
                    {st.inBag.length === 0 && <Text style={s.itemSpec}>Çanta boş. Eşyaları buraya sürükle.</Text>}
                    {st.inBag.map((i) => (
                      <TouchableOpacity key={i.id} style={s.chip} onPress={() => setPack(i.id, false)}>
                        <Text style={s.chipText}>{i.name} · {i.w} g</Text><X size={12} color="#94a3b8" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={[s.section, { marginTop: 12 }]}>ÇANTADA OLMAYANLAR ({unpacked.length}). Tutamaçtan çantaya sürükle.</Text>
                <ScrollView scrollEnabled={!drag} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 30 }}>
                  {unpacked.map((i) => <DragRow key={i.id} item={i} onStart={onStart} onMove={onMove} onEnd={onEnd} />)}
                </ScrollView>
              </>)}
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }} keyboardShouldPersistTaps="handled">
              {tab === 'trip' && (<>
                <Text style={s.section}>SPOR SEÇ</Text>
                <View style={s.grid}>
                  {SPORTS.map((x) => (
                    <TouchableOpacity key={x.id} onPress={() => setSportId(x.id)}
                      style={[s.sportCard, sportId === x.id && { borderColor: x.color, borderWidth: 2 }, sportId && sportId !== x.id && { opacity: 0.4 }]}>
                      <View style={s.row}><Text style={{ fontSize: 24 }}>{x.icon}</Text><Text style={s.itemSpec}>{x.category}</Text></View>
                      <Text style={[s.itemName, { marginTop: 8 }]}>{x.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={s.section}>SEVİYE (ÇANTA SINIRINI DEĞİŞTİRİR)</Text>
                <View style={s.row}>
                  {LEVELS.map((l) => (
                    <TouchableOpacity key={l} style={[s.pill, level === l && s.pillOn]} onPress={() => setLevel(l)}>
                      <Text style={[s.tabText, level === l && { color: '#fff' }]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={s.section}>YER</Text>
                <TextInput style={s.input} value={location} onChangeText={setLocation} placeholder="Örn. Uludağ" placeholderTextColor="#64748b" />
                <Text style={s.section}>HAVA SENARYOSU (DEMO)</Text>
                <View style={s.grid}>
                  {SCENARIOS.map((x) => (
                    <TouchableOpacity key={x.id} style={[s.pill, { width: '48%' }, scenarioId === x.id && s.pillWeather]} onPress={() => setScenarioId(x.id)}>
                      <Text style={[s.tabText, scenarioId === x.id && { color: '#020617' }]}>{x.icon} {x.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={s.card}>
                  <Text style={s.cardTitle}>{location || 'Konum'} · {weather.icon} {weather.label}</Text>
                  <Text style={s.weatherText}>🌡️ En düşük sıcaklık: {weather.temp}°C</Text>
                  <Text style={s.weatherText}>🌧️ Yağış ihtimali: %{weather.rain}</Text>
                  <Text style={s.weatherText}>💨 Rüzgar: {weather.wind} km/s{weather.snow ? '  ·  ❄️ Kar var' : ''}</Text>
                  <Text style={s.itemSpec}>Veri simüle edilmiştir. Canlı hava durumu API ile eklenecek.</Text>
                </View>
              </>)}

              {tab === 'list' && (!sport ? needSport : (<>
                {warnings.map((w, i) => (
                  <View key={i} style={s.alert}><AlertTriangle size={16} color="#f59e0b" /><Text style={s.alertText}>{w}</Text></View>
                ))}
                <View style={s.card}>
                  <Text style={s.cardTitle}>Zorunlu ekipman ({items.filter((i) => i.must).length})</Text>
                  {items.filter((i) => i.must).map((i) => <Row key={i.id} item={i} />)}
                </View>
                <View style={s.card}>
                  <Text style={s.cardTitle}>Önerilen & kendi eşyaların</Text>
                  {items.filter((i) => !i.must).map((i) => <Row key={i.id} item={i} />)}
                  <View style={s.row}>
                    <TextInput style={[s.input, { flex: 1 }]} value={newName} onChangeText={setNewName} placeholder="Eşya adı" placeholderTextColor="#64748b" />
                    <TextInput style={[s.input, { width: 70 }]} value={newGram} onChangeText={setNewGram} placeholder="gram" keyboardType="numeric" placeholderTextColor="#64748b" />
                    <TouchableOpacity style={s.addBtn} onPress={addCustom}><Plus size={18} color="#fff" /></TouchableOpacity>
                  </View>
                </View>
              </>))}
            </ScrollView>
          )}

          <Modal visible={!!modal} animationType="fade" transparent onRequestClose={() => setModal(null)}>
            <View style={s.modalOverlay}><View style={s.modalBox}>
              <View style={[s.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
                <Text style={s.cardTitle}>{modal === 'profile' ? 'Sporcu Profili' : 'Ayarlar'}</Text>
                <TouchableOpacity onPress={() => setModal(null)}><X size={20} color="#cbd5e1" /></TouchableOpacity>
              </View>
              {modal === 'profile' ? (<>
                <Text style={s.profileName}>{PROFILE.name}</Text>
                <Text style={s.weatherText}>Kan Grubu: {PROFILE.bloodType}</Text>
                <Text style={s.weatherText}>Acil Durum: {PROFILE.emergencyContact}</Text>
                <Text style={s.weatherText}>Alerji / Not: {PROFILE.medicalNotes}</Text>
              </>) : (<>
                <Text style={s.weatherText}>Versiyon: 1.3.0 Demo</Text>
                <TouchableOpacity style={[s.pill, { marginTop: 12 }]} onPress={() => { setPacked({}); setCustom([]); setModal(null); }}>
                  <Text style={s.tabText}>Çantayı ve özel eşyaları sıfırla</Text>
                </TouchableOpacity>
              </>)}
            </View></View>
          </Modal>
        </ImageBackground>
      </SafeAreaView>
      {drag && (
        <Animated.View pointerEvents="none" style={[s.ghost, { transform: ghost.getTranslateTransform() }]}>
          <Text style={s.itemName}>{drag.name}</Text><Text style={s.itemSpec}>{drag.w} g</Text>
        </Animated.View>
      )}
    </View>
  );
}

const glass = 'rgba(15, 23, 42, 0.88)';
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.8)' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  profileBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: glass, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  profileBtnText: { color: '#f8fafc', fontSize: 13, fontWeight: '700' },
  brand: { color: '#d97706', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  brandSub: { color: '#38bdf8', fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  iconBtn: { padding: 8, backgroundColor: glass, borderRadius: 20 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: glass, borderRadius: 12, padding: 4 },
  tabBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 8, borderRadius: 8 },
  tabOn: { backgroundColor: '#d97706' },
  tabText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  badge: { alignSelf: 'center', marginTop: 10, backgroundColor: glass, borderWidth: 1, borderColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeOk: { backgroundColor: '#10b981', borderColor: '#34d399' },
  badgeText: { color: '#f59e0b', fontSize: 12, fontWeight: '800' },
  section: { color: '#f8fafc', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sportCard: { width: '48%', backgroundColor: 'rgba(15, 23, 42, 0.7)', borderWidth: 1, borderColor: 'rgba(51, 65, 85, 0.6)', padding: 12, borderRadius: 16 },
  pill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(30, 41, 59, 0.9)', alignItems: 'center' },
  pillOn: { backgroundColor: '#d97706' },
  pillWeather: { backgroundColor: '#38bdf8' },
  input: { backgroundColor: 'rgba(30, 41, 59, 0.9)', color: '#f8fafc', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  addBtn: { backgroundColor: '#d97706', padding: 11, borderRadius: 10 },
  card: { backgroundColor: glass, borderRadius: 16, padding: 14, gap: 10 },
  cardTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '800' },
  weatherText: { color: '#38bdf8', fontSize: 13, marginBottom: 2 },
  alert: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: '#f59e0b', borderRadius: 14, padding: 12 },
  alertText: { color: '#fde68a', fontSize: 12, flex: 1 },
  gearItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: 12, padding: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: '#64748b', alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: '#10b981', borderColor: '#10b981' },
  itemName: { color: '#f8fafc', fontSize: 13, fontWeight: '700' },
  itemSpec: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  itemWhy: { color: '#f59e0b', fontSize: 11, marginTop: 2 },
  struck: { textDecorationLine: 'line-through', opacity: 0.5 },
  weight: { color: '#f59e0b', fontSize: 12, fontWeight: '700' },
  handle: { padding: 10, margin: -4 },
  infoCard: { backgroundColor: glass, borderRadius: 16, padding: 20, alignItems: 'center', gap: 6 },
  infoTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  infoDesc: { color: '#94a3b8', fontSize: 12, textAlign: 'center' },
  bagZone: { backgroundColor: glass, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: 'transparent' },
  bagZoneActive: { borderColor: '#d97706', borderStyle: 'dashed' },
  bar: { height: 10, borderRadius: 5, backgroundColor: 'rgba(51, 65, 85, 0.8)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  status: { borderRadius: 10, padding: 10, marginTop: 10 },
  statusOk: { backgroundColor: 'rgba(16, 185, 129, 0.25)' },
  statusBad: { backgroundColor: 'rgba(239, 68, 68, 0.22)' },
  statusText: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(30, 41, 59, 0.9)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  chipText: { color: '#f8fafc', fontSize: 11 },
  ghost: { position: 'absolute', left: 0, top: 0, width: 240, backgroundColor: '#d97706', borderRadius: 12, padding: 10, opacity: 0.95, elevation: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#0f172a', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155' },
  profileName: { color: '#d97706', fontSize: 17, fontWeight: '800', marginBottom: 8 },
});
