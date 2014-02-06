jQuery.support.cors = true;
$.ajaxSetup(
			{
				cache : false
			}
		);
var appSelectOptions,responseJSON,i;
var changeCalendarList = "Change Calendar"
$().SPServices.defaults.webURL = "https://teams.aexp.com/sites/teamsitewendy/";
$().SPServices.defaults.listName = changeCalendarList;

i=0;

function initLoad()
{
	if (IsGadget())
	{
		var storedVal = System.Gadget.Settings.readString("appSelect");
		if (storedVal != "")
			$("#appSelect").val(System.Gadget.Settings.readString("appSelect"));
		
	}
	getAppData();
}

// Delegate for the settings closing event.
if (IsGadget())
{
	System.Gadget.onSettingsClosing = SettingsClosing;
}

function getAppData()
{

	var functionStatus;
	var myQuery_appName = getQuery_appName();	
	
	$().SPServices({
					operation:"GetListItems",
					async:false,
					listName : changeCalendarList,
					CAMLViewFields : "<ViewFields Properties='True'><FieldRef Name='AIM_x0020_Name' /></ViewFields>",
					CAMLQuery : myQuery_appName,
					completefunc : function (xData, Status) {
					
					if (Status == "error")
					{

						functionStatus = "error";
					}
					else
					{
						functionStatus = "success";
					}
				
				    $(xData.responseXML).SPFilterNode("z:row").each(function(){
					//$("body").append("welcome");
					//	$("body").find("#appSelect").append("<option value='sample'>sample</option>");
					});
					
					responseJSON = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson(
							{
								mapping :
								{},
								includeAllAttrs : true
							});
						//$("body").append("welcome");	
				//$("body").find("#appSelect").append("<option value='sample'>sample</option>");
					$("body").append(responseJSON[1].AIM_x0020_Name);		
					$.each(responseJSON, function (i  , cal)
						{
						//	$("body").find("#appSelect").append("<option value='sample'>sample</option>");
							//appSelectOptions = "<option value='"+cal.AIM_x0020_Name+"'>"+ cal.AIM_x0020_Name +"</option>";
							
							if(IsGadget())
								System.Gadget.onShowSettings = SettingsShow;
						});
					}
					
					}); 
					
					return functionStatus;
			
}
	
	
	function SettingsShow()
			{
				
				//$("body").find("#appSelect").append(appSelectOptions);
				//$("#appSelect").append(appSelectOptions);
				//System.Gadget.Settings.writeString("appSelect"+i,appSelectOptions);
				//i=i+1;
			}

// --------------------------------------------------------------------
// Handle the Settings dialog closing event.
// Parameters:
// event - event arguments.
// --------------------------------------------------------------------
function SettingsClosing(event)
{

	if (IsGadget())
	{
		// Save the settings if the user clicked OK.
		if (event.closeAction == event.Action.commit)
		{
			System.Gadget.Settings.writeString("appSelect", $("#appSelect").val());
			System.Gadget.document.parentWindow.settingsHaveChanged();
		}

		// Allow the Settings dialog to close.
		event.cancel = false;

	}
}

function getQuery_appName()
{
  var myQuery = "<Query>" +
				"<OrderBy>"+
					"<FieldRef Name='AIM_x0020_Name'/>" +
					"<Value Type='String'>"+
				"</OrderBy>"+
			"</Query>"; 
	
  return myQuery;
}


function IsGadget()
{
	var IsGadgetrun = (window.System != undefined);
	return IsGadgetrun;
}
