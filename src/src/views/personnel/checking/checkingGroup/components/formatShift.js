let formatTime = (start, end) => {
    let sTime = start.split(":").slice(0, 2);
    let eTime = end.split(":").slice(0, 2);
    (sTime = sTime.join(":")), (eTime = eTime.join(":"));
    return `${sTime}~${eTime}`;
}
export default function formatTimeQuantum(row) {
    let str = "";
    switch (row.working_count) {
        case 1:
            str = formatTime(
                row.first_working_time,
                row.first_offduty_time
            );
            break;
        case 2:
            str =
                formatTime(
                    row.first_working_time,
                    row.first_offduty_time
                ) +
                ";" +
                formatTime(
                    row.second_working_time,
                    row.second_offduty_time
                );
            break;
        case 3:
            str =
                formatTime(
                    row.first_working_time,
                    row.first_offduty_time
                ) +
                ";" +
                formatTime(
                    row.second_working_time,
                    row.second_offduty_time
                ) +
                ";" +
                formatTime(
                    row.third_working_time,
                    row.third_offduty_time
                );
            break;
        default:
            break;
    }
    return str;
}