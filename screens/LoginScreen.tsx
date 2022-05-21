import {Button, StyleSheet} from 'react-native';
import {Text, View} from '../components/Themed';
import {useEffect, useState} from 'react';
import {ResponseType, useAuthRequest} from 'expo-auth-session';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import * as tokenStore from '../store/actions/token';

const discovery = {
  authorizationEndpoint:
      'https://accounts.spotify.com/authorize',
  tokenEndpoint:
      'https://accounts.spotify.com/api/token',
};

export default function LoginScreen({navigation}: any) {
  const dispatch = useDispatch();
  const [token, setToken] = useState('');

  const [request, response, promptAsync] =
      useAuthRequest(
          {
            responseType: ResponseType.Token,
            clientId: '19e3ddbf461f4f44997f1ffe82a6eddb',
            scopes: [
              'user-read-currently-playing',
              'user-read-recently-played',
              'user-read-playback-state',
              'user-top-read',
              'user-modify-playback-state',
              'streaming',
              'user-read-email',
              'user-read-private',
            ],
            usePKCE: false,
            redirectUri: 'exp://127.0.0.1:19000/',
          },
          discovery,
      );

  useEffect(() => {
    if (response?.type === 'success') {
      const {access_token} = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      axios(
          'https://api.spotify.com/v1/me/top/tracks?time_range=short_term', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          }).then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log('error', error.message);
      });

      setTimeout(
          () =>
              navigation.navigate('Root'),
          500,
      );

      dispatch(tokenStore.addToken(token));
    }
  });

  return (
      <View style={styles.container}>
        <Button onPress={() => {
          promptAsync();
        }} title={'Login'}/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
