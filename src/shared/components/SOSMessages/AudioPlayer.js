import React, { useCallback, useState, useRef, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from 'react-native-vector-icons';
import { actionColor } from 'core/theme';

const styles = StyleSheet.create({
  icon: {
    fontSize: 45,
    color: actionColor,
  },
});

export default function AudioPlayer({ href }) {
  const timeout = useRef();
  const playback = useRef();
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({});
  const active = useMemo(() => status.isPlaying || status.shouldPlay, [status]);

  // Workaround because setStatus is not called when playback is stopped
  const setStopTimeout = () => {
    timeout.current = setTimeout(
      () => playback.current.sound.setStatusAsync({ shouldPlay: false, isPlaying: false }),
      playback.current.status.durationMillis
    );
  };

  const play = useCallback(async () => {
    if (!playback.current?.sound) {
      setLoading(true);
      playback.current = await Audio.Sound.createAsync({ uri: href });
      setLoading(false);
      playback.current.sound.setOnPlaybackStatusUpdate(setStatus);
      await playback.current.sound.playAsync();
      setStopTimeout();
      return;
    }

    if (active) {
      clearTimeout(timeout.current);
      playback.current.sound.stopAsync();
    } else {
      await playback.current.sound.replayAsync();
      setStopTimeout();
    }
  }, [href, active]);

  return (
    <TouchableOpacity onPress={play}>
      {loading ? (
        <ActivityIndicator
          style={{ marginRight: 'auto', marginTop: '2%', marginLeft: '2%' }}
          size='large'
          color='rgba(0, 0, 0, 0.4)'
        />
      ) : active ? (
        <FontAwesome name='stop-circle' style={styles.icon} />
      ) : (
        <FontAwesome name='play-circle' style={styles.icon} />
      )}
    </TouchableOpacity>
  );
}
