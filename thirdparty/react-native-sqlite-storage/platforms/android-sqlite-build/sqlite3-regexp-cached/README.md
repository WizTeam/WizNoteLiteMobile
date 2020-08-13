# sqlite3-regexp-cached

Provide REGEXP function for SQLite3 with regex caching, using BSD REGEX functions.

Default cache size: 16

`SQLITE3_REGEXP_CACHE_SIZE` may be defined to change the regex cache size.

Based on: <http://git.altlinux.org/people/at/packages/?p=sqlite3-pcre.git>

Sample usage (opening database):
```c
sqlite3 * db;
int rc;
const char * err;

rc = sqlite3_open_v2("my.db", &db, SQLITE_OPEN_CREATE, NULL);

if (rc == 0) {
    rc = sqlite3_regexp_init(db, &err);
}
```

**LICENSE:** public domain

Other GitHub version of sqlite3-pcre: <https://github.com/ralight/sqlite3-pcre>
