#include "sqlite3.h"

#ifndef WIZ_CJK_TOKENIZER_H
#define WIZ_CJK_TOKENIZER_H

#ifdef __cplusplus
extern "C" {
#endif

int registerCjkTokenizer(sqlite3 *db);

#ifdef __cplusplus
}
#endif

#endif //WIZ_CJK_TOKENIZER_H

