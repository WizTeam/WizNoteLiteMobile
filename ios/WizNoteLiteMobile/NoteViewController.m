//
//  NoteViewController.m
//  WizNoteLiteMobile
//
//  Created by Wei Shijun on 2020/8/24.
//

#import "NoteViewController.h"
#import <WebKit/WebKit.h>

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface NoteViewModule : RCTEventEmitter <RCTBridgeModule>
@end

NoteViewModule* g_noteViewModule;

@implementation NoteViewModule

RCT_EXPORT_MODULE();

- (id) init {
  self = [super init];
  g_noteViewModule = self;
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onMessage"];
}


- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end


@interface NoteViewController () <WKNavigationDelegate, WKScriptMessageHandler>

@end

@implementation NoteViewController {
  WKWebView* _webView;
  BOOL _loaded;
  NSString* _waitForLoad;
}

- (id) init {
  self = [super init];
  if (self) {
    WKWebViewConfiguration* config = [WKWebViewConfiguration new];
    [config.userContentController addScriptMessageHandler:self name:@"WizWebView"];
    NSString* js = @"window.WizWebView = window.webkit.messageHandlers.WizWebView";
    WKUserScript* script = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    [config.userContentController addUserScript:script];
    _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:config];
    _webView.navigationDelegate = self;
    [_webView setOpaque:NO];
    //
    NSString *path = [[NSBundle mainBundle] resourcePath];
    NSString* editorHtmlPath = [path stringByAppendingPathComponent:@"build/index.html"];
    NSURL* editorHtmlUrl = [NSURL fileURLWithPath:editorHtmlPath];
    //
    [_webView loadRequest:[NSURLRequest requestWithURL:editorHtmlUrl]];
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  // Do any additional setup after loading the view.
  _webView.frame = self.view.frame;
  [self.view addSubview:_webView];
}

- (void) webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
  _loaded = YES;
  if (_waitForLoad) {
    [self loadNote:_waitForLoad];
  }
}

- (void) viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
}

- (void) viewWillDisappear:(BOOL)animated
{
  [_webView endEditing:YES];
  [super viewWillDisappear:animated];
}

- (void) viewDidDisappear:(BOOL)animated
{
  NSString* data = @"{markdown: '', contentId: ''}";
  [self loadNote:data];
  [super viewDidDisappear:animated];
}

- (void) updateTheme:(NSString*)theme {
  if ([theme isEqualToString:@"dark"]) {
    UIColor* backgroundColor = [NoteViewController colorFromHexString:@"#2a2a2a"];
    _webView.backgroundColor = backgroundColor;
    _webView.scrollView.backgroundColor = backgroundColor;
    [_webView setOpaque:NO];
  } else {
    UIColor* backgroundColor = [UIColor whiteColor];
    _webView.backgroundColor = backgroundColor;
    _webView.scrollView.backgroundColor = backgroundColor;
    [_webView setOpaque:NO];
  }
}

- (void) loadNote:(NSString*)options {
  if (!_loaded) {
    _waitForLoad = options;
    return;
  }
  NSString* js = [NSString stringWithFormat:@"window.loadMarkdown(%@)", options];
  [_webView evaluateJavaScript:js completionHandler:^(id result, NSError * _Nullable error) {
    if (error) {
      NSLog(@"Failed to run javascript: %@", error);
    }
  }];
}

+ (UIViewController *) noteViewController:(NSDictionary * _Nullable)props {
  static dispatch_once_t onceToken;
  static NoteViewController* viewController;
  dispatch_once(&onceToken, ^{
    viewController = [NoteViewController new];
  });
  if (props) {
    NSString* loadData = props[@"loadData"];
    if (loadData) {
      [viewController loadNote:loadData];
    }
    NSString* theme = props[@"theme"];
    if (theme) {
      [viewController updateTheme:theme];
    }
  }
  return viewController;
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
  //
  if ([message.name isEqualToString:@"WizWebView"]) {
    [g_noteViewModule sendEventWithName:@"onMessage" body:message.body];
  }
  //
}


// Assumes input like "#00FF00" (#RRGGBB).
+ (UIColor *)colorFromHexString:(NSString *)hexString {
  unsigned rgbValue = 0;
  NSScanner *scanner = [NSScanner scannerWithString:hexString];
  [scanner setScanLocation:1]; // bypass '#' character
  [scanner scanHexInt:&rgbValue];
  return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
}


@end
