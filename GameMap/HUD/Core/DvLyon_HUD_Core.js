"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_HUD_Core.js
//=============================================================================

var DvLyon = DvLyon || {};
DvLyon.HUDCore = DvLyon.HUDCore || {};
DvLyon.HUDCore.version = 2;

/*:
@target MZ
@base DvLyon_Core
@orderAfter DvLyon_Core
@plugindesc HUD Core Functions
@author DvLyon
@url https://dvlyon.com
@help 
== Description ==

Visit https://dvlyon.com/plugins/hudCore

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Contributing ==

If you could credit DvLyon and https://dvlyon.com, we'd really
appreciate it!

We want to keep growing and making your RMMZ experience better!
*/

//=============================================================================
// Declarations
//=============================================================================

function Window_DvLyonHUD() {
	this.initialize(...arguments)
}

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
		if (body && body.hudCore && (body.hudCore.version > DvLyon.HUDCore.version)) {
			const text = 'An updated version of DvLyon_HUD_Core is available at https://dvlyon.com/plugins/hudCore'
			console.info(text)
		}
	})
}

versionChecker()
