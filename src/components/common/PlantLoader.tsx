import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

const PlantLoader = () => {
  /**
   * --------------------------------------------------------------------------
   * Animation Values
   * --------------------------------------------------------------------------
   *
   * growth  -> seed to growing plant
   * sway    -> very subtle natural wind movement
   * glow    -> soft ground/light breathing effect
   *
   * Important:
   * - growth/glow use JS driver because height/opacity are animated.
   * - sway uses native driver on a separate wrapper.
   * --------------------------------------------------------------------------
   */

  const growth = useRef(
    new Animated.Value(0),
  ).current;

  const sway = useRef(
    new Animated.Value(0),
  ).current;

  const glow = useRef(
    new Animated.Value(0),
  ).current;

  useEffect(() => {
    /**
     * ------------------------------------------------------------------------
     * Plant Growth
     * ------------------------------------------------------------------------
     *
     * Seed
     *   ↓
     * Small stem
     *   ↓
     * First leaf
     *   ↓
     * Second leaf
     *   ↓
     * Full seedling
     */

    const growthAnimation = Animated.loop(
      Animated.sequence([
        // Small pause before the seed starts growing
        Animated.delay(120),

        // Main growth
        Animated.timing(growth, {
          toValue: 1,
          duration: 2400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),

        // Hold the fully grown plant
        Animated.delay(650),

        // Reset for the next cycle
        Animated.timing(growth, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),

        Animated.delay(180),
      ]),
    );

    /**
     * ------------------------------------------------------------------------
     * Natural Wind / Sway
     * ------------------------------------------------------------------------
     *
     * This animation is isolated on the outer wrapper so it never conflicts
     * with the JS-driven growth animation.
     */

    const swayAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(sway, {
          toValue: -1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(sway, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    /**
     * ------------------------------------------------------------------------
     * Soft Ground Glow
     * ------------------------------------------------------------------------
     */

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),

        Animated.timing(glow, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    );

    growthAnimation.start();
    swayAnimation.start();
    glowAnimation.start();

    return () => {
      growthAnimation.stop();
      swayAnimation.stop();
      glowAnimation.stop();
    };
  }, [growth, sway, glow]);

  /**
   * --------------------------------------------------------------------------
   * Growth Interpolations
   * --------------------------------------------------------------------------
   */

  // Stem gradually grows upward.
  const stemHeight = growth.interpolate({
    inputRange: [
      0,
      0.08,
      0.22,
      0.42,
      0.65,
      1,
    ],
    outputRange: [
      2,
      5,
      12,
      23,
      38,
      52,
    ],
  });

  // Plant becomes slightly larger as it grows.
  const plantScale = growth.interpolate({
    inputRange: [
      0,
      0.18,
      0.45,
      1,
    ],
    outputRange: [
      0.72,
      0.78,
      0.90,
      1,
    ],
  });

  /**
   * First leaf
   */
  const leftLeafOpacity = growth.interpolate({
    inputRange: [
      0,
      0.22,
      0.36,
      1,
    ],
    outputRange: [
      0,
      0,
      1,
      1,
    ],
  });

  const leftLeafScale = growth.interpolate({
    inputRange: [
      0,
      0.25,
      0.40,
      1,
    ],
    outputRange: [
      0.05,
      0.05,
      0.82,
      1,
    ],
  });

  /**
   * Second leaf
   */
  const rightLeafOpacity = growth.interpolate({
    inputRange: [
      0,
      0.42,
      0.56,
      1,
    ],
    outputRange: [
      0,
      0,
      1,
      1,
    ],
  });

  const rightLeafScale = growth.interpolate({
    inputRange: [
      0,
      0.45,
      0.60,
      1,
    ],
    outputRange: [
      0.05,
      0.05,
      0.82,
      1,
    ],
  });

  /**
   * Small top leaf
   */
  const topLeafOpacity = growth.interpolate({
    inputRange: [
      0,
      0.68,
      0.80,
      1,
    ],
    outputRange: [
      0,
      0,
      1,
      1,
    ],
  });

  const topLeafScale = growth.interpolate({
    inputRange: [
      0,
      0.70,
      0.84,
      1,
    ],
    outputRange: [
      0.05,
      0.05,
      0.80,
      1,
    ],
  });

  /**
   * Seed slowly disappears as the stem emerges.
   */
  const seedOpacity = growth.interpolate({
    inputRange: [
      0,
      0.08,
      0.18,
      0.30,
    ],
    outputRange: [
      1,
      1,
      0.45,
      0,
    ],
  });

  const seedScale = growth.interpolate({
    inputRange: [
      0,
      0.10,
      0.24,
    ],
    outputRange: [
      1,
      1.05,
      0.65,
    ],
  });

  /**
   * Ground glow.
   */
  const groundGlowOpacity = glow.interpolate({
    inputRange: [
      0,
      1,
    ],
    outputRange: [
      0.10,
      0.20,
    ],
  });

  const groundGlowScale = glow.interpolate({
    inputRange: [
      0,
      1,
    ],
    outputRange: [
      0.94,
      1.05,
    ],
  });

  /**
   * Very subtle plant rotation.
   */
  const plantRotate = sway.interpolate({
    inputRange: [
      -1,
      0,
      1,
    ],
    outputRange: [
      '-1.5deg',
      '0deg',
      '1.5deg',
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.scene}>

        {/* ------------------------------------------------------------------
            Soft background glow
        ------------------------------------------------------------------ */}

        <Animated.View
          style={[
            styles.groundGlow,
            {
              opacity: groundGlowOpacity,
              transform: [
                {
                  scale: groundGlowScale,
                },
              ],
            },
          ]}
        />

        {/* ------------------------------------------------------------------
            Very subtle ground shadow
        ------------------------------------------------------------------ */}

        <View style={styles.groundShadow} />

        {/* ------------------------------------------------------------------
            Thin soil mound
        ------------------------------------------------------------------ */}

        <View style={styles.soilMound}>
          <View style={styles.soilHighlight} />
        </View>

        {/* ------------------------------------------------------------------
            Seed
        ------------------------------------------------------------------ */}

        <Animated.View
          style={[
            styles.seed,
            {
              opacity: seedOpacity,
              transform: [
                {
                  scale: seedScale,
                },
                {
                  rotate: '-22deg',
                },
              ],
            },
          ]}
        />

        {/* ------------------------------------------------------------------
            Native-driver sway wrapper
        ------------------------------------------------------------------ */}

        <Animated.View
          style={[
            styles.swayWrapper,
            {
              transform: [
                {
                  rotate: plantRotate,
                },
              ],
            },
          ]}
        >

          {/* ----------------------------------------------------------------
              JS-driven growth wrapper
          ---------------------------------------------------------------- */}

          <Animated.View
            style={[
              styles.plant,
              {
                transform: [
                  {
                    scale: plantScale,
                  },
                ],
              },
            ]}
          >

            {/* --------------------------------------------------------------
                Stem
            -------------------------------------------------------------- */}

            <Animated.View
              style={[
                styles.stem,
                {
                  height: stemHeight,
                },
              ]}
            />

            {/* --------------------------------------------------------------
                Left leaf
            -------------------------------------------------------------- */}

            <Animated.View
              style={[
                styles.leaf,
                styles.leftLeaf,
                {
                  opacity: leftLeafOpacity,
                  transform: [
                    {
                      scale: leftLeafScale,
                    },
                    {
                      rotate: '-38deg',
                    },
                  ],
                },
              ]}
            />

            {/* --------------------------------------------------------------
                Right leaf
            -------------------------------------------------------------- */}

            <Animated.View
              style={[
                styles.leaf,
                styles.rightLeaf,
                {
                  opacity: rightLeafOpacity,
                  transform: [
                    {
                      scale: rightLeafScale,
                    },
                    {
                      rotate: '38deg',
                    },
                  ],
                },
              ]}
            />

            {/* --------------------------------------------------------------
                Top leaf
            -------------------------------------------------------------- */}

            <Animated.View
              style={[
                styles.topLeaf,
                {
                  opacity: topLeafOpacity,
                  transform: [
                    {
                      scale: topLeafScale,
                    },
                    {
                      rotate: '-10deg',
                    },
                  ],
                },
              ]}
            />

          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

/**
 * ============================================================================
 * Styles
 * ============================================================================
 */

const styles = StyleSheet.create({
  /**
   * Main loader area
   */
  container: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Animation scene
   */
  scene: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  /**
   * --------------------------------------------------------------------------
   * Ground glow
   * --------------------------------------------------------------------------
   *
   * Much softer than the previous large halo.
   */
  groundGlow: {
    position: 'absolute',
    bottom: 18,
    width: 82,
    height: 22,
    borderRadius: 50,
    backgroundColor: '#8BCF82',
  },

  /**
   * --------------------------------------------------------------------------
   * Ground shadow
   * --------------------------------------------------------------------------
   */
  groundShadow: {
    position: 'absolute',
    bottom: 15,
    width: 62,
    height: 6,
    borderRadius: 20,
    backgroundColor:
      'rgba(70, 52, 38, 0.10)',
  },

  /**
   * --------------------------------------------------------------------------
   * Soil
   * --------------------------------------------------------------------------
   *
   * Previously the soil looked like a thick rectangular block.
   *
   * Now it is intentionally:
   * - thin
   * - curved
   * - minimal
   * - closer to the reference agriculture illustration
   */
  soilMound: {
    position: 'absolute',
    bottom: 19,
    width: 68,
    height: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: '#805B3F',
  },

  /**
   * Small highlight on the top of the soil.
   */
  soilHighlight: {
    position: 'absolute',
    top: 2,
    left: 12,
    width: 44,
    height: 2,
    borderRadius: 10,
    backgroundColor: '#A47A58',
  },

  /**
   * --------------------------------------------------------------------------
   * Seed
   * --------------------------------------------------------------------------
   */
  seed: {
    position: 'absolute',
    bottom: 24,
    width: 9,
    height: 7,
    borderRadius: 8,
    backgroundColor: '#634431',
  },

  /**
   * --------------------------------------------------------------------------
   * Sway wrapper
   * --------------------------------------------------------------------------
   */
  swayWrapper: {
    position: 'absolute',
    bottom: 25,
    width: 72,
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  /**
   * --------------------------------------------------------------------------
   * Plant
   * --------------------------------------------------------------------------
   */
  plant: {
    width: 72,
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  /**
   * --------------------------------------------------------------------------
   * Stem
   * --------------------------------------------------------------------------
   */
  stem: {
    width: 4,
    minHeight: 2,
    borderRadius: 10,
    backgroundColor: '#3F8B49',
  },

  /**
   * --------------------------------------------------------------------------
   * Leaves
   * --------------------------------------------------------------------------
   */
  leaf: {
    position: 'absolute',
    width: 28,
    height: 15,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 6,
    backgroundColor: '#58A95A',
  },

  leftLeaf: {
    bottom: 21,
    left: 7,
  },

  rightLeaf: {
    bottom: 34,
    right: 7,
  },

  /**
   * --------------------------------------------------------------------------
   * Top leaf
   * --------------------------------------------------------------------------
   */
  topLeaf: {
    position: 'absolute',
    bottom: 51,
    right: 24,
    width: 20,
    height: 12,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 5,
    backgroundColor: '#69B968',
  },
});

export default PlantLoader;