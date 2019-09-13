// let io = require('../streams');
// let GatesUpdate = require('../../../database/seeds/gate-update');

// const filterGatesUpdateKeys = ({
//     user_id, username, station, gate, oldVal, newVal, updated
// }) => ({
//     user_id, username, station, gate, oldVal, newVal, updated
// });

// const changeStreamGatesUpdate = GatesUpdate.watch({fullDocument: 'updateLookup'});

// changeStreamGatesUpdate.on('change', async (change) => {
//     io.emit('gates_update', filterGatesUpdateKeys(change.fullDocument))
// }); 