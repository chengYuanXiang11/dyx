

// 定时任务格式化
export function getCrontabData(val) {
	if (!val || Object.keys(val).length === 0) return "";
	const week = {
		1: "一",
		2: "二",
		3: "三",
		4: "四",
		5: "五",
		6: "六",
		7: "日"
	};
	let res = "";
	if (val.month_of_year !== "*") {
		res = `${val.month_of_year} 月 ${val.day_of_month} 日 ${val.hour}点${val.minute}分`;
	} else if (val.day_of_month !== "*") {
		res = `每月 ${val.day_of_month} 日 ${val.hour}点${val.minute}分`;
	} else if (val.day_of_week !== "*") {
		res = `每周周${week[val.day_of_week] || val.day_of_week} ${val.hour}点${val.minute}分 `;
	} else if (val.hour !== "*") {
		res = `每天 ${val.hour}点${val.minute}分`;
	} else if (val.minute !== "*") {
		res = `每分钟 ${val.minute}秒`;
	} else {
		res = `${val.month_of_year} 月 ${val.day_of_month} 日 ${val.hour}点${val.minute}分`;
	}
	return res.replace(/\*/g, "00");
}

// 时间间隔格式化
export function getIntervalData(val) {
	if (!val || Object.keys(val).length === 0) return "";
	const lists = {
		days: "天",
		hours: "小时",
		seconds: "秒",
		minutes: "分钟"
	};
	return `每${val.every !== 1 ? val.every : ""}${lists[val.period]}`;
}


export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null;
	}
	const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
	let date;
	if (typeof time === "object") {
		date = time;
	} else {
		if ((typeof time === "string") && (/^[0-9]+$/.test(time))) {
			time = parseInt(time);
		} else if (typeof time === "string") {
			time = time.replace(new RegExp(/-/gm), "/");
		}
		if ((typeof time === "number") && (time.toString().length === 10)) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	};
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === "a") {
			return ["日", "一", "二", "三", "四", "五", "六"][value];
		}
		if (result.length > 0 && value < 10) {
			value = "0" + value;
		}
		return value || 0;
	});
	return time_str;
}
/**
 * 表格时间格式化
 */
 export function formatDate(cellValue) {
	if (cellValue == null || cellValue == "") return "";
	var date = new Date(cellValue);
	var year = date.getFullYear();
	var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
	if (("" + time).length === 10) {
		time = parseInt(time) * 1000;
	} else {
		time = +time;
	}
	const d = new Date(time);
	const now = Date.now();

	const diff = (now - d) / 1000;

	if (diff < 30) {
		return "刚刚";
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + "分钟前";
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + "小时前";
	} else if (diff < 3600 * 24 * 2) {
		return "1天前";
	}
	if (option) {
		return parseTime(time, option);
	} else {
		return (
			d.getMonth() +
			1 +
			"月" +
			d.getDate() +
			"日" +
			d.getHours() +
			"时" +
			d.getMinutes() +
			"分"
		);
	}
}