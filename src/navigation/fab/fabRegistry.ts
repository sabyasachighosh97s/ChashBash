import {
  
  // InformationAction,
  // TrainingAction,
  InputOutputAction,
  // POPAction,
  GovernmentAction,
   FarmAccountAction,
    // FarmIncomeExpenseAction,
} from './fabActions';

import { FabRegistry } from './fabTypes';

/*
=========================================
COMMON CENTER FAB MENU
=========================================
*/

const MainFabActions = [
  {
    action: GovernmentAction,
  },
// {
//     action: POPAction,
//   },

  // {
  //   action: InformationAction,
  // },

  // {
  //   action: TrainingAction,
  // },

  {
    action: InputOutputAction,
  },
  {
    action: FarmAccountAction,
  },
  //  {
  //   action: FarmIncomeExpenseAction,
  // },
];

/*
=========================================
FAB REGISTRY
=========================================
*/

export const fabRegistry: FabRegistry = {
  /*
  Bottom Tabs
  */

  Home: MainFabActions,

    POP: MainFabActions,
  // Government: MainFabActions,

  Community: MainFabActions,

  Profile: MainFabActions,

  /*
  Other Screens
  */

  Information: [],

  Training: [],

  InputOutput: [],

  
   FarmAccount: [],
};