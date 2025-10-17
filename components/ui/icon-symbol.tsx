// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.fill': 'person',
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.fill': 'person',
  // Thêm các icon mới cho ứng dụng thai kỳ
  'magnifyingglass': 'search',
  'book.fill': 'menu-book',
  'pencil.and.outline': 'edit',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'book.closed.fill': 'book',
  'lightbulb.fill': 'lightbulb',
  'heart.fill': 'favorite',
  'calendar': 'calendar-today',
  'stethoscope': 'healing',
  'bell.fill': 'notifications',
  'figure.pregnancy': 'pregnant-woman', // Có thể cần custom icon
  'cross.case.fill': 'medical-services',
  'envelope': 'email',
  'lock': 'lock',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'checkmark': 'check',
  'logo-google': 'google',
  'logo-facebook': 'facebook',
  'nutrition': 'restaurant', // hoặc 'local-dining'
  'brain.head.profile': 'psychology',
  'figure.walk': 'directions-walk',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
