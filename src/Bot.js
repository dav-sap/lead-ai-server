
const INPUT = "input";
const NAME = "name";
const OPTIONS = "options";
const RADIO_OPTIONS = "radio_options";

function getHelloString() {
	let today = new Date().getHours();
	let start = "";
	if (today >= 5 && today < 12) {
		start = "בוקר טוב!"
	} else if (today >= 12 && today < 18) {
		start = "צהריים טובים!"
	} else if (today >= 18 && today < 22) {
		start = "ערב טוב!"
	} else if (today >= 22 || today < 5) {
		start = "לילה טוב!"
	}
	let end = " איך קוראים לך?";
	return start + end;
}
let isBudget = {
	name: "",
	getName: true,
	get question() {
		let start = "נעים מאוד"
		let name = " " + this.name.split(" ")[0] + " ";
		const is_budget = "האם יש תקציב?";
		return start + name + " 🚐./n" + is_budget
	},
	answer: {
		type: OPTIONS,
		options: [{value: "לא", key:1}, {value: "כן", key: 2}],
		dir: "rtl",
	},
}
let hello_get_name = {
	question: getHelloString(),
	answer: {
		type: INPUT,
		inputName: NAME,
		placeholder: "שם מלא |",
		inputType: "text",
		dir: "rtl",
	},
};

let get_budget = {
	question: "קול. כמה מתכננים להשקיע?",
	answer: {
		type: RADIO_OPTIONS,
		options: ["60k-100k", "100k-120k", "120k-150k", "150k או יותר"],
	},
}

const answerToQuestion = {
	2: get_budget,
}

const getNextStage = (question, answer) => {
	return answerToQuestion[answer.key];
}
export {
	hello_get_name, isBudget, getNextStage
}