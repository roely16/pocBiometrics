/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.white,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {

  const backgroundStyle = {
    backgroundColor: Colors.lighter
  };

  const handleBiometris = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics()

      const { biometryType } = await rnBiometrics.isSensorAvailable()

      console.log('biometry type => ', biometryType);

      let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
      let payload = epochTimeSeconds + 'some message'

      rnBiometrics.createSignature({
          promptMessage: 'Sign in',
          payload: payload
        })
        .then((resultObject) => {
          const { success, signature } = resultObject

          if (success) {
            console.log(signature)
            verifySignatureWithServer(signature, payload)
          }
        })

    } catch (error) {
      console.log('error => ', error);
    }
    

  };

  const createKeys = () => {
    const rnBiometrics = new ReactNativeBiometrics()

    rnBiometrics.createKeys()
    .then((resultObject) => {
      const { publicKey } = resultObject
      console.log('createKeys => ', publicKey)
    })
  };

  const createSignature = () => {
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
    let payload = 'a'

    const rnBiometrics = new ReactNativeBiometrics()

    rnBiometrics.createSignature({
        promptMessage: 'Sign in',
        payload: payload
      })
      .then((resultObject) => {
        const { success, signature } = resultObject

        if (success) {
          console.log('createSignature => ', signature)
        }
      })
  };

  const isSensorAvailable = () => {
    const rnBiometrics = new ReactNativeBiometrics()

    rnBiometrics.isSensorAvailable()
      .then((resultObject) => {
        const { available, biometryType } = resultObject

        if (available && biometryType === BiometryTypes.TouchID) {
          console.log('TouchID is supported')
        } else if (available && biometryType === BiometryTypes.FaceID) {
          console.log('FaceID is supported')
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          console.log('Biometrics is supported')
        } else {
          console.log('Biometrics not supported')
        }
      })
  }

  const deleteKeys = () => {
    const rnBiometrics = new ReactNativeBiometrics()

    rnBiometrics.deleteKeys()
      .then((resultObject) => {
        const { keysDeleted } = resultObject

        if (keysDeleted) {
          console.log('Successful deletion')
        } else {
          console.log('Unsuccessful deletion because there were no keys to delete')
        }
      })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity style={{ marginBottom: 20 }} onPress={createKeys}>
        <Text style={{ color: 'black' }}>Create Keys</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginBottom: 20 }} onPress={createSignature}>
        <Text style={{ color: 'black' }}>Create Signature</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginBottom: 20 }} onPress={isSensorAvailable}>
        <Text style={{ color: 'black' }}>isSensorAvailable</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteKeys}>
        <Text style={{ color: 'black' }}>Delete Keys</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
