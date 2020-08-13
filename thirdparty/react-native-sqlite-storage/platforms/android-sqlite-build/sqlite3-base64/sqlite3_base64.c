#include "sqlite3_base64.h"

#include "cencode.h"

#include <string.h>
#include <stdint.h>

static
void sqlite3_base64(sqlite3_context * context, int argc, sqlite3_value ** argv) {
  if (argc < 1) {
    sqlite3_result_null(context);
  } else {
    // THANKS FOR GUIDANCE:
    // http://www.sqlite.org/cgi/src/artifact/43916c1d8e6da5d1
    // (src/func.c:hexFunc)
    sqlite3_value * first = argv[0];

    const uint8_t * blob = sqlite3_value_blob(first);

    const int blen = sqlite3_value_bytes(first);

    char * b64 = sqlite3_malloc(blen*2);

    base64_encodestate es;
    base64_init_encodestate(&es);

    {
      const int len1 = base64_encode_block(blob, blen, b64, &es);
      const int len = len1 + base64_encode_blockend(b64 + len1, &es);

      sqlite3_result_text(context, b64, len, sqlite3_free);
    }
  }
}

int sqlite3_base64_init(sqlite3 * db)
{
    return sqlite3_create_function_v2(db, "BASE64", 1, SQLITE_ANY | SQLITE_DETERMINISTIC, NULL, sqlite3_base64, NULL, NULL, NULL);
}
