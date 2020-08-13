# sqlite3-base64

Add BASE64 encoding function to sqlite3.

**LICENSE:** UNLICENSE (public domain) ref: <http://unlicense.org/>

## External dependencies

- `cencode.h`, `cencode.c` from <http://libb64.sourceforge.net/> (public domain)
- `sqlite3.h`

**NOTE:** `cencode.h` must be in the build path.

## Sample usage

After opening sqlite3 database:

```c
sqlite3_base64_init(db);
```

Then the following SQL:
```sql
SELECT BASE64(X'010203')
```

returns the following value: `AQID`
