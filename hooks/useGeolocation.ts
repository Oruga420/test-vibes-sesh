import { useState, useEffect } from 'react';

interface GeolocationState {
  location: GeolocationCoordinates | null;
  loading: boolean;
  error: string | null;
}

const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        location: position.coords,
        loading: false,
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        location: null,
        loading: false,
        error: `Failed to get location: ${error.message}`,
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
  }, []);

  return state;
};

export default useGeolocation;
