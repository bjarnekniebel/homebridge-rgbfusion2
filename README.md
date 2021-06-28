# RGBFusion-2 Plugin

A plugin for Home Bridge to control RGB on Gigabyte mainboards that support RGBFusion2.

![Preview](https://github.com/zode-ger/homebridge-rgbfusion2/blob/main/rgbfusion.gif)

## Features:
- [x] static color change
- [x] support for passwords
- [ ] support for multiple color modes
- [ ] support for no passwords (not tested)

## Usage:
1. download and install [RGBFusion2](https://www.gigabyte.com/MicroSite/512/download.html "Download") on your computer 
2. set a password in the settings
3. install the plugin ```npm install -g git+https://github.com/zode-ger/homebridge-rgbfusion2.git```
4. add the following accessory to your config file, choose any name and set the correct IP and RGBFusion2-password for your pc
5. restart Home Bridge ```sudo systemctl restart homebridge```

### Example Config:
```
"accessories": [
	{
		"accessory": "RGBFusion2",
		"name": "PC",
		"ip": "192.168.0.23",
		"password": "superSecretPassword"
  	},
}
```
