function schedule_icons(reckind, rsvtype, repeat)
{
	var icons = [];

	switch (rsvtype)
	{
	    case 1: icons.push("175_1_00_Reservation_Watch"); break;
	    case 2: icons.push("175_1_00_Reservation_Watch"); break;
	    case 3: icons.push("175_1_11_Reservation_Record"); break;
	    case 4: icons.push("175_1_11_Reservation_Record"); break;
	    case 5: icons.push("745_1_10_Video_2Live"); break;
	    case 6: icons.push("745_1_11_Video_1REC"); break;
	    case 7: icons.push("345_6_08_ST_Ad_Hoc"); break;
	}

	switch (reckind)
	{
	    case 2: icons.push("178_1_26_Icon_Split"); break;
	    case 4: icons.push("175_1_11_Series_Record"); break;
	    default:
		switch (repeat)
		{
		    case 1: icons.push("521_1_00_RP_Daily_C"); break;
		    case 2: icons.push("521_1_00_RP_Weekly_C"); break;
		    case 3: icons.push("521_1_00_RP_Weekdays_C"); break;
		    case 4: icons.push("521_1_00_RP_Weekend_C"); break;
		}
	}

	return icons;
}

