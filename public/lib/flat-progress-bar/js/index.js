$(function(){
  var $ppc = $('#learn-progress .progress-pie-chart'),
    percent = parseInt($ppc.data('percent')),
    deg = 360*percent/100;
  if (percent > 50) {
    $ppc.addClass('gt-50');
  }
  $('.ppc-progress-fill').css('transform','rotate('+ deg +'deg)');
  $('.ppc-percents span').html(percent+'%');
  
  var $ppp = $('#learn-point .progress-pie-chart'),
    percent_2 = parseInt($ppp.data('percent')),
    deg_2 = 360*percent_2/100;
  if (percent_2 > 50) {
    $ppp.addClass('gt-50');
  }
  $('#learn-point .ppc-progress-fill').css('transform','rotate('+ deg_2 +'deg)');
  $('#learn-point .ppc-percents span').html(percent_2);
});

