### NewGallery (React Native + Expo)

NewGallery is a lightweight sample gallery app built with React Native and Expo. It demonstrates a modern UI for viewing albums, adding images from the camera or media library, saving items locally, and using voice-to-text to generate captions.

### Features
- **Tabbed navigation**: Bottom tabs for `Gallery` and `Add` flows using `@react-navigation`.
- **Gallery UI**: Polished albums screen with tabs (Recent, Videos, Favorite, Private) and search placeholder.
- **Add Image**:
  - Pick from library or capture a photo (Expo Image Picker)
  - Add a caption manually or via **voice input** (`@react-native-voice/voice`)
  - Copy/clear caption, unsaved-change warning on back
- **Local persistence**: Saves items with `AsyncStorage` in `src/storage/galleryStorage.js`.
- **Theming**: Light/Dark theme awareness via `useColorScheme` and `ThemeProvider`.
- **Expo support**: Works on Android, iOS, and Web (camera is disabled on Web).

### Tech Stack
- React Native 0.81, React 19 (Expo SDK ~54)
- Navigation: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- Storage: `@react-native-async-storage/async-storage`
- Media: `expo-image-picker`, `expo-file-system`, `expo-sharing`, `expo-clipboard`
- Voice: `@react-native-voice/voice`

### Getting Started
1. Install dependencies
```bash
npm install
```

2. Start the Metro server (Expo)
```bash
npm run start
```

3. Run on a device or simulator
- **Android**: `npm run android`
- **iOS** (macOS only): `npm run ios`
- **Web**: `npm run web`

If using a physical device, install the Expo Go app and scan the QR from the terminal/Expo Dev Tools.

### Permissions
The app requests runtime permissions when needed:
- Media Library: select images from the gallery
- Camera: capture photos

Make sure to accept prompts on first use. On iOS, ensure Info.plist has appropriate usage descriptions if you build a standalone app (Expo handles this via `app.json` when configured).

### Scripts (from package.json)
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

### Project Structure
```
NewGallery/
  App.js                      # Navigation container, tabs, theming
  app.json                    # Expo config
  src/
    screens/
      GalleryScreen.js        # Albums UI (placeholder data)
      AddImageScreen.js       # Pick/capture image, caption, voice, save
    storage/
      galleryStorage.js       # AsyncStorage helpers (save/load)
    theme/
      ThemeContext.js         # Theme provider/hooks
    utils/
      sharing.js              # Sharing helpers (if used)
    voice/
      voice.js                # Voice hooks: start/stop/useVoiceRecognition
```

### How It Works (high level)
- `App.js` sets up a bottom tab navigator with `Gallery` and `Add` screens and applies light/dark theme.
- `AddImageScreen` uses Expo Image Picker to get an image, collects a caption (typed or voice), and calls `saveItem` to persist to `AsyncStorage`.
- `galleryStorage.js` stores items under the key `MY_GALLERY_ITEMS_V1` as a JSON array.
- `GalleryScreen` currently shows a stylized albums grid with placeholder data; you can extend it to render saved items from storage.

### Extending
- Replace placeholder albums with real data by loading from `loadItems()` and rendering a grid of saved images.
- Add detail view for an individual photo with share/delete.
- Wire up the search bar to filter saved items.
- Persist theme preference via context + storage.

### Troubleshooting
- If Android emulator cannot open, ensure Android Studio + SDKs are installed and an emulator is running.
- For iOS, use Xcode simulators (macOS). On Windows, prefer Android or physical devices.
- On Web, camera functionality is disabled; picking from local files may have browser constraints.
- Clear Metro/Expo caches if odd errors occur:
```bash
expo start -c
```

### License
MIT
