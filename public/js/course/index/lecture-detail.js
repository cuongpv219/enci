$(document).ready(function() {
    $('.box-mode').click(function() {
        if (!$(this).hasClass('view-mode-active')) {
            $(this).parent().children('.tree-mode').removeClass('view-mode-active');
            $(this).addClass('view-mode-active');
            showSectionContent($(this).parent().parent().children('.section-content-box'));
        }
    });
    
    $('.tree-mode').click(function() {
        if (!$(this).hasClass('view-mode-active')) {
            $(this).parent().children('.box-mode').removeClass('view-mode-active');
            $(this).addClass('view-mode-active');
            showSectionTree($(this).parent().parent().children('.section-content-tree'));
        }
    });
});

function showSectionTree(sectionTree) {
    sectionTree.show();
    sectionTree.parent().children('.section-content-box').hide();
}
    
function showSectionContent(sectionContent) {
    sectionContent.show();
    sectionContent.parent().children('.section-content-tree').hide();
}