import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { checkForAppUpdate } from '@utils/appVersionCheck';

interface AppUpdateContextType {
  isCheckingUpdate: boolean;
  updateRequired: boolean;
  latestVersion: string;
  storeUrl: string;
}

const AppUpdateContext = createContext<AppUpdateContextType>({
  isCheckingUpdate: true,
  updateRequired: false,
  latestVersion: '',
  storeUrl: '',
});

interface AppUpdateProviderProps {
  children: ReactNode;
}

export const AppUpdateProvider = ({
  children,
}: AppUpdateProviderProps) => {
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(true);
  const [updateRequired, setUpdateRequired] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [storeUrl, setStoreUrl] = useState('');

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const result = await checkForAppUpdate();


        setUpdateRequired(result.needsUpdate);
        setLatestVersion(result.latestVersion);
        setStoreUrl(result.storeUrl);
      } catch (error) {
        console.log('App Update Provider Error =>', error);

        setUpdateRequired(false);
      } finally {
        setIsCheckingUpdate(false);
      }
    };

    checkAppVersion();
  }, []);

  return (
    <AppUpdateContext.Provider
      value={{
        isCheckingUpdate,
        updateRequired,
        latestVersion,
        storeUrl,
      }}
    >
      {children}
    </AppUpdateContext.Provider>
  );
};

export const useAppUpdate = () => {
  return useContext(AppUpdateContext);
};