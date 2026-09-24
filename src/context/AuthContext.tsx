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
  id: string;

  name: string;

  phone: string;

  email: string;

  state: string;

  district: string;

  block: string;

  type: string;

  isActive: boolean;

  createdAt: string;
  files?: any[];
  stateID: string;

  districtID: string;

  blockID: string;
  // subdivision_name: string;
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
  token: string;
  isLoading: boolean;

  isLoggedIn: boolean;

  userType: UserType;

  profileCompleted: boolean;

  cropCompleted: boolean;

  user: UserProfile;

  loginAsGuest: () => Promise<void>;

  // Future OTP login
  loginWithOtp: (token: string, profile: UserProfile) => Promise<void>;

  // Current password login
  loginWithPassword: (
    token: string,
    profile: UserProfile,
    cropCompleted: boolean,
  ) => Promise<void>;
  completeProfile: (profile: UserProfile) => Promise<void>;

  updateUser: (profile: UserProfile) => Promise<void>;

  completeCrop: () => Promise<void>;

  logout: () => Promise<void>;
}

/*
=========================================================
Storage Key
=========================================================
*/

const AUTH_STORAGE_KEY = 'AUTH_SESSION';
// const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

// const FARMER_PROFILE_KEY = 'FARMER_PROFILE';

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
  const [token, setToken] = useState('');

  const [user, setUser] = useState<UserProfile>({
    id: '',

    name: '',

    phone: '',

    email: '',

    state: '',

    district: '',

    block: '',

    type: '',

    isActive: false,

    createdAt: '',
    stateID: '',
    districtID: '',
    blockID: '',
    // subdivision_name: '',
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
      setToken(data.token);
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
        id: '',

        name: '',

        phone: '',

        email: '',

        state: '',

        district: '',

        block: '',

        type: 'farmer',

        isActive: false,

        createdAt: '',
        stateID: '',
        districtID: '',
        blockID: '',
        // subdivision_name: '',
      },
    };

    setIsLoggedIn(true);

    setUserType('guest');

    setProfileCompleted(false);

    setCropCompleted(false);
    setToken('');
    setUser(session.user);

    await saveSession(session);
  };

  /*
  =========================================================
  OTP Login
  =========================================================
  */

  const loginWithOtp = async (accessToken: string, profile: UserProfile) => {
    const session: AuthSession = {
      isLoggedIn: true,

      userType: 'registered',

      profileCompleted: true,

      cropCompleted: false,

      token: accessToken,

      user: profile,
    };

    setIsLoggedIn(true);

    setToken(accessToken);

    setUser(profile);

    setUserType('registered');

    setProfileCompleted(true);

    setCropCompleted(false);

    await saveSession(session);
  };

  const loginWithPassword = async (
    accessToken: string,
    profile: UserProfile,
    hasCropRegistration: boolean,
  ) => {
    const session: AuthSession = {
      isLoggedIn: true,

      userType: 'registered',

      profileCompleted: true,

      cropCompleted: hasCropRegistration,

      token: accessToken,

      user: profile,
    };

    setIsLoggedIn(true);

    setToken(accessToken);

    setUser(profile);

    setUserType('registered');

    setProfileCompleted(true);

    setCropCompleted(hasCropRegistration);

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

      token,

      user: profile,
    };
    setIsLoggedIn(true);
    setToken(token);
    setUser(profile);

    setUserType('registered');

    setProfileCompleted(true);

    await saveSession(session);
  };
  const updateUser = async (profile: UserProfile) => {
    const session: AuthSession = {
      isLoggedIn,

      userType,

      profileCompleted,

      cropCompleted,

      token,

      user: profile,
    };

    setUser(profile);

    await saveSession(session);
  }; /*
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

      token,

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
    setToken('');
    setUser({
      id: '',

      name: '',

      phone: '',

      email: '',

      state: '',

      district: '',

      block: '',

      type: 'farmer',

      isActive: false,

      createdAt: '',
      stateID: '',
      districtID: '',
      blockID: '',
      // subdivision_name: '',
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
      token,
      isLoading,

      isLoggedIn,

      userType,

      profileCompleted,

      cropCompleted,

      user,

      loginAsGuest,

      loginWithOtp,
      loginWithPassword,
      completeProfile,
      updateUser,
      completeCrop,

      logout,
    }),
    [
      token,
      isLoading,
      isLoggedIn,
      userType,
      profileCompleted,
      cropCompleted,
      user,
    ],
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
