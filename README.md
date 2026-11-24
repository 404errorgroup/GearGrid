# GearGrid Demo (404found)

## 1. Telefonda çalıştırma (Expo Go)
```
npx create-expo-app@latest geargrid --template blank
cd geargrid
npx expo install react-native-svg @react-native-async-storage/async-storage
npm install lucide-react-native
```
Bu klasördeki `App.js`, `src/` ve `eas.json` dosyalarını projenin üzerine kopyala, sonra:
```
npx expo start
```
QR kodu Expo Go ile okut (aynı Wi-Fi; olmazsa `npx expo start --tunnel`).

## 2. APK alma (sunum için)
1. `app.json` içindeki `"expo"` bölümüne ekle: `"android": { "package": "com.team404found.geargrid" }`
2. ```
   npm install -g eas-cli
   eas login            # ücretsiz Expo hesabı
   eas build -p android --profile preview
   ```
3. Build bitince (yaklaşık 10-20 dk) verilen linkten APK'yı indir, telefona yükle (bilinmeyen kaynaklara izin ver).

## Notlar
- Arka plan fotoğrafları internetten gelir. İnternet yoksa çizilen sahneler gösterilir, uygulama çökmez. Sunumdan önce bir kez internetle açıp dene.
- Hava verisi simüledir (`src/weather.js`). Canlı API sonra buraya bağlanacak.
- Fotoğraf eklemek: `src/photos.js`. Ekipman/ağırlık: `src/data.js`. Kurallar: `src/engine.js`. Sağlık eşleşmesi: `src/health.js`.
