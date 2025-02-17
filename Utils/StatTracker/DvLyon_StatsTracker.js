"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_StatsTracker.js
//=============================================================================

var DvLyon = DvLyon || {};
DvLyon.StatsTracker = DvLyon.StatsTracker || {};
DvLyon.StatsTracker.version = 1.0;

/*:
@target MZ
@plugindesc Core Functions
@author DvLyon
@url https://dvlyon.com
@help
== Description ==

Visit https://dvlyon.com/rmmz/plugins/StatsTracker

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Support ==

Crediting DvLyon.com in your games is much appreciated!

Follow us on socials:
@dvlyon on Twitter, Instagram, Twitch, TikTok and more!

@param SkipTitle
@text Skip Title If No Save
@desc Skips the title scene (straight to map) if there's no save data. (Default: No)
@type boolean
@on Yes
@off No
@default false

@param OpenTools
@text Auto Open Dev Tools
@desc Automatically opens the tools window (F12) on reload. (Default: No)
@type boolean
@on Yes
@off No
@default false
*/

//=============================================================================
// Constants
//=============================================================================

const DefaultStats = {
	Moves: 0,
};

//=============================================================================
// Helpers
//=============================================================================

//=============================================================================
// Declarations
//=============================================================================

//=============================================================================
// Plugin Start
//=============================================================================

(function() {

	if (!DvLyon.Core.version || DvLyon.Core.version < 2.1) {
		throw new Error('DvLyon_Core v2.1+ is required for DvLyon_StatsTracker')
	}

	//=============================================================================
	// Parameters
	//=============================================================================

	DvLyon.StatsTracker.Parameters = PluginManager.parameters('DvLyon_StatsTracker')

	//=============================================================================
	// Managers
	//=============================================================================

	//=============================================================================
	// Objects
	//=============================================================================

	// Game_DvLyon

	const _Game_DvLyon_initialize = Game_DvLyon.prototype.initialize
	Game_DvLyon.prototype.initialize = function() {
		_Game_DvLyon_initialize.call(this)
		this.StatsTracker = this.StatsTracker ?? DefaultStats
	}

	Game_DvLyon.prototype.addMove = function() {
		this.StatsTracker.Moves += 1
	}

	// Game_Player

	Game_Player.prototype.increaseSteps = function() {
		Game_Character.prototype.increaseSteps.call(this);
		if (this.isNormal()) {
			$gameParty.increaseSteps();
		}
	};

	//=============================================================================
	// Scenes
	//=============================================================================

	//=============================================================================
	// Windows
	//=============================================================================

	//=============================================================================
	// Extra
	//=============================================================================

	if (!!DvLyon.StatsTracker.OpenTools && Utils.isNwjs() && Utils.isOptionValid("test")) {
		nw.Window.get().showDevTools()
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
		if (body && body.StatsTracker && (body.StatsTracker.version > DvLyon.StatsTracker.version)) {
			const text = 'An updated version of DvLyon_StatsTracker is available at https://dvlyon.com/rmmz/plugins/StatsTracker'
			console.info(text)
		}
	})
}

versionChecker()
