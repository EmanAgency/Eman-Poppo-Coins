package com.emanagency.coins;
import android.app.*;
import android.os.*;
import android.content.*;
import android.net.Uri;
import android.webkit.*;
import android.widget.*;
import android.view.*;

public class MainActivity extends Activity {
 private WebView web; private ValueCallback<Uri[]> picker;
 private static final String HOME="https://emancoins.com/";
 @Override public void onCreate(Bundle state){
  super.onCreate(state);
  getWindow().setStatusBarColor(0xFF090D1A);
  getWindow().setNavigationBarColor(0xFF090D1A);
  web=new WebView(this); setContentView(web);
  web.setBackgroundColor(0xFF090D1A);
  WebSettings s=web.getSettings(); s.setJavaScriptEnabled(true); s.setUseWideViewPort(true); s.setLoadWithOverviewMode(true); s.setDomStorageEnabled(true); s.setAllowFileAccess(false); s.setAllowContentAccess(true); s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW); s.setJavaScriptCanOpenWindowsAutomatically(false);
  CookieManager.getInstance().setAcceptCookie(true);
  web.setWebViewClient(new WebViewClient(){
   @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r){ return route(r.getUrl()); }
   @Override public boolean shouldOverrideUrlLoading(WebView v,String url){ return route(Uri.parse(url)); }
   @Override public void onReceivedError(WebView v,WebResourceRequest r,WebResourceError e){ if(r.isForMainFrame()) new AlertDialog.Builder(MainActivity.this).setTitle("Connection problem").setMessage("Check your internet connection and try again.").setPositiveButton("Retry",(d,w)->web.loadUrl(trusted(r.getUrl())?r.getUrl().toString():HOME)).setNegativeButton("Close",null).show(); }
   @Override public void onPageFinished(WebView v,String url){ CookieManager.getInstance().flush(); }

  });
  web.setWebChromeClient(new WebChromeClient(){
   @Override public boolean onJsAlert(WebView v,String url,String message,JsResult result){
    new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton(android.R.string.ok,(d,w)->result.confirm()).setOnCancelListener(d->result.cancel()).show(); return true;
   }
   @Override public boolean onJsConfirm(WebView v,String url,String message,JsResult result){
    new AlertDialog.Builder(MainActivity.this).setMessage(message).setPositiveButton(android.R.string.ok,(d,w)->result.confirm()).setNegativeButton(android.R.string.cancel,(d,w)->result.cancel()).setOnCancelListener(d->result.cancel()).show(); return true;
   }
   @Override public boolean onShowFileChooser(WebView v,ValueCallback<Uri[]> cb,FileChooserParams p){
    if(picker!=null)picker.onReceiveValue(null); picker=cb;
    Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT); i.addCategory(Intent.CATEGORY_OPENABLE); i.setType("*/*"); i.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{"image/*","application/pdf"});
    try{startActivityForResult(i,42);return true;}catch(ActivityNotFoundException e){picker.onReceiveValue(null);picker=null;return true;}
   }
  });
  web.setDownloadListener((url,userAgent,disposition,mime,length)->{
   Uri uri=Uri.parse(url);
   if("https".equalsIgnoreCase(uri.getScheme())){try{startActivity(new Intent(Intent.ACTION_VIEW,uri));}catch(ActivityNotFoundException e){Toast.makeText(this,"No app available to open this download",Toast.LENGTH_LONG).show();}}
   else Toast.makeText(this,"Open the website in your browser to save this file",Toast.LENGTH_LONG).show();
  });
  if(state==null || web.restoreState(state)==null)web.loadUrl(HOME);
 }
 private boolean trusted(Uri u){return "https".equalsIgnoreCase(u.getScheme()) && ("emancoins.com".equalsIgnoreCase(u.getHost())||"www.emancoins.com".equalsIgnoreCase(u.getHost()));}
 private boolean route(Uri u){if(trusted(u))return false; String scheme=u.getScheme(); if("https".equalsIgnoreCase(scheme)||"whatsapp".equalsIgnoreCase(scheme)||"tel".equalsIgnoreCase(scheme)||"mailto".equalsIgnoreCase(scheme)){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(ActivityNotFoundException e){Toast.makeText(this,"No app available to open this link",Toast.LENGTH_LONG).show();}}return true;}
 @Override protected void onActivityResult(int r,int c,Intent d){super.onActivityResult(r,c,d);if(r==42&&picker!=null){picker.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(c,d));picker=null;}}
 @Override protected void onPause(){CookieManager.getInstance().flush();super.onPause();}
 @Override protected void onDestroy(){if(picker!=null){picker.onReceiveValue(null);picker=null;}web.destroy();super.onDestroy();}
 @Override protected void onSaveInstanceState(Bundle b){web.saveState(b);super.onSaveInstanceState(b);}
 @Override public void onBackPressed(){if(web.canGoBack())web.goBack();else super.onBackPressed();}
}
