import React from 'react';
import { Animated, Easing } from 'react-native';

// Fade in animation hook
export function useFadeIn(duration: number = 300) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, duration]);

  return fadeAnim;
}

// Slide up animation hook
export function useSlideUp(duration: number = 300, delay: number = 0) {
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim, duration, delay]);

  return { slideAnim, opacityAnim };
}

// Scale animation hook
export function useScale(duration: number = 200) {
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim, duration]);

  return { scaleAnim, opacityAnim };
}

// Pulse animation hook
export function usePulse(duration: number = 1000) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim, duration]);

  return pulseAnim;
}

// Shake animation hook
export function useShake() {
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const shake = React.useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  return { shakeAnim, shake };
}

// Animated components
export function FadeInView({
  children,
  duration = 300,
  style = {},
  ...props
}: {
  children: React.ReactNode;
  duration?: number;
  style?: any;
  [key: string]: any;
}) {
  const fadeAnim = useFadeIn(duration);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

export function SlideUpView({
  children,
  duration = 300,
  delay = 0,
  style = {},
  ...props
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: any;
  [key: string]: any;
}) {
  const { slideAnim, opacityAnim } = useSlideUp(duration, delay);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

export function ScaleInView({
  children,
  duration = 200,
  style = {},
  ...props
}: {
  children: React.ReactNode;
  duration?: number;
  style?: any;
  [key: string]: any;
}) {
  const { scaleAnim, opacityAnim } = useScale(duration);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

// Staggered animation for lists
export function useStaggeredAnimation(
  itemCount: number,
  staggerDelay: number = 100,
  animationDuration: number = 300
) {
  const animations = React.useMemo(
    () => Array.from({ length: itemCount }, (_, i) => new Animated.Value(0)),
    [itemCount]
  );

  React.useEffect(() => {
    const animations_ = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: animationDuration,
        delay: index * staggerDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    Animated.stagger(staggerDelay, animations_).start();
  }, [animations, staggerDelay, animationDuration]);

  return animations;
}
