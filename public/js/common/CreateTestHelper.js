angular.module("CreateTestHelper", [])

.factory('ConstantValues', function() {
    return {
        TEMPLATES_CREATE_DIR: baseUrl + '/html/test-templates/create/'
    };
})

.factory('DefaultValues', function() {
    return {
        /**
         * Tất cả các DạngBài.Question đều có những thuộc tính này
         */
        initQuestionParams: function(question) {
            question.isDivider = false;
            question.dividerContent = null;
        }
    };
})

.factory('InputHelper', function() {
    return {
        getStorage: function() {
           return window.opener.$('#' + window.opener.callerObject.attr('data-outputsource'));
        },
        getBrowseUrl: function() {
            return '/upload/browse.php';
        }
    }
})

.service('Activity', function(TestTemplate) {
    var owner = this;

    function Instance(name, questions) {
        this.name = name ? name : 'Multiple Choice';
        owner.setTemplates(this);
        this.questions = questions ? questions : [];
    };

    this.create = function(name, questions) {
        return new Instance(name, questions);
    }

    this.setTemplates = function(activity) {
        switch (activity.name) {
            case 'Multiple Choice':
                activity.template = {
                    data: TestTemplate.getMultipleChoiceDataTemplate(),
                    input: TestTemplate.getMultipleChoiceTemplate(),
                    
                };
                break;

            case 'Multiple Choice Inline':
                activity.template = {
                    data: TestTemplate.getMultipleChoiceInlineDataTemplate(),
                    input: TestTemplate.getMultipleChoiceInlineTemplate(),
                };
                break;

            case 'Choose Correct Answer':
                activity.template = {
                    data: TestTemplate.getChooseCorrectAnswerDataTemplate(),
                    input: TestTemplate.getChooseCorrectAnswerTemplate()
                };
                break;

            case 'Fill In Blanks':
                activity.template = {
                    data: TestTemplate.getFillInBlanksDataTemplate(),
                    input: TestTemplate.getFillInBlanksTemplate()
                };
                break;

            default:
                window.console.error(activity.name, 'Chưa có dạng này. Tự động chuyển về Multiple Choice');
                activity.template = {
                  data: TestTemplate.getMultipleChoiceDataTemplate(),
                  input: TestTemplate.getMultipleChoiceTemplate()
                };
        }
    };
})

.service('TestTemplate', function(ConstantValues) {

    var v = function() {
        return '?' + randomFromTo(1, 9999);
    };

    this.getDividerTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_divider.html' + v();
    };

    this.getModalTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_modal.html' + v();
    };

    this.getMultipleChoiceTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_multiple_choice.html' + v();
    };

    this.getMultipleChoiceDataTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_multiple_choice_data.html' + v();
    };

    this.getMultipleChoiceInlineTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_multiple_choice_inline.html' + v();
    };

    this.getMultipleChoiceInlineDataTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_multiple_choice_inline_data.html' + v();
    };

    this.getQuestionActionsTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_question_actions.html' + v();
    };

    this.getChooseCorrectAnswerTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_choose_correct_answer.html' + v();
    };

    this.getChooseCorrectAnswerDataTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_choose_correct_answer_data.html' + v();
    };

    this.getFillInBlanksTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_fill_in_blanks.html' + v();
    };

    this.getFillInBlanksDataTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_fill_in_blanks_data.html' + v();
    };

    this.getModalFooterActionsTemplate = function() {
        return ConstantValues.TEMPLATES_CREATE_DIR + '_modal_footer_actions.html' + v();
    };
})
;