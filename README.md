// DevERP

// Multiple build creation with different Name + icon + package name

// --- android build ----
// gradlew --stop
// gradlew clean
// gradlew generateCodegenArtifactsFromSchema 
// gradlew app:assembleRelease 
// cmd - gradlew assemble[BRAND_NAME]Release

// How to used - .env.clientA and .env.cientB ??

// How to run - clientA and clientB app ??
// gradlew installClientADebug -Pbrand=[BRAND_NAME]
//ios
//npx react-native run-ios --simulator="Test1"


Payroll Mobile App – API Documentation

1. Authentication Flow

Step 1: getLink
curl --location 'https://support.deverp.net/devws/appcode.aspx/getLink' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=hg4u3v1lqcd000cgwcp35vyx' \
--data '{
    "code": "payroll"
}'

[ step 2. setAppID: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/setAppID' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "user": "suresh",
    "pass": "suresh",
    "appid": "appid",
    "firebaseid" : "firebaseid",
    "device": "device"
}'

[ step 3. getAuth: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getAuth' \
--header 'Content-Type: text/plain' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "appid":"",
    "device": ""
}'

[ step 4. getMenu: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getMenu' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "54da6bd990954c45a729d29210d23114"
}'

[ step 5. getDB: ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getDB' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "54da6bd990954c45a729d29210d23114"
}'

[ step 6. getPage ---- ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getPage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "4203ce36b6a94d8e80bb497b860384c0",
    "page": "PropMst"
}'

[ step 7. getListData ----]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getListData' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=zucfpi2splg1hbdky53rtabf' \
--data '{
    "token": "4203ce36b6a94d8e80bb497b860384c0",
    "page": "PropMst", "fd":"01-Apr-2024","td":"31-Aug-2025"
}'


[ Attandanced - punch in]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa' \
--data '{
  "token": "51b35f3b6af242898bfc397607aad328",
  "page": "punhin",
  "data": "{\"ID\":\"51b35f3b6af242898bfc397607aad328\", \"EmployeeId\":\"51b35f3b6af242898bfc397607aad328\",\"InDate\":\"\",\"InImage\":\"\",\"InRemarks\":\"\",\"InLocation\":{\"lat\":\"\",\"long\":\"\"},\"CUID\":\"51b35f3b6af242898bfc397607aad328\"}"
}
'

[ Attandanced - punch out]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa; ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa' \
--data '{
  "token": "51b35f3b6af242898bfc397607aad328",
  "page": "punhout",
  "data": "{\"ID\":\"51b35f3b6af242898bfc397607aad328\", \"EmployeeId\":\"51b35f3b6af242898bfc397607aad328\",\"OutDate\":\"\",\"OutImage\":\"\",\"OutRemarks\":\"\",\"OutLocation\":{\"lat\":\"\",\"long\":\"\"},\"CUID\":\"51b35f3b6af242898bfc397607aad328\"}"
}
'

[ get Drop-down ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getDDL' \
--header 'Content-Type: application/json' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "dtlid":"1081",
     "where": "PropTypeName=~Gender~"
}'

[ get Ajax ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getAjax' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=scsvjmlmyltbdc0aial10axa; ASP.NET_SessionId=yuhpy41xwsqjq2olhay4i3c0' \
--data '{
     "token": "d78134973d9b4697a2b3d5b8b2e87510",
     "dtlid":"1072",
     "where":"Status=~A~",
     "search": "dadfdfdfdd"
 }'

