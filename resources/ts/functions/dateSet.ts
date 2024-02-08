export const getWeek = (timestamp: Date | null): string | null => {
    let dayOfWeekStr: string | null
    if (timestamp) {
        let date: Date = new Date(timestamp);
        let dayOfWeek: number = date.getDay(); // 曜日(数値)
        let dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"][
            dayOfWeek
        ]; // 曜日(日本語表記)
        return dayOfWeekStr;
    } else {
        return null
    }
}

export const formatDate = (date: Date) => {
    date = new Date(date);
    return date ? date.toISOString().split('T')[0] : '';
};

export const shortDate = (date: Date | null) => {
    if (date) {
        date = new Date(date);
        return date.toISOString().split('T')[0].slice(2, 10).replace('-', '/').replace('-', '/');
    }
    return '';
};

export const dateDigi = (num: number): string => {
    let result: string = ""
    num < 10 ? result = "0" + String(num) : result = String(num)
    return result;
};

export const getToday = (): string => {
    // 今日の日付を取得できるnew Dateを格納
    const today: Date = new Date();
    const year: string = String(today.getFullYear());
    const month: string = dateDigi(today.getMonth() + 1);
    const date: string = dateDigi(today.getDate());
    return year + "-" + month + "-" + date
};

export const compareToday = (date: Date): boolean => {
    const thisDate = Number(String(date).replace("-", "").replace("-", ""))
    const today = Number(getToday().replace("-", "").replace("-", ""))
    if (thisDate > today) {
        return true
    } else {
        return false
    }
}

export const getLastYear = (): string => {
    const today: string = getToday();
    const year: string = today.slice(0, 4)
    const lastYear: string = String(Number(year) - 1)
    return today.replace(year, lastYear)
}

export const getNextYear = (): string => {
    const today: string = getToday();
    const year: string = today.slice(0, 4)
    const nextYear: string = String(Number(year) + 1)
    return today.replace(year, nextYear)
}

export const getYearDate = (getDate: Date): string => {
    // 今日の日付を取得できるnew Dateを格納
    const setDay: Date = new Date(getDate);
    const year: string = String(setDay.getFullYear());
    const month: string = dateDigi(setDay.getMonth() + 1);
    const date: string = dateDigi(setDay.getDate());
    return year + month + date
}


