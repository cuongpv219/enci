var curTabIndex = 0;

$(document).ready(function(){
    
    var count = activityContent.group.length;
    
    for (var i = 0; i < count; i++) {
        activityContent.group[i].reading = Ucan.Function.HTML.editMediaUrl(activityContent.group[i].reading);
    }
    
    function moveToTab(index){
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        curTabIndex = parseInt(index);
        activeTabAndButton(index);
    }
    
    function inactivateAllTabAndNavigatorButton() {
        $('.audio-container div').hide();
        $('#picture-board').children().hide();
        $('#lession-content').hide();
        $('#intro-container').hide();
        $('.home-img').attr("src",baseUrl+'/themes/blueocean/img/home-tab-inactive-icon.png');
    }
            
    function activeTabAndButton(index) {
        $('#next-link').hide();
        $('#prev-link').hide();
        $('#startNow').show();
        if (index != -1) {
            $('#startNow').hide();
            $('#next-link').show();
            $('#prev-link').show();
            $('#pixelout-player-'+index).show();
            $('#paragraph-container_' + index).show();
            $('#picture-'+index).show();
            $('#video-'+index).show();
            $('#slideshow-'+index).show();
            $('#lession-content').html(activityContent.group[index].reading).show();
        } else {
            $('#intro-container').show();
            $('.home-img').attr("src",baseUrl+'/themes/blueocean/img/home-tab-active-icon.png');
        }
    }
    
    function displayActivity() {
        
        var buttonHtml = "";
        
        for(var i = 0; i < count;i++) {
            buttonHtml +='<div id="sentence-button_' + (count-i-1) + '" data-order="' + (count-i-1) + '" class="inactive-button unselected">' + '<span>' + (count-i) +'</span></div>';   
        }
        
        buttonHtml += '<div id="sentence-button_'+(-1)+'" data-order="'+(-1)+'"class="inactive-button unselected">'+'<img class="home-img" src="'+baseUrl+'/themes/blueocean/img/home-tab-inactive-icon.png"/></div>';
        buttonHtml += '<div id="lession-title">'+activityContent.lession_title+'</div>';
        
        $('#paragraph-number').append(buttonHtml);
        $('#intro-title').append(activityContent.lession_title_detail);
        $('#intro-example').append(activityContent.lession_example.replace(/\[\[/g, '<span class="exactly">').replace(/\]\]/g, '</span>'));
        $('.inactive-button').click(function(){		
            var id = $(this).attr('data-order');
            moveToTab(id);
        });
        
        $('#next-link').click(function(){
            if (curTabIndex < count-1){
                moveToTab(curTabIndex + 1) ;
            }
        });
        
        $('#prev-link').click(function(){
            if(curTabIndex > -1) {
                moveToTab(curTabIndex - 1 );
            }
        });
        
        $('#startNow').click(function(){
            moveToTab(0);
        });
    }
    
    displayActivity();
    
    moveToTab(-1);
    
});