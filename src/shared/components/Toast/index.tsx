import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';

import { styles } from './styles';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

const DURATION = 3000;

let toastId = 0;

const toasts: Toast[] = [];

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(listener => listener());
}

export function show(message: string, type: ToastType = 'default', duration = DURATION) {
  const id = `toast-${toastId++}`;

  const toast: Toast = { id, message, type, duration };

  toasts.push(toast);
  notify();

  if (duration > 0) {
    setTimeout(() => {
      dismiss(id);
    }, duration);
  }

  return id;
}

export function dismiss(id: string) {
  const index = toasts.findIndex(t => t.id === id);

  if (index !== -1) {
    toasts.splice(index, 1);
    notify();
  }
}

export function dismissAll() {
  toasts.length = 0;
  notify();
}

export function ToastContainer() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const opacity = new Animated.Value(0);

  const translateY = new Animated.Value(-20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dismiss(toast.id);
    });
  }, [toast.id]);

  return (
    <Animated.View
      style={[
        styles.toast,
        styles[`toast_${toast.type}`],
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={handleDismiss} style={styles.pressable}>
        <Text style={styles.text}>{toast.message}</Text>
      </Pressable>
    </Animated.View>
  );
}
