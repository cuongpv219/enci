var DO_TEST_TEMPLATE_DIR = baseUrl + '/html/test-templates/do/';

angular.module("DoTestHelper", [])

.service('TestTemplate', function() {
    this.getResultDefaultTemplate = function() {
        return DO_TEST_TEMPLATE_DIR + '_result_default.html';
    };

    this.getResultTOEICTemplate = function() {
        return DO_TEST_TEMPLATE_DIR + '_result_toeic.html';
    };

    this.getDataListTemplate = function(activityName) {
        switch (activityName) {
            case 'Multiple Choice':
				return DO_TEST_TEMPLATE_DIR + '_multiple_choice.html';

            case 'Multiple Choice Inline':
                return DO_TEST_TEMPLATE_DIR + '_multiple_choice_inline.html';

            case 'Choose Correct Answer':
                return DO_TEST_TEMPLATE_DIR + '_choose_correct_answer.html';

            case 'Fill In Blanks':
                return DO_TEST_TEMPLATE_DIR + '_fill_in_blanks.html';

			default:
				return null;
		}
    };

    this.getTestingTimeTemplate = function() {
        return DO_TEST_TEMPLATE_DIR + '_testing_time.html';
    };

    this.getPartIntroTemplate = function() {
        return DO_TEST_TEMPLATE_DIR + '_part_intro.html';
    };

    this.getAnswerExplanationTemplate = function() {
        return DO_TEST_TEMPLATE_DIR + '_answer_explanation.html';
    };


    this.getExplanationTemplate = function() {
        return DO_TEST_TEMPLATE_DIR + '_explanation.html';
    };

    this.getExplanationInlineTemplate = function(html) {
        return '<div class="explanation-inline arrow-box">' + html + '</div>'
    };

    this.getOrderInlineTemplate = function(order) {
        return '<b class="order-inline">' + order + '</b>'
    };
})

.service('ScoreCalculator', function() {

    /**
    * Tính điểm trung bình mỗi câu cho kiểu lưu dữ liệu bình thường
    */
    var average = function(part) {
        if (part.total_mark > 0) {
            var totalQuestion = 0;

            for (var i = 0; i < part.questions.length; i++) {
                var activity = part.questions[i];

                // getTotalQuestions() do Provider cung cấp ngay từ khi duyệt activity
                totalQuestion += activity.getTotalQuestions();
            }

            return part.total_mark / totalQuestion;
        }

        return part.mark_per_question;
    };

    this.toeic = {
        compute: function(parts, conversion) {

            var totalScore = 0;
            for (var i = 0; i < parts.length; i++) {

                var part = parts[i];
                var title = part.title.toLowerCase();
                var activities = parts[i].questions; // các dạng bài
                var correct = 0; // số lượng câu đúng của part

                // Note: TOEIC dùng activity "Multiple Choice"
                for (var j = 0; j < activities.length; j++) {
                    var questions = activities[j].questions;
                    for (var k = 0; k < questions.length; k++) {
                        var q = questions[k];
                        if (!q.isDivider && q.userChoice == q.key) {
                            correct++;
                        }
                        
                    }
                }

                if (title.indexOf('listening') !== -1) {
                    part.correct = correct;
                    scoreListening = parseInt(conversion[correct].listening);
                    totalScore += scoreListening;
                    part.score = scoreListening;
                } else if (title.indexOf('reading') !== -1) {
                    part.correct = correct;
                    scoreReading = parseInt(conversion[correct].reading);
                    totalScore += scoreReading;
                    part.score = scoreReading;
                }
            }

            return totalScore;
        }
    };

    this.multipleChoice = {
        compute: function(activity, part) {
            var correct = 0;
            var result = {};

            for (var i = 0; i < activity.questions.length; i++) {
                var q = activity.questions[i];

                if (!q.isDivider && q.userChoice == q.key) {
                    correct++;
                }
            }

            result.correct = correct;
            result.score = correct * average(part);
            
            return result;
        }
    };

    this.multipleChoiceInline = {
        compute: function(activity, part) {
            var correct = 0;
            var result = {};

            for (var i = 0; i < activity.questions.length; i++) {
                var q = activity.questions[i];

                if (!q.isDivider && q.userChoice == q.key) {
                    correct++;
                }
            }

            result.correct = correct;
            result.score = correct * average(part);
            
            return result;
        }
    };

    this.chooseCorrectAnswer = {
        compute: function(activity, part) {
            var correct = 0;
            var result = {};

            for (var i = 0; i < activity.questions.length; i++) {
                var box = activity.questions[i];

                if (!box.isDivider) {
                    for (var j = 0; j < box.list.length; j++) {
                        var q = box.list[j];
                        if (q.userChoice == q.key) {
                            correct++;
                        }
                    }
                }
            }

            result.correct = correct;
            result.score = correct * average(part);

            return result;
        }
    };

    this.fillInBlanks = {
        compute: function(activity, part) {
            var correct = 0;
            var result = {};

            for (var i = 0; i < activity.questions.length; i++) {
                var box = activity.questions[i];

                if (!box.isDivider) {
                    for (var j = 0; j < box.list.length; j++) {
                        var q = box.list[j];
                        q.correct = false;

                        for ( var t = 0; t < q.answers.length; t++){
                            if (compareTwoString(q.userAnswer, q.answers[t])) {
                                correct++;
                                q.correct = true;
                                break;
                            }
                        }
                    }
                }
            }

            result.correct = correct;
            result.score = correct * average(part);

            return result;
        }
    };

    /**
    * Chấm điểm theo kiểu Test Default
    */
    this.computeByDefault = function(parts) {
        var score = 0;

        /*
        * Duyệt các part và chấm điểm dựa vào activity_name
        */
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var result;

            part.correct = 0;
            part.score = 0;

            for (var j = 0; j < part.questions.length; j++) {
                var activity = part.questions[j];

                switch (activity.name) {
                    case 'Multiple Choice':
                        result = this.multipleChoice.compute(activity, part);
                        break;
                    
                    case 'Multiple Choice Inline':
                        result = this.multipleChoiceInline.compute(activity, part);
                        break;

                    case 'Choose Correct Answer':
                        result = this.chooseCorrectAnswer.compute(activity, part);
                        break;
                    case 'Fill In Blanks':
                        result = this.fillInBlanks.compute(activity, part);
                        break;
                }

                part.correct += result.correct;
                part.score += result.score;
            }

            score += part.score;
        }

        return score;
    };

    /**
    * Lấy ra điểm mỗi part, dùng cho phần test 9 năng lực tư duy (Chấm điểm theo kiểu Test Default)
    */
    this.computeByDefaultInTest = function(parts) {
        var listScore = [];

        /*
        * Duyệt các part và chấm điểm dựa vào activity_name
        */
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var result;

            part.correct = 0;
            part.score = 0;

            for (var j = 0; j < part.questions.length; j++) {
                var activity = part.questions[j];

                switch  (activity.name) {
                    case 'Multiple Choice':
                        result = this.multipleChoice.compute(activity, part);
                        break;
                    
                    case 'Multiple Choice Inline':
                        result = this.multipleChoiceInline.compute(activity, part);
                        break;

                    case 'Choose Correct Answer':
                        result = this.chooseCorrectAnswer.compute(activity, part);
                        break;
                    case 'Fill In Blanks':
                        result = this.fillInBlanks.compute(activity, part);
                        break;
                }

                part.correct += result.correct;
                part.score += result.score;
            }

            listScore[i] = part.score;
        }

        return listScore;
    };
});
