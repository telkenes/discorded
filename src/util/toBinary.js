module.exports = (num) => {
    let bin = '';
    let high = parseInt(num.slice(0, -10)) || 0;
    let low = parseInt(num.slice(-10));
    while (low > 0 || high > 0) {
        bin = String(low & 1) + bin;
        low = Math.floor(low / 2);
        if (high > 0) {
        low += 5000000000 * (high % 2);
        high = Math.floor(high / 2);
        }
    }
    return bin;
}