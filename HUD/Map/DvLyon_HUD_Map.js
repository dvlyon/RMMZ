"use strict";

//=============================================================================
// DvLyon Games
// RPG Maker MZ - DvLyon_HUD_Map.js
//=============================================================================

var Imported = Imported || {};
Imported.DvLyon_HUD_Map = true;

var DvLyon = DvLyon || {};
DvLyon.HUDMap = DvLyon.HUDMap || {};
DvLyon.HUDMap.version = 1;

/*:
-------------------------------------------------------------------------------
@target MZ
@title DvLyon HUD Map
@author DvLyon Games @ https://games.dvlyon.com
@date Aug 26, 2020
@version 1.0.0
@filename DvLyon_HUD_Map.js
@url https://games.dvlyon.com

Contact:

* Website: https://games.dvlyon.com
* Twitter: https://twitter.com/DvLyon

-------------------------------------------------------------------------------
@plugindesc DvLyon's Map HUD
@help 
-------------------------------------------------------------------------------
== Description ==

DvLyon's Map HUD

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Terms of Use ==

If you could credit DvLyon and https://games.dvlyon.com, we'd really
appreciate it!

We want to keep growing and making your RMMZ experience better!

== Change Log ==

1.0.0 - Aug 26, 2020
 * (Release) Release.

== Usage ==

Install, activate and configure parameters.

-------------------------------------------------------------------------------
 *
 * @command showHUD
 * @text Map HUD Visibility
 * @desc Sets Map HUD visibility on/off.
 *
 * @arg value
 * @type boolean
 * @text Value
 * @desc Map HUD visibility on/off.
 * @on Show
 * @off Hide
 *
 *
 *
 * @param Default
 * @text Map HUD Default Visibility
 * @desc Default visibility of the Map HUD. (Default: Show)
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param X
 * @text Map HUD X
 * @desc X position of the Map HUD.
 * @type number
 * @default 288
 *
 * @param Y
 * @text Map HUD Y
 * @desc Y position of the Map HUD.
 * @type number
 * @default 0
  *
 * @param Width
 * @text Map HUD Width
 * @desc Width of the Map HUD.
 * @type number
 * @default 240
 *
 * @param Height
 * @text Map HUD Height
 * @desc Height of the Map HUD.
 * @type number
 * @default 60
 *
*/

//=============================================================================
// Dependencies
//=============================================================================

if (Imported.DvLyon_HUD_Core && DvLyon.HUDCore && DvLyon.HUDCore.version >= 1) {

//=============================================================================
// Plugin Start
//=============================================================================
 
(function() {
	
	//=============================================================================
	// Parameters
	//=============================================================================

	DvLyon.HUDMap.Parameters = PluginManager.parameters('DvLyon_HUD_Map')
	
	DvLyon.HUDMap.Default = toBool(DvLyon.HUDMap.Parameters['Default'], true)
	DvLyon.HUDMap.X = toNumber(DvLyon.HUDMap.Parameters['X'], 288)
	DvLyon.HUDMap.Y = toNumber(DvLyon.HUDMap.Parameters['Y'], 0)
	DvLyon.HUDMap.Width = toNumber(DvLyon.HUDMap.Parameters['Width'], 240)
	DvLyon.HUDMap.Height = toNumber(DvLyon.HUDMap.Parameters['Height'], 60)

	//=============================================================================
	// Managers
	//=============================================================================

	/* PluginManager */

	PluginManager.registerCommand('DvLyon_HUD_Map', 'showHUD', args => {
		$gameDvLyon.setMapHUDVisibility(toBool(args.value, DvLyon.HUDMap.Default))
	})

	//=============================================================================
	// Objects
	//=============================================================================

	/* Game_DvLyon */

	const _Game_DvLyon_initialize = Game_DvLyon.prototype.initialize
	Game_DvLyon.prototype.initialize = function() {
		_Game_DvLyon_initialize.call(this)
		this._showMapHUD = DvLyon.HUDMap.Default
	}

	Game_DvLyon.prototype.isMapHUDVisible = function() {
		return this._showMapHUD
	}

	Game_DvLyon.prototype.setMapHUDVisibility = function(value) {
		this._showMapHUD = value
	}

	//=============================================================================
	// Scenes
	//=============================================================================

	/* Scene_Map */

	const _Scene_Map_updateDvLyonHUDWindows = Scene_Map.prototype.updateDvLyonHUDWindows
	Scene_Map.prototype.updateDvLyonHUDWindows = function() {
		_Scene_Map_updateDvLyonHUDWindows.call(this)
		if ($gameDvLyon.isMapHUDVisible()) {
			this._dvLyonHUDMapWindow.show()
		} else {
			this._dvLyonHUDMapWindow.hide()
		}
	}

	const _Scene_Map_terminateDvLyonHUDWindows = Scene_Map.prototype.terminateDvLyonHUDWindows
	Scene_Map.prototype.terminateDvLyonHUDWindows = function() {
		_Scene_Map_terminateDvLyonHUDWindows.call(this)
		this._dvLyonHUDMapWindow.hide()
	}

	const _Scene_Map_createDvLyonHUDWindows = Scene_Map.prototype.createDvLyonHUDWindows
	Scene_Map.prototype.createDvLyonHUDWindows = function() {
		$gameMap.disableNameDisplay()
		_Scene_Map_createDvLyonHUDWindows.call(this)
		this._dvLyonHUDMapWindow = new Window_DvLyonHUDMap()
		this.addChild(this._dvLyonHUDMapWindow)
	}

	//=============================================================================
	// Windows
	//=============================================================================

	//-----------------------------------------------------------------------------
	// Window_DvLyonHUDMap
	//
	// The window for displaying the Map HUD.

	function Window_DvLyonHUDMap() {
		this.initialize.apply(this, arguments)
	}

	Window_DvLyonHUDMap.prototype = Object.create(Window_DvLyonHUD.prototype)
	Window_DvLyonHUDMap.prototype.constructor = Window_DvLyonHUDMap

	Window_DvLyonHUDMap.prototype.initialize = function() {
		const x = DvLyon.HUDMap.X
		const y = DvLyon.HUDMap.Y
		const width = DvLyon.HUDMap.Width
		const height = DvLyon.HUDMap.Height
		Window_DvLyonHUD.prototype.initialize.call(this, new Rectangle(x, y, width, height))
	}

	Window_DvLyonHUDMap.prototype.refresh = function() {
		this.drawText($gameMap.displayName(), 0, 0, this.contentsWidth(), 'center')
	}

})()

//=============================================================================
// Plugin End
//=============================================================================

} else {
	const error = 'DvLyon_HUD_Map requires DvLyon_HUD_Core at the latest version to run.'
	console.error(error)
	require('nw.gui').Window.get().showDevTools()
}

//=============================================================================
// Version Checker
//=============================================================================

/*function versionChecker() {
	const url = "https://raw.githubusercontent.com/dvlyon/RMMV-Free/master/versions.json"
	const request = new Request(url)
	fetch(request)
	.then(function(response) {
		return response.json()
	})
	.then(function(body) {
		if (body && (body.core > DvLyon.Core.version)) {
			const text = 'An updated version of DvLyon_Core is available at https://games.dvlyon.com'
			console.info(text)
		}
	})
}

versionChecker()*/
