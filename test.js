const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

console.log(dayjs().utc().toDate())