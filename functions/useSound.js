import { Audio } from 'expo-av';
import { useState, useCallback, useEffect } from 'react';

export default function useSound(path) {
    const [sound, setSound] = useState();
  
    useEffect(() => {
      return sound ? () => {
        sound.unloadAsync();
      } : undefined;
    }, [sound]);
  
    const playSound = useCallback(async () => {
      const { sound } = await Audio.Sound.createAsync(path);
      setSound(sound);
      await sound.playAsync();
    }, [sound]);
  
    const stopSound = useCallback(async () => {
      await sound.stopAsync();
    }, [sound]);
  
    return [playSound, stopSound];
  }