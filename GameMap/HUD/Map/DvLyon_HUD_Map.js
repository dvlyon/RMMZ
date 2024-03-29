"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_HUD_Map.js
//=============================================================================

var DvLyon = DvLyon || {};
DvLyon.HUDMap = DvLyon.HUDMap || {};
DvLyon.HUDMap.version = 2;

/*:
@target MZ
@base DvLyon_HUD_Core
@orderAfter DvLyon_HUD_Core
@plugindesc Map Name HUD
@author DvLyon
@url https://dvlyon.com
@help
== Description ==

Visit https://dvlyon.com/rmmz/plugins/hudMap

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Contributing ==

If you could credit DvLyon and https://dvlyon.com, I'd really
appreciate it!

@command showHUD
@text Map HUD Visibility
@desc Sets map HUD visibility on/off.

@arg value
@type boolean
@text Value
@desc Map HUD visibility on/off.
@on Show
@off Hide


@param Default
@text Map HUD Default Visibility
@desc Default visibility of the map HUD. (Default: Show)
@type boolean
@on Show
@off Hide
@default true

@param X
@text Map HUD X
@desc X position of the map HUD.
@type number
@default 288

@param Y
@text Map HUD Y
@desc Y position of the map HUD.
@type number
@default 0

@param Width
@text Map HUD Width
@desc Width of the map HUD.
@type number
@default 240

@param Window
@text Windowskin
@desc Windowskin for the map HUD.
@type file
@dir img/system/
@require 1
@default Window
*/

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
	DvLyon.HUDMap.Window = DvLyon.HUDMap.Parameters['Window']

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
		return !!this._showMapHUD && $gameMap.displayName()
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
		this.initialize(...arguments)
	}

	Window_DvLyonHUDMap.prototype = Object.create(Window_DvLyonHUD.prototype)
	Window_DvLyonHUDMap.prototype.constructor = Window_DvLyonHUDMap

	Window_DvLyonHUDMap.prototype.initialize = function() {
		const x = DvLyon.HUDMap.X
		const y = DvLyon.HUDMap.Y
		const width = DvLyon.HUDMap.Width
		const height = this.lineHeight() + 24
		Window_DvLyonHUD.prototype.initialize.call(this, new Rectangle(x, y, width, height))
	}

	Window_DvLyonHUDMap.prototype.loadWindowskin = function() {
		this.windowskin = ImageManager.loadSystem(DvLyon.HUDMap.Window)
	}

	Window_DvLyonHUDMap.prototype.refresh = function() {
		this.drawText($gameMap.displayName(), 0, 0, this.contentsWidth(), 'center')
	}

})()

//=============================================================================
// Plugin End
//=============================================================================

//=============================================================================
// Version Checker
//=============================================================================

function versionChecker() {
	const url = 'https://raw.githubusercontent.com/dvlyon/RMMZ/main/versions.json'
	fetch(url)
	.then(res => {
		return res.json()
	})
	.then(function(body) {
		if (body && body.hudMap && (body.hudMap.version > DvLyon.HUDMap.version)) {
			const text = 'An updated version of DvLyon_HUD_Map is available at https://dvlyon.com/rmmz/plugins/hudMap'
			console.info(text)
		}
	})
}

versionChecker()
