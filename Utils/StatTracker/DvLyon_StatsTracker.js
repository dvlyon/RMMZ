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

//=============================================================================
// Helpers
//=============================================================================

function makeDefaultStats() {
	return {
		Steps: {
			p: 0,
		},
		Encounters: {
			// Predefine some keys so they’re always objects
			t: {},
			p: {},
		},
	};
}

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

	// BattleManager

	const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.call(this, result);

        // Tally a total encounter result
        $gameDvLyon.addEncounter(result);

        // For each enemy, log party-level and individual actor stats
        $gameTroop.members().forEach(enemy => {
            $gameDvLyon.addPartyEncounter(enemy._enemyId, result);
            $gameParty.battleMembers().forEach(member => {
                $gameDvLyon.addMemberEncounter(member._actorId, enemy._enemyId, result);
            });
        });
    };

	//=============================================================================
	// Objects
	//=============================================================================

	// Game_DvLyon

	const _Game_DvLyon_initialize = Game_DvLyon.prototype.initialize;
    Game_DvLyon.prototype.initialize = function() {
        _Game_DvLyon_initialize.call(this);
        
        // If it’s undefined or null, give it a brand new default structure:
        if (!this.StatsTracker) {
            this.StatsTracker = makeDefaultStats();
        }
    };

	/**
     * Just for debugging/logging in the console
     */
    Game_DvLyon.prototype.showStats = function() {
        console.log(this.StatsTracker);
    };

	/**
     * Count steps for a given actor or for the entire party.
     */
    Game_DvLyon.prototype.addStep = function(characterIndex, party = false) {
        // Initialize if missing
        if (!this.StatsTracker.Steps[characterIndex]) {
            this.StatsTracker.Steps[characterIndex] = 0;
        }
        // Increase steps for that specific character
        this.StatsTracker.Steps[characterIndex]++;

        // If counting party steps:
        if (party) {
            if (!this.StatsTracker.Steps['p']) {
                this.StatsTracker.Steps['p'] = 0;
            }
            this.StatsTracker.Steps['p']++;
        }
    };

	/**
     * Total encounters: track the result (win, escape, lose, etc.) globally.
     */
    Game_DvLyon.prototype.addEncounter = function(result) {
        // Make sure .Encounters.t is an object
        if (!this.StatsTracker.Encounters.t) {
            this.StatsTracker.Encounters.t = {};
        }
        if (!this.StatsTracker.Encounters.t[result]) {
            this.StatsTracker.Encounters.t[result] = 0;
        }
        this.StatsTracker.Encounters.t[result]++;
    };

	/**
     * Party encounters vs a particular enemy ID.
     */
    Game_DvLyon.prototype.addPartyEncounter = function(enemyId, result) {
		this.addMemberEncounter('p', enemyId, result)
    };

    /**
     * Encounters for a specific actor against a particular enemy.
     */
    Game_DvLyon.prototype.addMemberEncounter = function(actorId, enemyId, result) {
        // Make sure .Encounters[actorId] and .Encounters[actorId][enemyId] exist
        if (!this.StatsTracker.Encounters[actorId]) {
            this.StatsTracker.Encounters[actorId] = {};
        }
        if (!this.StatsTracker.Encounters[actorId][enemyId]) {
            this.StatsTracker.Encounters[actorId][enemyId] = {};
        }
        if (!this.StatsTracker.Encounters[actorId][enemyId][result]) {
            this.StatsTracker.Encounters[actorId][enemyId][result] = 0;
        }
        this.StatsTracker.Encounters[actorId][enemyId][result]++;
    };

	// Game_Player

	const _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps
	Game_Player.prototype.increaseSteps = function() {
		_Game_Player_increaseSteps.call(this)
		$gameDvLyon.addStep($gameParty.leader()._actorId, true)
	}

	// Game_Follower

	const _Game_Follower_increaseSteps = Game_Follower.prototype.increaseSteps
	Game_Follower.prototype.increaseSteps = function() {
		_Game_Follower_increaseSteps.call(this)
		$gameDvLyon.addStep(this.actor()._actorId)
	}

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
