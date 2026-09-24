// components/AppIcon.js
import React,{FC} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ICON_SETS = {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
};

type AppIconProps = {
  name: string;
  type?: keyof typeof ICON_SETS;
  size?: number;
  color?: string;
  [key: string]: any;
};

const AppIcon: FC<AppIconProps> = ({ name, type = 'FontAwesome', size = 24, color = '#000', ...props }) => {
  const IconComponent = ICON_SETS[type];

  if (!IconComponent) {
    console.warn(`Icon type "${type}" is not supported.`);
    return null;
  }

  return <IconComponent name={name} size={size} color={color} {...props} />;
};

export default AppIcon;
