export function formatDate (ms) {
    return dispatch => {
        const theDate = new Date(ms)

        const month = theDate.toLocaleString('en-us', { month: "long" })
        const day = theDate.getDate()
        const year = theDate.getFullYear();

        return {
            full : `${month} ${day}, ${year}`,
            month,
            day,
            year
        }
        
    }
}