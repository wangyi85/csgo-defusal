# CS:GO Defusal
Mobile app simulating the c4 explosive from Counter Strike: Global Offensive bomb defusal scenarios.

# To test on android

- open up android sdk
- start your virtual device
- run `npm run android`


# To release a new version

- update version in `android/app/build.gradle`
- `npm run np`



# To generate APK Signing Key

### Generate keystore

`keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`

`openssl base64 < my-upload-key.keystore  | tr -d '\n' | tee my-upload-key.keystore.base64.txt`