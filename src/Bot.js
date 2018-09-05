const INPUT = "input";
const NAME = "name";
const PHONE = "phone";
const OPTIONS = "options";
const RADIO_OPTIONS = "radio_options";
const COMPLETED = "completed";
const MULTIPLE_OPTIONS = "multiple_options";
let name = ""

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
	get question() {
		let start = "נעים מאוד"
		let newName = " " + name.split(" ")[0] + " ";
		const is_budget = "האם יש תקציב?";
		return start + newName + " 🚐./n" + is_budget
	},
	answer: {
		type: OPTIONS,
		options: [{value: "לא", key:3}, {value: "כן", key: 2}],
		dir: "rtl",
	},
}
let hello_get_name = {
	question: "",
	answer: {
		type: INPUT,
		inputName: NAME,
		placeholder: "שם מלא |",
		inputType: "text",
		dir: "rtl",
		key: 1,
	},
};

let get_budget = {
	question: "קול. כמה מתכננים להשקיע?",
	answer: {
		type: RADIO_OPTIONS,
		options: ["60k-100k", "100k-120k", "120k-150k", "150k או יותר"],
		key: 4
	},
}

let kindOfCar = {
	question: "רכב משפחתי או פרטי?",
	answer: {
		type: OPTIONS,
		options: [{value: "פרטי", key:5}, {value: "משפחתי", key: 6}],
	},
}


let numOfPeople = {
	question: "כמה נפשות?",
	answer: {
		type: RADIO_OPTIONS,
		options: ["3-4", "5", "6", "7+"],
		key: 7
	},
}

let importantInCar = {
	question: "מה הכי חשוב לך ברכב?",
	answer: {
		type: MULTIPLE_OPTIONS,
		options: ["בטיחות", "צדיקות", "נוחות", "עוצמה"],
		key: 8
	},
}

let firstCar = {
	question: "האם זה הרכב הראשון שאתה קונה?",
	answer: {
		type: OPTIONS,
		options: [{value: "כן", key:10}, {value: "לא", key: 9}],
	},
}

let get_cell_num_input = {
	question: "מה מספר הטלפון שלך?",
	answer: {
		type: INPUT,
		placeholder: "הכנס מספר נייד",
		dir: "ltr",
		inputType: "tel",
		key: 11,
		inputName: PHONE,
	},
	lastQuestion: true,

}

let end = {
	question: " עומר ייצור איתך קשר בדקות הקרובות.",
	completed: true,
	answer: {
		type: COMPLETED,
	}
};

const answerToStage = {
	1: isBudget,
	2: get_budget,
	3: kindOfCar,
	4: kindOfCar,
	5: importantInCar,
	6: numOfPeople,
	7: importantInCar,
	8: firstCar,
	9: get_cell_num_input,
	10: get_cell_num_input,
	11: end,

}

const getNextStage = (question, answer) => {
	if (answer.key === 1) {
		name = answer.value
	}
	return answerToStage[answer.key];
}
export {
	hello_get_name, getNextStage, getHelloString
}