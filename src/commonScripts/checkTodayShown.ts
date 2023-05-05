export const isTodayTasksShown = (): boolean => {

    const shown_date = localStorage.getItem('TodayTaskLastShown')
    const today: Date = new Date()

    if (shown_date !== null) {
        const parsed_date: Date = new Date(Date.parse(JSON.parse(shown_date)))

        return parsed_date.getFullYear() === today.getFullYear()
            && parsed_date.getMonth() === today.getMonth()
            && parsed_date.getDate() === today.getDate();

    } else {
        return false
    }
}