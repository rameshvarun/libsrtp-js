#include <stddef.h>
#include "libsrtp/include/srtp.h"

size_t srtp_t_sizeof() { return sizeof(srtp_t); }
size_t srtp_policy_t_sizeof() { return sizeof(srtp_policy_t); }
size_t srtp_crypto_policy_t_sizeof() { return sizeof(srtp_crypto_policy_t); }
