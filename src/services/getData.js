const getData = (def = false) => {
    let data = require('../data.json')
    const defaultData = data
    let localData = JSON.parse(localStorage.getItem('data'))
    return (localData && !def) ? localData : defaultData
}

export default getData