
function highlight(obj, searchTerm)
{
	var bodyText = obj.innerHTML;

	stag = "<span class=yellowshade>";
	etag = "</span>";
  
	var newText = "";
	var i = -1;
	var lcSearchTerm = searchTerm.toLowerCase();
	var lcBodyText = bodyText.toLowerCase();
    
	while (bodyText.length > 0)
	{
		i = lcBodyText.indexOf(lcSearchTerm, i + 1);
		if (i < 0)
		{
			newText += bodyText;
			bodyText = "";
		}
		else
		{
			if (bodyText.lastIndexOf(">", i) >=
			    bodyText.lastIndexOf("<", i))
			{
				if (lcBodyText.lastIndexOf("/script>", i) >=
				    lcBodyText.lastIndexOf("<script", i))
				{
					newText += bodyText.substring(0, i) +
					    stag +
					    bodyText.substr(i,
					    searchTerm.length) + etag;
					bodyText = bodyText.substr(i +
					    searchTerm.length);
					lcBodyText = bodyText.toLowerCase();
					i = -1;
				}
			}
		}
	}
	obj.innerHTML = newText;
}

