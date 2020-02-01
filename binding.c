#include <stddef.h>
#include <stdlib.h>
#include "libsrtp/include/srtp.h"

size_t srtp_t_sizeof() { return sizeof(srtp_t); }
size_t srtp_policy_t_sizeof() { return sizeof(srtp_policy_t); }

size_t srtp_crypto_policy_t_sizeof() { return sizeof(srtp_crypto_policy_t); }

srtp_cipher_type_id_t srtp_crypto_policy_t_get_cipher_type(srtp_crypto_policy_t* p) { return p->cipher_type; }
int srtp_crypto_policy_t_get_cipher_key_len(srtp_crypto_policy_t* p) { return p->cipher_key_len; }

srtp_auth_type_id_t srtp_crypto_policy_t_get_auth_type(srtp_crypto_policy_t* p) { return p->auth_type; }
int srtp_crypto_policy_t_get_auth_key_len(srtp_crypto_policy_t* p) { return p->auth_key_len; }
int srtp_crypto_policy_t_get_auth_tag_len(srtp_crypto_policy_t* p) { return p->auth_tag_len; }

srtp_sec_serv_t srtp_crypto_policy_t_get_sec_serv(srtp_crypto_policy_t* p) { return p->sec_serv; }

srtp_crypto_policy_t* srtp_crypto_policy_t_create(srtp_cipher_type_id_t cipher_type,
    int cipher_key_len,
    srtp_auth_type_id_t auth_type,
    int auth_key_len,
    int auth_tag_len,
    srtp_sec_serv_t sec_serv) {
    srtp_crypto_policy_t* cp = malloc(sizeof(srtp_crypto_policy_t));

    cp->cipher_type = cipher_type;
    cp->cipher_key_len = cipher_key_len;
    cp->auth_type = auth_type;
    cp->auth_key_len = auth_key_len;
    cp->auth_tag_len = auth_tag_len;
    cp->sec_serv = sec_serv;

    return cp;
}
