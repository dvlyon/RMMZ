# DvLyon Core

## DvLyon Games - RMMZ

### Description

DvLyon_Core is the core of all plugin functionality for the [DvLyon Games](https://games.dvlyon.com)' collection of RPG Maker MZ plugins. It is required by all of our plugins, and comes with some nifty extra functions specially tailored for game development.

### License

This plugin is distributed under the following license:

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.

[Mozilla Public License Version 2.0](http://mozilla.org/MPL/2.0/ "Mozilla Public License
Version 2.0")

### Usage

Simply install, activate and configure parameters.

#### Parameters

##### Skip Title If No Save
###### boolean

If active, the game would start directly when there's no save game data. (Skips title screen). Meant mostly for game development.

##### Auto Open Dev Tools
###### boolean

If active, opens the development tools on game load, also on refresh. Meant for game development.

### For Developers

#### Functions

##### toNumber(param0, default)
###### param0: any
###### default: number

Returns the numeric value of param0, if any, otherwise returns the default.

##### toText(param0, default)
###### param0: any
###### default: string

Returns param0 if valid, otherwise returns the default.

##### toBool(param0, default)
###### param0: any
###### default: boolean

Returns the boolean value of param0, if any, otherwise returns the default.

#### Objects

##### $gameDvLyon

Simple object that is saved with game data. Can be used to store information.

###### $gameDvLyon.clear()

Resets the object data to it's default values.

#### Managers

##### ImageManager.loadDvLyon(param0)
###### param0: string

Loads an image stored in the 'img/dvlyon/' folder.

##### SceneManager.isCurrentScene(param0)
###### param0: sceneClass

Checks if the current scene is of the param0. Returns true/false.

#### Windows

This plugin includes a better Window_Base.prototype.drawFace.

##### Window_Base.prototype.drawBar = function(x, y, width, height, base, color, rate)
###### x: number
###### y: number
###### width: number
###### height: number
###### base: string
###### color: string
###### rate: number

Draws an image-based bar to display a rate (i.e: hp, mp). x, y, width and height are straightforward. base and color are, respectively, the base image and the the one to display on top (according to the rate). And the rate is a number between 0 and 1.

##### Window_Base.prototype.drawLifeBar = function(actor, x, y, width, height, base, color)
###### actor: Game_Actor()
###### x: number
###### y: number
###### width: number
###### height: number
###### base: string
###### color: string
###### rate: number

Draws an image-based bar to display hp rate. The actor is any of the Game_Actor class. x, y, width and height are straightforward. base and color are, respectively, the base image and the the one to display on top (according to the rate). And the rate is a number between 0 and 1.

### Changelog

* 1.0.0 - Aug 26, 2020
	* Release.

### Contributing

If you could credit [DvLyon](https://dvlyon.com) and [DvLyon Games](https://games.dvlyon.com) in your games, we'd really appreciate it!

We want to keep growing and making your RMMZ experience better!

### Contacting

Multiple ways of reaching us are available at [DvLyon Games](https://games.dvlyon.com).
