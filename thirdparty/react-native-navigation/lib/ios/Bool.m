#import "Bool.h"

@interface Bool()

@property (nonatomic, retain) NSNumber* value;

@end

@implementation Bool

- (instancetype)initWithBOOL:(BOOL)boolValue {
	self = [super initWithValue:@(boolValue)];
	return self;
}

- (BOOL)get {
	return [self.value boolValue];
}

- (NSNumber *)getValue {
	return self.value;
}

- (BOOL)getWithDefaultValue:(BOOL)defaultValue {
	if (self.value) {
		return [self.value boolValue];
	} else {
		return defaultValue;
	}
}

- (bool)isFalse {
    return self.value != nil && ![self.value boolValue];
}


@end
