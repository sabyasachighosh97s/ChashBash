import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Pressable, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FabActionItem, { FabAction } from './FabActionItem';

type Props = {
  visible: boolean;
  actions: FabAction[];
  onClose?: () => void;
  bottom?: number;
};

const FabMenu = ({ visible, actions, onClose, bottom = 175 }: Props) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0.92)).current;

  const itemAnimations = useRef(
    actions.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    if (visible) {
      itemAnimations.forEach(anim => anim.setValue(0));

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),

        Animated.timing(menuOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),

        Animated.spring(menuScale, {
          toValue: 1,
          friction: 7,
          tension: 90,
          useNativeDriver: true,
        }),

        Animated.stagger(
          45,
          itemAnimations.map(anim =>
            Animated.timing(anim, {
              toValue: 1,
              duration: 260,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ),
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.timing(menuOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.timing(menuScale, {
          toValue: 0.92,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, menuOpacity, menuScale, itemAnimations]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(9, 2, 2, 0.42)',
              'rgba(53, 52, 52, 0.72)',
              'rgba(0, 0, 0, 0.74)',
            ]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Pressable>
      <Animated.View
        style={[
          styles.container,
          {
            bottom,
            opacity: menuOpacity,
            transform: [{ scale: menuScale }],
          },
        ]}
      >
        <View style={styles.grid}>
          {actions.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                styles.gridItem,
                {
                  opacity: itemAnimations[index],
                  transform: [
                    {
                      translateY: itemAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [25, 0],
                      }),
                    },
                    {
                      scale: itemAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.85, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <FabActionItem item={item} />
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

export default FabMenu;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: '#000',
  },

  container: {
    position: 'absolute',
    // right: 10,
    width: '100%',
    zIndex: 999,
    left: 100,
  },

  grid: {
    // flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 22,
  },
});
