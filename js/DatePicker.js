    "use strict";

     // Enable support of cross domain origin request
    jQuery.support.cors = true;

     // Disable caching of AJAX responses - Stop IE reusing cache data for the same requests
    $.ajaxSetup(
    {
    	cache: false
    });
    var changeCalendarList = "Change Calendar"
    $().SPServices.defaults.webURL = "https://teams.aexp.com/sites/teamsitewendy/";
    $().SPServices.defaults.listName = changeCalendarList;
    var changeDateArr = new Array();
    var truncateLimit = 7;
    var gadgetHeight = '250px';
    var gadgetWidth = '250px';
    var expandedHeight = '450px';
    var globalCurrentMonth, globalCurrentYear;

    function IsGadget()
    {
    	return (window.System != undefined);
    }

    $(document).ready(function()
    {
    	$("#jqxcal").jqxCalendar(
    	{
    		width: gadgetHeight,
    		height: gadgetWidth,
    		theme: 'myTheme',
    		enableViews: false,
    		enableFastNavigation: false,
    		showOtherMonthDays: false
    	});

    	refresh();

    });

    function getminFormattedDate(month, year)
    {
    	var minDate = new Date(year, month, 1);
    	minDate.setHours(minDate.getHours() + parseFloat(5));
    	minDate.setMinutes(minDate.getMinutes() + 30);
    	return minDate.toISOString().replace(".000", "");
    }

    function getmaxFormattedDate(month, year)
    {
    	var maxDate = new Date(year, month + 1, 0);
    	maxDate.setHours(maxDate.getHours() + parseFloat(5));
    	maxDate.setMinutes(maxDate.getMinutes() + 30);
    	return maxDate.toISOString().replace(".000", "");

    }

    function refresh()
    {

    	var now = new Date();
    	globalCurrentMonth = now.getMonth();
    	globalCurrentYear = now.getFullYear();

    	var startDate = getminFormattedDate(globalCurrentMonth, globalCurrentYear)
    	var endDate = getmaxFormattedDate(globalCurrentMonth, globalCurrentYear)

    	var responseJSON = getCalendarDates(startDate, endDate);

    	nextFiveChanges(responseJSON);

    	$("#cellTableViewjqxcal td").each(function()
    	{
    		if ($(this).css("visibility") == "hidden")
    		{
    			// console.log("hidden: "+$(this).text());
    		}
    		else
    		{
    			doDateBindings(this, responseJSON);
    		}
    	});

    	$('#jqxcal').on('backButtonClick', function()
    	{

    		// year = now.getFullYear();
    		globalCurrentMonth = globalCurrentMonth - 1;

    		if (globalCurrentMonth == -1)
    		{
    			globalCurrentMonth = 11;
    			globalCurrentYear = globalCurrentYear - 1;
    		}
    		if (globalCurrentMonth == 12)
    		{
    			globalCurrentMonth = 0;
    			globalCurrentYear = globalCurrentYear + 1;
    		}

    		//console.log(month);
    		var startDate = getminFormattedDate(globalCurrentMonth, globalCurrentYear)
    		var endDate = getmaxFormattedDate(globalCurrentMonth, globalCurrentYear)
    		var responseJSON = getCalendarDates(startDate, endDate);

    		$("#cellTableViewjqxcal td").each(function()
    		{
    			if ($(this).css("visibility") == "hidden")
    			{}
    			else
    				doDateBindings(this, responseJSON);

    		});

    	});


    	$('#jqxcal').on('nextButtonClick', function()
    	{
    		// year = now.getFullYear();

    		globalCurrentMonth = globalCurrentMonth + 1;

    		if (globalCurrentMonth == -1)
    		{
    			globalCurrentMonth = 11;
    			globalCurrentYear = globalCurrentYear - 1;
    		}
    		if (globalCurrentMonth == 12)
    		{
    			globalCurrentMonth = 0;
    			globalCurrentYear = globalCurrentYear + 1;
    		}

    		// console.log(month);
    		var startDate = getminFormattedDate(globalCurrentMonth, globalCurrentYear)
    		var endDate = getmaxFormattedDate(globalCurrentMonth, globalCurrentYear)


    		var responseJSON = getCalendarDates(startDate, endDate);


    		$("#cellTableViewjqxcal td").each(function()
    		{

    			if ($(this).css("visibility") == "hidden")
    			{}
    			else
    				doDateBindings(this, responseJSON);

    		});

    	});

    }


    function doDateBindings(tdelem, responseJSON)
    {

    	$(tdelem).css(
    	{
    		'background': 'transparent',
    		'color': 'black',
    		'cursor': 'none'
    	});
    	$(tdelem).unbind('click mouseenter mouseleave');

    	$.each(responseJSON, function(i, cal)
    	{

    		EventDate_Arr = cal.EventDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);

    		var tdText = $(tdelem).text();
    		if (tdText < 10)
    		{
    			tdText = "0" + tdText;
    		}
    		if (tdText === EventDate_Arr[3])
    		{
    			bindCalendarDate(tdelem, responseJSON);
    			return false;
    		}

    	});
    }

    function bindCalendarDate(elem, responseJSON)
    {
    	$(elem).css(
    	{
    		'background': '#F9C400',
    		'color': '#fff',
    		'cursor': 'pointer'
    	});

    	$(elem).hover(
    		function()
    		{
    			$(elem).addClass("jqx-calendar-cell-selected");
    		}, function()
    		{
    			$(elem).removeClass("jqx-calendar-cell-selected");
    		});

    	var tdonclick = function(ev)
    	{
    		ev.preventDefault();
    		onDateClickText = $(elem).text();

    		showFlyout(onDateClickText, responseJSON);

    		return false;
    	}

    	$(elem).bind('click', tdonclick);

    }

    function settingsHaveChanged()
    {

    	refresh();

    }

    function init()
    {
    	if (IsGadget())
    	{
    		System.Gadget.settingsUI = "Settings.html";
    		System.Gadget.onDock = CheckDockState;
    		System.Gadget.onUndock = CheckDockState;
    		System.Gadget.Flyout.file = "flyout.html";
    		System.Gadget.Flyout.show = false;

    	}

    }

    function showFlyout(onDateClickText, responseJSON)
    {
    	var tableContents = "";

        if (onDateClickText < 10)
        {
            onDateClickText = "0" + onDateClickText;
        }

        $.each(responseJSON, function(i, cal)
        {
            EventDate_Arr = cal.EventDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
            EndDate_Arr = cal.EndDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);

            /*******    DISPLAY THE CLICKED DATE'S CHANGES ON FLYOUT        ******/
            if ((EventDate_Arr[3] == onDateClickText))
            {
                tableContents = tableContents +
                    "<tr><td>" + EventDate_Arr[3] + "-" + EventDate_Arr[2] + "-" + EventDate_Arr[1] + "</td>" + "<td>" + cal.LOB + "</td>" + "<td>" + truncateString(appName, truncateLimit) + "</td>" + '<td><a href="https://teams.aexp.com/sites/teamsitewendy/Lists/Change%20Calendar/dispform.aspx?ID=' + cal.ID + '">' + truncateString(cal.LinkTitle, truncateLimit) + '</a></td>' + "</tr>";

            }
        });

        ActiveFlyout = tableContents;

    	if (IsGadget())
    	{
    		System.Gadget.Flyout.file = "flyout.html";
    		System.Gadget.Flyout.show = !System.Gadget.Flyout.show;
    		System.Gadget.Flyout.onShow = FlyoutLoaded;
    	}
    	else
    	{
    		myWin = window.open('flyout.html', '1384802697002', 'width=200,height=400,toolbar=0,menubar=0,location=0,status=0,scrollbars=0,resizable=1,left=0,top=0');

    		FlyoutLoaded(myWin);
    	}

    	return false;
    }


    function CheckDockState()
    {
    	if (System.Gadget.docked == true)
    	{
    		$('body').css(
    		{
    			"height": gadgetHeight
    		});
    	}
    	else
    	{
    		var height =
    			$('body').css(
    			{
    				"height": expandedHeight
    			});
    	}
    }

    function setBodyHeight(body, height)
    {

    	$(body).animate(
    	{
    		height: height
    	}, 0, function() {

    	});

    	$(body).css("overflow", "auto");

    }

    $("#upcomingdiv").css("overflow", "auto");



    function FlyoutLoaded(myWin)
    {
    	var approvedDOM = ActiveFlyout; //$("#"+ActiveFlyout).html();
    	var flyoutDOM;
    	var docDOM;
    	if (IsGadget())
    	{
    		flyoutDOM = System.Gadget.Flyout.document.getElementById('f_tblSPContent');
    		docDOM = System.Gadget.Flyout.document;
    	}
    	else
    	{
    		flyoutDOM = myWin.document.getElementById('f_tblSPContent');
    		docDOM = myWin.document;
    	}

    	if (flyoutDOM != null)
    	{
    		$(flyoutDOM).empty();
    		$(flyoutDOM).append(approvedDOM);
    	}

    	var size = $(flyoutDOM).find('tr').size();

    	var body = docDOM.body;
    	//var height = 250;
    	var height = 40 + size * 25;
    	if (height > window.screen.availHeight)
    		height = window.screen.availHeight;

    	setBodyHeight(body, height);

    }


    /*******  	DISPLAY THE NEXT FIVE CHANGES 		******/
    function nextFiveChanges(responseJSON)
    {
    	$('#tblSPContent').empty();
    	var count = 0;
    	$.each(responseJSON, function(i, cal)
    	{
    		EventDate_Arr = cal.EventDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    		EndDate_Arr = cal.EndDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    		var EventDate_Formatted = new Date(EventDate_Arr[1], EventDate_Arr[2] - 1, EventDate_Arr[3], EventDate_Arr[4], EventDate_Arr[5], EventDate_Arr[6]);
    		var currDate = new Date();
    		currDate.setDate(currDate.getDate() - 2);

    		appName = cal.AIM_x0020_Name.substr(5, (cal.AIM_x0020_Name.length - 1));

    		if ((EventDate_Formatted >= currDate))
    		{
    			upcomingContents =
    				"<tr><td>" + EventDate_Arr[3] + "-" + EventDate_Arr[2] + "-" + EventDate_Arr[1] + "</td>" + "<td>" + cal.LOB.trim() + "</td><td>" + truncateString(appName, truncateLimit) + "</td>" + '<td><a href="https://teams.aexp.com/sites/teamsitewendy/Lists/Change%20Calendar/dispform.aspx?ID=' + cal.ID + '">' + truncateString(cal.LinkTitle, truncateLimit) + '</a></td>' + "</tr>";

    			count = count + 1;

    			if (count <= 5)
    			{
    				$('#tblSPContent').append(upcomingContents);
    			}

    		}

    	});

    }

    /*******  	GET THE DATA FROM SHAREPOINT 		******/
    function getCalendarDates(start, end)
    {
    	var responseJSON;
    	var functionStatus;
    	var myQuery = getQuery(start, end);

    	$().SPServices(
    	{
    		operation: "GetListItems",
    		async: false,
    		listName: changeCalendarList,
    		CAMLViewFields: "<ViewFields Properties='True'><FieldRef Name='LinkTitle' /><FieldRef Name='Project_x0020_ID' /><FieldRef Name='AIM_x0020_Name' /><FieldRef Name='Tech_x0020_PM' /><FieldRef Name='EventDate' /><FieldRef Name='EndDate' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_A'/><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_D' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_V' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_V0' /><FieldRef Name='Impact' /><FieldRef Name='Outage' /><FieldRef Name='Incident_x0020__x0023_' /><FieldRef Name='Business_x0020_Comm_x0020_Requir' /><FieldRef Name='Bus_x0020_Comm_x0020_Date' /><FieldRef Name='LOB' /><FieldRef Name='Tech_x0020_Comm_x0020_Date' /></ViewFields>",
    		CAMLQuery: myQuery,
    		completefunc: function(xData, Status)
    		{
    			changeDateArr.sort();

    			responseJSON = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson(
    			{
    				mapping:
    				{},
    				includeAllAttrs: true
    			});
    		}

    		/*****************************************************************/
    	});

    	//console.log(responseJSON);
    	return responseJSON;
    }
 
    function truncateString(str, limit)
    {
    	if (str.length > limit)
    		return str.substring(0, limit) + "...";
    	return str;
    }


    /*******  	CAML QUERY		******/
    function getQuery(chgStart, chgEnd)
    {
    	var myQuery;

    	/********** Changes during a given Date Range **********/ //YYYY-MM-DDTHH:mm:ss.sssZ

    	myQuery =
    		"<Query>" +
    		"<Where> <And>" +
    		"<Geq>" +
    		"<FieldRef Name='EventDate'/>" +
    		"<Value Type='DateTime' IncludeTimeValue='FALSE'>" + chgStart + "</Value>" +
    	//*********HARDCODED - Date range to be selected by the user
    	"</Geq>" +
    		"<Leq>" +
    		"<FieldRef Name='EndDate'/>" +
    		"<Value Type='DateTime' IncludeTimeValue='FALSE'>" + chgEnd + "</Value>" +
    		"</Leq>" +
    		"</And> </Where>" +
    		"</Query>";
    	//

    	return myQuery;
    }