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
#import <React/RCTView.h>
#import "objc/runtime.h"
#import "WizResourceLoader.h"

static NSTimer *keyboardTimer;
// runtime trick to remove WKWebView keyboard default toolbar
// see: http://stackoverflow.com/questions/19033292/ios-7-uiwebview-keyboard-issue/19042279#19042279
@interface _SwizzleHelperWK_Wiz : UIView
@property (nonatomic, copy) WKWebView *webView;
@end
@implementation _SwizzleHelperWK_Wiz
-(id)inputAccessoryView
{
    if (_webView == nil) {
        return nil;
    }

    if ([_webView respondsToSelector:@selector(inputAssistantItem)]) {
        UITextInputAssistantItem *inputAssistantItem = [_webView inputAssistantItem];
        inputAssistantItem.leadingBarButtonGroups = @[];
        inputAssistantItem.trailingBarButtonGroups = @[];
    }
    return nil;
}
@end

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
@interface WizSingletonWebViewContainer : RCTView<UIScrollViewDelegate>
@property (nonatomic, copy) RCTDirectEventBlock onScroll;
@property (nonatomic, copy) RCTDirectEventBlock onKeyboardShow;
@property (nonatomic, copy) RCTDirectEventBlock onKeyboardHide;
@property (nonatomic, copy) RCTDirectEventBlock onMessage;
@end

// view manager, communicate with js component
@interface WizSingletonWebViewManager : RCTViewManager
@end


@implementation WizSingletonWebView

- (id) initWithFrame:(CGRect)frame {
  WKWebViewConfiguration* config = [WKWebViewConfiguration new];
  //
  [config.userContentController addScriptMessageHandler:self name:@"WizSingletonWebView"];
  //
  [config setURLSchemeHandler:[WizResourceLoader new] forURLScheme: @"wiz"];
  //
  NSString* js = @"window.WizWebView = window.webkit.messageHandlers.WizSingletonWebView";
  WKUserScript* script = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
  [config.userContentController addUserScript:script];
  //
  self = [super initWithFrame:frame configuration:config];
  self.navigationDelegate = self;
  [self setOpaque:NO];
  //
  return self;
}

- (void) webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
  [[WizSingletonWebViewModule sharedInstance] sendEventWithName:@"onLoad" body:@{}];
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
  //
  if ([message.name isEqualToString:@"WizSingletonWebView"]) {
    [[WizSingletonWebViewModule sharedInstance] sendEventWithName:@"onMessage" body:message.body];
    //
    UIView* parent = self.superview;
    if (parent && [parent isKindOfClass:[WizSingletonWebViewContainer class]]) {
      WizSingletonWebViewContainer* container = (WizSingletonWebViewContainer *)parent;
      if (container.onMessage) {
        container.onMessage(@{@"body":message.body});
      }
    }
  }
}

- (void) traitCollectionDidChange: (UITraitCollection *) previousTraitCollection {
  [super traitCollectionDidChange: previousTraitCollection];
  //
  //
  if (@available(iOS 12.0, *)) {
    if (self.traitCollection.userInterfaceStyle != previousTraitCollection.userInterfaceStyle) {
      //
      BOOL dark = UIUserInterfaceStyleDark == self.traitCollection.userInterfaceStyle;
      NSString* themeName = dark ? @"dark" : @"light";
      NSString* js = [NSString stringWithFormat:@"window.onThemeChanged('%@')", themeName];
      //
      [self evaluateJavaScript:js completionHandler:nil];
    }
  } else {
    // Fallback on earlier versions
  }
}
- (void) darkModeChanged:(NSNotification*)note {
  
}


-(void)hideKeyboardAccessoryView
{
    UIView* subview;

    for (UIView* view in self.scrollView.subviews) {
        if([[view.class description] hasPrefix:@"WK"])
            subview = view;
    }

    if(subview == nil) return;

    NSString* name = [NSString stringWithFormat:@"%@_SwizzleHelperWK_Wiz", subview.class.superclass];
    Class newClass = NSClassFromString(name);

    if(newClass == nil)
    {
        newClass = objc_allocateClassPair(subview.class, [name cStringUsingEncoding:NSASCIIStringEncoding], 0);
        if(!newClass) return;

        Method method = class_getInstanceMethod([_SwizzleHelperWK_Wiz class], @selector(inputAccessoryView));
        class_addMethod(newClass, @selector(inputAccessoryView), method_getImplementation(method), method_getTypeEncoding(method));

        objc_registerClassPair(newClass);
    }

    object_setClass(subview, newClass);
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
  _webView.scrollView.delegate = self;
  [[NSNotificationCenter defaultCenter]
    addObserver:self
    selector:@selector(keyboardWillHide)
    name:UIKeyboardWillHideNotification object:nil];
  [[NSNotificationCenter defaultCenter]
    addObserver:self
    selector:@selector(keyboardWillShow:)
    name:UIKeyboardWillShowNotification object:nil];
  return self;
}