[ save page ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/savePage' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": 
"{\"EMPID\":\"1\",\"EMPCode\":\"00001\",\"CardNo\":\"\",\"BranchID\":\"1\",\"DepartmentID\":\"2\",\"DesignationID\":\"1\",\"JoinDate\":\"1/1/2025 12:00:00 AM\",\"Title\":\"Mr\",\"FirstName\":\"Satishvvbnnnnhn\",\"MiddleName\":\"Kalpeshbhai\",\"LastName\":\"Prajapati\",\"BirthDate\":\"1/1/1980 12:00:00 AM\",\"Gender\":\"M\",\"Religion\":\"Hindu\",\"BloodGroup\":\"AB-\",\"MobileNo\":\"87410256394\",\"MobileNo2\":\"\",\"PhoneNo\":\"9905012345\",\"EmailID\":\"satishk@gmail.com\",\"EmailID2\":\"satish@gmail.com\",\"EmergencyContactNo\":\"0533123456\",\"WebSite\":\"https://dev.com\",\"Disabilities\":\"51\",\"DisabilitiesRemarks\":\"\",\"LinkedIn\":\"satish.linkedin\",\"Facebook\":\"satish80\",\"Twitter\":\"satish1980\",\"Instagram\":\"satish80\",\"GitHub\":\"satishgit80\",\"CurrentAddress\":\"Bodak-dev, Near AMTS Stand, Ahmedabad\",\"CurrentCityID\":\"48428\",\"CurrentDistrict\":\"AHMEDABAD\",\"CurrentState\":\"GUJARAT\",\"CurrentCountry\":\"INDIA\",\"CurrentPin\":\"380054\",\"Address\":\"Bodak-dev, Near AMTS Stand, Ahmedabad\",\"CityID\":\"48428\",\"District\":\"AHMEDABAD\",\"State\":\"GUJARAT\",\"Country\":\"INDIA\",\"Pin\":\"380054\",\"AdharNo\":\"854172653987\",\"PANNo\":\"HGTUG5417H\",\"BankName\":\"HDFC Bank\",\"ACNo\":\"87456125367\",\"IFSCCode\":\"HDFC102310\",\"NameInBankAccount\":\"SATISH KALPESHBHAI PRAJAPATI\",\"PFNo\":\"PFSATISH\",\"ESINo\":\"ESICSATISH\",\"GratutityFormNo\":\"GT123456\",\"Status\":\"A\",\"ResignDate\":\"\",\"ResignReason\":\"\",\"Remarks\":\"\",\"LastDate\":\"\",\"UserID\":\"0\",\"CUID\":\"1\",\"Image\":\"d_logo.png\",\"CDT\":\"1/18/2025 12:00:00 AM\",\"MUID\":\"6\",\"MDT\":\"27-Aug-2025 13:22:37\"}",
 "page": "EmployeeMaster",
"token": "8c4aaf0e74fd4338943162b3876b2c7d"
}'


[ Delete ] 

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageDelete' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remark":"1=1",
     "page": "EmployeeMaster"
}'

[ Auth ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageAuth' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'


[ DeAuth ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageDeAuth' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'


[ Cancel ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/pageCancel' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=1tczjeqjqrgqtwjnq22yovtd' \
--data '{
     "token": "8c4aaf0e74fd4338943162b3876b2c7d",
     "id":"00100",
     "remarks":"1=1",
     "page": "EmployeeMaster"
}'

[ getLastPunchIn ] 

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/getLastPunchIn' \
--header 'Content-Type: application/json' \
--data '{
    "token": "49d45d99eff64492b94f449238507c7c"
}'

[ syncLocation ]

curl --location 'https://payroll.deverp.net/devws/msp_api.aspx/syncLocation' \
--header 'Content-Type: application/json' \
--header 'Cookie: ASP.NET_SessionId=ibj4tkc5ffzqbyp2xoni4pvt; ASP.NET_SessionId=2vj4yympr4l0kqag3xaxdcul' \
--data '{
    "token":"9eecfb8d7bbf4acba7568f21f078c9f5",
    "location":"45.5556,12.6655"
}'

================================================================================

1) Prerequisites (local)

Java JDK installed (openJDK 11+ recommended), Android SDK + platform tools, Android Studio or at least the Android build tools on PATH.

React Native CLI app (you said you already made a dummy app and not using Expo).

A Google account you’ll use to register as a Play developer.

(If you need help installing Android SDK / JDK I can paste commands — say the OS.)

2) Create a Google Play Developer account (one-time)

Sign up at the Play Console and pay the one-time registration fee (US$25 approx). You’ll also provide developer name and contact info. 
Google Support

Link: use Play Console signup when ready (Play Console help / Get started).

3) Prepare your app for release (source changes)

Bump versionName & versionCode in android/app/build.gradle (defaultConfig):

defaultConfig {
  applicationId "com.yourcompany.yourapp" // must be unique
  minSdkVersion rootProject.ext.minSdkVersion
  targetSdkVersion rootProject.ext.targetSdkVersion
  versionCode 1        // increment this for every upload
  versionName "1.0.0"  // visible to users
}


Always increment versionCode for every new upload. 
Android Developers

Unique applicationId / package name — Play requires each app’s package name be unique (you set this when you created the project). If you ever change it after publishing you’ll create a new app on Play.

Remove debug-only code/configs (dev servers, debug flags) and verify app works in release mode on device/emulator.

4) Create an upload key (keystore) — you control this

You need a keystore (upload key). Keep it and its passwords SAFE and back them up (Play cannot restore lost keystores easily).

Command (run in terminal):

# example — change alias/keystore name and passwords to your own values
keytool -genkey -v -keystore my-upload-key.jks -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000


This will prompt for passwords and metadata. (Works on macOS / Linux / Windows with Java's keytool available.) 
React Native

Then move the generated my-upload-key.jks into your RN project android/app/ folder (or keep it safe elsewhere — but Gradle config below expects to find or reference it).

5) Configure Gradle so release builds are signed by your upload key

React Native docs recommend storing keystore properties in ~/.gradle/gradle.properties (or android/gradle.properties) and referencing them from android/app/build.gradle.

A. Add these to ~/.gradle/gradle.properties (or android/gradle.properties):

MYAPP_UPLOAD_STORE_FILE=my-upload-key.jks
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password_here
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password_here


