import { NativeModules } from 'react-native';

console.log('NativeModules => ', Object.keys(NativeModules));
console.log('TextToSpeech => ', NativeModules.TextToSpeech);

export const TextToSpeech = NativeModules.TextToSpeech;