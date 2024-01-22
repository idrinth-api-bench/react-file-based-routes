export default (date: Date) : string=> {
    let data = `${date.getUTCFullYear()}-`;
    if (date.getUTCMonth() < 9) {
        data += '0';
    }
    data += `${date.getUTCMonth() + 1}-`;
    if (date.getUTCDate() < 10) {
        data += '0';
    }
    data += `${date.getUTCDate()}`;
    return data;
}
