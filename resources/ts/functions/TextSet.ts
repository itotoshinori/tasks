export const toShortText = (text: string, textLong: number): string => {
    if (text.length > textLong) {
        return text.substring(0, textLong) + "..";
    } else {
        return text
    }
}




