#import "RNNOptions.h"
#import "RNNScreenTransition.h"
#import "TransitionOptions.h"

@interface RNNAnimationsOptions : RNNOptions

@property (nonatomic, strong) RNNScreenTransition* push;
@property (nonatomic, strong) RNNScreenTransition* pop;
@property (nonatomic, strong) TransitionOptions* showModal;
@property (nonatomic, strong) TransitionOptions* dismissModal;
@property (nonatomic, strong) RNNScreenTransition* setStackRoot;
@property (nonatomic, strong) RNNScreenTransition* setRoot;

@end
