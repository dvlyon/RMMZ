# DvLyon HUD Core

## DvLyon Games - RMMZ

### Description

DvLyon_HUD_Core is the core of the modular HUD plugin functionality for the [DvLyon Games](https://games.dvlyon.com)' collection of RPG Maker MZ HUD plugins. It is required by all of our HUD plugins, and comes with some nifty extra functions specially tailored for game development.

### License

This plugin is distributed under the following license:

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.

[Mozilla Public License Version 2.0](http://mozilla.org/MPL/2.0/ "Mozilla Public License
Version 2.0")

### Usage

Simply install and activate.

### For Developers

#### Classes

##### Window_DvLyonHUD

The superclass of all of our HUD windows. Clears the window and refreshes it's contents on update.

#### Managers

##### ImageManager.loadDvLyon(param0)
###### param0: string

Loads an image stored in the 'img/dvlyon/' folder.

##### SceneManager.isCurrentScene(param0)
###### param0: sceneClass

Checks if the current scene is of the param0. Returns true/false.

#### Windows

##### Scene_Map.prototype.updateDvLyonHUDWindows

Updates HUD windows. Called after update().

##### Scene_Map.prototype.terminateDvLyonHUDWindows

Hides HUD windows. Called before terminate().

##### Scene_Map.prototype.createDvLyonHUDWindows

Adds HUD windows. Called after createAllWindows().

### Changelog

* 1.0.0 - Aug 26, 2020
	* Release.

### Contributing

If you could credit [DvLyon](https://dvlyon.com) and [DvLyon Games](https://games.dvlyon.com) in your games, we'd really appreciate it!

We want to keep growing and making your RMMZ experience better!

### Contacting

Multiple ways of reaching us are available at [DvLyon Games](https://games.dvlyon.com).
