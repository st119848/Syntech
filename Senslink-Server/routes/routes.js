var router = require('./middlewares/routes');

const Authentication = require('./controllers/Authentication');
router.use('/Authentication', Authentication);

const HoldingRegister = require('./controllers/HoldingRegister');
router.use('/HoldingRegister', HoldingRegister);

const Advisory = require('./controllers/Advisory');
router.use('/Advisory', Advisory);

// const GetHistoricalData = require('./controllers/GetHistoricalData');
// router.use('/GetHistoricalData', GetHistoricalData);

const GetSystemSetting = require('./controllers/GetSystemSetting');
router.use('/GetSystemSetting', GetSystemSetting);

const QueryMonitor = require('./controllers/QueryMonitor');
router.use('/QueryMonitor', QueryMonitor);

const QueryController = require('./controllers/QueryController');
router.use('/QueryController', QueryController);

const QueryAction = require('./controllers/QueryAction');
router.use('/QueryAction', QueryAction);

/**
 * SystemSetting
 */
const User = require('./controllers/SystemSetting/User');
router.use('/user', User);

const Station = require('./controllers/SystemSetting/Station');
router.use('/station', Station);

const Gate = require('./controllers/SystemSetting/Gate');
router.use('/gate', Gate);

module.exports = router;