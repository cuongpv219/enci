$(document).ready(function() {
  $.material.init();
  
  $('#navbar-menu').click(function(){
  	$('.navbar-responsive-collapse-account').removeClass('in');
  });

  $('#user-avatar').click(function(){
  	$('.navbar-responsive-collapse').removeClass('in');
  });
});

