/* API version to check: */
#define SQLC_API_VERSION 1

/* Export some important sqlite open flags to the Java interface (VFS not supported): */
#define SQLC_OPEN_READONLY      0x00001
#define SQLC_OPEN_READWRITE     0x00002
#define SQLC_OPEN_CREATE        0x00004
#define SQLC_OPEN_URI           0x00040
#define SQLC_OPEN_MEMORY        0x00080
#define SQLC_OPEN_NOMUTEX       0x08000
#define SQLC_OPEN_FULLMUTEX     0x10000
#define SQLC_OPEN_SHAREDCACHE   0x20000
#define SQLC_OPEN_PRIVATECACHE  0x40000

/* some important sqlite result codes to the Java interface: */
#define SQLC_RESULT_OK          0
#define SQLC_RESULT_ERROR       1
#define SQLC_RESULT_INTERNAL    2
#define SQLC_RESULT_PERM        3
#define SQLC_RESULT_ABORT       4
/* TBD ... */
#define SQLC_RESULT_CONSTRAINT  19
#define SQLC_RESULT_MISMATCH    20
#define SQLC_RESULT_MISUSE      21
/* TBD ... */
#define SQLC_RESULT_ROW         100
#define SQLC_RESULT_DONE        101

/* and sqlite datatypes: */
#define SQLC_INTEGER    1
#define SQLC_FLOAT      2
#define SQLC_TEXT       3
#define SQLC_BLOB       4
#define SQLC_NULL       5

/* Could not easily get int64_t from stddef.h for gluegen */
typedef long long sqlc_long_t;

/* negative number indicates an error: */
typedef sqlc_long_t sqlc_handle_t;

/* RECOMMENDED (alt 1): Use this call at startup to check Java/native library match
 * (returns SQLC_RESULT_OK [0] if OK, other value in case of mismatch) */
int sqlc_api_version_check(int sqlc_api_version);

/* RECOMMENDED (alt 2): Check Java/native library match and open database handle */
sqlc_handle_t sqlc_api_db_open(int sqlc_api_version, const char *filename, int flags);

sqlc_handle_t sqlc_db_open(const char *filename, int flags);

// FUTURE TBD (???):
//sqlc_handle_t sqlc_db_open_vfs(const char *filename, int flags, const char *vfs);

// FUTURE TBD (???) for sqlcipher:
//  int sqlc_db_key_bytes(sqlc_handle_t db, unsigned char *key_bytes, int num_bytes);
//  int sqlc_db_rekey_bytes(sqlc_handle_t db, unsigned char *key_bytes, int num_bytes);

int sqlc_db_key_native_string(sqlc_handle_t db, char *key_string);
// FUTURE TBD (???) for sqlcipher:
//  int sqlc_db_rekey_string_native(sqlc_handle_t db, char *key_string);

sqlc_handle_t sqlc_db_prepare_st(sqlc_handle_t db, const char *sql);

sqlc_long_t sqlc_db_last_insert_rowid(sqlc_handle_t db);
int sqlc_db_total_changes(sqlc_handle_t db);

int sqlc_db_errcode(sqlc_handle_t db);
const char * sqlc_db_errmsg_native(sqlc_handle_t db);
const char * sqlc_errstr_native(int errcode);

// FUTURE TBD bind blob:
//  int sqlc_st_bind_blob(sqlc_handle_t st, int pos, const void *val, int len); // ??
int sqlc_st_bind_double(sqlc_handle_t st, int pos, double val);
int sqlc_st_bind_int(sqlc_handle_t st, int pos, int val);
int sqlc_st_bind_long(sqlc_handle_t st, int pos, sqlc_long_t val);
int sqlc_st_bind_null(sqlc_handle_t st, int pos);
/* Converts UTF-16 to UTF-8 internally: */
int sqlc_st_bind_text_native(sqlc_handle_t st, int col, const char *val);
// FUTURE TBD: bind text in UTF-16 format to SKIP the conversion
//  int sqlc_st_bind_text_string(sqlc_handle_t st, int col, const char *val);

int sqlc_st_step(sqlc_handle_t st);

int sqlc_st_column_count(sqlc_handle_t st);
int sqlc_st_column_type(sqlc_handle_t st, int col);
const char *sqlc_st_column_name(sqlc_handle_t st, int col);
// FUTURE TBD get column as blob (using a Java Buffer ??):
//  void *sqlc_st_column_blob(sqlc_handle_t st, int col);
double sqlc_st_column_double(sqlc_handle_t st, int col);
int sqlc_st_column_int(sqlc_handle_t st, int col);
sqlc_long_t sqlc_st_column_long(sqlc_handle_t st, int col);
/* Converts UTF-8 to UTF-16 internally: */
const char *sqlc_st_column_text_native(sqlc_handle_t st, int col);
// FUTURE TBD: get text in UTF-16 format to SKIP the conversion
//  const char *sqlc_st_column_text_string(sqlc_handle_t st, int col);

int sqlc_st_finish(sqlc_handle_t st); /* call sqlite3_finalize() */

int sqlc_db_close(sqlc_handle_t db);
