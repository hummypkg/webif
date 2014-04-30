$(function() {

$('button').button();

$('#dlnareset').click(function(e) {
	e.preventDefault();
	$('#results').empty().slideDown().load('reset.jim');
});

});

