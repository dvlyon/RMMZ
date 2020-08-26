"use strict";

//=============================================================================
// DvLyon Games
// RPG Maker MZ - DvLyon_HUD_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.DvLyon_HUD_Core = true;

var DvLyon = DvLyon || {};
DvLyon.HUDCore = DvLyon.HUDCore || {};
DvLyon.HUDCore.version = 1;

/*:
-------------------------------------------------------------------------------
@target MZ
@title DvLyon HUD Core
@author DvLyon Games @ https://games.dvlyon.com
@date Aug 26, 2020
@version 1.0.0
@filename DvLyon_HUD_Core.js
@url https://games.dvlyon.com

Contact:

* Website: https://games.dvlyon.com
* Twitter: https://twitter.com/DvLyon

-------------------------------------------------------------------------------
@plugindesc DvLyon's HUD Core
@help 
-------------------------------------------------------------------------------
== Description ==

DvLyon's HUD Core

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

Install and activate.

-------------------------------------------------------------------------------
 *
*/

//=============================================================================
// Declarations
//=============================================================================

function Window_DvLyonHUD() {
	this.initialize.apply(this, arguments)
}

//=============================================================================
// Dependencies
//=============================================================================

if (Imported.DvLyon_Core && DvLyon.Core && DvLyon.Core.version >= 1) {

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
		this.refresh()
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
