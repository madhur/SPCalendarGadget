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
				var date1,date2,chgStart,chgEnd,title,flyoutWindow, flyoutWinDoc, onDateClickText, EventDate_Arr,EndDate_Arr, ActiveFlyout,myWin,count,iter, index_nextFive, firstIndex, responseJSON, date1parse, date2parse,upcomingContents,appName,timeTransition,appSelectOptions, startDate, endDate,month, year, now;
				var clickCount=0;
				timeTransition=10;
				var changeDateArr = new Array();
				var changeDateArr_temp = new Array();
				var nextFiveDatesArr = new Array();
				var tableContentsArr = new Array();
				var truncateLimit = 7;
				
				
				
$(document).ready(function ()
{
			$("#jqxcal").jqxCalendar({ width: '250px', height: '250px', theme:'myTheme',enableViews: false, enableFastNavigation: false, showOtherMonthDays: false});

				 //init();
				var IsGadget = (window.System != undefined);
					
					if (IsGadget)
					{
						System.Gadget.Flyout.file = "flyout.html";
						System.Gadget.Flyout.show = false;
						
						System.Gadget.settingsUI = "Settings.html";
						System.Gadget.onDock =  CheckDockState;
						System.Gadget.onUndock = CheckDockState;
						
						//System.Gadget.Flyout.onShow = FlyoutLoaded;
						//System.Gadget.onSettingsClosed = SettingsClosed;  
					}	
					
					 now = new Date();
					 month=now.getMonth();
					 year=now.getFullYear();
					 minDate = new Date(year, month, 1);
					 maxDate = new Date(year, month+1, 0);
					 minDate.setHours(minDate.getHours()+parseFloat(5));
					 maxDate.setHours(maxDate.getHours()+parseFloat(5));
					 minDate.setMinutes(minDate.getMinutes()+30);
					 maxDate.setMinutes(maxDate.getMinutes()+30);
					 startDate = minDate.toISOString().replace(".000", ""); //"yyyy-mm-ddThh:mm:ssZ"
					 endDate = maxDate.toISOString().replace(".000", "");
				//	 console.log("Start "+startDate);
				//	 console.log("End "+endDate);
					 responseJSON = getchgCalendarData(startDate,endDate);
				//	 console.log("Res "+responseJSON);
					 
					 $("#cellTableViewjqxcal td").each(function(){
					    var tdonclick = function(ev)
						{
							ev.preventDefault();
							onDateClickText=$(this).text();
						    $(this).css({'background': '#003399','color': '#ff0000'});
							showFlyout(onDateClickText);
							return false;
						}
						$(this).unbind('click',tdonclick);
						$(this).bind('click',tdonclick);
						//$(this).css({'background':'#F9C400', 'color':'#fff'});
					 });
					

						nextFiveChanges(responseJSON);
						onMonthChange(now.getMonth());				 

});

			function init()
			{	
					var IsGadget = (window.System != undefined);
					
					if (IsGadget)
					{
						System.Gadget.Flyout.file = "flyout.html";
						System.Gadget.Flyout.show = false;
						
					//	System.Gadget.settingsUI = "Settings.html";
					//	System.Gadget.onDock =  CheckDockState;
					//	System.Gadget.onUndock = CheckDockState;
						
					//	System.Gadget.Flyout.onShow = FlyoutLoaded;
					//	System.Gadget.onSettingsClosed = SettingsClosed;
					}
					
					
					 
					 now = new Date();
					 month=now.getMonth();
					 year=now.getFullYear();
					 minDate = new Date(year, month, 1);
					 maxDate = new Date(year, month+1, 0);
					 minDate.setHours(minDate.getHours()+parseFloat(5));
					 maxDate.setHours(maxDate.getHours()+parseFloat(5));
					 minDate.setMinutes(minDate.getMinutes()+30);
					 maxDate.setMinutes(maxDate.getMinutes()+30);
					 startDate = minDate.toISOString().replace(".000", ""); //"yyyy-mm-ddThh:mm:ssZ"
					 endDate = maxDate.toISOString().replace(".000", "");
				//	 console.log("Start "+startDate);
				//	 console.log("End "+endDate);
					 responseJSON = getchgCalendarData(startDate,endDate);
					 onMonthChange(now.getMonth());
				//	 console.log("Res "+responseJSON);
					 
					 
					 var tdonclick1 = function(ev)
						{
							ev.preventDefault();
							onDateClickText=$(this).text();
							showFlyout(onDateClickText);
							$(this).css({'background': '#003399','color': '#ff0000'});
							return false;
						}
						$("#cellTableViewjqxcal td").unbind('click',tdonclick1);
						$("#cellTableViewjqxcal td").bind('click',tdonclick1);
						
						nextFiveChanges(responseJSON);
						
					
					 // $('#jqxcal').bind('valuechanged', function (event) {
					// if(IsGadget())
						// System.Gadget.Flyout.show = !System.Gadget.Flyout.show;
						// clickevent();
					// });
				}    
			
		 function showFlyout(onDateClickText)
			{
			//	console.log("onDateClickText = "+onDateClickText);
				clickevent(onDateClickText);
	 
						if(IsGadget())
						   {
							System.Gadget.Flyout.file = "flyout.html";
							//System.Gadget.Flyout.show=true;
							System.Gadget.Flyout.show = !System.Gadget.Flyout.show;
							 
						    System.Gadget.Flyout.onShow = FlyoutLoaded; 
							}
						else
							 {
									 myWin=window.open('flyout.html','1384802697002','width=200,height=400,toolbar=0,menubar=0,location=0,status=0,scrollbars=0,resizable=1,left=0,top=0');
									 	
									 FlyoutLoaded(myWin);
							 }
							 
							 return false;
			}		
					
		function onMonthChange(month)
		{
					
					 var minDate, maxDate, currmonth;
					 year=now.getFullYear();
					 var getDate= $('#jqxcal').jqxCalendar('getDate');
					 
					 $('#jqxcal').on('backButtonClick', function () {
					
						//$('#jqxcal').jqxCalendar('clear');				
						
						 $("#cellTableViewjqxcal").find("td").filter(function(){
							// $(this).css({'background':'#F2F2F2', 'color':'#757A64'})
							$(this).css({'background':'none', 'color':'#757A64'});
						 });
						
						//var getDate=$('#jqxcal').jqxCalendar('getDate');
						
						month=month-1;
						
						if(month==-1)
						{
							month=11;
							year=year-1;
						}
						if(month==12)
						{
							month=0;
							year=year+1;
						}
					//	console.log("Month num back "+month+"year next " +year);
						
					 minDate = new Date(year, month, 1);
					 maxDate = new Date(year, month+1, 0);
					 minDate.setHours(minDate.getHours()+parseFloat(5));
					 maxDate.setHours(maxDate.getHours()+parseFloat(5));
					 minDate.setMinutes(minDate.getMinutes()+30);
					 maxDate.setMinutes(maxDate.getMinutes()+30);
					 startDate = minDate.toISOString().replace(".000", ""); //"yyyy-mm-ddThh:mm:ssZ"
					 endDate = maxDate.toISOString().replace(".000", "");
					// console.log("Start "+startDate);
					// console.log("End "+endDate);
					 responseJSON = getchgCalendarData(startDate,endDate);
						
					});
				
					$('#jqxcal').on('nextButtonClick', function () {
						//$('#jqxcal').jqxCalendar('clear'); 
						
						 $("#cellTableViewjqxcal").find("td").filter(function(){
							// $(this).css({'background':'#F2F2F2', 'color':'#757A64'})
							$(this).css({'background':'none', 'color':'#757A64'});
						 });

						month=month+1;
						
						if(month==-1)
						{
							month=11;
							year=year-1;
						}
						if(month==12)
						{
							month=0;
							year=year+1;
						}
			//			console.log("Month num next "+month+"year next " +year);
						
					 minDate = new Date(year, month, 1);
					 maxDate = new Date(year, month+1, 0);
					 minDate.setHours(minDate.getHours()+parseFloat(5));
					 maxDate.setHours(maxDate.getHours()+parseFloat(5));
					 minDate.setMinutes(minDate.getMinutes()+30);
					 maxDate.setMinutes(maxDate.getMinutes()+30);
					 startDate = minDate.toISOString().replace(".000", ""); //"yyyy-mm-ddThh:mm:ssZ"
					 endDate = maxDate.toISOString().replace(".000", "");
					 //console.log("Start "+startDate);
					 //console.log("End "+endDate);
					 responseJSON = getchgCalendarData(startDate,endDate);
					});
					
		}
			
		function SettingsClosed(event)
		{
	// User hits OK on the settings page.
		if (event.closeAction == event.Action.commit)
			{
				 //refresh();
			}

		}
	
		function CheckDockState()
		{
			System.Gadget.beginTransition();
			
			if (System.Gadget.docked==true)
			 {
			$('body').css({
				"height":"250px"
				});
			}
			
			else
			{
			$('body').css({
					"height":"500px"
					});
			}
			System.Gadget.endTransition(System.Gadget.TransitionType.morph, timeTransition);
		}  		
			function setBodyHeight(body, height)
			{

				$(body).animate(
				{
					height : height
				}, 125, function ()
				{
					
				});

				$(body).css("overflow", "auto");

			}
			
			$("#upcomingdiv").css("overflow","auto");
				
			function IsGadget()
			{
				var IsGadgetrun = (window.System != undefined);
				return IsGadgetrun;
			}
			
			 function FlyoutLoaded(myWin)
			{
			var approvedDOM = ActiveFlyout;//$("#"+ActiveFlyout).html();
			//console.log("AppDOM "+approvedDOM);
			//console.log("Approved DOM "+approvedDOM);
			var flyoutDOM;
			var docDOM;
			if(IsGadget())	
			{
				flyoutDOM = System.Gadget.Flyout.document.getElementById('f_tblSPContent');
				docDOM=System.Gadget.Flyout.document;
			}
			else
			{
			flyoutDOM=myWin.document.getElementById('f_tblSPContent');
			docDOM=myWin.document;
			}
			
			if(flyoutDOM!=null)
			{
				//$(flyoutDOM).empty();
				$(flyoutDOM).append(approvedDOM);
			}

			var size = $(flyoutDOM).find('tr').size();
			
			var body = docDOM.body;
			//var height = 250;
			var height = 60 + size*30;
			if (height > window.screen.availHeight)
				height = window.screen.availHeight;

			setBodyHeight(body, height);
			
			}  
			
			
			/*******  	DISPLAY THE NEXT FIVE CHANGES 		******/
			function nextFiveChanges(responseJSON)
			{
			$('#tblSPContent').empty();
				count=0;
					$.each(responseJSON, function (i, cal)
						{
							EventDate_Arr = cal.EventDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
							EndDate_Arr = cal.EndDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
							var EventDate_Formatted = new Date(EventDate_Arr[1], EventDate_Arr[2] - 1, EventDate_Arr[3], EventDate_Arr[4], EventDate_Arr[5], EventDate_Arr[6]);
						//	console.log("EventDate_Arr"+EventDate_Arr[3]);
							var currDate = new Date();
							currDate.setDate(currDate.getDate()-2);
							//console.log(currDate);

							// appSelectOptions = "<option value='"+cal.AIM_x0020_Name+"'>"+ cal.AIM_x0020_Name +"</option>";
							appName = cal.AIM_x0020_Name.substr(5,(cal.AIM_x0020_Name.length-1));
							 
							 if((EventDate_Formatted>=currDate))	
							  {				 					 
							    upcomingContents = 
							    "<tr><td>"+ EventDate_Arr[3]+"-"+EventDate_Arr[2]+"-"+EventDate_Arr[1] +"</td>"+"<td>"+cal.LOB.trim()+"</td><td>"+truncateString(appName,truncateLimit)+"</td>"+'<td><a href="https://teams.aexp.com/sites/teamsitewendy/Lists/Change%20Calendar/dispform.aspx?ID='+cal.ID+'">'+truncateString(cal.LinkTitle,truncateLimit)+'</a></td>'+"</tr>";	

								count=count+1;
								
								if(count<=5)
								{
									$('#tblSPContent').append(upcomingContents);
								}
								
							  }
							  
						});
			
			}
			
			function highlight()
			{
					
							title=$(this).attr("ows_Title");
					
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
												$(this).css({'background':'#F9C400', 'color':'#fff'});
												changeDateArr[i]=parseInt(date1parse.getDate());
												i++;
										}
										else

										{


										}
							
						
					});
					
		    } 
		
		    /*******  	GET THE DATA FROM SHAREPOINT 		******/
			function getchgCalendarData(start,end)
			{
			
					//$("#jqxcal").jqxCalendar({ width: '250px', height: '250px', theme:'myTheme'});
						
					// $('#jqxcal').bind('valuechanged', function (event) {
					// if(IsGadget()){
						// System.Gadget.Flyout.show = !System.Gadget.Flyout.show;
						// //System.Gadget.Flyout.show =FlyoutLoaded;
						
					// }
					// });
				//	console.log("Start In getchgcalendardata()");
					var functionStatus;
					var myQuery = getQuery(start,end);	

					$().SPServices({
					operation:"GetListItems",
					async:false,
					listName : changeCalendarList,
					CAMLViewFields : "<ViewFields Properties='True'><FieldRef Name='LinkTitle' /><FieldRef Name='Project_x0020_ID' /><FieldRef Name='AIM_x0020_Name' /><FieldRef Name='Tech_x0020_PM' /><FieldRef Name='EventDate' /><FieldRef Name='EndDate' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_A'/><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_D' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_V' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_V0' /><FieldRef Name='Impact' /><FieldRef Name='Outage' /><FieldRef Name='Incident_x0020__x0023_' /><FieldRef Name='Business_x0020_Comm_x0020_Requir' /><FieldRef Name='Bus_x0020_Comm_x0020_Date' /><FieldRef Name='LOB' /><FieldRef Name='Tech_x0020_Comm_x0020_Date' /></ViewFields>",
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
					var i=0;
					
					
					  $(xData.responseXML).SPFilterNode("z:row").each(highlight);  
					
					changeDateArr.sort();
					
					responseJSON = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson(
							{
								mapping :
								{},
								includeAllAttrs : true
							});
					}
					
				//	console.log("Response in get "+responseJSON);
					
					}); 
				//	console.log("End In getchgcalendardata() res" +responseJSON);
					return responseJSON;
			}
			
			
			/*******  	DISPLAY THE FLYOUT ON CLICK 		******/
			function clickevent(onDateClickText)
			{
			
						var tableContents="";
						 
						//onDateClickText=$(this).text();
						if(onDateClickText<10){onDateClickText="0"+onDateClickText;}
					//	console.log("Again "+onDateClickText);	
						$.each(responseJSON, function (i, cal)
						{    
							EventDate_Arr = cal.EventDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
							EndDate_Arr = cal.EndDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
						//	console.log("EventDate_Arr"+EventDate_Arr[3]);  
								
							/*******  	DISPLAY THE CLICKED DATE'S CHANGES ON FLYOUT 		******/
							 if((EventDate_Arr[3]==onDateClickText))
							 {				 					 
						//	 console.log("Event = Date "+onDateClickText);
							 tableContents = tableContents+
							 "<tr><td>"+ EventDate_Arr[3]+"-"+EventDate_Arr[2]+"-"+EventDate_Arr[1] +"</td>" + "<td>"+cal.LOB+"</td>"+ "<td>"+truncateString(appName,truncateLimit)+"</td>"+'<td><a href="https://teams.aexp.com/sites/teamsitewendy/Lists/Change%20Calendar/dispform.aspx?ID='+cal.ID+'">'+truncateString(cal.LinkTitle,truncateLimit)+'</a></td>'+"</tr>";

							}
					
						
						});
						//console.log("Table of contents "+tableContents);
						ActiveFlyout=tableContents; 	
					//	console.log("Active flyout " +ActiveFlyout);
						 	

			
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
				
			/********** Changes during a given Date Range **********/   //YYYY-MM-DDTHH:mm:ss.sssZ
				
				myQuery = 
					"<Query>" +
					  "<Where> <And>" +
						"<Geq>" +
							"<FieldRef Name='EventDate'/>" +
							"<Value Type='DateTime' IncludeTimeValue='FALSE'>"+chgStart+"</Value>" +	  
							//*********HARDCODED - Date range to be selected by the user
						"</Geq>" +
						"<Leq>" +
							"<FieldRef Name='EndDate'/>" +
							"<Value Type='DateTime' IncludeTimeValue='FALSE'>"+chgEnd+"</Value>" +
						"</Leq>" +
					  "</And> </Where>" +
					"</Query>"; 
				//

				return myQuery;
			} 
