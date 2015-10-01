$(document).ready(function() {
  $('.course-lesson-title').each(function() {
    // Ẩn những item này (from VT partner)
    var ignores = [15051, 15054];
    var url = $(this).attr('href');
    var self = $(this);
    ignores.forEach(function(id) {
      if (url.indexOf(id) != -1) {
        self.parents('.course-lesson:first').remove();
      }
    });
  });
});
