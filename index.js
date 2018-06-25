"use strict";

//jQuery UI Pointers
const $landingScreenView = $("#view-landing-screen");
const $beginButton = $("#js-begin-button");

const $promptView = $("#view-prompt");
const $promptHeaderText = $("#js-prompt-header-text");
const $prompt = $("#js-prompt");
const $responseListWrapper = $("#js-response-list-wrapper");
const $submitResponseButton = $("#js-submit-response-button");

const $responseFeedbackView = $("#view-response-feedback");
const $responseFeedbackHeaderText = $("#js-response-feedback-header-text");
const $responseFeedbackPrompt = $("#js-response-feedback-prompt");
const $correctResponseHeading = $("#js-response-feedback-correct-response-heading");
const $correctResponse = $("#js-response-feedback-correct-response");
const $responseFeedbackCurrentScore = $("#js-response-feedback-score");
const $nextPromptButton = $("#js-next-prompt-button");

const $finalResultsView = $("#view-final-results");
const $finalResultsFinalScore = $("#js-final-results-score");
const $startOverButton = $("#js-start-over-button");


//Global Data
const RESOURCES = [{
		prompt: "What name is given to the study of volcano function?",
		responses: ["Pyromancy",
			"Volcanology",
			"Geomorphism",
			"Jouleology"
		],
		acceptedResponseIndex: 1
	},
	{
		prompt: "What layer of the Earth's atmosphere sits between the Troposphere and Mesosphere?",
		responses: ["The Thermosphere",
			"The Bathysphere",
			"The Stratosphere",
			"The Rhizosphere"
		],
		acceptedResponseIndex: 2
	},
	{
		prompt: "Calypso, Cattleya, and Laelia are types of which flowering plant?",
		responses: ["Orchid",
			"Succulent",
			"Citrus Tree",
			"Ivy"
		],
		acceptedResponseIndex: 0
	},
	{
		prompt: "Which of the following natural phenomena can be measured on the Mercalli scale?",
		responses: ["Thunderstorms",
			"Tornados",
			"Tsunamis",
			"Earthquakes"
		],
		acceptedResponseIndex: 3
	},
	{
		prompt: "Which single fruit out of the following is a berry?",
		responses: ["Strawberry",
			"Blueberry",
			"Raspberry",
			"Blackberry"
		],
		acceptedResponseIndex: 1
	},
	{
		prompt: "Which planet in the Solar System is known as the Earth's twin?",
		responses: ["Mercury",
			"Venus",
			"Mars",
			"Uranus"
		],
		acceptedResponseIndex: 1
	},
	{
		prompt: "How many feet do snails have?",
		responses: ["None",
			"One",
			"Two",
			"Undiscovered"
		],
		acceptedResponseIndex: 1
	},
	{
		prompt: "Alfred Nobel is credited with the invention of what?",
		responses: ["World Peace",
			"Fiberglass Insulation",
			"Antibacterial Hand Soap",
			"Dynamite"
		],
		acceptedResponseIndex: 3
	},
	{
		prompt: "Which ailment is also known as Hansen's disease?",
		responses: ["Measels",
			"Malaria",
			"Leprosy",
			"Gout"
		],
		acceptedResponseIndex: 2
	},
	{
		prompt: "The Egyptian plover is a bird best known for its symbiotic relationship with what host animal?",
		responses: ["The Blue Wildebeest",
			"The Lynx",
			"The African Sacred Ibis",
			"The Crocodile"
		],
		acceptedResponseIndex: 3
	}
];
const userSession = {
	//Session Variables
	currentPromptIndex: 0,
	acceptedUserResponses: 0,
	selectedRadioButtonValue: 0,
	//Session Functions
	currentScore: function () {
		return (this.acceptedUserResponses + " / " + (this.currentPromptIndex + 1));
	},
	reset: function () {
		this.currentPromptIndex = 0;
		this.acceptedUserResponses = 0;
	}
};


//Core Functions
$(function entryPoint() {
	initializeEventListeners();
	initializeQuiz();
});

function initializeEventListeners() {
	$responseListWrapper.on("change", "[type='radio']", radioButtonWasSelected);
	$responseListWrapper.on("click", ".response-wrapper", responseWrapperWasClicked);
	$beginButton.on("click", function (event) {
		goToPrompt(0);
	});
	$submitResponseButton.on("click", submitResponseButtonWasClicked);
	$nextPromptButton.on("click", nextPromptButtonWasClicked);
	$startOverButton.on("click", initializeQuiz);
}

