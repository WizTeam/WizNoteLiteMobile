#import "RNNOptions.h"

@interface RNNSharedElementAnimationOptions : RNNOptions

@property (nonatomic, strong) NSArray* animations;
@property (nonatomic, strong) NSNumber* duration;
@property (nonatomic, strong) NSNumber* springDamping;
@property (nonatomic, strong) NSNumber* springVelocity;

- (BOOL)hasValue;

@end
