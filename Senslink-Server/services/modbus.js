const ModbusTcpClient = require('modbusjs').ModbusTcpClient;
const options = {};

module.exports = {
    ModbusTCP: (ip, from = 48, len = 32, port = 502) => {
        let modbusTcpClient = new ModbusTcpClient(ip, port, options);

        return new Promise((resolve, reject) => {
            modbusTcpClient.connect()
                .then(() => {
                    modbusTcpClient.readHoldingRegisters(from, len)
                        .then((result) => {
                            resolve(result.response.data)
                        })
                        .catch((err) => {
                            reject(err)
                        });
                })
                .catch((err) => {
                    reject(err)
                });
        })
    },

    writeSingleRegister: (from, values, ip) => {
        let modbusTcpClient = new ModbusTcpClient(ip, 502, options);

        return new Promise((resolve, reject) => {
            modbusTcpClient.connect()
                .then(() => {
                    modbusTcpClient.writeSingleRegister(from, values)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                .catch((err) => {
                    reject(err)
                });
        })
    },

    writeMultipleRegisters: (from, values, ip) => {
        let modbusTcpClient = new ModbusTcpClient(ip, 502, options);

        return new Promise((resolve, reject) => {
            modbusTcpClient.connect()
                .then(() => {
                    modbusTcpClient.writeMultipleRegisters(from, values)
                        .then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
                .catch((err) => {
                    reject(err)
                });
        })
    }
}