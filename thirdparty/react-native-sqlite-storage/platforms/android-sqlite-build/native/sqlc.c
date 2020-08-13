#include "sqlc.h"

#include <stddef.h> /* for NULL */

#include <android/log.h>

#include "sqlite3.h"

#include "sqlite3_regexp.h"

#include "sqlite3_base64.h"

#include "cjk_tokenizer.h"

#define BASE_HANDLE_OFFSET 0x100000000LL

#ifdef SQLC_KEEP_ANDROID_LOG
// ref: http://www.ibm.com/developerworks/opensource/tutorials/os-androidndk/index.html
#define MYLOG(...) __android_log_print(ANDROID_LOG_VERBOSE, "sqlc", __VA_ARGS__)
#else
#define MYLOG(...) ;
#endif

#define HANDLE_FROM_VP(p) ( BASE_HANDLE_OFFSET + ( (unsigned char *)(p) - (unsigned char *)NULL ) )
#define HANDLE_TO_VP(h) (void *)( (unsigned char *)NULL + (ptrdiff_t)((h) - BASE_HANDLE_OFFSET) )

int sqlc_api_version_check(int sqlc_api_version)
{
  return (sqlc_api_version != SQLC_API_VERSION) ? SQLC_RESULT_ERROR : SQLC_RESULT_OK;
}

sqlc_handle_t sqlc_api_db_open(int sqlc_api_version, const char *filename, int flags)
{
  if (sqlc_api_version != SQLC_API_VERSION) return SQLC_RESULT_ERROR;

  return sqlc_db_open(filename, flags);
}

sqlc_handle_t sqlc_db_open(const char *filename, int flags)
{
  sqlite3 *d1;
  int r1;
  const char * err;

  MYLOG("db_open %s %d", filename, flags);

  r1 = sqlite3_open_v2(filename, &d1, flags, NULL);

  MYLOG("db_open %s result %d ptr %p", filename, r1, d1);

  if (r1 != 0) return -r1;

  registerCjkTokenizer(d1);

  sqlite3_db_config(d1, SQLITE_DBCONFIG_DEFENSIVE, 1, NULL);

  // TBD IGNORE result:
  sqlite3_regexp_init(d1, &err);

  sqlite3_base64_init(d1);

  return HANDLE_FROM_VP(d1);
}

sqlc_handle_t sqlc_db_prepare_st(sqlc_handle_t db, const char *sql)
{
  sqlite3 *mydb = HANDLE_TO_VP(db);
  sqlite3_stmt *s;
  int rv;

  MYLOG("prepare db %p sql %s", mydb, sql);

  rv = sqlite3_prepare_v2(mydb, sql, -1, &s, NULL);

  return (rv == 0) ? HANDLE_FROM_VP(s) : -rv;
}

/** FUTURE TBD (???) for sqlcipher:
int sqlc_db_key_bytes(sqlc_handle_t db, unsigned char *key_bytes, int num_bytes)
{
  sqlite3 *mydb = HANDLE_TO_VP(db);

#ifdef SQLITE_HAS_CODEC
  return sqlite3_key(mydb, key_bytes, num_bytes);
#else
  return SQLITE_ERROR;
#endif
}

int sqlc_db_rekey_bytes(sqlc_handle_t db, unsigned char *key_bytes, int num_bytes)
{
  sqlite3 *mydb = HANDLE_TO_VP(db);

#ifdef SQLITE_HAS_CODEC
  return sqlite3_rekey(mydb, key_bytes, num_bytes);
#else
  return SQLITE_ERROR;
#endif
}
**/

int sqlc_db_key_native_string(sqlc_handle_t db, char *key_string)
{
  // NOT IMPLEMENTED in this version branch:
  return SQLITE_INTERNAL;
}

sqlc_long_t sqlc_db_last_insert_rowid(sqlc_handle_t db)
{
  sqlite3 *mydb = HANDLE_TO_VP(db);

  return sqlite3_last_insert_rowid(mydb);
}

int sqlc_db_total_changes(sqlc_handle_t db)
{
  sqlite3 *mydb = HANDLE_TO_VP(db);

  return sqlite3_total_changes(mydb);
}

int sqlc_db_errcode(sqlc_handle_t db)
{
  sqlite3 *mydb = HANDLE_TO_VP(db);

  return sqlite3_errcode(mydb);
}

const char * sqlc_db_errmsg_native(sqlc_handle_t db)
{
  sqlite3 *mydb = HANDLE_TO_VP(db);

  return sqlite3_errmsg(mydb);
}

const char * sqlc_errstr_native(int errcode)
{
  return sqlite3_errstr(errcode);
}

int sqlc_st_bind_double(sqlc_handle_t st, int pos, double val)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p %d %lf", __func__, myst, pos, val);

  return sqlite3_bind_double(myst, pos, val);
}

int sqlc_st_bind_int(sqlc_handle_t st, int pos, int val)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p %d %d", __func__, myst, pos, val);

  return sqlite3_bind_int(myst, pos, val);
}

int sqlc_st_bind_long(sqlc_handle_t st, int pos, sqlc_long_t val)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p %d %lld", __func__, myst, pos, val);

  return sqlite3_bind_int64(myst, pos, val);
}

int sqlc_st_bind_null(sqlc_handle_t st, int pos)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);
  return sqlite3_bind_null(myst, pos);
}

int sqlc_st_bind_text_native(sqlc_handle_t st, int col, const char *val)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p %d %s", __func__, myst, col, val);

  return sqlite3_bind_text(myst, col, val, -1, SQLITE_TRANSIENT);
}

int sqlc_st_step(sqlc_handle_t stmt)
{
  sqlite3_stmt *mystmt = HANDLE_TO_VP(stmt);

  return sqlite3_step(mystmt);
}

int sqlc_st_column_count(sqlc_handle_t st)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p", __func__, myst);

  return sqlite3_column_count(myst);
}

const char *sqlc_st_column_name(sqlc_handle_t st, int col)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p %d", __func__, myst, col);

  return sqlite3_column_name(myst, col);
}

double sqlc_st_column_double(sqlc_handle_t st, int col)
{
  return sqlite3_column_double(HANDLE_TO_VP(st), col);
}

int sqlc_st_column_int(sqlc_handle_t st, int col)
{
  return sqlite3_column_int(HANDLE_TO_VP(st), col);
}

sqlc_long_t sqlc_st_column_long(sqlc_handle_t st, int col)
{
  return sqlite3_column_int64(HANDLE_TO_VP(st), col);
}

const char *sqlc_st_column_text_native(sqlc_handle_t st, int col)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p %d", __func__, myst, col);

  return (const char *)sqlite3_column_text(myst, col);
}

int sqlc_st_column_type(sqlc_handle_t st, int col)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p %d", __func__, myst, col);

  return sqlite3_column_type(myst, col);
}

int sqlc_st_finish(sqlc_handle_t st)
{
  sqlite3_stmt *myst = HANDLE_TO_VP(st);

  MYLOG("%s %p", __func__, myst);

  return sqlite3_finalize(myst);
}

int sqlc_db_close(sqlc_handle_t db)
{
  sqlite3 *mydb = HANDLE_TO_VP(db);

  MYLOG("%s %p", __func__, mydb);

// XXX TBD consider sqlite3_close() vs sqlite3_close_v2() ??:
  return sqlite3_close(mydb);
}

