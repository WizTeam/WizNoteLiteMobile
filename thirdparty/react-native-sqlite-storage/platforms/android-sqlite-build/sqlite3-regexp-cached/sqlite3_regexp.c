/*
 * Adapted by Christopher J. Brody <brodybits@litehelpers.net>.
 *
 * Based on sqlite3-pcre:
 * Written by Alexey Tourbin <at@altlinux.org>.
 *
 * The author has dedicated the code to the public domain.  Anyone is free
 * to copy, modify, publish, use, compile, sell, or distribute the original
 * code, either in source code form or as a compiled binary, for any purpose,
 * commercial or non-commercial, and by any means.
 */

#include "sqlite3_regexp.h"

#include <stdlib.h>
#include <string.h>

/* NOTE:
 * It should be possible to use a different regex implementation by changing
 * the include, cached_regex_t, and static regexp_compile, regexp_free, and
 * regexp_exec functions below.
 */
#include <regex.h>

typedef regex_t cached_regex_t;

#ifdef SQLITE3_REGEXP_EXT
#include "sqlite3ext.h"
SQLITE_EXTENSION_INIT1
#endif

typedef struct {
    char *s;
    cached_regex_t r;
} cache_entry;

/* May be defined to add per-context or global locking if necessary */
#define CACHE_LOCK(ctx) ;
#define CACHE_UNLOCK(ctx) ;

#ifdef SQLITE3_REGEXP_CACHE_SIZE
const static int cache_size = SQLITE3_REGEXP_CACHE_SIZE;
#else
const static int cache_size = 16;
#endif

const static int regex_compile_flags = REG_EXTENDED;

static inline
int regexp_compile(cached_regex_t * pr, const char * re) {
    return regcomp(pr, re, regex_compile_flags);
}

static inline
void regexp_free(cached_regex_t * pr) {
    regfree(pr);
}

static inline
int regexp_exec(cached_regex_t * pr, const char * str) {
    return regexec(pr, str, 0, 0, 0);
}

static
void sqlite3_regexp(sqlite3_context *ctx, int argc, sqlite3_value **argv)
{
    const char *re, *str;

    cached_regex_t * pr;

    if (argc != 2) {
	// quick failure:
	sqlite3_result_int(ctx, 0);
	return;
    }

    re = (const char *) sqlite3_value_text(argv[0]);
    if (!re) {
	sqlite3_result_error(ctx, "no regexp", -1);
	return;
    }

    str = (const char *) sqlite3_value_text(argv[1]);
    if (!str) {
	sqlite3_result_error(ctx, "no string", -1);
	return;
    }

    /* simple LRU cache */
    {
	int i;
	int found = 0;
	cache_entry *cache = sqlite3_user_data(ctx);

	if (!cache) {
	    // quick failure (should not happen):
	    sqlite3_result_int(ctx, 0);
	    return;
	}

	for (i = 0; i < cache_size && cache[i].s; i++)
	    if (strcmp(re, cache[i].s) == 0) {
		found = 1;
		break;
	    }
	if (found) {
	    if (i > 0) {
		cache_entry c = cache[i];
		memmove(cache + 1, cache, i * sizeof(cache_entry));
		cache[0] = c;
	    }
	}
	else {
	    cache_entry c;

	    CACHE_LOCK(ctx);

	    if (regexp_compile(&c.r, re) != 0) {
		char *e2 = sqlite3_mprintf("%s: invalid", re);
		sqlite3_result_error(ctx, e2, -1);
		sqlite3_free(e2);
		return;
	    }

	    c.s = strdup(re);
	    if (!c.s) {
		sqlite3_result_error(ctx, "strdup: ENOMEM", -1);
		regexp_free(&c.r);
		return;
	    }
	    i = cache_size - 1;
	    if (cache[i].s) {
		free(cache[i].s);
		regexp_free(&cache[i].r);
	    }

	    CACHE_UNLOCK(ctx);

	    memmove(cache + 1, cache, i * sizeof(cache_entry));
	    cache[0] = c;
	}
	pr = &cache[0].r;
    }

    {
	int rc = regexp_exec(pr, str);
	sqlite3_result_int(ctx, rc == 0);
	return;
    }
}

int sqlite3_regexp_init(sqlite3 * db, const char ** err)
{
	cache_entry *cache = calloc(cache_size, sizeof(cache_entry));

	if (!cache) {
	    *err = "calloc: ENOMEM";
	    return 1;
	}

	return sqlite3_create_function_v2(db, "REGEXP", 2, SQLITE_ANY | SQLITE_DETERMINISTIC, cache, sqlite3_regexp, NULL, NULL, NULL);
}

#ifdef SQLITE3_REGEXP_EXT
int sqlite3_extension_init(sqlite3 *db, char **err, const sqlite3_api_routines *api)
{
	SQLITE_EXTENSION_INIT2(api)
	return sqlite3_regexp_init(db, err);
}
#endif
