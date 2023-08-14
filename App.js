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
import {
  generateKeyPair,
  encrypt,
  sign,
  decrypt,
  getKey,
} from 'react-native-secure-encryption-module';
// import ECEncryption from 'react-native-ec-encryption';
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
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  const handleBiometris = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();

      const {biometryType} = await rnBiometrics.isSensorAvailable();

      console.log('biometry type => ', biometryType);

      let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
      let payload = epochTimeSeconds + 'some message';

      rnBiometrics
        .createSignature({
          promptMessage: 'Sign in',
          payload: payload,
        })
        .then(resultObject => {
          const {success, signature} = resultObject;

          if (success) {
            console.log(signature);
            verifySignatureWithServer(signature, payload);
          }
        });
    } catch (error) {
      console.log('error => ', error);
    }
  };

  const createKeys = () => {
    const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics.createKeys().then(resultObject => {
      const {publicKey} = resultObject;
      console.log('createKeys => ', publicKey);
    });
  };

  const createSignature = () => {
    let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
    let payload = 'a';

    const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics
      .createSignature({
        promptMessage: 'Sign in',
        payload: payload,
      })
      .then(resultObject => {
        const {success, signature} = resultObject;

        if (success) {
          console.log('createSignature => ', signature);
        }
      });
  };

  const isSensorAvailable = () => {
    const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType} = resultObject;

      if (available && biometryType === BiometryTypes.TouchID) {
        console.log('TouchID is supported');
      } else if (available && biometryType === BiometryTypes.FaceID) {
        console.log('FaceID is supported');
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        console.log('Biometrics is supported');
      } else {
        console.log('Biometrics not supported');
      }
    });
  };

  // const deleteKeys = () => {
  //   const rnBiometrics = new ReactNativeBiometrics();

  //   rnBiometrics.deleteKeys().then(resultObject => {
  //     const {keysDeleted} = resultObject;;

  //     if (keysDeleted) {
  //       console.log('Successful deletion');;
  //     } else {
  //       console.log(
  //         'Unsuccessful deletion because there were no keys to delete',;
  //       );
  //     }
  //   });
  // };

  const getKeyPair = async () => {
    const key = await generateKeyPair('my-key');
    console.log('generate key pair => ', key);
    const returnKey = await getKey('my-key');
    console.log('return key => ', returnKey);
    const cipher = await encrypt('Encrypt this message', 'my-key');
    console.log('cipher message => ', cipher);
    const sign_message = await sign('Sign this message', 'my-key');
    console.log('sign message => ', sign_message);
    const clearText = await decrypt(cipher, 'my-key');
    console.log('message decrypt => ', clearText);
  };

  // const testReactNativeEC = async () => {
  //   try {
  //     //Encrypt
  //     const cipherText = await ECEncryption.encrypt({
  //       data: 'some confidential data',
  //       label: '0x5Cc5dc62be3c95C771C14232e30358B398265deF', //any identical string
  //     });
  //     //Decrypt
  //     const clearText = await ECEncryption.decrypt({
  //       data: cipherText,
  //       label: '0x5Cc5dc62be3c95C771C14232e30358B398265deF', //the same identical string
  //     });
  //     console.log('decrypt result is ', clearText);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // Test react-native-device-crypto

  const [accessLevel, setAccessLevel] = React.useState<AccessLevel>(2);

  const testReactNativeDeviceCrypto = async () => {
    // create asymetric key with FaceID
    const key = await DeviceCrypto.getOrCreateAsymmetricKey('my-key', {
      accessLevel,
      invalidateOnNewBiometry: true,
    });
    console.log('asymetric key => ', key);

    // get public key
    const publicKey = await DeviceCrypto.getPublicKey('my-key');
    console.log('public key => ', publicKey);

    // Sign
    const sign = await DeviceCrypto.sign('my-key', 'text to sign', {
      biometryTitle: 'Authenticate',
      biometrySubTitle: 'Signing',
      biometryDescription: 'Authenticate your self to sign the text',
    });
    console.log('text signed => ', sign);

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
        biometrySubTitle: 'Encrypt',
        biometryDescription: 'Authenticate your self to encrypt the text',
      },
    );
    console.log('text decrypted => ', decrypt);
  };

  const testReactNativeDeviceCryptoDelete = async () => {
    await DeviceCrypto.deleteKey('my-key');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <TouchableOpacity style={{marginBottom: 20}} onPress={createKeys}>
        <Text style={{color: 'black'}}>Create Keys</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{marginBottom: 20}} onPress={createSignature}>
        <Text style={{color: 'black'}}>Create Signature</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{marginBottom: 20}} onPress={isSensorAvailable}>
        <Text style={{color: 'black'}}>isSensorAvailable</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{marginBottom: 20}} onPress={getKeyPair}>
        <Text style={{color: 'black'}}>Generate a KeyPair</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={{marginBottom: 20}} onPress={testReactNativeEC}>
        <Text style={{color: 'black'}}>Test React-Native-EC-Encryption</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={testReactNativeDeviceCrypto}>
        <Text style={{color: 'black'}}>Test react-native-device-crypto</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginBottom: 20}}
        onPress={testReactNativeDeviceCryptoDelete}>
        <Text style={{color: 'black'}}>
          Delete Key react-native-device-crypto
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={deleteKeys}>
        <Text style={{color: 'black'}}>Delete Keys</Text>
      </TouchableOpacity> */}
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
