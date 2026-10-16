import colors from '@themes/colors';
import { FabAction } from './fabTypes';

export const GovernmentAction: FabAction = {
  id: 'government',
  icon: 'bank-outline',
  label: 'সরকারি প্রকল্প',
  color: colors.success,
  route: 'Government',
};
// export const POPAction = {
//   id: 'pop',
//   icon: 'sprout',
//   label: 'চাষ পদ্ধতি',
//   color: colors.success,
//   route: 'pop',
// };

// export const InformationAction: FabAction = {
//   id: 'information',
//   icon: 'book-open-page-variant-outline',
//   label: 'তথ্য',
//   color: colors.info,
//   route: 'Information',
// };

// export const TrainingAction: FabAction = {
//   id: 'training',
//   icon: 'school-outline',
//   label: 'প্রশিক্ষণ',
//   color: '#7E57C2',
//   route: 'Training',
// };

export const FarmAccountAction: FabAction = {
  id: 'income-exp',
  icon: 'wallet-outline',
  label: 'খামারের আয়-ব্যয়',
  color: '#7E57C2',
  route: 'FarmAccount',
};

export const InputOutputAction: FabAction = {
  id: 'input',
  icon: 'sprout-outline',
  label: 'কৃষি উপকরণ',
  color: colors.warning,
 route: 'InputOutput',
};

export const CreatePostAction: FabAction = {
  id: 'CreatePostScreen',
  icon: 'post-outline',
  label: 'Create Post',
  color: colors.primary,
  route: 'CreatePostScreen',
};