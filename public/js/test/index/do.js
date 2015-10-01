$(document).ready(function() {
    var heightFrontBlubar = $('#front-bluebar').css('height');
    var heightFrontMenu = $('#front-menu').css('height');
    var heightTestIntro = $('.test-intro').css('height');

    if ($('.progress ul').length) {
        var heightProgressUl = $('.progress ul').css('height');
        var heightLock = parseInt(heightFrontBlubar) 
            + parseInt(heightFrontMenu) 
            + parseInt(heightTestIntro) 
            + parseInt(heightProgressUl) + 30;
    } else {
        var heightLock = parseInt(heightFrontBlubar) 
            + parseInt(heightFrontMenu) 
            + parseInt(heightTestIntro) +  30;
    }

    $(window).scroll(function () {
        if ($(this).scrollTop() > heightLock) {
            $('.testing-time').addClass('anchoClock');
        } else {
            $('.testing-time').removeClass('anchoClock');
        };
    });
});

angular.module('App', ['ngSanitize',  'TestCommon', 'DoTestHelper', 'timer'])

.directive('result', function(TestTemplate) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: function() {
            var type = test.type;
            switch (type) {
                case 'default':
                    return TestTemplate.getResultDefaultTemplate();

                case 'toeic':
                    return TestTemplate.getResultTOEICTemplate();

                default:
                    window.console.error('Không tìm thấy template bảng kết quả phù hợp', type);
            }
        }
    };
})

.directive('testingTime', function(TestTemplate) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: TestTemplate.getTestingTimeTemplate()
    }
})

.directive('partIntro', function(TestTemplate) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: TestTemplate.getPartIntroTemplate()
    };
})

.directive('highlight', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, elem) {
            $timeout(function() {
                var text = elem.text();
                var pattern = /\[.*\]/g;
                var matched = text.match(pattern);
                if (matched) {
                    var result = matched[0].replace('[', '').replace(']', '')
                    elem.html(text.replace(pattern, '<u><b>' + result + '</b></u>'));
                }
            });
        }
    };
})

.directive('chooseCorrectAnswerContent', function($timeout, $compile, TestTemplate) {
    return {
        restrict: 'A',
        link: function(scope, e, attrs) {
            $timeout(function() {
                var code = e.html();
                code = code.replace(/\[/mg, '<div class="bracket">').replace(/\]/mg, '</div>');

                e.html(code);

                /*
                * Duyệt từng box (mỗi box bao gồm 1 list các answer (list này có key) & paragraph)
                * scope.activity tồn tại là do ng-repeat trong file html sinh ra
                */
                for (var i = 0; i < scope.activity.questions.length; i++) {
                    var box = scope.activity.questions[i];

                    if (attrs.box == i) {
                        for (var j = 0; j < box.list.length; j++) {
                            var question = box.list[j];

                            // Duyệt các bracket sau đó đưa thay thế nội dung bởi question tương ứng
                            e.find('.bracket')
                                .filter(function() {
                                    return $(this).text() == j;
                                }).each(function(index) {
                                    $(this).text(question.answers[index]);

                                    // Params: box index & question index & current index
                                    var params = [i, j, index].join(',');
                                    $(this).attr('ng-class', 'getAnswerClasses(' + params + ')');
                                    $(this).attr('ng-click', 'choose(' + params + ')');

                                    // Explanation inline
                                    if (question.explanation && index == question.key) {
                                        $(this).append(TestTemplate
                                                .getExplanationInlineTemplate(question.explanation));                                        
                                    }

                                    // Order
                                    if (index === 0) {
                                        var order = scope.orderer.computeOrder(
                                            question, scope.activity, scope.part.questions);

                                        if (box.list.length > 1) {
                                            $(this).before(TestTemplate.getOrderInlineTemplate(order));
                                        } else {
                                            $(this).parents('.content:first').prepend(
                                                '<span class="order">' + order + '</span>');
                                            $(this).parents('.question:first').removeClass('unorder');
                                        }
                                    }
                                });
                        }
                    }
                }

                // Recompile
                $compile(e.contents())(scope);
            });
        }
    };
})

