package com.avopodo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.cmcewen.blurview.BlurViewPackage;
import guichaguri.trackplayer.TrackPlayer;
import com.horcrux.svg.SvgPackage;
import com.zmxv.RNSound.RNSoundPackage;
import io.palette.RNPalettePackage;
import com.tanguyantoine.react.MusicControl;
import com.BV.LinearGradient.LinearGradientPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.cmcewen.blurview.BlurViewPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage; // <-- Add this line
// import com.futurice.rctaudiotoolkit.AudioPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;


// React Native Navigation
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;


import java.util.Arrays;
import java.util.List;

// public class MainApplication extends Application implements ReactApplication {

//   private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
//     @Override
//     public boolean getUseDeveloperSupport() {
//       return BuildConfig.DEBUG;
//     }

//     @Override
//     protected List<ReactPackage> getPackages() {
//       return Arrays.<ReactPackage>asList(
//             new TrackPlayer(),
//             new MainReactPackage(),
//            new BlurViewPackage(),
//             new RNSoundPackage(),
//             new RNPalettePackage(),
//             new MusicControl(),
//             new LinearGradientPackage(),
//             new RNFirebasePackage(),
//             new RNFirebaseAnalyticsPackage(), // <-- Add this line
//             new SvgPackage(),
//             new BlurViewPackage()
//       );
//     }

//     @Override
//     protected String getJSMainModuleName() {
//       return "index";
//     }
//   };

//   @Override
//   public ReactNativeHost getReactNativeHost() {
//     return mReactNativeHost;
//   }

//   @Override
//   public void onCreate() {
//     super.onCreate();
//     SoLoader.init(this, /* native exopackage */ false);
//   }
// }



public class MainApplication extends NavigationApplication {
    
    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
            new TrackPlayer(),
            new RNSoundPackage(),
            new RNPalettePackage(),
            new MusicControl(),
            new LinearGradientPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage(), // <-- Add this line
            new SvgPackage(),
            new BlurViewPackage()
        );
    }
  
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}