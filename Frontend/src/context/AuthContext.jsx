import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);

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

  useEffect(() => {
    if(!navigator.geolocation){
      return alert("please allow location to continue")
    }
    setLoadingLocation(true)

    navigator.geolocation.getCurrentPosition(async(position) => {
      const { latitude, longitude } = position.coords;

      try{
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        setLocation({ latitude, longitude, formattedAddress: data.display_name || "current location" });
        setCity(data.address.city || data.address.town || data.address.village || null);
      }catch(error){
        setLocation({ latitude, longitude, formattedAddress: "current location" });
        setCity("Failed to fetch location");
      }
    })
  })

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
    }),
    [user, profile, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);