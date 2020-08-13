
all: ndkbuild

init:
	git submodule update --init

regen:
	java -cp gluegentools/antlr.jar:gluegentools/gluegen.jar com.jogamp.gluegen.GlueGen -I. -Ecom.jogamp.gluegen.JavaEmitter -CSQLiteNative.cfg native/sqlc.h
	sed -i.orig 's/^import/\/\/import/' java/io/liteglue/SQLiteNative.java

# NOTE: adding v (verbose) flag for the beginning stage:
ndkbuild:
	rm -rf lib libs
	ndk-build
	zip sqlite-native-driver-libs.zip libs/*/*
	mv libs lib
	jar cf sqlite-native-driver.jar lib

clean:
	rm -rf obj lib libs sqlite-native-driver.jar *.zip

