// let io = require('../streams');
// let Advisory = require('../../../database/seeds/advisory');

// const filterAdvisoryKeys = ({
//     gate_ip, gate_levels, updated
// }) => ({
//     gate_ip, gate_levels, updated
// });

// const changeStreamAdvisory = Advisory.watch({fullDocument: 'updateLookup'});

// changeStreamAdvisory.on('change', (change) => {
//     io.emit('advisory', filterAdvisoryKeys(change.fullDocument));
// }); 