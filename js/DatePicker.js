﻿     // Enable support of cross domain origin request

    jQuery.support.cors = true;

     // Disable caching of AJAX responses - Stop IE reusing cache data for the same requests
    $.ajaxSetup(
    {
    	cache: false
    });
    var changeCalendarList = "Change Calendar"
    $().SPServices.defaults.webURL = "https://teams.aexp.com/sites/teamsitewendy/";
    $().SPServices.defaults.listName = changeCalendarList;
    //var date1, date2, chgStart, chgEnd, title, flyoutWindow, flyoutWinDoc, onDateClickText, EventDate_Arr, EndDate_Arr, ActiveFlyout, myWin, count, iter, index_nextFive, firstIndex, responseJSON, date1parse, date2parse, upcomingContents, appName, timeTransition, appSelectOptions, startDate, endDate, month, year, now;
    //var responsefilteredJSON;
    //var filteredAppNames = new Array();
    //var clickCount = 0;
    //timeTransition = 10;
    var changeDateArr = new Array();
    //var changeDateArr_temp = new Array();
    //var nextFiveDatesArr = new Array();
    //var tableContentsArr = new Array();
    var truncateLimit = 7;
    var gadgetHeight='250px';
    var gadgetWidth='250px';
    var expandedHeight='450px';



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
         minDate = new Date(year, month, 1);
         minDate.setHours(minDate.getHours() + parseFloat(5));
         minDate.setMinutes(minDate.getMinutes() + 30);
         return minDate.toISOString().replace(".000", "");
    }

    function getmaxFormattedDate(month, year)
    {
        maxDate = new Date(year, month + 1, 0);
        maxDate.setHours(maxDate.getHours() + parseFloat(5));
        maxDate.setMinutes(maxDate.getMinutes() + 30);
        return maxDate.toISOString().replace(".000", "");

    }

     function refresh()
     {

        now = new Date();
        month = now.getMonth();
        year = now.getFullYear();
       
        startDate = getminFormattedDate(month, year)
        endDate = getmaxFormattedDate(month, year)

        responseJSON = getchgCalendarData(startDate, endDate);

        $("#cellTableViewjqxcal td").each(function()
        {
            $(this).hover(
                function()
                {
                    $(this).addClass("jqx-calendar-cell-selected");
                }, function()
                {
                    $(this).removeClass("jqx-calendar-cell-selected");
                });

            var tdonclick = function(ev)
            {
                ev.preventDefault();
                onDateClickText = $(this).text();

                showFlyout(onDateClickText);

                return false;
            }
            $(this).unbind('click', tdonclick);
            $(this).bind('click', tdonclick);
        });

        nextFiveChanges(responseJSON);
        
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

    function showFlyout(onDateClickText)
    {
    	clickevent(onDateClickText);

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

    function onMonthChange(month)
    {

    	var minDate, maxDate, currmonth;
    	year = now.getFullYear();
    	var getDate = $('#jqxcal').jqxCalendar('getDate');

    	$('#jqxcal').on('backButtonClick', function()
    	{

    		$("#cellTableViewjqxcal").find("td").filter(function()
    		{
    			// $(this).css({'background':'#F2F2F2', 'color':'#757A64'})
    			$(this).css(
    			{
    				'background': 'none',
    				'color': '#757A64'
    			});
    			$(this).onhover(
    				function()
    				{
    					$(this).addClass("jqx-calendar-cell-selected");
    				}, function()
    				{
    					$(this).removeClass("jqx-calendar-cell-selected");
    				});

    		});


    		month = month - 1;

    		if (month == -1)
    		{
    			month = 11;
    			year = year - 1;
    		}
    		if (month == 12)
    		{
    			month = 0;
    			year = year + 1;
    		}


    		startDate = getminFormattedDate(month, year)
            endDate = getmaxFormattedDate(month, year)

    		responseJSON = getchgCalendarData(startDate, endDate);
    		//responsefilteredJSON = getchgCalendarFilteredData();

    	});

    	$('#jqxcal').on('nextButtonClick', function()
    	{

    		$("#cellTableViewjqxcal").find("td").filter(function()
    		{
    			// $(this).css({'background':'#F2F2F2', 'color':'#757A64'})
    			$(this).css(
    			{
    				'background': 'none',
    				'color': '#757A64'
    			});
    			$(this).onhover(
    				function()
    				{
    					$(this).addClass("jqx-calendar-cell-selected");
    				}, function()
    				{
    					$(this).removeClass("jqx-calendar-cell-selected");
    				});


    		});

    		month = month + 1;

    		if (month == -1)
    		{
    			month = 11;
    			year = year - 1;
    		}
    		if (month == 12)
    		{
    			month = 0;
    			year = year + 1;
    		}

    		startDate = getminFormattedDate(month, year)
            endDate = getmaxFormattedDate(month, year)

    		responseJSON = getchgCalendarData(startDate, endDate);
    		//responsefilteredJSON = getchgCalendarFilteredData();

    	});

    }

    function CheckDockState()
    {
    	// System.Gadget.beginTransition();

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
    	// System.Gadget.endTransition(System.Gadget.TransitionType.morph, timeTransition);
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
    	count = 0;
    	$.each(responseJSON, function(i, cal)
    	{
    		EventDate_Arr = cal.EventDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    		EndDate_Arr = cal.EndDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    		var EventDate_Formatted = new Date(EventDate_Arr[1], EventDate_Arr[2] - 1, EventDate_Arr[3], EventDate_Arr[4], EventDate_Arr[5], EventDate_Arr[6]);
    		//	console.log("EventDate_Arr"+EventDate_Arr[3]);
    		var currDate = new Date();
    		currDate.setDate(currDate.getDate() - 2);
    		//console.log(currDate);

    		// appSelectOptions = "<option value='"+cal.AIM_x0020_Name+"'>"+ cal.AIM_x0020_Name +"</option>";
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

    function highlight()
    {
    	title = $(this).attr("ows_Title");

    	date1 = new Date();
    	date1 = $(this).attr("ows_EventDate");
    	var match1 = date1.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
    	date1parse = new Date(match1[1], match1[2] - 1, match1[3], match1[4], match1[5], match1[6])

    	date2 = new Date();
    	date2 = $(this).attr("ows_EndDate");
    	var match2 = date2.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
    	date2parse = new Date(match2[1], match2[2] - 1, match2[3], match2[4], match2[5], match2[6])

    	$("#cellTableViewjqxcal").find("td").filter(function()
    	{
    		if ($(this).text() == date1parse.getDate())
    		{
    			$(this).css(
    			{
    				'background': '#F9C400',
    				'color': '#fff'
    			});
    			changeDateArr[i] = parseInt(date1parse.getDate());
    			i++;
    		}
    	
    	});

    }

    /*******  	GET THE DATA FROM SHAREPOINT 		******/
    function getchgCalendarData(start, end)
    {
    	
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

    			if (Status == "error")
    			{

    				functionStatus = "error";
    			}
    			else
    			{
    				functionStatus = "success";
    			}
    			var i = 0;


    			$(xData.responseXML).SPFilterNode("z:row").each(highlight);

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
    	return responseJSON;
    }




    /*******  	DISPLAY THE FLYOUT ON CLICK 		******/
    function clickevent(onDateClickText)
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

    		/*******  	DISPLAY THE CLICKED DATE'S CHANGES ON FLYOUT 		******/
    		if ((EventDate_Arr[3] == onDateClickText))
    		{
    			tableContents = tableContents +
    				"<tr><td>" + EventDate_Arr[3] + "-" + EventDate_Arr[2] + "-" + EventDate_Arr[1] + "</td>" + "<td>" + cal.LOB + "</td>" + "<td>" + truncateString(appName, truncateLimit) + "</td>" + '<td><a href="https://teams.aexp.com/sites/teamsitewendy/Lists/Change%20Calendar/dispform.aspx?ID=' + cal.ID + '">' + truncateString(cal.LinkTitle, truncateLimit) + '</a></td>' + "</tr>";

    		}
    	});
    	ActiveFlyout = tableContents;


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