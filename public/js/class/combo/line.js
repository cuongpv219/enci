angular.module('app', ['ngSanitize'])

.directive('ignoreClick', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.click(function(e) {
        e.stopPropagation();
      });
    }
  };
})

.controller('mainCtrl', function($scope, $sce) {
  
  $scope.subjects = subjects;
  $scope.page = 1;
  $scope.subjectsPerPage = 3;
  $scope.mediaUrl = mediaUrl;
  $scope.baseUrl = baseUrl;
  $scope.readingStyle = {
    'height': document.documentElement.clientHeight - 40
  };
  $scope.positions = [0, 3, 6];
  $scope.positionData = {
    '0': {
      title: 'Học cách nghĩ',
      desc: 'Tự đổi mới bản thân để xuất sắc vượt trội với 1 chiến lược học tập hiệu quả.'
    },
    '3': {
      title: 'Học cách học',
      desc: 'Các phương pháp, công cụ và kĩ năng học tập tối ưu theo quy luật của trí não.'
    },
    '6': {
      title: 'Học cách làm chủ',
      desc: 'Làm chủ bản thân, làm chủ vận mệnh theo học thuyết 369.'
    }
  };
  $scope.authors = [
    {
      name: 'Lê Anh Sơn', 
      img: 'https://scontent-a-sin.xx.fbcdn.net/hprofile-xfa1/v/l/t1.0-1/c18.0.320.320/p320x320/1897849_688355717874399_1233290829_n.jpg?oh=ecb2e437ee02bdc801b84bebd83d1c1e&oe=552AFA28',
      desc: 'Giảng viên cao cấp'
    },
    {
      name: 'Nguyễn Hải Hùng', 
      img: 'http://ucan.vn/shark/public/img/global/team/hung.jpg',
      desc: 'Giảng viên cao cấp'
    },
    {
      name: 'Tạ Văn Hiển', 
      img: 'http://ucan.vn/shark/public/img/global/team/hien.jpg',
      desc: 'Giảng viên cao cấp'
    },
    {
      name: 'Bùi Tuấn Thành', 
      img: 'http://ucan.vn/shark/public/img/global/team/thanh.jpg',
      desc: 'Giảng viên cao cấp'
    },
    {
      name: 'Tô Thị Hồng Nhung', 
      img: 'http://ucan.vn/shark/public/img/global/team/nhung.png',
      desc: 'Giảng viên cao cấp'
    },
    {
      name: 'Đoàn Vũ Hoài Nam', 
      img: 'http://ucan.vn/shark/public/img/global/team/nam.jpg',
      desc: 'Giảng viên cao cấp'
    },
    {
      name: 'Võ Như Trang', 
      img: 'http://ucan.vn/shark/public/img/global/team/trang.jpg',
      desc: 'Giảng viên cao cấp'
    },
    {
      name: 'Đỗ Thị Hải Yến', 
      img: 'http://ucan.vn/shark/public/img/global/team/yen.png',
      desc: 'Giảng viên cao cấp'
    }
  ];

  $scope.setCurrentArticle = function(article) {
    $scope.currentArticle = article;
  };

  $scope.editMediaUrl = function(html) {
    return $sce.trustAsHtml(Ucan.Function.HTML.editMediaUrl(html));
  };

  $scope.goToHash = function(target) {
    window.location.hash = target;
  };
});