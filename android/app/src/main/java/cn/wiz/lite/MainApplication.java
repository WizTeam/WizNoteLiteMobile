package cn.wiz.lite;

import android.content.Context;
import android.content.res.AssetManager;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.PackageList;
import com.reactnativenavigation.NavigationApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.reactnativenavigation.react.NavigationPackage;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.facebook.react.ReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;


import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import io.liteglue.SQLitePluginPackage;
import me.alwx.HttpServer.HttpServerReactPackage;

public class MainApplication extends NavigationApplication {

  private final ReactNativeHost mReactNativeHost =
      new NavigationReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new SQLitePluginPackage());
            packages.add(new HttpServerReactPackage());
            packages.add(new RNFetchBlobPackage());
            packages.add(new WizReactNativePackage());
            packages.add(new NavigationPackage(mReactNativeHost));
            packages.add(new RNGestureHandlerPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    if (flagFileExists()) return;
    FileUtils.deleteQuietly(localAssetsFolder());
    copyFileOrDir("resources");
    createFlagFile();
  }

  private File localAssetsFolder() {
    return new File(getFilesDir(), "resources");
  }

  private File flagFile() {
      return new File(getFilesDir(), BuildConfig.VERSION_NAME + "_assets_flag");
  }

  private boolean flagFileExists() {
      if (BuildConfig.DEBUG) return false;
      return flagFile().exists();
  }

  private void createFlagFile() {
      try {
          flagFile().createNewFile();
      } catch (IOException e) {
          e.printStackTrace();
      }
  }

  private void copyFileOrDir(String path) {
      //
      AssetManager assetManager = getAssets();
      try {
          String[] assets = assetManager.list(path);
          if (assets == null) {
              return;
          }
          if (assets.length == 0) {
              copyFile(path);
          } else {
              String fullPath = getFilesDir().getAbsolutePath() + "/" + path;
              File dir = new File(fullPath);
              if (!dir.exists()) dir.mkdirs();
              for (String asset : assets) {
                  copyFileOrDir(path + "/" + asset);
              }
          }
      } catch (IOException e) {
          e.printStackTrace();
      }
  }

  private void copyFile(String filename) {
      AssetManager assetManager = getAssets();
      InputStream in = null;
      OutputStream out = null;
      try {
          String outputFileName = getFilesDir().getAbsolutePath() + "/" + filename;
          if (new File(outputFileName).exists()) return;
          in = assetManager.open(filename);
          out = new FileOutputStream(outputFileName);
          byte[] buffer = new byte[2048];
          int read;
          while ((read = in.read(buffer)) != -1) {
              out.write(buffer, 0, read);
          }
      } catch (IOException e) {
          e.printStackTrace();
      } finally {
          try {
              if (in != null ) in.close();
              if (out != null) out.close();
          } catch (IOException e) {
              e.printStackTrace();
          }
      }
  }
    
  
    /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("cn.wiz.lite.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
