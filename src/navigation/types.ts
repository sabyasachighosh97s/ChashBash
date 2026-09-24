// export type RootStackParamList = {
//   Home: undefined;

//   Details: {
//     id: number;
//   };
// };

export type RootStackParamList = {
  Home: undefined;

  Details: {
    id: number;
  };
  Splash: undefined;
  Login: undefined;
  OtpVerification: undefined;

  RegistrationScreen: {
    user?: any;
  };

  MainTabs: undefined;

  Information: undefined;
  Training: undefined;
  InputOutput: undefined;

  DiseaseResult: undefined;
  VisionCamera: undefined;
  Comments: undefined;
  CreatePostScreen: undefined;
  WeatherDetails: undefined;
  GovernmentSchemeDetails: undefined;

  MyCropsScreen: {
    lands: Land[];
  };
};

export type Crop = {
  id: string;
  crop_variety_id: string;
  crop_variety_name: string;
  crop_name_id: string;
  crop_name: string;
  crop_type_id: string;
  crop_type_name: string;
  area_hectares: number;
  status: string;
};

export type Land = {
  id: string;
  name: string;
  area: number;
  crops: Crop[];
};