EXPORTED_FUNCTIONS = srtp_init \
	srtp_t_sizeof \
	srtp_policy_t_sizeof \
	srtp_crypto_policy_t_sizeof \
	srtp_crypto_policy_t_get_cipher_type \
	srtp_crypto_policy_t_get_cipher_key_len \
	srtp_crypto_policy_t_get_auth_type \
	srtp_crypto_policy_t_get_auth_key_len \
	srtp_crypto_policy_t_get_auth_tag_len \
	srtp_crypto_policy_t_get_sec_serv \
	srtp_crypto_policy_t_create \
	srtp_shutdown \
	srtp_protect \
	srtp_protect_mki \
	srtp_unprotect \
	srtp_unprotect_mki \
	srtp_create \
	srtp_dealloc \
	srtp_add_stream \
	srtp_remove_stream \
	srtp_update \
	srtp_update_stream \
	srtp_crypto_policy_set_rtp_default \
	srtp_crypto_policy_set_rtcp_default

libsrtp2.out.js: libsrtp/libsrtp2.a binding.c
	emcc -o libsrtp2.out.js \
		-s "STRICT=1" \
		-s "ALLOW_MEMORY_GROWTH=1" \
		-s "WASM=1" \
		-s "MODULARIZE=1" \
		-s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap', 'ccall']" \
		-s "FILESYSTEM=0" \
		-s "EXPORTED_FUNCTIONS=[$(shell echo $(EXPORTED_FUNCTIONS) | sed -E "s/([_0-9A-Za-z]+)/'_\1'/g" | sed -E "s/[[:space:]]+/, /g" )]" \
		binding.c \
		libsrtp/libsrtp2.a

docker:
	docker build -t libsrtp-js .
	docker run -v $(shell pwd):/libsrtp-js -it libsrtp-js /bin/bash -c "source /emsdk/emsdk_env.sh && cd /libsrtp-js && make"

test:
	npm run test

clean:
	rm -f libsrtp2.out.*
	cd libsrtp && git clean -xf
	emcc --clear-cache --clear-ports

libsrtp/Makefile:
	cd libsrtp && emconfigure ./configure

libsrtp/libsrtp2.a: libsrtp/Makefile
	cd libsrtp && emmake make

.PHONY : clean docker test
