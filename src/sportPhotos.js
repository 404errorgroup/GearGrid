// KAMP için isteğe bağlı yerel fotoğraf. Kullanmak için: dosyayı assets/sports/camping-full.jpg olarak koy ve aşağıdaki satırın başındaki // işaretini kaldır.
// (Dosya yokken açarsan paketleme hata verebilir, bu yüzden varsayılan olarak kapalı.)
let camping = null;
// try { camping = require('../assets/sports/camping-full.jpg'); } catch (e) {}
export const LOCAL_PHOTOS = { camping: camping ? [camping] : [] };
