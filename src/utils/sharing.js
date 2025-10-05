import { Platform, Share } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export async function shareImageWithCaption(item) {
  const message = item.caption || '';
  if (Platform.OS === 'web') {
    try {
      if (navigator.share) {
        await navigator.share({ text: message, url: item.uri });
        return;
      }
    } catch {}
    await Share.share({ message: `${message} ${item.uri}`.trim() });
    return;
  }

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(item.uri, { dialogTitle: 'Share Image', mimeType: 'image/*' });
      return;
    }
  } catch {}

  await Share.share({ message, url: item.uri });
}


