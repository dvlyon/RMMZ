"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_HUD_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.DvLyon_HUD_Core = true;

var DvLyon = DvLyon || {};
DvLyon.HUDCore = DvLyon.HUDCore || {};
DvLyon.HUDCore.version = 1.2;

/*:
-------------------------------------------------------------------------------
@target MZ
@title DvLyon HUD Core
@author DvLyon @ https://dvlyon.com
@date Sep 16, 2020
@version 1.2.0
@filename DvLyon_HUD_Core.js
@url https://dvlyon.com

Contact:

* Website: https://dvlyon.com
* Twitter: https://twitter.com/DvLyon

-------------------------------------------------------------------------------
@plugindesc DvLyon's HUD Core
@help 
-------------------------------------------------------------------------------
== Description ==

Visit https://dvlyon.com/plugins/hud

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
*/

//=============================================================================
// Declarations
//=============================================================================

function Window_DvLyonHUD() {
	this.initialize(...arguments)
}

//=============================================================================
// Dependencies
//=============================================================================

if (Imported.DvLyon_Core && DvLyon.Core && DvLyon.Core.version >= 1.2) {

//=============================================================================
// Plugin Start
//=============================================================================
 
(function() {
	
	//=============================================================================
	// Parameters
	//=============================================================================

	DvLyon.HUDCore.Parameters = PluginManager.parameters('DvLyon_HUD_Core')

	//=============================================================================
	// Scenes
	//=============================================================================

	/* Scene_Map */

	const _Scene_Map_update = Scene_Map.prototype.update
	Scene_Map.prototype.update = function() {
		_Scene_Map_update.call(this)
		this.updateDvLyonHUDWindows()
	}

	const _Scene_Map_terminate = Scene_Map.prototype.terminate
	Scene_Map.prototype.terminate = function() {
		this.terminateDvLyonHUDWindows()
		_Scene_Map_terminate.call(this)
	}

	const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows
	Scene_Map.prototype.createAllWindows = function() {
		_Scene_Map_createAllWindows.call(this)
		this.createDvLyonHUDWindows()
	}

	Scene_Map.prototype.updateDvLyonHUDWindows = function() {}

	Scene_Map.prototype.terminateDvLyonHUDWindows = function() {}

	Scene_Map.prototype.createDvLyonHUDWindows = function() {}

	//=============================================================================
	// Windows
	//=============================================================================

	//-----------------------------------------------------------------------------
	// Window_DvLyonHUD
	//
	// The superclass of all DvLyon HUD windows within the game.

	Window_DvLyonHUD.prototype = Object.create(Window_Base.prototype)
	Window_DvLyonHUD.prototype.constructor = Window_DvLyonHUD

	Window_DvLyonHUD.prototype.initialize = function(rect) {
		Window_Base.prototype.initialize.call(this, rect)
	}

	Window_DvLyonHUD.prototype.update = function() {
		Window_Base.prototype.update.call(this)
		this.contents.clear()
		if ($gameMessage.isBusy()) {
			this.close()
		} else {
			this.open()
			this.refresh()
		}
	}

	Window_DvLyonHUD.prototype.refresh = function() {}

})()

//=============================================================================
// Plugin End
//=============================================================================

} else {
	const error = 'DvLyon_HUD_Core requires DvLyon_Core at the latest version to run.'
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
		if (body && body.hud && (body.hud.version > DvLyon.HUDCore.version)) {
			const text = 'An updated version of DvLyon_HUD_Core is available at https://dvlyon.com/plugins/hud'
			console.info(text)
		}
	})
}

versionChecker()
