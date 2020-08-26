"use strict";

//=============================================================================
// DvLyon Games
// RPG Maker MZ - DvLyon_Core.js
//=============================================================================

var Imported = Imported || {};
Imported.DvLyon_Core = true;

var DvLyon = DvLyon || {};
DvLyon.Core = DvLyon.Core || {};
DvLyon.Core.version = 1;

/*:
-------------------------------------------------------------------------------
@target MZ
@title DvLyon Core
@author DvLyon Games @ https://games.dvlyon.com
@date Aug 26, 2020
@version 1.0.0
@filename DvLyon_Core.js
@url https://games.dvlyon.com

Contact:

* Website: https://games.dvlyon.com
* Twitter: https://twitter.com/DvLyon

-------------------------------------------------------------------------------
@plugindesc DvLyon Core Functions
@help 
-------------------------------------------------------------------------------
== Description ==

DvLyon Core Functions for RMMZ.

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
 * @param SkipTitle
 * @text Skip Title If No Save
 * @desc Skips the title scene (straight to map) if there's no save data. (Default: No)
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @param OpenTools
 * @text Auto Open Dev Tools
 * @desc Automatically opens the tools window (F12) on reload. (Default: No)
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
*/

//=============================================================================
// Helpers
//=============================================================================

function toNumber(str, def) {
	str = Number(str)
	return isNaN(str) ? def : str
}

function toText(str, def) {
	return str ? str : def
}

function toBool(str, def) {
	switch (str) {
		case 'true':
			return true
		case 'false':
			return false
		default:
			return !!def ? true : false
	}
}

//=============================================================================
// Declarations
//=============================================================================

var $gameDvLyon = null

function Game_DvLyon() {
	this.initialize.apply(this, arguments)
}

//=============================================================================
// Plugin Start
//=============================================================================

(function() {

	//=============================================================================
	// Parameters
	//=============================================================================

	DvLyon.Core.Parameters = PluginManager.parameters('DvLyon_Core')

	DvLyon.Core.SkipTitle = toBool(DvLyon.Core.Parameters['SkipTitle'], false)
	DvLyon.Core.OpenTools = toBool(DvLyon.Core.Parameters['OpenTools'], false)

	//=============================================================================
	// Managers
	//=============================================================================

	/* DataManager */

	const _DataManager_createGameObjects = DataManager.createGameObjects
	DataManager.createGameObjects = function() {
		_DataManager_createGameObjects.call(this)
		$gameDvLyon = new Game_DvLyon()
	}

	const _DataManager_makeSaveContents = DataManager.makeSaveContents
	DataManager.makeSaveContents = function() {
		let contents = _DataManager_makeSaveContents.call(this)
		contents.dvlyon = $gameDvLyon
		return contents
	}

	const _DataManager_extractSaveContents = DataManager.extractSaveContents
	DataManager.extractSaveContents = function(contents) {
		_DataManager_extractSaveContents.call(this, contents)
		$gameDvLyon = contents.dvlyon
	}

	/* ImageManager */

	ImageManager.loadDvLyon = function(filename) {
		return this.loadBitmap('img/dvlyon/', filename)
	}

	/* SceneManager */

	SceneManager.isCurrentScene = function(sceneClass) {
		return this._scene && this._scene.constructor === sceneClass
	}

	//=============================================================================
	// Objects
	//=============================================================================

	//-----------------------------------------------------------------------------
	// Game_DvLyon
	//
	// The game object class for all things DvLyon.

	Game_DvLyon.prototype.initialize = function() {
		this.clear()
	}

	Game_DvLyon.prototype.clear = function() {}

	//=============================================================================
	// Scenes
	//=============================================================================

	/* Scene_Boot */

	const _Scene_Boot_start = Scene_Boot.prototype.start
	Scene_Boot.prototype.start = function() {
		if (DvLyon.Core.SkipTitle && !DataManager.isBattleTest()
			&& !DataManager.isEventTest() && !DataManager.isAnySavefileExists()) {
			Scene_Base.prototype.start.call(this)
			SoundManager.preloadImportantSounds()
			this.checkPlayerLocation()
			DataManager.setupNewGame()
			this.resizeScreen()
			this.updateDocumentTitle()
			this.fadeOutAll()
			SceneManager.goto(Scene_Map)
		} else {
			_Scene_Boot_start.call(this)
		}
	}

	//=============================================================================
	// Windows
	//=============================================================================

	/* Window_Base */

	Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
		width = width || ImageManager.faceWidth
		height = height || ImageManager.faceHeight
		const bitmap = ImageManager.loadFace(faceName)
		const sw = ImageManager.faceWidth
		const sh = ImageManager.faceHeight
		const sx = (faceIndex % 4) * sw
		const sy = Math.floor(faceIndex / 4)
		this.contents.blt(bitmap, sx, sy, sw, sh, x, y, width, height)
	}

	Window_Base.prototype.drawBar = function(actor, x, y, width, height, base, color, rate) {
		rate = Math.max(Math.min(rate, 1), 0)
		let bitmap = ImageManager.loadDvLyon(base)
		this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y, width, height)
		bitmap = ImageManager.loadDvLyon(color)
		const sw = Math.floor(rate * bitmap.width)
		const dw = Math.floor(rate * width)
		if (dw > 0) {
			this.contents.blt(bitmap, 0, 0, sw, bitmap.height, x, y, dw, height)
		}
	}

	Window_Base.prototype.drawLifeBar = function(actor, x, y, width, height, base, color) {
		this.drawBar(actor, x, y, width, height, base, color, actor.hpRate())
	}

	//=============================================================================
	// Extra
	//=============================================================================

	if (!!DvLyon.Core.OpenTools && Utils.isNwjs() && Utils.isOptionValid("test")) {
		nw.Window.get().showDevTools()
	}

})()

//=============================================================================
// Plugin End
//=============================================================================

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