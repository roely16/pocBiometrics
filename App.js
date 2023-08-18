/* eslint-disable react-native/no-inline-styles */
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
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import DeviceCrypto, {AccessLevel, KeyTypes} from 'react-native-device-crypto';
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

  // Test react-native-device-crypto

  const [accessLevel, setAccessLevel] = React.useState<AccessLevel>(AccessLevel.AUTHENTICATION_REQUIRED);

  const testReactNativeDeviceCrypto = async () => {
    // create asymetric key with FaceID
    const key = await DeviceCrypto.getOrCreateSymmetricKey('my-key', {
      accessLevel,
      invalidateOnNewBiometry: true,
    });
    console.log('asymetric key => ', key);

    // // get public key
    // const publicKey = await DeviceCrypto.getPublicKey('my-key');
    // console.log('public key => ', publicKey);

    // // Sign
    // const sign = await DeviceCrypto.sign('my-key', 'text to sign', {
    //   biometryTitle: 'Authenticate',
    //   biometrySubTitle: 'Signing',
    //   biometryDescription: 'Authenticate your self to sign the text',
    // });
    // console.log('text signed => ', sign);

    //Encrypt
    const encrypt = await DeviceCrypto.encrypt('my-key', 'text to encrypt', {
      biometryTitle: 'Authenticate',
      biometrySubTitle: 'Encrypt',
      biometryDescription: 'Authenticate your self to encrypt the text',
    });
    console.log('text encrypted => ', encrypt);

    //Decrypt
    const decrypt = await DeviceCrypto.decrypt(
      'my-key',
      encrypt.encryptedText,
      encrypt.iv,
      {
        biometryTitle: 'Authenticate',
        biometrySubTitle: 'Decrypt',
        biometryDescription: 'Authenticate your self to encrypt the text',
      },
    );
    console.log('text decrypted => ', decrypt);
  };

  const testReactNativeDeviceCryptoDelete = async () => {
    await DeviceCrypto.deleteKey('my-key');
  };

  const isBiometryEnrolled = async () => {
    const isEnrolled = await DeviceCrypto.isBiometryEnrolled()

    if (isEnrolled) {
      const biometryType = await DeviceCrypto.getBiometryType();
      console.log('biometry type => ', biometryType);

      const deviceSecurityLevel = await DeviceCrypto.deviceSecurityLevel();
      console.log('device security leve => ', deviceSecurityLevel);
    }
    console.log('is biometry enrolled => ', isEnrolled)
  }

  // react-native-biometrics
  const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })

  const createKeys = () => {
    rnBiometrics.createKeys()
    .then((resultObject) => {
      const { publicKey } = resultObject
      console.log(publicKey)
    })
  };

  const createSignature = () => {
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
      }
    })
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={testReactNativeDeviceCrypto}>
        <Text style={{color: 'black'}}>Test react-native-device-crypto</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={isBiometryEnrolled}>
        <Text style={{color: 'black'}}>Check if biometry is enrolled</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={testReactNativeDeviceCryptoDelete}>
        <Text style={{color: 'black', marginBottom: 50}}>
          Delete Key react-native-device-crypto
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={createKeys}>
        <Text style={{color: 'black'}}>createKeys</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={createSignature}>
        <Text style={{color: 'black'}}>createSignature</Text>
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
