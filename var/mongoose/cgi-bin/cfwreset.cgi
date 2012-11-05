#!/bin/sh

[ -n "$QUERY_STRING" ] && rma="${QUERY_STRING##*=}" || rma=0

echo "Content-Type: text/plain"
echo

if [ "$rma" = 1 ]; then
	touch /var/lib/humaxtv/.rma
else
	touch /var/lib/humaxtv/mod/_RESET_CUSTOM_FIRMWARE_ENVIRONMENT
fi

