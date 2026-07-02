import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

/*
=========================================================
Types
=========================================================
*/

export type UserType = 'guest' | 'otp' | 'registered';

export interface UserProfile {
  name: string;
  phone: string;
  state: string;
  district: string;
  block: string;
}

export interface AuthSession {
  isLoggedIn: boolean;

  userType: UserType;

  profileCompleted: boolean;

  cropCompleted: boolean;

  token: string;

  user: UserProfile;
}

/*
=========================================================
Context Interface
=========================================================
*/

interface AuthContextProps {
  isLoading: boolean;

  isLoggedIn: boolean;

  userType: UserType;

  profileCompleted: boolean;

  cropCompleted: boolean;

  user: UserProfile;

  loginAsGuest: () => Promise<void>;

  loginWithOtp: (phone: string) => Promise<void>;

  completeProfile: (profile: UserProfile) => Promise<void>;

  completeCrop: () => Promise<void>;

  logout: () => Promise<void>;
}

/*
=========================================================
Storage Key
=========================================================
*/

const AUTH_STORAGE_KEY = 'AUTH_SESSION';

/*
=========================================================
Context
=========================================================
*/

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

/*
=========================================================
Provider
=========================================================
*/

const AuthProvider = ({ children }: any) => {
  /*
  =========================================================
  States
  =========================================================
  */

  const [isLoading, setIsLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userType, setUserType] = useState<UserType>('guest');

  const [profileCompleted, setProfileCompleted] = useState(false);

  const [cropCompleted, setCropCompleted] = useState(false);

  const [user, setUser] = useState<UserProfile>({
    name: '',
    phone: '',
    state: '',
    district: '',
    block: '',
  });

  /*
  =========================================================
  Restore Session
  =========================================================
  */

  useEffect(() => {
    restoreSession();
  }, []);

  /*
  =========================================================
  Save Session
  =========================================================
  */

  const saveSession = async (session: AuthSession) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.log('Save Session Error', e);
    }
  };

  /*
  =========================================================
  Clear Session
  =========================================================
  */

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.log('Clear Session Error', e);
    }
  };
  /*
  =========================================================
  Restore Session
  =========================================================
  */

  const restoreSession = async () => {
    try {
      const session = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

      if (!session) {
        setIsLoading(false);
        return;
      }

      const data: AuthSession = JSON.parse(session);

      setIsLoggedIn(data.isLoggedIn);

      setUserType(data.userType);

      setProfileCompleted(data.profileCompleted);

      setCropCompleted(data.cropCompleted);

      setUser(data.user);
    } catch (e) {
      console.log('Restore Session Error', e);
    } finally {
      setIsLoading(false);
    }
  };

  /*
  =========================================================
  Guest Login
  =========================================================
  */

  const loginAsGuest = async () => {
    const session: AuthSession = {
      isLoggedIn: true,

      userType: 'guest',

      profileCompleted: false,

      cropCompleted: false,

      token: '',

      user: {
        name: '',
        phone: '',
        state: '',
        district: '',
        block: '',
      },
    };

    setIsLoggedIn(true);

    setUserType('guest');

    setProfileCompleted(false);

    setCropCompleted(false);

    setUser(session.user);

    await saveSession(session);
  };

  /*
  =========================================================
  OTP Login
  =========================================================
  */

  const loginWithOtp = async (phone: string) => {
    const session: AuthSession = {
      isLoggedIn: true,

      userType: 'otp',

      profileCompleted: false,

      cropCompleted: false,

      token: '',

      user: {
        name: '',
        phone,

        state: '',

        district: '',

        block: '',
      },
    };

    setIsLoggedIn(true);

    setUserType('otp');

    setProfileCompleted(false);

    setCropCompleted(false);

    setUser(session.user);

    await saveSession(session);
  };

  /*
  =========================================================
  Complete Profile
  =========================================================
  */

  const completeProfile = async (profile: UserProfile) => {
    const session: AuthSession = {
      isLoggedIn: true,

      userType: 'registered',

      profileCompleted: true,

      cropCompleted,

      token: '',

      user: profile,
    };

    setUser(profile);

    setUserType('registered');

    setProfileCompleted(true);

    await saveSession(session);
  };

  /*
  =========================================================
  Complete Crop
  =========================================================
  */

  const completeCrop = async () => {
    const session: AuthSession = {
      isLoggedIn,

      userType,

      profileCompleted,

      cropCompleted: true,

      token: '',

      user,
    };

    setCropCompleted(true);

    await saveSession(session);
  };

  /*
  =========================================================
  Logout
  =========================================================
  */

  const logout = async () => {
    setIsLoggedIn(false);

    setUserType('guest');

    setProfileCompleted(false);

    setCropCompleted(false);

    setUser({
      name: '',

      phone: '',

      state: '',

      district: '',

      block: '',
    });

    await clearSession();
  };
  /*
  =========================================================
  Context Value
  =========================================================
  */

  const value = useMemo(
    () => ({
      isLoading,

      isLoggedIn,

      userType,

      profileCompleted,

      cropCompleted,

      user,

      loginAsGuest,

      loginWithOtp,

      completeProfile,

      completeCrop,

      logout,
    }),
    [isLoading, isLoggedIn, userType, profileCompleted, cropCompleted, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

/*
=========================================================
Hook
=========================================================
*/

export const useAuth = () => useContext(AuthContext);
