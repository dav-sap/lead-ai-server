const consultants = require('./../db/consultants.js');
const users = require('./../db/users.js');

const INPUT = "input";
const NAME = "name";
const PHONE = "phone";
const OPTIONS = "options";
const RADIO_OPTIONS = "radio_options";
const COMPLETED = "completed";
const MULTIPLE_OPTIONS = "multiple_options";
const NEXT_QUESTION = "next_question";
let name = "";
let budget = false;
let consultant = null;

function fetchConsultant(userId) {
	consultants.find({}, (err, consultants) => {
		return consultants
	}).then(consultants => {
		let chosenConsultant = consultants[Math.floor(Math.random() * consultants.length)];
		consultant = chosenConsultant;
		return users.findOneAndUpdate({_id: userId}, {$set: {'referenced': chosenConsultant}}, {new: true});
	}).then(user => {
		if (!user) {
			console.error("No user found for ", userId);
		} else {
			console.log("Added consultant to user");
		}
	}).catch(err => {
		console.error(err.toString());
	})
}
let isBudget = {
	get question() {
		let start = "נעים מאוד"
		let newName = " " + name.split(" ")[0];
		const is_budget = "החלטת כבר על תקציב לרכב החדש?";
		return start + newName + ".\n" + is_budget
	},
	answer: {
		type: OPTIONS,
		options: [{value: "עוד לא", key:3}, {value: "כן", key: 2}],
		dir: "rtl",
	},
}
let hello_get_name = {
	question: "יאללה התחלנו 💪",
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
		type: MULTIPLE_OPTIONS,
		options: ["100-120 אלף", "60-100 אלף", "150 אלף או יותר",  "120-150 אלף"],
		key: 4
	},
}

let kindOfCar = {
	get question() {
		return  !budget ? "אין לחץ.. נוכל לתכנן את התקציב ביחד. על איזה סוג רכב חשבת?" :  "אחלה. איזה סוג רכב חשבת לקנות?";
	},
	answer: {
		type: OPTIONS,
		options: [{value: "פרטי", key:5}, {value: "משפחתי", key: 6}],
	},
}


let numOfPeople = {
	question: "כמה נפשות אתם?",
	answer: {
		type: MULTIPLE_OPTIONS,
		options: ["5", "3-4", "7 או יותר", "6"],
		key: 7
	},
}

let importantInCar = {
	question: "מה הכי חשוב לך ברכב? (אפשר לסמן יותר מתשובה אחת)",
	answer: {
		type: MULTIPLE_OPTIONS,
		options: ["בטיחות", "אמינות", "מחיר", "ביצועים"],
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

let perform_analysis = {
	question: ['שומר נתונים...', 'סורק מאגר רכבים..', 'מחפש יועץ רכב פנוי..', '🍓🍓🍓 בינגו!'],
	answer: {
		type: NEXT_QUESTION,
		key: 11,
	}
}

let get_cell_num_input = {

	get question() {
		if (consultant) {
			return consultant.name + " היועץ שלך מוכן ליצור איתך קשר בווטסאפ"
		} else {
			console.error("No Consultant. Should not happen");
			return "כל היועצים שלנו תפוסים כרגע. נציג ייצור איתך קשר ברגע שיתפנה "
		}
	},
	get consultantImg() {return consultant.imgPath},
	answer: {
		type: INPUT,
		placeholder: "השאר מספר טלפון",
		dir: "ltr",
		inputType: "tel",
		key: 12,
		inputName: PHONE,
	},
}

let end = {
	get question() {
		return consultant.name + " ייצור איתך קשר בדקות הקרובות.";
	},
	completed: true,
	answer: {
		type: COMPLETED,
	}
};

const answerToStage = {
	// 1: perform_analysis,
	1: isBudget,
	2: get_budget,
	// 2: perform_analysis,
	3: kindOfCar,
	4: kindOfCar,
	5: importantInCar,
	6: numOfPeople,
	7: importantInCar,
	8: perform_analysis,
	11: get_cell_num_input,
	12: end,
}

const setConsultant = (consultantGiven) => {
	consultant = consultantGiven;
}
const getNextStage = (question, answer, userId) => {

	if (answer.key === 1) {
		name = answer.value
	} else if (answer.key === 2) {
		budget = true;
	} else if (answer.key === 3) {
		budget = false;
	}else if (answer.key === 8) {
		fetchConsultant(userId);
	}

	return answerToStage[answer.key];
}
export {
	hello_get_name, getNextStage, setConsultant
}