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
				var date1,date2,chgStart,chgEnd,title,flyoutWindow, flyoutWinDoc, onDateClickText, EventDate_Arr,EndDate_Arr, ActiveFlyout,tableContents,myWin,count,iter, index_nextFive, firstIndex, responseJSON, date1parse, date2parse,upcomingContents,appName;
				var clickCount=0;
				
				var changeDateArr = new Array();
				var changeDateArr_temp = new Array();
				var nextFiveDatesArr = new Array();
				var tableContentsArr = new Array();
										
			function init()
			{	
				
					var IsGadget = (window.System != undefined);
					//System.Gadget.visibilityChanged=checkVisibility;		
					
					if (IsGadget)
					{
						System.Gadget.Flyout.file = "flyout.html";
						System.Gadget.Flyout.show = false;
						
						System.Gadget.onDock =  CheckDockState;
						System.Gadget.onUndock = CheckDockState;
						//window.onload =  System.Gadget.docked ? CheckDockState : CheckUnDockState;
						//System.Gadget.settingsUI = "settings.html";
						//System.Gadget.onSettingsClosed = SettingsClosed;
						
						System.Gadget.Flyout.onShow = FlyoutLoaded;
					}
					getchgCalendarData();
					
			}
			
		function CheckDockState()
		{
			System.Gadget.beginTransition();
			
			if (System.Gadget.docked==true)
			 {
			$('body').css({
				"height":"200px"
				});
			}
			
			else
			{
			$('body').css({
					"height":"400px"
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
					// Animation complete.
				}
			);

			$(body).css("overflow", "auto");

			}
				
			function IsGadget()
			{
				var IsGadgetrun = (window.System != undefined);
				return IsGadgetrun;
			}
			
			function FlyoutLoaded(myWin)
			{

			var approvedDOM = tableContents;//$("#"+ActiveFlyout).html();
			//console.log("AppDOM "+approvedDOM);
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
				$(flyoutDOM).append(approvedDOM);

			var size = $(flyoutDOM).find('tr').size();
			
			var body = docDOM.body;
			var height = 400;
			if (height > window.screen.availHeight)
				height = window.screen.availHeight;

			setBodyHeight(body, height);
			
			}

		
		/************** CODE FOR ACTION UPON DOCKING THE RESIZE BUTTON ************/

			
			// function upcomingChanges()  //call onclick of a button to facilitate the resize of gadget.
			// {
			
				// clickCount++;
				// $("#tbl_upcoming").find("#a_upcoming").filter(function(){

				// if(clickCount%2!=0)
				// {
					// $('body').css({
						// "height":"400px"
					// });
				// }
				// else
				// {
					// $('body').css({
						// "height":"250px"
					// });
				// }
				
			// });
			
			// }
			
			
			
			function getchgCalendarData()
			{
			
					$("#jqxcal").jqxCalendar({ width: '200px', height: '200px', theme:'myTheme'});
						
					$('#jqxcal').bind('valuechanged', function (event) {
					if(IsGadget())
						System.Gadget.Flyout.show =!System.Gadget.Flyout.show;
					
					});
					
					var functionStatus;
					var myQuery = getQuery();	

					$().SPServices({
					operation:"GetListItems",
					async:false,
					listName : changeCalendarList,
					CAMLViewFields : "<ViewFields Properties='True'><FieldRef Name='LinkTitle' /><FieldRef Name='Project_x0020_ID' /><FieldRef Name='AIM_x0020_Name' /><FieldRef Name='Tech_x0020_PM' /><FieldRef Name='EventDate' /><FieldRef Name='EndDate' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_D' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_V' /><FieldRef Name='AIM_x0020_Name_x003a_AIM_x0020_V0' /><FieldRef Name='Impact' /><FieldRef Name='Outage' /><FieldRef Name='Incident_x0020__x0023_' /><FieldRef Name='Business_x0020_Comm_x0020_Requir' /><FieldRef Name='Bus_x0020_Comm_x0020_Date' /><FieldRef Name='LOB' /><FieldRef Name='Tech_x0020_Comm_x0020_Date' /></ViewFields>",
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
					$(xData.responseXML).SPFilterNode("z:row").each(function(){
					
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
												$(this).css({'background':'#F9C400', 'color':'#fff'})
												changeDateArr[i]=parseInt(date1parse.getDate());
												i++;
										}
													
							});
							

			
					});
					
				  
				  
					changeDateArr.sort();
					
					responseJSON = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson(
							{
								mapping :
								{},
								includeAllAttrs : true
							});

							
					/*******  	DISPLAY THE NEXT FIVE CHANGES 		******/
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

							appName = cal.AIM_x0020_Name.substr(5,(cal.AIM_x0020_Name.length-1));
							 
							 if((EventDate_Formatted>=currDate))	
							  {				 					 
							   upcomingContents = 
							   "<tr><td>"+ EventDate_Arr[3]+"-"+EventDate_Arr[2]+"-"+EventDate_Arr[1] +"</td>" + "<td>"+EndDate_Arr[3]+"-"+EndDate_Arr[2]+"-"+EndDate_Arr[1]+ "</td>"+ "<td>"+cal.LOB.trim()+"</td>"+ "<td>"+appName+"</td>"+"<td>"+cal.LinkTitle+"</td></tr>";	
							 
								count=count+1;
								
								if(count<=5)
								{
									$('#tblSPContent').append(upcomingContents);
								}
								
							  }
							  
						});
					
					/*************************************************/
							
					var td_onClick = $("#cellTableViewjqxcal tr td").click(function()
						 {
						
						// if(IsGadget()) 
							// System.Gadget.Flyout.show = true;
						
						onDateClickText=$(this).text();
						if(onDateClickText<10){onDateClickText="0"+onDateClickText;}
							
						
						$.each(responseJSON, function (i, cal)
						{    
							EventDate_Arr = cal.EventDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
							EndDate_Arr = cal.EndDate.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
						//	console.log("EventDate_Arr"+EventDate_Arr[3]);
								
							/*******  	DISPLAY THE CLICKED DATE'S CHANGES ON FLYOUT 		******/
							 if((EventDate_Arr[3]==onDateClickText))
							 {				 					 
							 tableContents = 
							 "<tr><td>"+ EventDate_Arr[3]+"-"+EventDate_Arr[2]+"-"+EventDate_Arr[1] +"</td>" + "<td>"+EndDate_Arr[3]+"-"+EndDate_Arr[2]+"-"+EndDate_Arr[1]+ "</td>"+ "<td>"+cal.LOB.trim()+"</td>"+ "<td>"+appName+"</td>"+"<td>"+cal.LinkTitle+"</td></tr>";
							
							//console.log(tableContents);
							
							ActiveFlyout=tableContents; 	
							 if(IsGadget())
								System.Gadget.Flyout.show = FlyoutLoaded; 
								// !System.Gadget.Flyout.show;
							 else
							   {
								myWin=window.open('flyout.html','1384802697002','width=200,height=400,toolbar=0,menubar=0,location=0,status=0,scrollbars=0,resizable=1,left=0,top=0');
									FlyoutLoaded(myWin);
								}
								
							}
					
							// /********* NEXT FIVE DAY'S CHANGES ********/
							// count=0; index=0; j=0;
							
							// $('#tblnextFiveDays').append("<div><table><tr></tr></table></div>");
							// while(count<5)
							 // {
							  // //  console.log(parseInt(onDateClickText)+index);
								// if(EventDate_Arr[3]==(parseInt(onDateClickText)+index))
								// {
								 // tableContents = 
								  // "<tr><td>"+ cal.EventDate +"</td>" + "<td>"+cal.EndDate+ "</td>"+ "<td>"+cal.LOB+"</td>"+ "<td>"+cal.AIM_x0020_Name+"</td>"+"<td>"+cal.LinkTitle+"</td></tr>";
								 
								 // $('#tblnextFiveDays').append(tableContents);
								// }
								// count=count+1;
								// index=index+1;
						
							// }	
						});
			
						});
					
					
					}
					
					}); 
					
					return functionStatus;
			}
			
			
			
			 
			 function getQuery()
			{
				var myQuery; 
				
			/********** Changes during a given Date Range **********/   //YYYY-MM-DDTHH:mm:ss.sssZ
		//		var minDate = $('#jqxcalendar').jqxCalendar('getMinDate');
		//		var maxDate = $('#jqxcalendar').jqxCalendar('getMaxDate');
				
				//console.log("Min "+minDate);
				//console.log("Max "+maxDate);
				myQuery = 
					"<Query>" +
					  "<Where> <And>" +
						"<Geq>" +
							"<FieldRef Name='EventDate'/>" +
							"<Value Type='DateTime' IncludeTimeValue='FALSE'>"+"2014-01-01T00:00:00Z"+"</Value>" +	  
							//*********HARDCODED - Date range to be selected by the user
						"</Geq>" +
						"<Leq>" +
							"<FieldRef Name='EndDate'/>" +
							"<Value Type='DateTime' IncludeTimeValue='FALSE'>"+"2014-01-31T00:00:00Z"+"</Value>" +
						"</Leq>" +
					  "</And> </Where>" +
					"</Query>"; 
				//

				return myQuery;
			} 
