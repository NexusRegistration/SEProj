const hasNull = (obj) => {
    for (let key in obj) {
      if (obj[key] === null) {
        return true;
      }
    }
    return false;
}

module.exports = { hasNull }