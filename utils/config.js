'use strict';

const fs = require('fs');


class configUtil {
    static getConfigValue(original_value, default_value) {
        return (original_value !== undefined ? original_value : default_value);
    }

    static checkValueRange(value, min, max) {
        return (value >= min && value <= max);
    }
        
    static checkValueValid(value, valid_value_array) {
        return (-1 !== valid_value_array.indexOf(value));
    }
    
    
    static readStoragedConfigFromFile(filePath) {
        var result = undefined;
        try {
            // const filePath = api.user.storagePath() + '/raspberry-simpleGPIO.json';
            if (fs.existsSync(filePath)) {
                const rawdata = fs.readFileSync(filePath);
                const accessory_name = this.config.get('name');
                if (JSON.parse(rawdata)[accessory_name] !== undefined) {
                    result = JSON.parse(rawdata)[accessory_name];
                }
            }
        } catch (error) {
            this.log.error('readstoragedConfigFromFile failed: ' + error);
        } finally {
            return result;
        }
    }

    static saveStoragedConfigToFile(filePath, data) {
        var result = undefined;
        // const filePath = api.user.storagePath() + '/raspberry-simpleGPIO.json';
        try {       // read
            if (fs.existsSync(filePath)) {
                const original_data = fs.readFileSync(filePath);
                result = JSON.parse(original_data);
            }
        } catch (error) {
            this.log.error('readFileSync failed: ' + error);
        }

        try {       // write
            const accessory_name = this.config.get('name');
            if (result && result[accessory_name] !== undefined) {
                result[accessory_name] = Object.assign(result[accessory_name], data)
            } else {
                result[accessory_name] = data;
            }
            const rawdata = JSON.stringify(result);
            fs.writeFileSync(filePath, rawdata);
        } catch (error) {
            this.log.error('saveStoragedConfigToFile failed: ' + error);
        } finally {
            return result;
        }
    }

    constructor(config) {
        this.config = config;
    }

    checkValueRange(prop, min, max) {
        return configUtil.checkValueRange(this.config[prop], min, max);
    }

    checkValueValid(prop, valid_value_array) {
        return configUtil.checkValueValid(this.config[prop], valid_value_array);
    }

    fulfill(prop, value) {
        this.config[prop] = configUtil.getConfigValue(this.config[prop], value);
        return this.config[prop];
    }

    get(prop, default_value = undefined, update = false) {
        if (typeof update === 'boolean' && update) {
            return fulfill(prop, default_value);
        } else if (undefined !== default_value) {
            return getConfigValue(this.config[prop], default_value);
        } else {
            return this.config[prop];
        }
    }
    
    set(prop, value) {
        this.config[prop] = value;
    }
}

module.exports = configUtil;