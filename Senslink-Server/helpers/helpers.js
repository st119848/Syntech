let moment = require('moment-timezone');

module.exports = {
    handle: (promise) => {
        return promise.then(res => [null, res]).catch(err => [err, null]);
    },
    
    asyncForEach: async (array, callback) => {
        for (let index = 0, len = array.length; index < len; index++) {
            await callback(array[index], index, array);
        }
    },

    getCurrentTime: () => {
        return moment().tz("Asia/Bangkok").format("HH:mm:ss");
    },

    getCurrentDateTime:() => {
        return moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    },

    formatTimestamp: (timestamp) => {
        let date = timestamp.split('T')[0]
        let [yy, mm, dd] = date.split('-');
        date = `${dd}-${mm}-${yy}`

        let time = moment(timestamp.split('T')[1].split('+')[0].split('.')[0], 'HH:mm:ss').add(7, 'hours').format('HH:mm:ss')
        return `${date} ${time}`;
    },

    extractModbusBuffer: (buffer) => {
        const surged = buffer.pop();

        buffer = buffer
            .filter((_, index) => index % 2 === 0)
            .splice(0, 16);

        const mode = buffer.pop();

        const levels = buffer.splice(0, 5);
        const sensors = buffer.splice(0, 5);
        const overloads = buffer.splice(0, 5);

        return [levels, sensors, overloads, mode, surged];
    },

    parsedResults: (results, validKeys) => {
        let parsedResultsKeys = [];
        let i = 0; const len = results.length;
        for (; i < len; i++) {
            parsedResultsKeys.push(validKeys(results[i]));
        };
    
        return parsedResultsKeys;
    },

    minuteDiff: (startTime, endTime, diff = 5) => {
        let [, mm, ] = moment
          .utc(moment(startTime, "HH:mm:ss").diff(moment(endTime, "HH:mm:ss")))
          .format("HH:mm:ss")
          .split(':');
      
        // console.log(mm + ' > ' + diff)
      
        return Boolean(Number(mm) >= diff);
    }
};