export interface FabAction {
  id: string;

  icon: string;

  label: string;

  route: string;

  color?: string;
}

export interface FabRegistryItem {
  action: FabAction;

  visible?: boolean;

  enabled?: boolean;

  roles?: string[];
}

export interface FabRegistry {
  [screenName: string]: FabRegistryItem[];
}

export type FabScreenName =
  | 'Home'
  | 'Government'
  | 'pop'
  | 'Community'
  | 'Profile'
  | 'Information'
  | 'Training'
  | 'InputOutput';