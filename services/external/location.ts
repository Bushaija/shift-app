
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(timeoutMs: number = 8000): Promise<Coordinates | null> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 10000 }
      );
    } catch {
      resolve(null);
    }
  });
}
