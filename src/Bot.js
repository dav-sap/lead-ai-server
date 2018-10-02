const consultants = require('./../db/consultants.js');
const users = require('./../db/users.js');

const INPUT = "input";
const NAME = "name";
const AGE = "age";
const PHONE = "phone";
const OPTIONS = "options";
const RADIO_OPTIONS = "radio_options";
const COMPLETED = "completed";
const MULTIPLE_OPTIONS = "multiple_options";
const NEXT_QUESTION = "next_question";
let name = "";
let budget = false;
let consultant = null;

// function fetchConsultant(userId) {
// 	consultants.find({}, (err, consultants) => {
// 		return consultants
// 	}).then(consultants => {
// 		let chosenConsultant = consultants[Math.floor(Math.random() * consultants.length)];
// 		consultant = chosenConsultant;
// 		return users.findOneAndUpdate({_id: userId}, {$set: {'referenced': chosenConsultant}}, {new: true});
// 	}).then(user => {
// 		if (!user) {
// 			console.error("No user found for ", userId);
// 			return null;
// 		} else {
// 			console.log("Added consultant to user");
// 			return user;
// 		}
// 	}).catch(err => {
// 		console.error(err.toString());
// 	})
// }
let isBudget = {
	get question() {
		let start = "נעים מאוד"
		let newName = " " + name.split(" ")[0];
		const is_budget = "החלטת כבר על תקציב לרכב החדש?";
		return {text: start + newName + ".\n" + is_budget, key: 1}
	},
	answer: {
		type: OPTIONS,
		options: [{value: "עוד לא", key:3}, {value: "כן", key: 2}],
		dir: "rtl",
	},
}
let hello_get_name = {
	question: {text: "יאללה התחלנו 💪", key: 0},
	answer: {
		type: INPUT,
		inputName: NAME,
		placeholder: "שם מלא |",
		inputType: "text",
		dir: "rtl",
		key: 1,
	},
		// {
		// 	type: INPUT,
		// 	inputName: AGE,
		// 	placeholder: "גיל |",
		// 	inputType: "text",
		// 	dir: "ltr",
		// 	key: 2,
		// }
};

let get_budget = {
	question: {text: "קול. כמה מתכננים להשקיע?", key: 2},
	answer: {
		type: RADIO_OPTIONS,
		options: ["60-80 אלף", "80-100 אלף", "100-150 אלף", "150 אלף או יותר"],
		key: 4
	},
}

let kindOfCar = {
	get question() {
		return  {text: !budget ? "אין לחץ.. נוכל לתכנן את התקציב ביחד.\n על איזה סוג רכב חשבת?" :  "אחלה. איזה סוג רכב חשבת לקנות?", key: 3}
	},
	answer: {
		type: RADIO_OPTIONS,
		options: ["קטן", "משפחתי", "פנאי", "מסחרי"],
		key: 6
	},
}


let numOfPeople = {
	question: {text: "כמה נפשות אתם?", key: 4},
	answer: {
		type: RADIO_OPTIONS,
		options: ["3-4", "1-2", "6 או יותר", "5"],
		key: 7
	},
}

let importantInCar = {
	question: {text: "מה הכי חשוב לך ברכב? (אפשר לסמן יותר מתשובה אחת)", key: 5},
	answer: {
		type: MULTIPLE_OPTIONS,
		options: ["בטיחות", "אמינות", "אבזור", "ביצועים"],
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
	question: { text: ['שומר נתונים...', 'סורק מאגר רכבים..', 'מחפש יועץ זמין..', 'מצאתי לך יועץ!'], key: 6},
	answer: {
		type: NEXT_QUESTION,
		key: 11,
	}
}

let get_cell_num_input = {

	get question() {
		if (consultant) {
			return {text: consultant.name + " מוכן ליצור איתך קשר בווטסאפ", key: 7}
		} else {
			console.error("No Consultant. Should not happen");
			return {text: "כל היועצים שלנו תפוסים כרגע. נציג ייצור איתך קשר ברגע שיתפנה ", key:7 }
		}
	},
	get consultantImg() {
		return consultant.imgPath ? consultant.imgPath : "";
	},
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
		const today = new Date();
		const hour = today.getHours();
		let text = "רשמתי ועדכנתי את " + consultant.name + " בפרטים שלך.";
		text += "\n";
		if (hour >= 22 || hour < 5) {
			text += "הוא בטח חולם כרגע על רכבים, אז נדבר מחר בבוקר 😀"
		} else if (hour >= 5 && hour < 8) {
			text += "סחטיין על השעה המוקדמת בבוקר 😀 נדבר בקרוב!"
		} else if (hour >= 8 && hour < 18) {
			text += "נהיה בקשר בקרוב!"
		} else if (hour >= 18 && hour < 22) {
			text += "ניצור קשר בקרוב, ערב טוב!"
		}
		return {text: text, key: 8}
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
	// 5: numOfPeople,
	6: importantInCar,
	// 7: importantInCar,
	8: perform_analysis,
	11: get_cell_num_input,
	12: end,
}

const getNextStage = (question, answer, userId, consultantRef) => {
	if (consultantRef) {
		consultant = consultantRef;
	}
	if (answer.key === 1) {
		name = answer.value
	} else if (answer.key === 2) {
		budget = true;
	} else if (answer.key === 3) {
		budget = false;
	}

	return answerToStage[answer.key];

}
export {
	hello_get_name, getNextStage
}