angular.module("TestCommon", [])
.service('Provider', function() {
	function getTotalQuestionByDefault(activity) {
		var total = 0;

		for (var i = 0; i < activity.questions.length; i++) {
			var q = activity.questions[i];
			if (!q.isDivider) {
				total++;
			}
		}

		return total;
	};

	function indexOfQuestionByDefault(question, activity) {
		var index = activity.questions.indexOf(question);
		var divider = 0;

		for (var i = 0; i < activity.questions.length; i++) {
			var q = activity.questions[i];

			if (q.isDivider) {
				divider++;
			}

			if (q === question) {
				break;
			}
		}

		return index - divider;
	}

	function getTotalQuestionByBox(activity) {
		var total = 0;
		for (var i = 0; i < activity.questions.length; i++) {
			box = activity.questions[i];
			if (!box.isDivider) {
				total += box.list.length;
			}
		}
		return total;
	}

	function indexOfQuestionByBox(question, activity) {
		var index = 0;

		for (var i = 0; i < activity.questions.length; i++){
			box = activity.questions[i];

			if (!box.isDivider) {
				for (var j = 0; j < box.list.length; j++) {
					if (box.list[j] === question) {
						return index;
					} else {
						index++;
					}
				}
			}
		}
		return index;
	}

	this.provideOrderer = function(activity) {
		switch (activity.name) {
			case 'Fill In Blanks':
			
			case 'Choose Correct Answer':
				activity.getTotalQuestions = function() {
					return getTotalQuestionByBox(activity)
				};

				activity.indexOfQuestion = function(question) {
					return indexOfQuestionByBox(question, this);
				};
				break;

			default:
				activity.getTotalQuestions = function() {
					return getTotalQuestionByDefault(activity)
				};

				activity.indexOfQuestion = function(question) {
					return indexOfQuestionByDefault(question, this);
				};
				break;
		}
	};
})
.service('OrderCalculator', function(Provider) {
	this.computeOrder = function(question, activity, activities) {
		var order = 1;
		
        for (var i = 0; i < activities.length; i++) {
            var act = activities[i];

            if (act === activity) {
            	return order += activity.indexOfQuestion(question);
            } else {
            	order += act.getTotalQuestions();
            }
        }

        return order;
	};

	this.translateABCD = function(index) {
        switch (index) {
            case 0:
                return 'A';

            case 1:
                return 'B';

            case 2:
                return 'C';

            case 3:
                return 'D';

            case 4:
                return 'E';

            case 5:
                return 'F';

            default:
                return 'unknown';
        }
    };	
})
;