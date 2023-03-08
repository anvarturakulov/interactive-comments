let isArray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

let isObject = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function getComment(data, key, value) {
  let allPaths = [];

  function findPath(branch, str) {
    Object.keys(branch).forEach(function (key) {
      if (isArray(branch[key]) || isObject(branch[key]))
        findPath(branch[key], str ? str + "." + key : key);
      else
        allPaths.push(str ? str + "." + key : key);
    });
  }

  // берем все возможные пути в объекте
  findPath(data, "");

  // филтруем у кого последний ключ равно в key // для дальнейщего сравнения с value
  let pathsByKey = allPaths.map(item => {
    return item.split('.')
  }).filter(item => {
    return item[item.length - 1] == key
  });

  // находим путь где ключ key с значением value
  // getValue - функция получения значение по пути указанного в path
  const getValue = (obj, path) => path.reduce((acc, c) => acc && acc[c], obj);
  let currentPath = pathsByKey.filter(item => {
    return getValue(data, item) == value;
  })

  // находим родителя для пути где ключ key по значению value - родитель тоже в виде путя  
  let parentCurrentPath = currentPath[0].slice(0, currentPath[0].length - 1)

  // найденный путь переводим в строковую значение
  parentCurrentPath = parentCurrentPath.map(item => {
    if (parseInt(item, 10)) {
      return `[${item}]`
    } else return item
  }).join('.')

  // возвращаем родительского путя и данные объекта по этой родительской пути
  return { paths: parentCurrentPath }
}

export default getComment

