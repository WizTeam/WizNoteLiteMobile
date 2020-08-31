//
//  WizSingletonWebView.m
//  WizNoteLiteMobile
//
//  Created by Wei Shijun on 2020/8/28.
//

#import "WizSingletonWebView.h"
#import <React/RCTViewManager.h>
#import <WebKit/WebKit.h>
#import <React/RCTUIManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

// global object
@interface WizSingletonWebViewModule : RCTEventEmitter <RCTBridgeModule>
+ (WizSingletonWebViewModule*) sharedInstance;
@end

// webview
@interface WizSingletonWebView : WKWebView <
WKNavigationDelegate,
WKScriptMessageHandler>
@end

// webview container
@interface WizSingletonWebViewContainer : UIView
@property (nonatomic, copy) NSString* url;
@end

// view manager, communicate with js component
@interface WizSingletonWebViewManager : RCTViewManager
@end


@implementation WizSingletonWebView

- (id) init {
  self = [super init];
  if (self) {
    WKWebViewConfiguration* config = [WKWebViewConfiguration new];
    [config.userContentController addScriptMessageHandler:self name:@"WizSingletonWebView"];
    NSString* js = @"window.WizWebView = window.webkit.messageHandlers.WizSingletonWebView";
    WKUserScript* script = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    [config.userContentController addUserScript:script];
    self = [super initWithFrame:CGRectZero configuration:config];
    self.navigationDelegate = self;
    [self setOpaque:NO];
  }
  return self;
}

- (WizSingletonWebViewContainer *) container {
  if (self.superview) {
    if ([self.superview isKindOfClass:[WizSingletonWebViewContainer class]]) {
      return (WizSingletonWebViewContainer*)self.superview;
    }
  }
  return nil;
}


- (void) webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
  [[WizSingletonWebViewModule sharedInstance] sendEventWithName:@"onLoad" body:@{}];
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
  //
  if ([message.name isEqualToString:@"WizSingletonWebView"]) {
    [[WizSingletonWebViewModule sharedInstance] sendEventWithName:@"onMessage" body:message.body];
  }
}

@end



@implementation WizSingletonWebViewContainer
static WizSingletonWebView* _webView;

+ (void) initialize {
  if (self == [WizSingletonWebViewContainer class]) {
    _webView = [WizSingletonWebView new];
  }
}

+ (WizSingletonWebView*) webView {
  return _webView;
}

- (id) init {
  self = [super init];
  if (_webView.superview) {
    [_webView removeFromSuperview];
  }
  [self addSubview:_webView];
  return self;
}

- (id) initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  [self addSubview:_webView];
  _webView.frame = self.bounds;
  return self;
}

- (void) dealloc {
  if (_webView.superview == self) {
    [_webView endEditing:YES];
    [_webView removeFromSuperview];
  }
}

- (void) layoutSubviews {
  _webView.frame = self.bounds;
  [super layoutSubviews];
}

- (void) setBackgroundColor:(UIColor *)backgroundColor {
  [super setBackgroundColor:backgroundColor];
  _webView.backgroundColor = backgroundColor;
  _webView.scrollView.backgroundColor = backgroundColor;
}

@end



@implementation WizSingletonWebViewManager

RCT_EXPORT_MODULE(WizSingletonWebView)
RCT_EXPORT_VIEW_PROPERTY(url, NSString*)

- (UIView *)view {
  return [[WizSingletonWebViewContainer alloc] init];
}
//

@end


@implementation WizSingletonWebViewModule
static WizSingletonWebViewModule* _sharedInstance;

RCT_EXPORT_MODULE();

- (id) init {
  self = [super init];
  _sharedInstance = self;
  return self;
}

RCT_EXPORT_METHOD(loadRequest:(NSString*)urlString) {
  NSURLRequest *request = [RCTConvert NSURLRequest:urlString];
  WizSingletonWebView* web = [WizSingletonWebViewContainer webView];
  if (web) {
    [_webView loadRequest:request];
  }
}

RCT_EXPORT_METHOD(injectJavaScript:(NSString*)script resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    WizSingletonWebView* web = [WizSingletonWebViewContainer webView];
    if (web) {
      if (web.URL && web.URL.absoluteString && web.URL.absoluteString.length) {
        [web evaluateJavaScript:script completionHandler:^(id _Nullable result, NSError * _Nullable error) {
          if (error) {
            reject(@"-1", @"Failed to execute JavaScript", error);
          } else {
            @try {
              resolve(result);
            } @catch (NSError* err) {
              RCTLogError(@"Failed to send result: %@", err);
            }
          }
        }];
      }
    }
  });
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onMessage", @"onLoad"];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

+ sharedInstance {
  return _sharedInstance;
}

@end
