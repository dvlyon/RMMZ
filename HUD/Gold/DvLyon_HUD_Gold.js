"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_HUD_Gold.js
//=============================================================================

var Imported = Imported || {};
Imported.DvLyon_HUD_Gold = true;

var DvLyon = DvLyon || {};
DvLyon.HUDGold = DvLyon.HUDGold || {};
DvLyon.HUDGold.version = 1.1;

/*:
-------------------------------------------------------------------------------
@target MZ
@title DvLyon HUD Gold
@author DvLyon @ https://dvlyon.com
@date Sep 13, 2020
@version 1.1.0
@filename DvLyon_HUD_Gold.js
@url https://dvlyon.com

Contact:

* Website: https://dvlyon.com
* Twitter: https://twitter.com/DvLyon

-------------------------------------------------------------------------------
@plugindesc DvLyon's Gold HUD
@help 
-------------------------------------------------------------------------------
== Description ==

Visit https://dvlyon.com/plugins/hudgold

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Contributing ==

If you could credit DvLyon and https://dvlyon.com, we'd really
appreciate it!

We want to keep growing and making your RMMZ experience better!

-------------------------------------------------------------------------------
 *
 * @command showHUD
 * @text Gold HUD Visibility
 * @desc Sets gold HUD visibility on/off.
 *
 * @arg value
 * @type boolean
 * @text Value
 * @desc Gold HUD visibility on/off.
 * @on Show
 * @off Hide
 *
 *
 *
 * @param Default
 * @text Gold HUD Default Visibility
 * @desc Default visibility of the gold HUD. (Default: Show)
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param X
 * @text Gold HUD X
 * @desc X position of the gold HUD.
 * @type number
 * @default 576
 *
 * @param Y
 * @text Gold HUD Y
 * @desc Y position of the gold HUD.
 * @type number
 * @default 564
  *
 * @param Width
 * @text Gold HUD Width
 * @desc Width of the gold HUD.
 * @type number
 * @default 240
 *
 * @param Window
 * @text Windowskin
 * @desc Windowskin for the gold HUD.
 * @type file
 * @dir img/system/
 * @require 1
 * @default Window
 *
*/

//=============================================================================
// Dependencies
//=============================================================================

if (Imported.DvLyon_HUD_Core && DvLyon.HUDCore && DvLyon.HUDCore.version >= 1.1) {

//=============================================================================
// Plugin Start
//=============================================================================
 
(function() {
	
	//=============================================================================
	// Parameters
	//=============================================================================

	DvLyon.HUDGold.Parameters = PluginManager.parameters('DvLyon_HUD_Gold')
	
	DvLyon.HUDGold.Default = toBool(DvLyon.HUDGold.Parameters['Default'], true)
	DvLyon.HUDGold.X = toNumber(DvLyon.HUDGold.Parameters['X'], 576)
	DvLyon.HUDGold.Y = toNumber(DvLyon.HUDGold.Parameters['Y'], 564)
	DvLyon.HUDGold.Width = toNumber(DvLyon.HUDGold.Parameters['Width'], 240)
	DvLyon.HUDGold.Window = DvLyon.HUDGold.Parameters['Window']

	//=============================================================================
	// Managers
	//=============================================================================

	/* PluginManager */

	PluginManager.registerCommand('DvLyon_HUD_Gold', 'showHUD', args => {
		$gameDvLyon.setGoldHUDVisibility(toBool(args.value, DvLyon.HUDGold.Default))
	})

	//=============================================================================
	// Objects
	//=============================================================================

	/* Game_DvLyon */

	const _Game_DvLyon_initialize = Game_DvLyon.prototype.initialize
	Game_DvLyon.prototype.initialize = function() {
		_Game_DvLyon_initialize.call(this)
		this._showGoldHUD = DvLyon.HUDGold.Default
	}

	Game_DvLyon.prototype.isGoldHUDVisible = function() {
		return !!this._showGoldHUD
	}

	Game_DvLyon.prototype.setGoldHUDVisibility = function(value) {
		this._showGoldHUD = value
	}

	//=============================================================================
	// Scenes
	//=============================================================================

	/* Scene_Map */

	const _Scene_Map_updateDvLyonHUDWindows = Scene_Map.prototype.updateDvLyonHUDWindows
	Scene_Map.prototype.updateDvLyonHUDWindows = function() {
		_Scene_Map_updateDvLyonHUDWindows.call(this)
		if ($gameDvLyon.isGoldHUDVisible()) {
			this._dvLyonHUDGoldWindow.show()
		} else {
			this._dvLyonHUDGoldWindow.hide()
		}
	}

	const _Scene_Map_terminateDvLyonHUDWindows = Scene_Map.prototype.terminateDvLyonHUDWindows
	Scene_Map.prototype.terminateDvLyonHUDWindows = function() {
		_Scene_Map_terminateDvLyonHUDWindows.call(this)
		this._dvLyonHUDGoldWindow.hide()
	}

	const _Scene_Map_createDvLyonHUDWindows = Scene_Map.prototype.createDvLyonHUDWindows
	Scene_Map.prototype.createDvLyonHUDWindows = function() {
		_Scene_Map_createDvLyonHUDWindows.call(this)
		this._dvLyonHUDGoldWindow = new Window_DvLyonHUDGold()
		this.addChild(this._dvLyonHUDGoldWindow)
	}

	//=============================================================================
	// Windows
	//=============================================================================

	//-----------------------------------------------------------------------------
	// Window_DvLyonHUDGold
	//
	// The window for displaying the Gold HUD.

	function Window_DvLyonHUDGold() {
		this.initialize(...arguments)
	}

	Window_DvLyonHUDGold.prototype = Object.create(Window_DvLyonHUD.prototype)
	Window_DvLyonHUDGold.prototype.constructor = Window_DvLyonHUDGold

	Window_DvLyonHUDGold.prototype.initialize = function() {
		const x = DvLyon.HUDGold.X
		const y = DvLyon.HUDGold.Y
		const width = DvLyon.HUDGold.Width
		const height = this.lineHeight() + 24
		Window_DvLyonHUD.prototype.initialize.call(this, new Rectangle(x, y, width, height))
	}

	Window_DvLyonHUDGold.prototype.loadWindowskin = function() {
		this.windowskin = ImageManager.loadSystem(DvLyon.HUDGold.Window)
	}

	Window_DvLyonHUDGold.prototype.refresh = function() {
		const width = this.contentsWidth()
		this.drawCurrencyValue(this.value(), this.currencyUnit(), 0, 0, width)
	}

	Window_DvLyonHUDGold.prototype.value = function() {
		return $gameParty.gold()
	}

	Window_DvLyonHUDGold.prototype.currencyUnit = function() {
		return TextManager.currencyUnit
	}

})()

//=============================================================================
// Plugin End
//=============================================================================

} else {
	const error = 'DvLyon_HUD_Gold requires DvLyon_HUD_Core at the latest version to run.'
	console.error(error)
	require('nw.gui').Window.get().showDevTools()
}

//=============================================================================
// Version Checker
//=============================================================================

function versionChecker() {
	const url = 'https://raw.githubusercontent.com/dvlyon/RMMZ/master/versions.json'
	fetch(url)
	.then(res => {
		return res.json()
	})
	.then(function(body) {
		if (body && body.hudgold && (body.hudgold.version > DvLyon.HUDGold.version)) {
			const text = 'An updated version of DvLyon_HUD_Gold is available at https://dvlyon.com/plugins/hudgold'
			console.info(text)
		}
	})
}

versionChecker()
