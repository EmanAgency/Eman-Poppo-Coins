# Eman Coins Android — website match v1.2

The Android app opens https://emancoins.com/ directly. It uses the live website for its design, prices, coin shops, order forms and admin pages. Website updates appear in the app when refreshed/reopened. Internet access is required. No website files or Supabase settings were changed.

## Upload and build from your phone
1. Extract this ZIP.
2. In EmanAgency/Eman-Poppo-Coins, upload the contents inside Eman-Poppo-Coins-main, including .github/workflows. Keep your existing website files.
3. Delete the old app/src/main/jave folder in GitHub if it still exists. The corrected folder is app/src/main/java.
4. Open Actions → Build Eman Coins Android APK → Run workflow.
5. After the build succeeds, open the run, download Eman-Poppo-Coins-APK under Artifacts, extract it, and install Eman-Poppo-Coins.apk.

## Changes
- Corrected the Java source folder so Android includes MainActivity.
- Preserved the website layout and install control, with no page modifications.
- Enabled the website viewport, local storage and persistent cookies.
- Added JavaScript alert/confirmation dialogs for validation and admin messages.
- Kept image/PDF receipt selection and Android Back navigation.
- Open external links and HTTPS downloads in the appropriate phone app.
- Accepted Android SDK licenses before the workflow installs build tools.

## Verification
The current live homepage was downloaded and matched the supplied index.html byte for byte. Static source, XML and workflow checks were performed. This workspace has no Android SDK or Gradle installed, so an APK build and device/payment tests were not performed. Use the GitHub Actions build and verify receipt upload, copy wallet address, login persistence, order tracking and admin receipt opening on your phone.

This build uses the existing application ID com.emanagency.coins and debug signing. Installation over an older APK requires its signing key to match; GitHub runner debug keys can change between runs. Do not uninstall an existing app just to work around a signing mismatch without first preserving any data you need. Native push notifications are not included.
