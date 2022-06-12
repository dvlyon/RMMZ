"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_HUD_Party.js
//=============================================================================

var DvLyon = DvLyon || {};
DvLyon.HUDParty = DvLyon.HUDParty || {};
DvLyon.HUDParty.version = 2;

/*:
@target MZ
@base DvLyon_HUD_Core
@orderAfter DvLyon_HUD_Core
@plugindesc Party HUD
@author DvLyon
@url https://dvlyon.com
@help 
== Description ==

Visit https://dvlyon.com/plugins/hudParty

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Contributing ==

If you could credit DvLyon and https://dvlyon.com, we'd really
appreciate it!

We want to keep growing and making your RMMZ experience better!

@command showHUD
@text Party HUD Visibility
@desc Sets Party HUD visibility on/off.

@arg value
@type boolean
@text Value
@desc Party HUD visibility on/off.
@on Show
@off Hide


@param Default
@text Party HUD Default Visibility
@desc Default visibility of the Party HUD. (Default: Show)
@type boolean
@on Show
@off Hide
@default true

@param X
@text Party HUD X
@desc X position of the party HUD.
@type number
@default 0

@param Y
@text Party HUD Y
@desc Y position of the party HUD.
@type number
@default 0

@param Size
@text Party HUD Actor Size
@desc Size (width & height) of the party HUD actor faces.
@type number
@default 36

@param Width
@text Party HUD Bar Width
@desc Width of the party HUD hp/mana gauges.
@type number
@default 8

@param Mana
@text Display Mana
@desc Should the mana be displayed?
@type boolean
@on Yes
@off No
@default false

@param Window
@text Windowskin
@desc Windowskin for the party HUD.
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

	DvLyon.HUDParty.Parameters = PluginManager.parameters('DvLyon_HUD_Party')
	
	DvLyon.HUDParty.Default = toBool(DvLyon.HUDParty.Parameters['Default'], true)
	DvLyon.HUDParty.X = toNumber(DvLyon.HUDParty.Parameters['X'], 0)
	DvLyon.HUDParty.Y = toNumber(DvLyon.HUDParty.Parameters['Y'], 0)
	DvLyon.HUDParty.Size = toNumber(DvLyon.HUDParty.Parameters['Size'], 36)
	DvLyon.HUDParty.Width = toNumber(DvLyon.HUDParty.Parameters['Width'], 8)
	DvLyon.HUDParty.Mana = toBool(DvLyon.HUDParty.Parameters['Mana'], false)
	DvLyon.HUDParty.Window = DvLyon.HUDParty.Parameters['Window']

	//=============================================================================
	// Managers
	//=============================================================================

	/* PluginManager */

	PluginManager.registerCommand('DvLyon_HUD_Party', 'showHUD', args => {
		$gameDvLyon.setPartyHUDVisibility(toBool(args.value, DvLyon.HUDParty.Default))
	})

	//=============================================================================
	// Objects
	//=============================================================================

	/* Game_DvLyon */

	const _Game_DvLyon_initialize = Game_DvLyon.prototype.initialize
	Game_DvLyon.prototype.initialize = function() {
		_Game_DvLyon_initialize.call(this)
		this._showPartyHUD = DvLyon.HUDParty.Default
	}

	Game_DvLyon.prototype.isPartyHUDVisible = function() {
		const minLength = DvLyon.HUDLeader && !!this.isLeaderHUDVisible() ? 1 : 0
		return this._showPartyHUD && $gameParty.allMembers().length > minLength
	}

	Game_DvLyon.prototype.setPartyHUDVisibility = function(value) {
		this._showPartyHUD = value
	}

	//=============================================================================
	// Scenes
	//=============================================================================

	/* Scene_Map */

	const _Scene_Map_updateDvLyonHUDWindows = Scene_Map.prototype.updateDvLyonHUDWindows
	Scene_Map.prototype.updateDvLyonHUDWindows = function() {
		_Scene_Map_updateDvLyonHUDWindows.call(this)
		if ($gameDvLyon.isPartyHUDVisible()) {
			this._dvLyonHUDPartyWindow.show()
		} else {
			this._dvLyonHUDPartyWindow.hide()
		}
	}

	const _Scene_Map_terminateDvLyonHUDWindows = Scene_Map.prototype.terminateDvLyonHUDWindows
	Scene_Map.prototype.terminateDvLyonHUDWindows = function() {
		_Scene_Map_terminateDvLyonHUDWindows.call(this)
		this._dvLyonHUDPartyWindow.hide()
	}

	const _Scene_Map_createDvLyonHUDWindows = Scene_Map.prototype.createDvLyonHUDWindows
	Scene_Map.prototype.createDvLyonHUDWindows = function() {
		_Scene_Map_createDvLyonHUDWindows.call(this)
		this._dvLyonHUDPartyWindow = new Window_DvLyonHUDParty()
		this.addChild(this._dvLyonHUDPartyWindow)
	}

	//=============================================================================
	// Windows
	//=============================================================================

	//-----------------------------------------------------------------------------
	// Window_DvLyonHUDParty
	//
	// The window for displaying the Party HUD.

	function Window_DvLyonHUDParty() {
		this.initialize(...arguments)
	}

	Window_DvLyonHUDParty.prototype = Object.create(Window_DvLyonHUD.prototype)
	Window_DvLyonHUDParty.prototype.constructor = Window_DvLyonHUDParty

	Window_DvLyonHUDParty.prototype.initialize = function() {
		const x = DvLyon.HUDParty.X
		const y = DvLyon.HUDParty.Y
		const width = 24 + DvLyon.HUDParty.Size + (this.itemPadding() + DvLyon.HUDParty.Width) * (DvLyon.HUDParty.Mana ? 2 : 1)
		Window_DvLyonHUD.prototype.initialize.call(this, new Rectangle(x, y, width, 0))
		this._length = 0
		this._leader = false
	}

	Window_DvLyonHUDParty.prototype.loadWindowskin = function() {
		this.windowskin = ImageManager.loadSystem(DvLyon.HUDParty.Window)
	}

	Window_DvLyonHUDParty.prototype.refresh = function() {
		const leader = DvLyon.HUDLeader && !!$gameDvLyon.isLeaderHUDVisible() ? 1 : 0
		const members = $gameParty.allMembers()
		const length = members.length
		this.setLength(length, leader)
		for (let i = 0; i < length; i++) {
			const padding = this.itemPadding()
			const y = (i - leader) * (DvLyon.HUDParty.Size + padding)
			this.drawActorFace(members[i], 0, y, DvLyon.HUDParty.Size, DvLyon.HUDParty.Size)
			const hpX = DvLyon.HUDParty.Size + padding
			this.drawHPGaugeV(members[i], hpX, y, DvLyon.HUDParty.Width, DvLyon.HUDParty.Size)
			if (DvLyon.HUDParty.Mana) {
				this.drawMPGaugeV(members[i], hpX + DvLyon.HUDParty.Width + padding, y, DvLyon.HUDParty.Width, DvLyon.HUDParty.Size)
			}
		}
	}

	Window_DvLyonHUDParty.prototype.setLength = function(length, leader) {
		if ((this._length !== length) || (this._leader !== leader)) {
			this._length = length
			this._leader = leader
			length -= leader
			const padding = this.itemPadding()
			this.height = 24 + length * (DvLyon.HUDParty.Size + padding) - padding
			this.createContents()
		}
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
		if (body && body.hudParty && (body.hudParty.version > DvLyon.HUDParty.version)) {
			const text = 'An updated version of DvLyon_HUD_Party is available at https://dvlyon.com/plugins/hudParty'
			console.info(text)
		}
	})
}

versionChecker()
