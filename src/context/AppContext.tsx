import React, { createContext, useContext, useMemo } from 'react';

// import CustomInput from '../components/inputs/CustomInput';

// import CustomDropdown from '../components/dropdowns/CustomDropdown';

// import CustomButton from '../components/buttons/CustomButton';

import { useTranslation } from 'react-i18next';

import i18n from '../localization/i18n';

interface AppContextProps {
  // CustomInput: typeof CustomInput;

  // CustomDropdown: typeof CustomDropdown;

  // CustomButton: typeof CustomButton;

  t: (key: string) => string;

  i18n: typeof i18n;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

const AppProvider = ({ children }: any) => {
  const { t } = useTranslation();

  const contextValue = useMemo(
    () => ({
      t,

      i18n,

      // CustomInput,

      // CustomDropdown,

      // CustomButton,
    }),

    [t],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;

export const useApp = () => useContext(AppContext);
