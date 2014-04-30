#!/bin/sh

[ -n "$QUERY_STRING" ] && rma="${QUERY_STRING##*=}" || rma=0

echo "Content-Type: text/plain"
echo

if [ "$rma" = 1 ]; then
	modver="`cat /etc/modversion`"
	if [ "$modver" -ge 215 ]; then
		touch /var/lib/humaxtv_backup/.rma
	else
		touch /var/lib/humaxtv/.rma
	fi
else
	touch /var/lib/humaxtv/mod/_RESET_CUSTOM_FIRMWARE_ENVIRONMENT
fi

