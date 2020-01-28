EXPORTED_FUNCTIONS = srtp_init \
  srtp_shutdown \
	srtp_protect \
	srtp_protect_mki \
  srtp_unprotect \
	srtp_unprotect_mki \
  srtp_create \
	srtp_add_stream \
	srtp_remove_stream \
	srtp_update \
	srtp_update_stream

libsrtp2.out.js: libsrtp/libsrtp2.a
	emcc -o libsrtp2.out.js \
		-s "STRICT=1" \
		-s "ALLOW_MEMORY_GROWTH=1" \
		-s "WASM=1" \
		-s "MODULARIZE=1" \
		-s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap', 'ccall']" \
		-s "FILESYSTEM=0" \
		-s "EXPORTED_FUNCTIONS=[$(shell echo $(EXPORTED_FUNCTIONS) | sed -E "s/([_0-9A-Za-z]+)/'_\1'/g" | sed -E "s/[[:space:]]+/, /g" )]" \
		libsrtp/libsrtp2.a

.PHONY : clean

clean:
	rm -f libsrtp2.out.*
	cd libsrtp && git clean -xf
	emcc --clear-cache --clear-ports

libsrtp/Makefile:
	cd libsrtp && emconfigure ./configure

libsrtp/libsrtp2.a: libsrtp/Makefile
	cd libsrtp && emmake make
