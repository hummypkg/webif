var request = false;

/*@cc_on @*/
/*@if (@_jscript_version >= 5)
try
{
	request = new ActiveXObject("Msxml2.XMLHTTP");
}
catch (e)
{
	try
	{
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	case (e2)
	{
		request = false;
	}
}
@end @*/

if (!request && typeof XMLHttpRequest != 'undefined')
	request = new XMLHttpRequest();

