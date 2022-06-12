"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_MadeBy.js
//=============================================================================

var DvLyon = DvLyon || {};
DvLyon.MadeBy = DvLyon.MadeBy || {};
DvLyon.MadeBy.version = 2;

/*:
@target MZ
@base DvLyon_Core
@orderAfter DvLyon_Core
@plugindesc MadeBy Scene
@author DvLyon
@url https://dvlyon.com
@help
== Description ==

Visit https://dvlyon.com/plugins/madeBy

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Contributing ==

If you could credit DvLyon and https://dvlyon.com, we'd really
appreciate it!

We want to keep growing and making your RMMZ experience better!

@param Images
@text Display Images
@desc List of images to be displayed before game load.
@type file[]
@dir img/dvlyon/
@require 1
@default []

@param FadeSpeed
@text Fade Speed
@desc Fading speed for the displayed images. (Default: 48).
@type number
@default 48
*/

//=============================================================================
// Plugin Start
//=============================================================================

(function() {

	//=============================================================================
	// Variables
	//=============================================================================

	let isMadeByShown = false

	//=============================================================================
	// Parameters
	//=============================================================================

	DvLyon.MadeBy.Parameters = PluginManager.parameters('DvLyon_MadeBy')

	DvLyon.MadeBy.Images = JSON.parse(DvLyon.MadeBy.Parameters['Images'])
	DvLyon.MadeBy.FadeSpeed = toNumber(DvLyon.MadeBy.Parameters['FadeSpeed'], 48)

	//=============================================================================
	// Scenes
	//=============================================================================

	/* Scene_Boot */

	var _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages
	Scene_Boot.prototype.loadSystemImages = function() {
		_Scene_Boot_loadSystemImages.call(this)
		DvLyon.MadeBy.Images.forEach(image => {
			ImageManager.loadDvLyon(image)
		})
	}

	const _Scene_Boot_start = Scene_Boot.prototype.start
	Scene_Boot.prototype.start = function() {
		if (!DataManager.isBattleTest() && !DataManager.isEventTest() && !isMadeByShown) {
			this.resizeScreen()
			this.updateDocumentTitle()
			SceneManager.push(Scene_DvLyonMadeBy)
		} else {
			_Scene_Boot_start.call(this)
		}
	}

	//-----------------------------------------------------------------------------
	// Scene_DvLyonMadeBy
	//
	// The scene class for showing the DvLyon' MadeBy splash screen.

	function Scene_DvLyonMadeBy() {
		this.initialize(...arguments)
	}

	Scene_DvLyonMadeBy.prototype = Object.create(Scene_Base.prototype)
	Scene_DvLyonMadeBy.prototype.constructor = Scene_DvLyonMadeBy

	Scene_DvLyonMadeBy.prototype.initialize = function() {
		Scene_Base.prototype.initialize.call(this)
		this._currentSplash = 0
		this._splashFadeIn = false
		this._splashFadeOut = false
	}

	Scene_DvLyonMadeBy.prototype.create = function() {
		Scene_Base.prototype.create.call(this)
		this.createSplash()
	}

	Scene_DvLyonMadeBy.prototype.update = function() {
		Scene_Base.prototype.update.call(this)
		if (!this.isBusy()) {
			if (this._currentSplash < DvLyon.MadeBy.Images.length) {
				if (!this._splashFadeIn && !this._splashFadeOut) {
					this.loadBitmap(DvLyon.MadeBy.Images[this._currentSplash])
				}
				if (!this._splashFadeIn) {
					this.startFadeIn(this.fadeSpeed(), false)
					this._splashFadeIn = true
				} else if (!this._splashFadeOut) {
					this.startFadeOut(this.fadeSpeed(), false)
					this._splashFadeOut = true
				} else {
					this._currentSplash++
					this._splashFadeIn = false
					this._splashFadeOut = false
				}
			} else {
				isMadeByShown = true
				SceneManager.pop()
			}
		}
	}

	Scene_DvLyonMadeBy.prototype.createSplash = function() {
		this._splashSprite = new Sprite()
		this.addChild(this._splashSprite)
	}

	Scene_DvLyonMadeBy.prototype.adjustSplash = function() {
		this.scaleSprite(this._splashSprite)
		this.centerSprite(this._splashSprite)
	}

	Scene_DvLyonMadeBy.prototype.fadeSpeed = function() {
		return DvLyon.MadeBy.FadeSpeed
	}

	Scene_DvLyonMadeBy.prototype.loadBitmap = function(image) {
		this._splashSprite.bitmap = ImageManager.loadDvLyon(image)
		this.adjustSplash()
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
	.then(body => {
		if (body && body.madeBy && (body.madeBy.version > DvLyon.MadeBy.version)) {
			const text = 'An updated version of DvLyon_MadeBy is available at https://dvlyon.com/plugins/madeBy'
			console.info(text)
		}
	})
}

versionChecker()
