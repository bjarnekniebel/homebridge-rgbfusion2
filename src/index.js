var Service, Characteristic;

const fetch = require('node-fetch');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-rgbfusion2", "RGBFusion2", RGBFusion2);
}

function RGBFusion2(log, config) {
    this.log = log;
    this.config = config;

    this.on = false;
    this.hue = 0;
    this.saturation = 0;
    this.brightness = 0;

    this.ip = config.ip;
    this.password = config.password;

    this.getCurrentSettings();
}

RGBFusion2.prototype.getCurrentSettings = function () {
    fetch(this.ip + ":9009/?Get_Type=0", {methdo: "GET"}).then(response => response.text()).then(text => {

    }).catch(err => this.log.log(err))
}

RGBFusion2.prototype.setSettings = function () {
    fetch(this.ip + "/?Get_Type=0", {
            methdo: "POST",
            body: '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<LED_info_Easy Pattern="0"\n' +
                '      Profile="1"\n' +
                '      Mode="0"\n' +
                '      Othermode="3"\n' +
                '      color="16143270"\n' +
                '      S_Time="09:00"\n' +
                '      E_Time="17:30"\n' +
                '      Br="1"\n' +
                '      Sp="0"\n' +
                '      Support_Flag="191"\n' +
                '      Password_Str="penis"\n' +
                '      MCU_FW="0"\n' +
                '/>'
    }).catch(err => this.log.log(err))
}

RGBFusion2.prototype.getServices = function () {
    const informationService = new Service.AccessoryInformation();
    informationService.setCharacteristic(Characteristic.Manufacturer, "Sn4p3");
    informationService.setCharacteristic(Characteristic.Model, "RGBFusion2 Service");
    informationService.setCharacteristic(Characteristic.SerialNumber, "18769");
    informationService.setCharacteristic(Characteristic.FirmwareRevision, "0.0.1");
    service = new Service.Switch(this.name);

    service.getCharacteristic(Characteristic.On).on("set", this.setOn.bind(this));
    service.addCharacteristic(Characteristic.Hue).on('set', this.setHue.bind(this));
    service.addCharacteristic(Characteristic.Saturation).on('set', this.setSaturation.bind(this));
    service.addCharacteristic(new Characteristic.Brightness()).on('set', this.setBrightness.bind(this));

    return [informationService, service];
}

Serial.prototype.setOn = function(on, callback) {
    if (on == true) {
        this.sendSerial("on");
    } else {
        this.sendSerial("off");
    }
    callback();
}

Serial.prototype.setHue = function(hue, callback) {
    this.lastHue = hue;
    this.sendSerial("hue");
    callback();
}

Serial.prototype.setSaturation = function(saturation, callback) {
    this.lastSaturation = saturation;
    this.sendSerial("saturation");
    callback();
}

Serial.prototype.setBrightness = function(brightness, callback) {
    this.lastBrightness = brightness;
    this.sendSerial("brightness");
    callback();
}
