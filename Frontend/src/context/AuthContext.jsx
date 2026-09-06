import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { completeProfile as completeProfileApi, getMyProfile, logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      const storedUser = localStorage.getItem("auth_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfileState] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [location, setLocation] = useState(() => {
    try {
      const storedLocation = localStorage.getItem("user_location");
      return storedLocation ? JSON.parse(storedLocation) : null;
    } catch {
      return null;
    }
  });
  const [city, setCity] = useState(() => localStorage.getItem("user_city"));

  const setUser = (value) => {
    setUserState(value);

    if (value) {
      localStorage.setItem("auth_user", JSON.stringify(value));
    } else {
      localStorage.removeItem("auth_user");
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await getMyProfile();
      setUser(response.user || null);
      setProfileState(response.userDetails || null);
      return response;
    } catch (error) {
      setUser(null);
      setProfileState(null);
      throw error;
    }
  };

  const completeProfile = async (payload) => {
    const response = await completeProfileApi(payload);
    setProfileState(response.user || null);
    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setProfileState(null);
      // Clear token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
    }
  };



  useEffect(() => {
    const bootstrap = async () => {
      try {
        await fetchProfile();
      } catch (error) {
        console.error("Unable to fetch profile", error);
      } finally {
        setAuthLoading(false);
      }
    };

    bootstrap();
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const error = new Error("This browser does not support location services.");
      setLocationError(error.message);
      setLoadingLocation(false);
      return Promise.reject(error);
    }

    if (!window.isSecureContext && !["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      const error = new Error("Location requires a secure HTTPS connection.");
      setLocationError(error.message);
      setLoadingLocation(false);
      return Promise.reject(error);
    }

    setLoadingLocation(true);
    setLocationError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;
          const fallbackLocation = {
            latitude,
            longitude,
            formattedAddress: `Selected location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
          };

          // Coordinates are usable immediately; reverse geocoding is only an enhancement.
          setLocation(fallbackLocation);
          setCity("your location");
          localStorage.setItem("user_location", JSON.stringify(fallbackLocation));

          try {
            const controller = new AbortController();
            const timeoutTimer = setTimeout(() => controller.abort(), 3000);
            const response = await fetch(
              `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/location/reverse-geocode?latitude=${latitude}&longitude=${longitude}`,
              { signal: controller.signal }
            );
            clearTimeout(timeoutTimer);
            const data = await response.json();

            if (response.ok && data?.success && data?.location) {
              const resolvedLocation = {
                ...fallbackLocation,
                formattedAddress: data.location.formattedAddress || fallbackLocation.formattedAddress,
              };
              const resolvedCity = data.location.city || "your location";
              setLocation(resolvedLocation);
              setCity(resolvedCity);
              localStorage.setItem("user_location", JSON.stringify(resolvedLocation));
              localStorage.setItem("user_city", resolvedCity);
            }
          } catch {
            // Coordinates are already available if reverse geocoding fails.
          } finally {
            setLoadingLocation(false);
            resolve(fallbackLocation);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoadingLocation(false);
          const message = error.code === 1
            ? "Location permission is blocked. Allow location for this website in browser settings, then try again."
            : error.code === 2
              ? "Your location could not be determined. Turn on GPS/location services and try again."
              : "Location request timed out. Check GPS/location services and try again.";
          setLocationError(message);
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      authLoading,
      isAuthenticated: Boolean(user),
      setUser,
      fetchProfile,
      completeProfile,
      logout,
      loadingLocation,
      setLoadingLocation,
      location,
      setLocation,
      city,
      setCity,
      requestLocation,
      locationError,
    }),
    [user, profile, authLoading, loadingLocation, location, city, requestLocation, locationError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);