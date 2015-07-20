/**
 * here belong the jquery commands to show/hide the description
 */

jQuery(document).ready(function ($) {
	$(".schedule_summary").before("<p class=\"schedule_toggle\"><a href=\"\">+ details</a></p>");
	$(".schedule_summary").hide();
	$('.schedule_toggle a').click(function(e){
		e.preventDefault();
		if ($(this).parent().next().is(":visible")) {
		    $(this).text("+ details");
		} else {
		    $(this).html("&ndash; details");
		}
		$(this).parent().next().toggle();

		e.preventDefault();
    });
})
