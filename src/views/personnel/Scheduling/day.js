import moment from "moment";
const WORK_START_TIME = 8;
const WORK_END_TIME = 18;
const BREAK_TIME = 2;
const BREAK_START = 12;
const BREAK_END = 14;
const WORK_TIME = 8;
/**
 *
 * @param {*Number} num
 * @returns 分离出来的整数和小数
 */
const separation = (num) => {
    let intNum = 0,
        floatNum = 0.0;
    floatNum = num % 1;
    intNum = num - floatNum;
    return { intNum, floatNum };
};
//规范hour:minutes的值
const standardTime = (hour, min) => {
    let shour = hour,
        smin = min;
    //规范开始工作时间和结束工作时间
    smin = shour < WORK_START_TIME || shour > WORK_END_TIME ? 0 : smin;
    shour =
        shour < WORK_START_TIME
            ? WORK_START_TIME
            : shour > WORK_END_TIME
            ? WORK_END_TIME
            : shour;
    //当时间在午休时间内的情况
    smin = shour >= BREAK_START && shour < BREAK_END ? 0 : smin;
    shour = shour >= BREAK_START && shour <= BREAK_END ? BREAK_END : shour;
    return { shour, smin };
};
//按小时请假，确保sTime和eTime在同一天,且当天不是节假日
const leaveByhours = (sTime, eTime) => {
    let hours = 0,
        result = null;
    let shour = sTime.getHours(),
        smin = sTime.getMinutes();
    let ehour = eTime.getHours(),
        emin = eTime.getMinutes();
    let stTime = standardTime(shour, smin);
    let etTime = standardTime(ehour, emin);
    console.log(stTime.shour, etTime.shour);
    console.log(stTime.smin, etTime.smin);
    result =
        new Date(
            eTime.getFullYear(),
            eTime.getMonth(),
            eTime.getDate(),
            etTime.shour,
            etTime.smin
        ) -
        new Date(
            sTime.getFullYear(),
            sTime.getMonth(),
            sTime.getDate(),
            stTime.shour,
            stTime.smin
        );
    hours = moment.duration(result).asHours();
    //是否包含午休
    hours -=
        stTime.shour <= BREAK_START && etTime.shour >= BREAK_END
            ? BREAK_TIME
            : 0;
    let { intNum, floatNum } = separation(hours);
    hours = intNum + (floatNum > 0.5 ? 1 : floatNum === 0 ? 0 : 0.5);
    return hours;
};

const leaveBydays = (sTime, eTime, complement = 0) => {
    let sday = sTime.getDate();
    let result = eTime - sTime;
    let days = moment.duration(result).asDays() + complement;
    let { intNum, floatNum } = separation(days);
    let weekdays = 0;
    for (let i = 0; i < Math.round(days); i++) {
        let nowDay = new Date(new Date(sTime).setDate(sday + i));
        if (checkDay(nowDay)) {
            weekdays++;
        }
    }
    days = intNum + (floatNum > 0.5 ? 1 : floatNum === 0 ? 0 : 0.5);
    days -= weekdays;
    return days;
};
//判断日期是否处于周六、周日（节假日后续完善）
const checkDay = (time) => {
    let flag = false;
    let day = time.getDay();
    flag = day === 0 || day === 6 ? true : false;
    return flag;
};
/**
 *
 * @param {*Date} sTime
 * @param {*Date} eTime
 * @returns Number:请假时长:小时
 */
const calcHour = (sTime, eTime) => {
    let hours = 0,
        sday = sTime.getDate(),
        eday = eTime.getDate();

    if (sday === eday) {
        //1.同一天请假
        hours = checkDay(sTime) ? 0 : leaveByhours(sTime, eTime);
    } else {
        /*2.不同天请假:
      结果为end1-start1+day*8(去除节假日)+end2-start2。
      end1为与sday同一天的下午18:00,start2为与end2同一天的上午9:00
      day开始时间为start1+1天的0：00，结束时间为end2的0：00。防止第一天和最后一天的请假时长被重复计算
    */
        let e1 = new Date(new Date(sTime).setHours(WORK_END_TIME + 1)); //设置超过范围的数，触发初始化
        let s2 = new Date(new Date(eTime).setHours(WORK_START_TIME - 1));
        let ds = new Date(
                sTime.getFullYear(),
                sTime.getMonth(),
                sTime.getDate() + 1,
                0,
                0
            ),
            de = new Date(
                eTime.getFullYear(),
                eTime.getMonth(),
                eTime.getDate(),
                0,
                0
            );
        let d = leaveBydays(ds, de);
        let r1 = checkDay(sTime) ? 0 : leaveByhours(sTime, e1);
        let r2 = checkDay(s2) ? 0 : leaveByhours(s2, eTime);
        console.log("r1:", r1, "d:", d, "r2:", r2);
        hours = r1 + d * WORK_TIME + r2;
    }
    return hours < 0 ? 0 : hours;
};
/**
 *
 * @param {*开始时间} sTime
 * @param {*结束时间} eTime
 * @returns 请假时长:天
 */
const calcDay = (sTime, eTime) => {
    let days = leaveBydays(sTime, eTime, 1);
    console.log(days)
    return days;
};
export { calcHour, calcDay };