function initializeQuiz() {
	userSession.reset();
	//Reset changes made to the $nextPromptButton.text() during the final iteration of goToResponseFeedback()
	$nextPromptButton.text("Next Question →");
	goToLandingScreen();
}


//View State Variables
let $currentView = $landingScreenView;


//View Functions
function goToLandingScreen() {
	hideCurrentView();
	$currentView = $landingScreenView;
	showCurrentView();
}

function goToPrompt(promptIndex) {
	hideCurrentView();

	$currentView = $promptView;
	$promptHeaderText.text(`Test ${promptIndex+1}`);
	$prompt.text(RESOURCES[promptIndex].prompt);
	$responseListWrapper.html(generateResponseListHTMLForPrompt(promptIndex));
	$submitResponseButton.text("Select Response Above ↑");
	disableSubmitResponseButton();

	showCurrentView();
}

function goToResponseFeedback(userWasCorrect) {
	hideCurrentView();

	let currentResource = RESOURCES[userSession.currentPromptIndex];

	$currentView = $responseFeedbackView;
	if (userWasCorrect) {
		$responseFeedbackHeaderText.text("Correct Response Submitted");
	} else {
		$responseFeedbackHeaderText.text("Incorrect Response Submitted");
	}
	$responseFeedbackPrompt.text(currentResource.prompt);
	if (userWasCorrect) {
		$correctResponseHeading.text("Your Response");
	} else {
		$correctResponseHeading.text("Correct Response");
	}
	let acceptedResponseIndex = currentResource.acceptedResponseIndex;
	$correctResponse.text(currentResource.responses[acceptedResponseIndex]);
	$responseFeedbackCurrentScore.text(userSession.currentScore());
	if (userSession.currentPromptIndex + 1 === RESOURCES.length) {
		$nextPromptButton.text("View Examination Results →");
	}

	showCurrentView();
}

function goToFinalResults() {
	hideCurrentView();

	$currentView = $finalResultsView;
	$finalResultsFinalScore.text(userSession.currentScore());

	showCurrentView();
}


//Event Behaviors
function radioButtonWasSelected() {
	//Stores the value of the selected radio button in the userSession object,
	//and styles the current .response-wrapper's based on which radio is currently selected
	userSession.selectedRadioButtonValue = $(this).val();
	$responseListWrapper.children(".response-wrapper").removeClass("selected");
	$(this).closest(".response-wrapper").addClass("selected");
	if ($submitResponseButton.text() === "Select Response Above ↑") {
		$submitResponseButton.text("Submit Selected Response →");
	}
	if ($submitResponseButton.prop("disabled")) {
		enableSubmitResponseButton();
	}
}

function responseWrapperWasClicked() {
	//Triggers the "change" event on its radio button descendant, allowing the user to interact with the .response-wrapper as though it were a button.
	$(this).find("input[type='radio']").prop("checked", "true").trigger("change");
}

function submitResponseButtonWasClicked() {
	if (userSession.selectedRadioButtonValue == RESOURCES[userSession.currentPromptIndex].acceptedResponseIndex) {
		userSession.acceptedUserResponses++;
		goToResponseFeedback(true);
	} else {
		goToResponseFeedback(false);
	}
}

function nextPromptButtonWasClicked() {
	if (userSession.currentPromptIndex + 1 != RESOURCES.length) {
		userSession.currentPromptIndex++;
		goToPrompt(userSession.currentPromptIndex);
	} else {
		goToFinalResults();
	}
}


//Utility Functions
function hideCurrentView() {
	$currentView.addClass("hidden");
}

function showCurrentView() {
	$currentView.removeClass("hidden");
}

function disableSubmitResponseButton() {
	$submitResponseButton.prop("disabled", true);
}

function enableSubmitResponseButton() {
	$submitResponseButton.prop("disabled", false);
}


//HTML Generators
function generateResponseListHTMLForPrompt(promptIndex) {
	let promptResponses = RESOURCES[userSession.currentPromptIndex].responses;
	let responseListHTML = [];

	for (let responseCounter = 0; responseCounter < promptResponses.length; responseCounter++) {
		responseListHTML.push(
			`<div class="response-wrapper">` +
			`<label class="response" for="response${responseCounter}">` +
			`<input type="radio" name="responses" id="response${responseCounter}" value="${responseCounter}" required class="response-radio">` +
			`${promptResponses[responseCounter]}` +
			`</label>` +
			`</div>`
		);
	}

	return responseListHTML.join("");
}