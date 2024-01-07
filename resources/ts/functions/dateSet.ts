import React from 'react';
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
        return date.toISOString().split('T')[0].slice(5, 10);
    }
    return '';
};

export const dateDigi = (num: number): string => {
    let result: string = ""
    num < 10 ? result = "0" + String(num) : result = String(num)
    return result;
};


