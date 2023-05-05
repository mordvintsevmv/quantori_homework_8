export const isTodayTasksShown = (): boolean => {

    const shown_date = localStorage.getItem('TodayTaskLastShown')

    let date_string: string

    if (shown_date !== null) {
        date_string = JSON.parse(shown_date)
    } else {
        date_string = "Jan 01 1900"
    }

    const today: Date = new Date()
    const parsed_date: Date = new Date(Date.parse(date_string))

    if (shown_date) {
        if (parsed_date.getFullYear() === today.getFullYear()
            && parsed_date.getMonth() === today.getMonth()
            && parsed_date.getDate() === today.getDate()
        ) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}