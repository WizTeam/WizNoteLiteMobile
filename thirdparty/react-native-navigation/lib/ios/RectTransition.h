#import "ElementBaseTransition.h"

@interface RectTransition : ElementBaseTransition

- (instancetype)initWithView:(UIView *)view from:(CGRect)from to:(CGRect)to startDelay:(NSTimeInterval)startDelay duration:(NSTimeInterval)duration interpolation:(Text *)interpolation;

@property (nonatomic, readonly) CGRect from;
@property (nonatomic, readonly) CGRect to;

@end
