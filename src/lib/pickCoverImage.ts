/**
 * Open the photo library, let the user pick one image, and copy the file
 * into the app's persistent document directory.
 *
 * Returns the file:// URI of the persistent copy on success, or null if
 * the user cancelled or denied permission.
 *
 * Uses lazy require() for expo-image-picker so that a missing native module
 * (e.g. running in an old Expo Go or a dev client built before this dep
 * was added) does not crash the Recipe screen at module-load time — the
 * error only surfaces if the user actually taps "Change cover".
 */
export async function pickCoverImage(recipeId: string): Promise<string | null> {
  let ImagePicker: typeof import('expo-image-picker');
  let FileSystem: typeof import('expo-file-system');
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ImagePicker = require('expo-image-picker');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    FileSystem = require('expo-file-system');
  } catch {
    throw new Error('IMAGE_PICKER_UNAVAILABLE');
  }
  // A half-loaded module can return without throwing but be missing its
  // native bindings (happens in older runtimes). Treat that as unavailable.
  if (
    !ImagePicker ||
    typeof ImagePicker.launchImageLibraryAsync !== 'function'
  ) {
    throw new Error('IMAGE_PICKER_UNAVAILABLE');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 11],
    quality: 0.85,
  });

  if (result.canceled) return null;
  const asset = result.assets?.[0];
  if (!asset?.uri) return null;

  const dir = `${FileSystem.documentDirectory}recipe-covers/`;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});

  const ext = (asset.uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)?.[1] ?? 'jpg').toLowerCase();
  const dest = `${dir}${recipeId}-${Date.now()}.${ext}`;
  await FileSystem.copyAsync({ from: asset.uri, to: dest });

  return dest;
}
