MultipleChoice = {};

MultipleChoice.Question = function(content, answers) {

	var DEFAULT_CONTENT = 'Question content...';
	var DEFAULT_ANSWERS = ['Answer A ...', 'Answer B ...', 'Answer C ...', 'Answer D ...'];

	this.content = content ? content : DEFAULT_CONTENT;
	this.answers = answers ? answers : DEFAULT_ANSWERS;
	this.key = 0;

	// Dùng ADT khởi tạo một số params mặc định.
	ADT.DefaultValues.initQuestionParams(this);

	this.reset = function() {
		this.content = DEFAULT_CONTENT;
		this.answers = DEFAULT_ANSWERS;
	};
};