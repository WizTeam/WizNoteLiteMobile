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
@property NSString* loadNoteOptions;
@end

NoteViewModule* g_noteViewModule;

@implementation NoteViewModule
@synthesize loadNoteOptions;

RCT_EXPORT_MODULE();

- (id) init {
  self = [super init];
  g_noteViewModule = self;
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"saveNote"];
}

RCT_EXPORT_METHOD(willLoadNote:(NSString *)options) {
  self.loadNoteOptions = options;
}


@end


@interface NoteViewController () <WKNavigationDelegate>

@end

@implementation NoteViewController {
  WKWebView* _webView;
  BOOL _loaded;
  NSString* _waitForLoad;
}

- (id) init {
  self = [super init];
  if (self) {
    _webView = [WKWebView new];
    _webView.navigationDelegate = self;
    [_webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://localhost:3000"]]];
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
  //
  if (!_loaded) {
    _waitForLoad = g_noteViewModule.loadNoteOptions;
  } else {
    [self loadNote: g_noteViewModule.loadNoteOptions];
  }
}

- (void) loadNote:(NSString*)options {
  NSString* js = [NSString stringWithFormat:@"window.loadMarkdown(%@)", options];
  [_webView evaluateJavaScript:js completionHandler:^(id result, NSError * _Nullable error) {
    if (error) {
      NSLog(@"Failed to run javascript: %@", error);
    }
  }];
}

- (void) viewDidDisappear:(BOOL)animated {
  [super viewDidDisappear:animated];
  NSString* jsSave = @"window.trySaveNow()";
  [_webView evaluateJavaScript:jsSave completionHandler:^(id result, NSError * _Nullable error) {
    //
    NSString* jsClear = @"window.loadMarkdown({contentId:'', markdown: '', resourceUrl: ''});";
    [self->_webView evaluateJavaScript:jsClear completionHandler:nil];
  }];
}

+ (UIViewController *) noteViewController {
  static dispatch_once_t onceToken;
  static NoteViewController* viewController;
  dispatch_once(&onceToken, ^{
    viewController = [NoteViewController new];
  });
  return viewController;
}

@end