.directive('fillInBlanksContent', function($timeout, $compile, TestTemplate) {
    return {
        restrict: 'A',
        link: function(scope, e, attrs) {
            $timeout(function() {
                var code = e.html();
                code = code.replace(/\[/mg, '<div class="bracket">').replace(/\]/mg, '</div>');

                e.html(code);

                /*
                * Duyệt từng box (mỗi box bao gồm 1 list các answer (list này có key) & paragraph)
                * scope.activity tồn tại là do ng-repeat trong file html sinh ra
                */
                for (var i = 0; i < scope.activity.questions.length; i++) {
                    var box = scope.activity.questions[i];

                    if (attrs.box == i) {
                        for (var j = 0; j < box.list.length; j++) {
                            var question = box.list[j];

                            // Duyệt các bracket sau đó đưa thay thế nội dung bởi question tương ứng
                            e.find('.bracket')
                                .filter(function() {
                                    return $(this).text() == j;
                                }).each(function(index) {

                                    var params = [i, j, index].join(',');
                                    var answerLength = box.list[j].answers[0].length;

                                    if ( answerLength <= 15) textBoxLength = '100px' ; 
                                    if ( answerLength > 15 && answerLength <= 30) textBoxLength = '200px' ; 
                                    if ( answerLength > 30 && answerLength <= 45) textBoxLength = '280px' ; 
                                    if (answerLength > 45) textBoxLength = '350px';

                                    $(this).html('<input class="answer" type="text" '+
                                        ' box="' + i + '"' + 
                                        ' list="' + j + '"' + 
                                        ' ng-model="activity.questions[' + i + '].list[' + j + '].userAnswer"' + 
                                        ' ng-class="getAnswerClasses(' + params +')"' +
                                        ' style="width:' + textBoxLength + '">');


                                    // Explanation inline
                                    // if (question.explanation) {

                                        $(this).append('<div ng-include="testTemplate.getAnswerExplanationTemplate('+i + ',' + j +')"></div>');                                        
                                    // }
                                    

                                    // Order
                                    if (index === 0) {
                                        var order = scope.orderer.computeOrder(
                                            question, scope.activity, scope.currentPart.questions);

                                        if (box.list.length > 1) {
                                            $(this).before(TestTemplate.getOrderInlineTemplate(order));
                                        } else {
                                            $(this).parents('.content:first').prepend(
                                                '<span class="order">' + order + '</span>');
                                            $(this).parents('.question:first').removeClass('unorder');
                                        }
                                    }

                                });
                        }
                    }
                }

                // Recompile
                $compile(e.contents())(scope);

                // Hiện đáp án
                $timeout(function() {
                    $('input.answer').each(function() {
                        var i = $(this).attr('box');
                        var j = $(this).attr('list');
                        var explanation = scope.activity.questions[i].list[j].explanation;
                        if (explanation !== undefined) {
                            explanation = explanation.replace('<div>','');
                            explanation = explanation.replace('</div>','');
                        }
                        $(this).parent().find('.content-answer').text(scope.activity.questions[i].list[j].answers[0]);
                        $(this).parent().find('.content-explanation').text(explanation);
                    });
                });
            });
        }
    };
})

