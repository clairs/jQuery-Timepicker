//jQuery timepicker v1.0.1


(function($){   
$.fn.timepicker = function(params){

	params = $.extend({
		minutestep: 5,
		minhour: 0,
		maxhour: 23,
		popups: false
	}, params);
	if (params.minhour < 10) params.minhour = "0"+parseInt(params.minhour);
	if (params.maxhour < 10) params.maxhour = "0"+parseInt(params.maxhour);

	var element = this;
	var hourval = 0;
	var minuteval = 0;

	createhelper();

	//Create array of elements that are used for timepicker -- used later on
	//for popup creation
	if (typeof timeselect_array == 'undefined'){
		timeselect_array = new Array('timeselect');
	}
	timeselect_array.push($(element).attr('id'));

	//Create sliders
	$(element).click(function(){
		//Get time: use current time if the date is invalid
		var currentDate = new Date()
		completestring = $(element).val();
		re = /^\d{1,2}:\d{2}([ap]m)?$/;

		if (!completestring.match(re)){
			hourval = currentDate.getHours();
			minuteval = currentDate.getMinutes();
			$(element).val(hourval+':'+minuteval);
		} else {
			timearray = completestring.split(':');
			hourval = timearray[0];
			minuteval = timearray[1];
		}

		if (hourval < params.minhour) hourval = params.minhour;
		if (hourval > params.maxhour) hourval = params.maxhour; 
		settime();
	
		$("#hour").slider({
			orientation: 'vertical',
			range: "max",
			max: 23-(params.minhour),
			min: 23-(params.maxhour),
			step: 1,
			value: 23-hourval,
			slide: function(event, ui) {
				hourval = (23-ui.value);
				settime();
				if (params.popups){
					showpopup(hourval);
				}	
			},
			stop: function(event){
				$('#timepopup').hide();
			}
		});

		//Only go up to 59, or the highest alowable number. Force to be 59 if minutestep is 1
		if (params.minutestep == 1) slider_min = 0; else slider_min = 0+params.minutestep;

		//Only go down to 0, or the lowest allowable number. Force if minutestep is 2
		if (params.minutestep == 2) slider_max = 60; else slider_max = 59;

		$("#minute").slider({
			orientation: 'vertical',
			range: "max",
			min: slider_min,
			max: slider_max,
			step: params.minutestep,
			value: 59-minuteval,
			slide: function(event, ui) {
				minuteval = (59-ui.value);
				settime();
				if (params.popups){
					showpopup(minuteval);
				}	
			},
			stop: function(event){
				$('#timepopup').hide();
			}
		});

	});

	//Create popup whenever an element is selected (remove when focus lost)
	$(document).bind("click", function(e){
		if (e.target.id != '' && jQuery.inArray(e.target.id,timeselect_array) != -1){
  			var pos = $(e.target).offset();  
  			var height = $(e.target).height();
  			$("#timeselect").css( { "left": (pos.left) + "px", "top":(pos.top)+(height+10) + "px" } ).show();
		} else {
			$('#timeselect').hide();
		}
	});


	//Put the time into the selected element
	function settime(){		
		minuteval = Math.round(minuteval/params.minutestep)*params.minutestep;
		if (minuteval < 0) minuteval = 0;
		if (minuteval > 59) minuteval = (60-params.minutestep);

		if (hourval < 10) hourval = "0"+parseInt(hourval);
		if (minuteval < 10) minuteval = "0"+parseInt(minuteval);

		if (hourval < params.minhour) hourval = params.minhour;
		if (hourval > params.maxhour) hourval = params.maxhour; 
		if (params.maxhour != 23 && hourval == params.maxhour) minuteval = '00';

		$(element).val(hourval+':'+minuteval);
	}


	function showpopup(value){
		$('#timepopup').show();
		$('#timepopup').html(value);
		$(document).mousemove(function(e){
		      $('#timepopup').css({'top': (e.pageY)+10, 'left': (e.pageX)+10});
   		}); 
	}
	

	//Create elements which will contain the sliders
	function createhelper() {
		if( $('#timeselect').length == 0 ){
			$('body').append('<div id="timeselect"><div id="hour"></div><div id="minute"></div><span id="timepopup"></span></div>');
		}
	}

};
})(jQuery);
