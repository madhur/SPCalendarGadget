			  // Enable support of cross domain origin request

			  jQuery.support.cors = true;

			// Disable caching of AJAX responses - Stop IE reusing cache data for the same requests
			$.ajaxSetup(
			{
				cache : false
			}
			);
				var changeCalendarList = "Change Calendar"
				$().SPServices.defaults.webURL = "https://teams.aexp.com/sites/teamsitewendy/";
				$().SPServices.defaults.listName = changeCalendarList;
				var responseJSON;
				var selectedValues1=new Array();
				var selectedValues2=new Array();
				var selectedValues=new Array();
				var appSelectOptions="";
				var i,j;
				var appNamesDistinct = new Array();
			
			$(document).ready(function(){
					// var selectedList; //= new Array();
					// selectedList = getSelectedValues();
					// console.log("selectedList "+selectedList);
					
			});
		
			function initLoad()
			{	
					if (IsGadget())
					{
						var storedVal = System.Gadget.Settings.readString("appSelect");
						if (storedVal != "")
							$("#appSelect").val(System.Gadget.Settings.readString("appSelect"));		
					}
					var resJSON=getAppData();
					//console.log(resJSON);
					displayAppNames(resJSON);
					selectedValues = getSelectedValues();
					for(var i=0;i<selectedValues.length;i++)
						console.log("sel1 = "+selectedValues[i]);
			}
			
			function displayAppNames(resJSON)
			{   
				var count;
				var unique = new Array();
								
				$.each(resJSON, function (i, cal)
				{
					appNamesDistinct.push(cal.AIM_x0020_Name);
					unique = appNamesDistinct.filter( onlyUnique ); 
					// returns unique values in an array.
				});
				
				for (var k = 0; k < unique.length; k++) {
					appSelectOptions = "<option value='"+unique[k]+"'>"+ unique[k] +"</option>";
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

					$().SPServices({
					operation:"GetListItems",
					async:false,
					listName : changeCalendarList,
					CAMLViewFields : "<ViewFields Properties='True'><FieldRef Name='AIM_x0020_Name' /></ViewFields>",
					CAMLQuery : myQuery,
					completefunc : function (xData, Status) {
					
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
								mapping :
								{},
								includeAllAttrs : true
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
			
			
			function SettingsClosing(event)
			{

				if (IsGadget())
				{
					// Save the settings if the user clicked OK.
					if (event.closeAction == event.Action.commit)
					{
					setSelectedValues();
					System.Gadget.document.parentWindow.settingsHaveChanged();
					}

					// Allow the Settings dialog to close.
					event.cancel = false;

				}
			}
			
			function getSelectedValues()
			{
				for(var i=0;i<3;i++)
				{
//				    var selectedVal=System.Gadget.Settings.readString("app"+i);
					var selectedVal = selectedValues2[i];
					selectedValues1.push(selectedVal);
					$('#appSelect[value="'+selectedVal+'"]').prop('selected', true);
				}
				return selectedValues1;
			}
			
			function setSelectedValues()
			{
				// var x=document.getElementById("appSelect");
				// var selectedValues = new Array();
			
				// for (var i = 0; i < x.options.length; i++) {
				 // if(x.options[i].selected)
					// {
						
						// console.log(x.options[i].text);
						// selectedValues.push(x.options[i].text);
						
					// }
  
				// }
			
				$('#appSelect').find('option:selected').each(function(){
					selectedValues2.push($(this).text());
				});				
				
				for(var i=0;i<selectedValues2.length;i++)
				{
					console.log("sel2 ="+selectedValues2[i]);
				
//				System.Gadget.Settings.writeString("app"+i,selectedValues2[i]);
					
				}
				//return selectedValues2;
			}
			
			 /*******  	CAML QUERY		******/
		    function getQuery()
			{
				var myQuery = 
				"<Query>" +
					"<GroupBy>"+
								"<FieldRef Name='AIM_x0020_Name'/>" +							
					"</GroupBy>"+
				"</Query>"; 
				return myQuery;
			} 
