 function applyFilters(config, from, to, amount) {
    let toSave = true;
    Object.keys(config).forEach(key => {
        if (!FILTERS[key](config[key], from, to, Number.parseFloat(amount).toFixed(20))) {
            toSave = false;
        }
    })
    return toSave;
}

const FILTERS = {
    amountBigger: function(value, from, to, amount) {
        let valueToCompare = Number.parseFloat(value).toFixed(20);
        if (valueToCompare >= amount) {
            return false;
        }
        return true;
    }
}

module.exports = {
    applyFilters
}