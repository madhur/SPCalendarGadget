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
				var responseJSON, responsefilteredJSON,date1,date2,title, onDateClickText,date1parse, date2parse,appName;
				var selectedValues1=new Array();
				var selectedValues2=new Array();
				var selectedValues=new Array();
				var appSelectOptions="";
				var i,j;
				var appNamesDistinct = new Array();
				var filteredAppNames = new Array();
			
			$(document).ready(function(){
					// var selectedList; //= new Array();
					// selectedList = getSelectedValues();
					// console.log("selectedList "+selectedList);
					
			});
			
			function initLoad()
			{	
					// if (IsGadget())
					// {
						// var storedVal = System.Gadget.Settings.readString("appSelect");
						// if (storedVal != "")
							// $("#appSelect").val(System.Gadget.Settings.readString("appSelect"));		
					// }
					var resJSON=getAppData();
					//console.log(resJSON);
					displayAppNames(resJSON);
					// if (IsGadget())
					// {
						// System.Gadget.onSettingsClosing = SettingsClosing;
						// System.Gadget.onSettingsClosed = SettingsClosed;
					// }
				settingsClosing();
				getSelectedValues();
				settignsClosed();
				
				// responsefilteredJSON = getchgCalendarFilteredData();
				
			}

			// if (IsGadget())
					// {
						// System.Gadget.onSettingsClosed = SettingsClosed;	
					// }
			
			function SettingsClosing()
			{
						setSelectedValues();
				
			}
			function SettingsClosed()
			{
						responsefilteredJSON = getchgCalendarFilteredData();
				
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
			
			function getSelectedValues()
			{
				for(var i=0;i<4;i++)
				{
				    var selectedVal=System.Gadget.Settings.readString("app"+i);
					//var selectedVal = selectedValues2[i];
			//		console.log("selected value "+selectedVal);
					selectedValues1.push(selectedVal);
					//$('#appSelect[value="'+selectedVal+'"]').prop('selected', true);
					//if(selectedValues1!=null)
						$("#appSelect option[value='" + selectedVal + "']").attr('selected', true);
				}
				return selectedValues1;
			}
			
			function setSelectedValues()
			{
				$('#appSelect').find('option:selected').each(function(){
					selectedValues2.push($(this).text());
				});				
				
				for(var i=0;i<selectedValues2.length;i++)
				{
					console.log("sel2 ="+selectedValues2[i]);
				//	System.Gadget.Settings.writeString("app"+i,selectedValues2[i]);
				}
				
			}
			
			function getAppFilter()
			{
				var selValList = new Array();
				if (IsGadget())
				{
					for(var i=0;i<3;i++)
					{
						//var selVal=System.Gadget.Settings.readString("app"+i);
						var selVal=selectedValues2[i];
						if (selVal==null)
						{
							selValList.push("nofilter");
						}	
						else
							selValList.push(selVal);
					}
				}
				return selValList;
			}
	
			function getAppNames(responseJSON)
			{
				var filterList = new Array();
				var responseAppNames = new Array();
				filterList = getAppFilter();
				for(var i=0;i<filterList.length;i++)
				{
					if(filterList[i]!="nofilter")
						responseAppNames.push(responseJSON.AIM_x0020_Name);
				}
				return responseAppNames;
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
			
			
			function getchgCalendarFilteredData()
			{
				var filteredQuery;
				filteredAppNames = getAppNames(responseJSON);
				filteredQuery = getfilteredQuery(filteredAppNames);
				
				$('body').append("In chgcalendarfilter");
				
				$().SPServices({
					operation:"GetListItems",
					async:false,
					listName : changeCalendarList,
					CAMLViewFields : "<ViewFields Properties='True'><FieldRef Name='LinkTitle' /><FieldRef Name='Project_x0020_ID' /><FieldRef Name='AIM_x0020_Name' /><FieldRef Name='Tech_x0020_PM' /><FieldRef Name='EventDate' /><FieldRef Name='EndDate' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_A'/><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_D' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_V' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_V0' /><FieldRef Name='Impact' /><FieldRef Name='Outage' /><FieldRef Name='Incident_x0020__x0023_' /><FieldRef Name='Business_x0020_Comm_x0020_Requir' /><FieldRef Name='Bus_x0020_Comm_x0020_Date' /><FieldRef Name='LOB' /><FieldRef Name='Tech_x0020_Comm_x0020_Date' /></ViewFields>",
					CAMLQuery : filteredQuery,
					completefunc : function (xData, Status) {
					
					if (Status == "error")
					{

						functionStatus = "error";
					}
					else
					{
						functionStatus = "success";
					}
				
					var i=0;
					$(xData.responseXML).SPFilterNode("z:row").each(highlight);  
					
					responsefilteredJSON=$(xData.responseXML).SPFilterNode("z:row").SPXmlToJson(
							{
								mapping :
								{},
								includeAllAttrs : true
							});
					}
				
					}); 
					return responsefilteredJSON;
			}

			function highlight()
			{
												
							date1 = new Date();
							date1=$(this).attr("ows_EventDate");
							var match1 = date1.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
							date1parse = new Date(match1[1], match1[2] - 1, match1[3], match1[4], match1[5], match1[6])

							date2 = new Date();
							date2=$(this).attr("ows_EndDate");
							var match2 = date2.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
							date2parse = new Date(match2[1], match2[2] - 1, match2[3], match2[4], match2[5], match2[6])
							
							$("#cellTableViewjqxcal").find("td").filter(function(){
									if( $(this).text()==date1parse.getDate())
										{
												$(this).css({'background':'#FEF6D1', 'color':'#fff'});
												changeDateArr[i]=parseInt(date1parse.getDate());
												i++;
										}
					});
					
		    } 
			
			function getfilteredQuery(filteredAppNames)
			{
				var myfilteredQuery; 
				
			/********** Changes of selected applications **********/
				
				if(filteredAppNames.length==1)
				{
					myfilteredQuery = 
						"<Query>" +
							"<Where>" +
								"<Eq>" +
									"<FieldRef Name='AIM_x0020_Name'/>" +
									"<Value Type='Text'>"+filteredAppNames[0]+"</Value>" +
								"</Eq>" +
							"</Where>" +
						"</Query>"; 
				}
				else if(filteredAppNames.length==2)
				{
					myfilteredQuery = 
					"<Query>"+
					"<Where>"+
						"<In>"+
							"<FieldRef Name='AIM_x0020_Name'/>"+
							"<Values>"+
								"<Value Type='Text'>"+filteredAppNames[0]+"</Value>"+
								"<Value Type='Text'>"+filteredAppNames[1]+"</Value>"+
							"</Values>"+
						"</In>"+
					"</Where>"+
					"</Query>";
				}
				else if(filteredAppNames.length==3)
				{
					myfilteredQuery = 
					"<Query>"+
					"<Where>"+
						"<In>"+
							"<FieldRef Name='AIM_x0020_Name'/>"+
							"<Values>"+
								"<Value Type='Text'>"+filteredAppNames[0]+"</Value>"+
								"<Value Type='Text'>"+filteredAppNames[1]+"</Value>"+
								"<Value Type='Text'>"+filteredAppNames[2]+"</Value>"+
							"</Values>"+
						"</In>"+
					"</Where>"+
					"</Query>";
				}

				return myfilteredQuery;
			} 