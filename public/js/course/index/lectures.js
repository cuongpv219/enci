$(document).ready(function() {
  $('.lecture').each(function() {
    // Ẩn những item này (from VT partner)
    var ignores = [15051, 15054];
    var url = $(this).attr('data-url');
    var self = $(this);
    ignores.forEach(function(id) {
      if (url.indexOf(id) == -1) {
        self.click(function() {
          window.location = url;
        });
      } else {
        self.remove();
      }
    });
  });
});
