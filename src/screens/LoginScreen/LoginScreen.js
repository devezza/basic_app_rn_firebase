import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase/config'; // Importe a instância do app do Firebase
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = () => {
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        const usersCollection = collection(firestore, 'user');
      
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const uid = userCredential.user.uid;
            const userDocRef = doc(usersCollection, uid);
      
            getDoc(userDocRef)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const user = snapshot.data();
                  
                  navigation.navigate('Home', { user });

                } else {
                  alert("User does not exist anymore.");
                }
              })
              .catch((error) => {
                console.error('Error fetching user document:', error);
                alert(error.message);
              });
          })
          .catch((error) => {
            console.error('Error signing in:', error);
            alert(error.message);
          });
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/conquest-logo.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Login</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Ainda não tem conta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}