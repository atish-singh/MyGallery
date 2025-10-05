import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'MY_GALLERY_ITEMS_V1';

export async function loadItems() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export async function saveItem({ uri, caption }) {
  const list = await loadItems();
  const item = { id: String(Date.now()), uri, caption: caption || '' };
  const next = [item, ...list];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return item;
}


