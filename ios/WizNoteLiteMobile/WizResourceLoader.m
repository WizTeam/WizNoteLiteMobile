//
//  WizResourceLoader.m
//  WizNoteLiteMobile
//
//  Created by Wei Shijun on 2020/9/4.
//

#import "WizResourceLoader.h"

#import "React/RCTBridge.h"
#import "React/RCTEventEmitter.h"
#import "React/RCTLog.h"
#import "React/RCTEventDispatcher.h"


@interface WizResourceLoaderModule : RCTEventEmitter <RCTBridgeModule> {
    NSMutableDictionary* _tasks;
}
@end

@implementation WizResourceLoaderModule

static WizResourceLoaderModule* _sharedInstance = nil;

RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
    static WizResourceLoaderModule *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
      _sharedInstance = sharedInstance;
    });
    return sharedInstance;
}

+ (WizResourceLoaderModule *) sharedInstance {
  return _sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"httpServerResponseReceived"];
}

- (void)addRereqest:(id <WKURLSchemeTask>)task {
  
  long long milliseconds = (long long)([[NSDate date] timeIntervalSince1970] * 1000.0);
  int r = arc4random_uniform(1000000);
  NSString *requestId = [NSString stringWithFormat:@"%lld:%d", milliseconds, r];

  @synchronized (self) {
    if (!self->_tasks) {
      self->_tasks = [[NSMutableDictionary alloc] init];
    }
    [self->_tasks setObject:task forKey:requestId];
  }

  [self sendEventWithName:@"httpServerResponseReceived" body:@{@"requestId": requestId, @"type": @"get", @"url": task.request.URL.relativeString}];
}

- (void) removeRequest:(id<WKURLSchemeTask>)task {
  @synchronized (self) {
    if (!self->_tasks) {
      return;
    }
    NSString* foundKey = nil;
    for (id key in [self->_tasks allKeys]) {
      id value = [self->_tasks objectForKey:key];
      if (value == task) {
        foundKey = key;
      }
    }
    if (foundKey) {
      [self->_tasks removeObjectForKey:foundKey];
    }
  }
}

RCT_EXPORT_METHOD(respondWithFile: (NSString *) requestId
                  code: (NSInteger) code
                  type: (NSString *) type
                  file: (NSString *) file)
{
  id <WKURLSchemeTask> task = nil;
  @synchronized (self) {
      task = [_tasks objectForKey:requestId];
      [_tasks removeObjectForKey:requestId];
  }

  if (!task) return;
  //
  NSData* data = [NSData dataWithContentsOfFile:file];
  NSURLResponse* response = [[NSURLResponse alloc] initWithURL:task.request.URL MIMEType:type expectedContentLength:data.length textEncodingName:nil];
  //
  [task didReceiveResponse: response];
  [task didReceiveData:data];
  [task didFinish];
}

RCT_EXPORT_METHOD(respondWithError: (NSString *) requestId
                  error:(NSString*)error)
{
  id <WKURLSchemeTask> task = nil;
  @synchronized (self) {
      task = [_tasks objectForKey:requestId];
      [_tasks removeObjectForKey:requestId];
  }

  if (!task) return;
  //
  [task didFailWithError:[NSError errorWithDomain:@"WizResourceLoaderDomain" code:-1 userInfo:@{
    NSLocalizedDescriptionKey: error
  }]];
}

@end


@implementation WizResourceLoader

- (void)webView:(WKWebView *)webView startURLSchemeTask:(id <WKURLSchemeTask>)urlSchemeTask {
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSURL* url = urlSchemeTask.request.URL;
    if ([url.scheme isEqualToString: @"wiz"]) {
      [[WizResourceLoaderModule sharedInstance] addRereqest:urlSchemeTask];
    } else {
      [urlSchemeTask didFailWithError:[NSError errorWithDomain:@"WizResourceLoaderDomain" code:-1 userInfo:@{
        NSLocalizedDescriptionKey: [NSString stringWithFormat:@"Not support scheme:%@", url.scheme]
      }]];
    }
  });
}

- (void)webView:(WKWebView *)webView stopURLSchemeTask:(id <WKURLSchemeTask>)urlSchemeTask {
  [[WizResourceLoaderModule sharedInstance] removeRequest:urlSchemeTask];
}

@end