.controller('mainCtrl', function($sce, $http, $scope, TestTemplate, ScoreCalculator, OrderCalculator, Provider) {

    $scope.baseUrl = baseUrl;
    $scope.mediaUrl = mediaUrl;
    $scope.test = test;
    $scope.parts = parts;
    $scope.currentPart = $scope.parts[0];
    $scope.testTemplate = TestTemplate;
    $scope.orderer = OrderCalculator;
    $scope.timer = {};
    $scope.finishedTest = false;
    $scope.showExplanation = false;

    threeSixtyPlayer.config.playRingColor = '#0070c0';

    /*
     * Validate dependencies
     */

    switch (test.type) {
        case 'toeic':
            $http.get(baseUrl + '/js/test/helper/share/toeic-score-conversion.json').
            success(function(data, status, headers, config) {
                try {
                    if (angular.isObject(data)) {
                        $scope.toeicConversion = data;
                    } else {
                        throw 'Invalid data';
                    }
                } catch (ex) {
                    window.alert('Lỗi! Bảng chuyển đổi điểm TOEIC không hợp lệ');
                    window.console.error(ex, data, config);
                    $scope.error = true;
                    return;
                }
            });
    }

    /*
     * 1. Không có phần giới thiệu thì ready luôn,
     * 2. Cung cấp thêm function cho activity
     */
    for (var i = 0; i < parts.length; i++) {
        if ($.trim(parts[i].content) === '') {
            $scope.parts[i].ready = true;
        }

        for (var j = 0; j < parts[i].questions.length; j++) {
            var activity = parts[i].questions[j];
            Provider.provideOrderer(activity);
        }
    }

    /*
     * Nếu thời gian được set cho toàn bộ đề
     */
    if (test.time_type === 'all') {
        $scope.timer.time = test.total_time * 60;
    }

    $scope.setCurrentPart = function(part) {
        $scope.currentPart = part;

        if (!$scope.finishedTest && test.time_type === 'part') {
            var seconds = part.time * 60;
            $scope.timer.time = seconds;
            $scope.$broadcast('timer-set-countdown', seconds);
        }

        $scope.pausePlayer();
    };

    $scope.changePart = function(part) {
        if (!$scope.finishedTest && test.time_type === 'part') {
            window.alert('Không được chuyển! Bài Test này phải làm tuần tự từng phần.');
        } else {
            $scope.setCurrentPart(part);
        }
    };

    $scope.getNextPart = function() {
        for (var i = 0; i < $scope.parts.length; i++) {
            if (i < $scope.parts.length - 1 && $scope.currentPart === $scope.parts[i]) {
                return $scope.parts[i + 1];
            }
        }

        return null;
    };

    $scope.nextPart = function() {
        $scope.pausePlayer();
        var next = $scope.getNextPart();
        if (!next) {
            return;
        }

        $scope.setCurrentPart(next);
        $scope.goToTop();
    };

    $scope.getDataListTemplate = function(activity) {
        var url = TestTemplate.getDataListTemplate(activity.name);
        if (!url) {
            window.console.error('Không tìm thấy template ' + activity.name);
        }
        return url;
    };

    $scope.ready = function(part) {
        part.ready = true;
    };

    $scope.timer.finished = function() {
        $scope.$broadcast('timer-start');

        if (test.time_type === 'all' || !$scope.getNextPart()) {
            $scope.computeResult();
        } else {
            $scope.nextPart();
        }

        $scope.$apply();
    };

    $scope.pausePlayer = function() {
        if (threeSixtyPlayer.lastSound) {
            threeSixtyPlayer.stopSound(threeSixtyPlayer.lastSound);
        }
    };

    $scope.computeResult = function() {
        $scope.pausePlayer();

        if ($scope.finishedTest) {
            return;
        }

        playSound(Ucan.Resource.Audio.getShowResultSound());

        /*
         * Sau khi computeScore thì parts sẽ có thêm thông tin
         */

        var score = 0;

        switch (test.type) {
            case 'default':
                score = ScoreCalculator.computeByDefault(parts);
                break;

            case 'toeic':
                score = ScoreCalculator.toeic.compute(parts, $scope.toeicConversion);
                break;

            default:
                window.console.error('Dạng này chưa có công thức chấm điểm');
        }

        var data = {
            id: test.id,
            score: score
        };

        // var working = [];
        // for (var i = 0; i < parts.length; i++) {
        //     working.push({
        //         title: parts[i].title,
        //         working: parts[i].working
        //     });
        // }

        //data.working = working;
        data.status = 'completed';
        $scope.score = score;

        /*
        * Submit score
        */
        submitScore(data);

        $scope.finishedTest = true;
        $scope.goToTop();
    };

    $scope.goToTop = function() {
        window.location.hash = 'top';
    };

    $scope.bindHtml = function(html) {
        return $sce.trustAsHtml(html);
    };

    $scope.getTotalQuestion = function(part) {
        var totalQuestion = 0;

        for (var i = 0; i < part.questions.length; i++) {
            var activity = part.questions[i];
            totalQuestion += activity.getTotalQuestions();
        }

        return totalQuestion;
    };

    $scope.getTotalMark = function() {
        var mark = 0;

        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var markOfPart = parseInt(part.total_mark);
            var markPerQuestion = parseInt(part.mark_per_question);

            if (markOfPart > 0) {
                mark += markOfPart;
            } else if (markPerQuestion > 0) {
                // Nếu part set điểm mỗi câu
                for (var j = 0; part.questions.length; j++) {
                    var activity = part.questions[j];
                    var totalQuestions = activity.getTotalQuestions();
                    mark += markPerQuestion * totalQuestions;
                }
            }
        }

        if (mark === 0) {
            window.console.warn('totalMark bằng 0!');
        }
        return mark;
    };

    // Fist time
    $scope.setCurrentPart($scope.currentPart);

    /*
     * Submit score
     */
    function submitScore(data) {
        if (typeof submited === 'undefined' || submited !== true) {
            if (scoreUrl) {
                $.post(scoreUrl, data, function(responseData) {
                    window.console.log(responseData);
                });
            } else {
                window.console.info('missing scoreUrl');
            }
        }
        submited = true;
    }
})

