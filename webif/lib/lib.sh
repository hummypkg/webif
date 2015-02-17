#!/bin/sh

lbr_descr()
{
	if [ -f /tmp/.lbr ]; then
		case "`cat /tmp/.lbr`" in
			1) echo "Front panel button" ;;
			2) echo "Remote control handset" ;;
			3) echo "Scheduled event" ;;
			*) echo "Unknown `cat /tmp/.lbr`" ;;
		esac
	else
		echo "Unknown"
	fi
}

log_date()
{
	date +'%d/%m/%Y %H:%M:%S'
}

log()
{
	logf=$1; shift
	echo "`log_date` - $*" >> /var/log/$logf.log
}

plog()
{
	logf=$1; shift
	echo "`log_date` - $*" >> /mod/tmp/$logf.log
}


