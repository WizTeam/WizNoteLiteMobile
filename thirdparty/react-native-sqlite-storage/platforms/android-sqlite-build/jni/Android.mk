# THANKS for initial guidance:
# https://code.tutsplus.com/tutorials/advanced-android-getting-started-with-the-ndk--mobile-2152
# original location:
# http://mobile.tutsplus.com/tutorials/android/ndk-tutorial/

LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)  

LOCAL_LDLIBS := -llog
LOCAL_MODULE := sqlc-native-driver

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../sqlite-amalgamation
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../sqlite3-regexp-cached
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../libb64-encode
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../sqlite3-base64

LOCAL_CFLAGS += -DSQLITE_THREADSAFE=1
LOCAL_CFLAGS += -DSQLITE_DEFAULT_SYNCHRONOUS=3
LOCAL_CFLAGS += -DSQLITE_DEFAULT_MEMSTATUS=0
LOCAL_CFLAGS += -DSQLITE_OMIT_DECLTYPE
LOCAL_CFLAGS += -DSQLITE_OMIT_DEPRECATED
LOCAL_CFLAGS += -DSQLITE_OMIT_PROGRESS_CALLBACK
LOCAL_CFLAGS += -DSQLITE_OMIT_SHARED_CACHE
LOCAL_CFLAGS += -DSQLITE_TEMP_STORE=2
LOCAL_CFLAGS += -DSQLITE_OMIT_LOAD_EXTENSION
LOCAL_CFLAGS += -DSQLITE_ENABLE_FTS3 -DSQLITE_ENABLE_FTS3_PARENTHESIS
LOCAL_CFLAGS += -DSQLITE_ENABLE_FTS4
LOCAL_CFLAGS += -DSQLITE_ENABLE_FTS5
LOCAL_CFLAGS += -DSQLITE_ENABLE_RTREE
LOCAL_CFLAGS += -DSQLITE_ENABLE_JSON1
LOCAL_CFLAGS += -Wno-error=format-security
APP_CPPFLAGS += -Wno-error=format-security

# new stable default page size ref:
# - http://sqlite.org/releaselog/3_12_0.html
# - http://sqlite.org/pgszchng2016.html
LOCAL_CFLAGS += -DSQLITE_DEFAULT_PAGE_SIZE=4096
LOCAL_CFLAGS += -DSQLITE_DEFAULT_CACHE_SIZE=-2000

LOCAL_SRC_FILES := ../native/sqlc_all.c
LOCAL_SRC_FILES += ../sqlite-amalgamation/cjk_tokenizer.cc
LOCAL_SRC_FILES += ../sqlite-amalgamation/utf8.cc
LOCAL_SRC_FILES += ../sqlite-amalgamation/stop_words.cc

include $(BUILD_SHARED_LIBRARY)