/*
 * Điều khiển loại test chuyển được step
 */
.controller('ignoreOrderCtrl', function($scope) {
})

/*
 * Điều khiển loại test ko chuyển được step
 */
.controller('orderCtrl', function($scope) {
})


/*********************** Multiple Choice ***********************************/

.controller('multipleChoiceCtrl', function($scope) {

    $scope.getAnswerClasses = function(question, index) {
        if (!$scope.finishedTest) {
            return null;
        }

        var classes = [];

        if (index == question.key) {
            classes.push('key');
        }

        if (index == question.userChoice && index == question.key) {
            classes.push('correct');
        } else if (index == question.userChoice) {
            classes.push('incorrect');
        }

        return classes;
    };
})


/*********************** Multiple Choice Inline ****************************/

.controller('multipleChoiceInlineCtrl', function($scope) {
    $scope.getAnswerClasses = function(question, index) {
        if (!$scope.$parent.finishedTest) {
            return null;
        }

        var classes = [];

        if (index == question.key) {
            classes.push('key');
        }

        if (index == question.userChoice && index == question.key) {
            classes.push('correct');
        } else if (index == question.userChoice) {
            classes.push('incorrect');
        }

        return classes;
    };
})

/*********************** Choose Correct Answer *****************************/

.controller('chooseCorrectAnswerCtrl', function($scope) {
    /**
    * Sau khi recompile trong directive thì có thể gọi được function này
    * @param index {number} index của đáp án đang duyệt tới
    */
    $scope.getAnswerClasses = function(boxIndex, questionIndex, index) {
        var classes = [];

        // Active nếu click
        var question = getQuestion(boxIndex, questionIndex);
        if (index == question.userChoice) {
            classes.push('active');
        }

        if (!$scope.finishedTest) {
            return classes;
        }

        if (index == question.key) {
            classes.push('key');
        }

        if (index == question.userChoice && index == question.key) {
            classes.push('correct');
        } else if (index == question.userChoice) {
            classes.push('incorrect');
        }

        return classes;
    };

    $scope.choose = function(boxIndex, questionIndex, userChoice) {
        if (!$scope.finishedTest) {
            playSound(Ucan.Resource.Audio.getClickedSound2());
            var question = getQuestion(boxIndex, questionIndex);
            question.userChoice = userChoice;
        }
    };

    function getBox(index) {
        return $scope.activity.questions[index];
    }

    function getQuestion(boxIndex, questionIndex) {
        return $scope.activity.questions[boxIndex].list[questionIndex];
    }
})

/*********************** Fill In Blanks *****************************/

.controller('fillInBlanksCtrl', function($scope) {
    $scope.getAnswerClasses = function( boxIndex, questionIndex, index) {
        var classes = [];
        var check = 0;

        if (!$scope.finishedTest) {
            return null;
        }

        var question = getQuestion(boxIndex, questionIndex);
        
        if (question.correct) {
            classes.push('correct');
        } else {
            classes.push('incorrect');
        }
        $('.fill-in-blanks .answer').parent().addClass('show-explanation');
        return classes;
    };

    function getQuestion(boxIndex, questionIndex) {
        return $scope.activity.questions[boxIndex].list[questionIndex];
    }
})
;