- (void) dealloc {
  if (_webView.superview == self) {
    [_webView endEditing:YES];
    [_webView removeFromSuperview]; 
  }
  _webView.scrollView.delegate = nil;
  [[NSNotificationCenter defaultCenter] removeObserver:self];
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

- (void) didMoveToWindow {
  if (_webView.superview == self) {
    [_webView hideKeyboardAccessoryView];
  }
}

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView {
  // disable zoom
  return nil;
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
  if (_onScroll != nil) {
    NSDictionary *event = @{
      @"contentOffset": @{
          @"x": @(scrollView.contentOffset.x),
          @"y": @(scrollView.contentOffset.y)
          },
      @"contentInset": @{
          @"top": @(scrollView.contentInset.top),
          @"left": @(scrollView.contentInset.left),
          @"bottom": @(scrollView.contentInset.bottom),
          @"right": @(scrollView.contentInset.right)
          },
      @"contentSize": @{
          @"width": @(scrollView.contentSize.width),
          @"height": @(scrollView.contentSize.height)
          },
      @"layoutMeasurement": @{
          @"width": @(scrollView.frame.size.width),
          @"height": @(scrollView.frame.size.height)
          },
      @"zoomScale": @(scrollView.zoomScale ?: 1),
      };
    _onScroll(event);
  }
}

-(void)keyboardWillHide {
  keyboardTimer = [NSTimer scheduledTimerWithTimeInterval:0 target:self selector:@selector(keyboardDisplacementFix) userInfo:nil repeats:false];
  [[NSRunLoop mainRunLoop] addTimer:keyboardTimer forMode:NSRunLoopCommonModes];
  if (_onKeyboardHide) {
    _onKeyboardHide(@{});
  }
}

-(void)keyboardWillShow:(NSNotification*)note {
  NSDictionary *userInfo = note.userInfo;
  CGRect keyboardFrameEnd = [userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
  CGFloat keyboardHeight = keyboardFrameEnd.size.height;
  CGFloat keyboardWidth = keyboardFrameEnd.size.width;
  
  if (keyboardTimer != nil) {
    [keyboardTimer invalidate];
  }
  if (_onKeyboardShow) {
    _onKeyboardShow(@{
      @"keyboardWidth": @(keyboardWidth),
      @"keyboardHeight": @(keyboardHeight),
    });
  }
}

-(void)keyboardDisplacementFix {
  // Additional viewport checks to prevent unintentional scrolls
  UIScrollView *scrollView = _webView.scrollView;
  double maxContentOffset = scrollView.contentSize.height - scrollView.frame.size.height;
  if (maxContentOffset < 0) {
      maxContentOffset = 0;
  }
  if (scrollView.contentOffset.y > maxContentOffset) {
    // https://stackoverflow.com/a/9637807/824966
    [UIView animateWithDuration:.25 animations:^{
        scrollView.contentOffset = CGPointMake(0, maxContentOffset);
    }];
  }
}

@end



@implementation WizSingletonWebViewManager

RCT_EXPORT_MODULE(WizSingletonWebView)
RCT_EXPORT_VIEW_PROPERTY(onScroll, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyboardShow, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyboardHide, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMessage, RCTDirectEventBlock)


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
    [web loadRequest:request];
  }
}

RCT_EXPORT_METHOD(injectJavaScript:(NSString*)script resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    WizSingletonWebView* web = [WizSingletonWebViewContainer webView];
    if (web) {
      if (web.URL && web.URL.absoluteString && web.URL.absoluteString.length) {
        [web evaluateJavaScript:script completionHandler:^(id _Nullable result, NSError * _Nullable error) {
          if (error) {
            NSString* message = [NSString stringWithFormat:@"Failed to execute JavaScript: %@", error.localizedDescription];
            reject(@"-1", message, error);
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

RCT_EXPORT_METHOD(endEditing:(BOOL)force) {
  WizSingletonWebView* web = [WizSingletonWebViewContainer webView];
  if (web) {
    [web endEditing:force];
  }
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
