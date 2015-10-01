$(document).ready(function() {
    $('.content').expander({
        slicePoint:       200,  // default is 100
        expandPrefix:     '... ', // default is '... '
        expandText:       'Xem thêm', // default is 'read more'
        userCollapseText: ''  // default is 'read less'
    }); 
});