const month_array: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const day_array: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const getDayText = (date: Date | string): string => {

    let parsed_date: Date

    if (typeof date === "string")
        parsed_date = new Date(Date.parse(date))
    else
        parsed_date = date

    const today: Date = new Date();

    if (parsed_date.getFullYear() === today.getFullYear()
        && parsed_date.getMonth() === today.getMonth()
        && parsed_date.getDate() === today.getDate()
    ) {
        return 'Today'
    } else if (parsed_date.getFullYear() === today.getFullYear()
        && parsed_date.getMonth() === today.getMonth()
        && parsed_date.getDate() - today.getDate() === 1
    ) {
        return 'Tomorrow'
    } else if (parsed_date.getFullYear() === today.getFullYear()
        && parsed_date.getMonth() === today.getMonth()
        && parsed_date.getDate() - today.getDate() === -1
    ) {
        return 'Yesterday'
    } else {
        return `${day_array[parsed_date.getDay()]}, ${parsed_date.getDate()} ${month_array[parsed_date.getMonth()]}`
    }
}