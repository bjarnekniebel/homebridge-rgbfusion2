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
    this.log("GET SETTINGS")
    fetch("http://" + this.ip + ":9009/?Get_Type=0", {methdo: "GET"}).then(response => response.text()).then(text => {

    }).catch(err => this.log(err))
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function HSBtoHEX(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return componentToHex(Math.round(r*255)) + componentToHex(Math.round(g*255)) + componentToHex(Math.round(b*255));
}

function HEXtoINT(hex) {
    return parseInt(hex, 16)
}

RGBFusion2.prototype.setSettings = function () {
    this.log("SET SETTINGS:")
    this.log("\thue: " + this.hue)
    this.log("\tsaturation: " + this.saturation)
    this.log("\tbrightness: " + this.brightness)

    let rgb = HEXtoINT(HSBtoHEX(this.hue / 360, this.saturation / 100, this.brightness / 100));
    this.log("\trgb: " + rgb)
    fetch("http://" + this.ip + ":9009/?Get_Type=0", {
            method: "POST",
            body: '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<LED_info_Easy Pattern="0"\n' +
                '      Profile="1"\n' +
                '      Mode="0"\n' +
                '      Othermode="3"\n' +
                '      color="' + rgb + '"\n' +
                '      S_Time="09:00"\n' +
                '      E_Time="17:30"\n' +
                '      Br="' + this.brightness + '"\n' +
                '      Sp="0"\n' +
                '      Support_Flag="191"\n' +
                '      Password_Str="' + this.password + '"\n' +
                '      MCU_FW="0"\n' +
                '/>'
    }).catch(err => this.log(err))
}

RGBFusion2.prototype.getServices = function () {
    const informationService = new Service.AccessoryInformation();
    informationService.setCharacteristic(Characteristic.Manufacturer, "Sn4p3");
    informationService.setCharacteristic(Characteristic.Model, "RGBFusion2 Service");
    informationService.setCharacteristic(Characteristic.SerialNumber, "18769");
    informationService.setCharacteristic(Characteristic.FirmwareRevision, "0.0.1");
    service = new Service.Lightbulb(this.name);

    service.getCharacteristic(Characteristic.On).on("set", this.setOn.bind(this));
    service.addCharacteristic(Characteristic.Hue).on('set', this.setHue.bind(this));
    service.addCharacteristic(Characteristic.Saturation).on('set', this.setSaturation.bind(this));
    service.addCharacteristic(new Characteristic.Brightness()).on('set', this.setBrightness.bind(this));

    return [informationService, service];
}

RGBFusion2.prototype.setOn = function(on, callback) {
    this.on = !on;
    this.setSettings();
    callback();
}

RGBFusion2.prototype.setHue = function(hue, callback) {
    this.hue = hue;
    this.setSettings();
    callback();
}

RGBFusion2.prototype.setSaturation = function(saturation, callback) {
    this.saturation = saturation;
    this.setSettings();
    callback();
}

RGBFusion2.prototype.setBrightness = function(brightness, callback) {
    this.brightness = brightness;
    this.setSettings();
    callback();
}
