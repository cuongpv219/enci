$(document).ready(function() {
    (function($) {
        $.fn.getAttributes = function() {
            var attributes = {}; 

            if(!this.length)
                return this;

            $.each(this[0].attributes, function(index, attr) {
                attributes[attr.name] = attr.value;
            }); 

            return attributes;
        }
    })(jQuery);
})

function open_input_helper(obj, name, props) {
    name = name ? name : 'RecipeWindow';
    attributes = obj.getAttributes();
    url = obj.attr('data-url');
    inputSources = '';
    callerObject = obj;

    if (props) {
        window.open(url, name,
                'width=' + props.width
                + ',height=' + props.height
                + ',scrollbars=' + props.scrollbars);
    } else {
        window.open(url, name);
    }
}