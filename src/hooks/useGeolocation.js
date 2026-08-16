import { useCallback, useState } from 'react';

export function useGeolocation() {
  const [status, setStatus] = useState('prompt'); // prompt | requesting | granted | denied
  const [location, setLocation] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      return;
    }
    setStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus('granted');
      },
      () => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { status, location, requestLocation };
}
