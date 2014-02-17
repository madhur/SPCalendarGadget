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
var responseJSON, responsefilteredJSON, date1, date2, title, onDateClickText, date1parse, date2parse, appName;
var selectedValues1 = new Array();
var selectedValues2 = new Array();
var selectedValues = new Array();
var allValues = new Array();
var appSelectOptions = "";
var i, j;
var appNamesDistinct = new Array();
var filteredAppNames = new Array();
var flag=0;

$("#appSelect").css("overflow", "auto");

function initLoad()
{
	var resJSON = getAppData();
	displayAppNames(resJSON);
	if (IsGadget())
	{
		System.Gadget.onSettingsClosing = SettingsClosing;

	} 
	getSelectedValues();
	
}

function SettingsClosing(event)
{
	if (IsGadget())
	{
		// Save the settings if the user clicked OK.
		if (event.closeAction == event.Action.commit)
		{
			if(flag==1)
				onReset();
			else
				setSelectedValues();
			
			System.Gadget.document.parentWindow.settingsHaveChanged();
		}
		// Allow the Settings dialog to close.
	
		flag=0;
		event.cancel = false;
	}
	
}

function displayAppNames(resJSON)
{
	var count;
	var unique = new Array();

	$.each(resJSON, function(i, cal)
	{
		appNamesDistinct.push(formatOWSItem(cal.AIM_x0020_Name, 1));
		unique = appNamesDistinct.filter(onlyUnique);
		// returns unique values in an array.
	});

	for (var k = 0; k < unique.length; k++)
	{
		appSelectOptions = "<option value='" + unique[k] + "'>" + unique[k] + "</option>";
		$("body").find("#appSelect").append(appSelectOptions);

	}
}

function onlyUnique(value, index, self)
{
	return self.indexOf(value) === index;
}

function getAppData()
{
	var functionStatus;
	var myQuery = getQuery();

	$().SPServices(
	{
		operation: "GetListItems",
		async: false,
		listName: changeCalendarList,
		CAMLViewFields: "<ViewFields Properties='True'><FieldRef Name='AIM_x0020_Name' /></ViewFields>",
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

			responseJSON = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson(
			{
				mapping:
				{},
				includeAllAttrs: true
			});
		}

	});

	return responseJSON;
}

function IsGadget()
{
	var IsGadgetrun = (window.System != undefined);
	return IsGadgetrun;
}

function getSelectedValues()
{
	selectedValues1 = new Array();
	for (var i = 0; i < 4; i++)
	{
		var selectedVal = System.Gadget.Settings.readString("app" + i);
		selectedValues1.push(selectedVal);
		$("#appSelect option[value='" + selectedVal + "']").attr('selected', true);
	}
	return selectedValues1;
}

function setSelectedValues()
{
	selectedValues2 = new Array();
	$('#appSelect').find('option:selected').each(function()
	{
		selectedValues2.push($(this).text());
	});

	for (var i = 0; i < selectedValues2.length; i++)
		{
			System.Gadget.Settings.writeString("app" + i, selectedValues2[i]);
		}
}

function ResetSelection()
	{
		flag=1;
		$("#appSelect > option").prop("selected", false);
	}

function onReset()
{
	allValues = new Array();
	$('#appSelect').find('option').each(function()
		{
			allValues.push($(this).text());
		});
		
		for (var i = 0; i < allValues.length; i++)
		{
			System.Gadget.Settings.writeString("app" + i, allValues);
		}
}
	
function getAppFilter()
{
	var selValList = new Array();
	if (IsGadget())
	{
		for (var i = 0; i < 3; i++)
		{
			var selVal = System.Gadget.Settings.readString("app" + i);
			if (selVal == null)
			{
				selValList.push("nofilter");
			}
			else
				selValList.push(selVal);
		}
	}
	return selValList;
}


/*******  	CAML QUERY		******/
function getQuery()
{
	var myQuery =
		"<Query>" +
		"<GroupBy>" +
		"<FieldRef Name='AIM_x0020_Name'/>" +
		"</GroupBy>" +
		"</Query>";
	return myQuery;
}


function OnDivScroll()
{
    var listappSelect = document.getElementById("appSelect");

    if (listappSelect.options.length > 8)
    {
        listappSelect.size=listappSelect.options.length;
    }
    else
    {
        listappSelect.size=8;
    }
}

function OnSelectFocus()
{
    if (document.getElementById("appSelectDiv").scrollLeft != 0)
    {
        document.getElementById("appSelectDiv").scrollLeft = 0;
    }

    var listappSelect = document.getElementById("appSelect");
    if( listappSelect.options.length > 8)
    {
        listappSelect.focus();
        listappSelect.size=8;
    }
}

function formatOWSItem(item, idx)
{
	var tmpStr = "";
	if (item === null || item === undefined)
	{
		// return empty string for null items
		return "";
	}
	else
	{

		tmpStr = item.split(';#');
		return tmpStr[idx];
	}
}