B. Add signing config to android/app/build.gradle (example snippet inside android { ... }):

signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
buildTypes {
    release {
        // Make sure you keep minify / proguard settings as desired
        signingConfig signingConfigs.release
        // minifyEnabled true/false depending on your needs
    }
}


This is the standard RN/Android way to point Gradle at your keystore. React Native docs explain this flow in detail. 
React Native

Important: for security, don’t check your *.jks or passwords into Git — add them to .gitignore and use secure storage/CI secrets.

6) Enroll in Play App Signing (Google Play signing)

For new apps, Play App Signing is mandatory: you upload an upload key (the one you created above) and Google will manage final app signing and distribution keys. Enroll when you create the app or during upload. 
Android Developers
Google Support

(Short version: you keep your upload key safe and upload the AAB signed with that upload key; Google manages the final signing key and distribution.)

7) Build the Android App Bundle (.aab)

Google Play requires/upload prefers AAB (Android App Bundle). From your RN project root:

# macOS / Linux
cd android
./gradlew bundleRelease

# Windows
cd android
gradlew.bat bundleRelease


When the build succeeds the AAB will be at:
android/app/build/outputs/bundle/release/app-release.aab — ready to upload to Play. 
React Native

8) Test the release build

Options:

Use Internal testing or Internal app sharing in Play Console (fastest way to get an installable link to testers). This avoids needing to produce APKs locally — upload the .aab to the internal track and invite testers. 
Google Play
Google Support

(Advanced) Use bundletool to generate device-specific APKs from the AAB and sideload — but internal testing is easier.

9) Create the app in Play Console & upload the AAB

Open Play Console → Create app → choose app name, language, app vs game, paid/free. (You picked up the dev account in step 2.) 
Google Support

Fill App Content (Policy) — privacy policy URL, data safety, target audience, content rating, ads declaration. These must be completed before publishing. 
Google Support
+1

Go to Release > Testing > Internal testing (or select Closed/Open testing or Production) → Create new release → upload the app-release.aab.

Review, save, and Start rollout to the chosen testing track.

Important: For the first upload you’ll be asked to accept Play App Signing if you haven’t already (see step 6). 
Android Developers

10) Store listing assets (required and common requirements)

Prepare and upload the following on the Play Console’s Store Listing page:

App icon (512×512 PNG, max 1MB).

Feature graphic (optional but recommended for promo).

Screenshots: at least 2 phone screenshots (JPEG or 24-bit PNG, no alpha). Google has specific rules: min dimension ~320 px, max 3840 px, aspect ratio constraints, and no extra device frames/text overlays in screenshots. See Play assets guidelines. 
Google Support
sommo.io

Upload clear screenshots that show actual app UI; prepare privacy policy URL and contact email.

11) Publish: internal → closed → production

Start with Internal testing to verify installs on real devices quickly. Once testers confirm, promote to Closed or Open testing, then to Production. Internal tests typically publish fast; production can take longer (hours → few days depending on review). 
Google Play
Google Support

12) After upload: checks & monitoring

Monitor Play Console for pre-launch reports, crash reports, ANRs, and policy issues.

If you push an update later, increment versionCode and build a new AAB (see step 3/7). 
Android Developers

13) Useful commands & troubleshooting tips

Generate keystore (again):

keytool -genkey -v -keystore my-upload-key.jks -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000


(Store the .jks and passwords safely.) 
React Native

Build AAB:

cd android
./gradlew bundleRelease


Output: android/app/build/outputs/bundle/release/app-release.aab. 
React Native

Check signing fingerprint (SHA-1):

keytool -list -v -keystore my-upload-key.jks -alias my-key-alias


(Needed for some APIs like Google Sign-In.) 
Google for Developers

Common errors

validateSigningRelease FAILED → signing config issue; check keystore path/password/alias and that Gradle properties are correct.

versionCode conflict → increase versionCode.

14) Quick publish checklist (before pressing Release)

 Google Play Developer account active (paid + verified). 
Google Support

 App bundle .aab built and signed with your upload key. 
React Native

 VersionCode incremented. 
Android Developers

 Store listing: title, short description, full description. 
Google Support

 Graphics: 512×512 icon, screenshots (2+), feature graphic if used. 
Google Support

 App content filled: privacy policy URL, data safety, content rating, target audience. 
Google Support
+1

 Enrolled in Play App Signing (new apps). 
Android Developers

Official references (open these while you publish)

React Native — Signed release / Publish to Play (how to create keystore, set gradle variables, build .aab). 
React Native

Android Developers — Upload your app to Play Console (Play App Signing is mandatory for new apps). 
Android Developers

Play Console — Get started with Play Console (developer account & fee). 
Google Support

Google Play — Play App Signing (upload vs app signing keys explanation). 
Google Support

Play Console — Add preview assets / screenshots requirements. 
Google Support

=