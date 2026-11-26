plugins { id("com.android.application") }
android {
    namespace = "com.emanagency.coins"
    compileSdk = 35
    defaultConfig { applicationId = "com.emanagency.coins"; minSdk = 23; targetSdk = 34; versionCode = 3; versionName = "1.2" }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}
