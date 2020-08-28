//
//  WizWebView.m
//  WizNoteLiteMobile
//
//  Created by Wei Shijun on 2020/8/28.
//

#import "WizWebView.h"
#import <React/RCTViewManager.h>
#import <WebKit/WebKit.h>
#import <React/RCTUIManager.h>

#import <React/RCTBridgeModule.h>


@interface WizWebViewContainer : UIView
@property (nonatomic, copy) NSString* url;
@property (nonatomic, copy) RCTDirectEventBlock onLoad;
@property (nonatomic, copy) RCTDirectEventBlock onMessage;
@end

@interface WizWebViewManager : RCTViewManager
@end


@interface WizWebView : WKWebView <
WKNavigationDelegate,
WKScriptMessageHandler>
@property (nonatomic, weak) WizWebViewManager* webViewManager;
@end

@implementation WizWebView
@synthesize webViewManager;

- (id) init {
  self = [super init];
  if (self) {
    WKWebViewConfiguration* config = [WKWebViewConfiguration new];
    [config.userContentController addScriptMessageHandler:self name:@"WizWebView"];
    NSString* js = @"window.WizWebView = window.webkit.messageHandlers.WizWebView";
    WKUserScript* script = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    [config.userContentController addUserScript:script];
    self = [super initWithFrame:CGRectZero configuration:config];
    self.navigationDelegate = self;
    [self setOpaque:NO];
  }
  return self;
}

- (WizWebViewContainer *) container {
  if (self.superview) {
    if ([self.superview isKindOfClass:[WizWebViewContainer class]]) {
      return (WizWebViewContainer*)self.superview;
    }
  }
  return nil;
}


- (void) webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
  if (self.container) {
    self.container.onLoad(@{});
  }
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
  //
  if ([message.name isEqualToString:@"WizWebView"]) {
    if (self.container) {
      self.container.onMessage(@{
        @"data": message.body
      });
    }
  }
}

@end



@implementation WizWebViewContainer
static WizWebView* _webView;

+ (void) initialize {
  if (self == [WizWebViewContainer class]) {
    _webView = [WizWebView new];
  }
}

+ (WizWebView*) webView {
  return _webView;
}

- (id) init {
  self = [super init];
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
    [_webView removeFromSuperview];
  }
}

- (void) layoutSubviews {
  [super layoutSubviews];
  _webView.frame = self.bounds;
}

- (NSString *)url {
  if (_webView) {
    return [_webView.URL absoluteString];
  } else {
    return @"";
  }
}

- (void) setUrl:(NSString *)urlString {
  if (_webView) {
    if (_webView.URL) {
      NSString* oldUrlString = [_webView.URL absoluteString];
      NSURL* newUrl = [RCTConvert NSURL:urlString];
      NSString* newUrlString = [newUrl absoluteString];
      if ([oldUrlString isEqualToString:newUrlString]) {
        return;
      }
    }
    
    NSURLRequest *request = [RCTConvert NSURLRequest:urlString];
    [_webView loadRequest:request];
  }
}

- (void) injectJavaScript:(NSString*)script {
  if (_webView) {
    [_webView evaluateJavaScript:script completionHandler:nil];
  }
}

- (void) setBackgroundColor:(UIColor *)backgroundColor {
  [super setBackgroundColor:backgroundColor];
  _webView.backgroundColor = backgroundColor;
  _webView.scrollView.backgroundColor = backgroundColor;
}

@end



@implementation WizWebViewManager

RCT_EXPORT_MODULE(WizWebView)
RCT_EXPORT_VIEW_PROPERTY(url, NSString*)
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMessage, RCTDirectEventBlock)


- (UIView *)view {
  return [[WizWebViewContainer alloc] init];
}
//
RCT_EXPORT_METHOD(injectJavaScript:(nonnull NSNumber *)reactTag script:(NSString *)script)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, WizWebViewContainer *> *viewRegistry) {
    WizWebViewContainer *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[WizWebViewContainer class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNCWebView, got: %@", view);
    } else {
      [view injectJavaScript:script];
    }
  }];
}

@end


@interface WizWebViewInstanceManager : NSObject <RCTBridgeModule>
@end

@implementation WizWebViewInstanceManager
RCT_EXPORT_MODULE(WizWebViewInstanceManager);

RCT_EXPORT_METHOD(injectJavaScript:(NSString*)script) {
  dispatch_async(dispatch_get_main_queue(), ^{
    WizWebView* web = [WizWebViewContainer webView];
    if (web) {
      if (web.URL && web.URL.absoluteString && web.URL.absoluteString.length) {
        [web evaluateJavaScript:script completionHandler:nil];
      }
    }
  });
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
