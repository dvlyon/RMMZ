"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_HUD_Leader.js
//=============================================================================

var DvLyon = DvLyon || {};
DvLyon.HUDLeader = DvLyon.HUDLeader || {};
DvLyon.HUDLeader.version = 2;

/*:
@target MZ
@base DvLyon_HUD_Core
@orderAfter DvLyon_HUD_Core
@plugindesc Party Leader HUD
@author DvLyon
@url https://dvlyon.com
@help
== Description ==

Visit https://dvlyon.com/plugins/hudLeader

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Contributing ==

If you could credit DvLyon and https://dvlyon.com, I'd really
appreciate it!

@command showHUD
@text Leader HUD Visibility
@desc Sets leader HUD visibility on/off.

@arg value
@type boolean
@text Value
@desc Leader HUD visibility on/off.
@on Show
@off Hide


@param Default
@text Leader HUD Default Visibility
@desc Default visibility of the Leader HUD. (Default: Show)
@type boolean
@on Show
@off Hide
@default true

@param X
@text Leader HUD X
@desc X position of the leader HUD.
@type number
@default 0

@param Y
@text Leader HUD Y
@desc Y position of the leader HUD.
@type number
@default 528

@param Width
@text Leader HUD Width
@desc Width of the leader HUD.
@type number
@default 240

@param Mana
@text Display Mana Bar
@desc Should the mana bar be displayed?
@type boolean
@on Yes
@off No
@default false

@param Bar
@text Background Health Bar
@desc Background health bar image.
@type file
@dir img/dvlyon/
@require 1
@default

@param BarFill
@text Filled Health Bar
@desc Filled health bar image.
@type file
@dir img/dvlyon/
@require 1
@default

@param ManaBar
@text Background Mana Bar
@desc Background mana bar image.
@type file
@dir img/dvlyon/
@require 1
@default

@param ManaBarFill
@text Filled Mana Bar
@desc Filled mana bar image.
@type file
@dir img/dvlyon/
@require 1
@default

@param Window
@text Windowskin
@desc Windowskin for the leader HUD.
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

	DvLyon.HUDLeader.Parameters = PluginManager.parameters('DvLyon_HUD_Leader')
	
	DvLyon.HUDLeader.Default = toBool(DvLyon.HUDLeader.Parameters['Default'], true)
	DvLyon.HUDLeader.X = toNumber(DvLyon.HUDLeader.Parameters['X'], 0)
	DvLyon.HUDLeader.Y = toNumber(DvLyon.HUDLeader.Parameters['Y'], 528)
	DvLyon.HUDLeader.Width = toNumber(DvLyon.HUDLeader.Parameters['Width'], 240)
	DvLyon.HUDLeader.Mana = toBool(DvLyon.HUDLeader.Parameters['Mana'], false)
	DvLyon.HUDLeader.Bar = DvLyon.HUDLeader.Parameters['Bar']
	DvLyon.HUDLeader.BarFill = DvLyon.HUDLeader.Parameters['BarFill']
	DvLyon.HUDLeader.ManaBar = DvLyon.HUDLeader.Parameters['ManaBar']
	DvLyon.HUDLeader.ManaBarFill = DvLyon.HUDLeader.Parameters['ManaBarFill']
	DvLyon.HUDLeader.Window = DvLyon.HUDLeader.Parameters['Window']

	//=============================================================================
	// Managers
	//=============================================================================

	/* PluginManager */

	PluginManager.registerCommand('DvLyon_HUD_Leader', 'showHUD', args => {
		$gameDvLyon.setLeaderHUDVisibility(toBool(args.value, DvLyon.HUDLeader.Default))
	})

	//=============================================================================
	// Objects
	//=============================================================================

	/* Game_DvLyon */

	const _Game_DvLyon_initialize = Game_DvLyon.prototype.initialize
	Game_DvLyon.prototype.initialize = function() {
		_Game_DvLyon_initialize.call(this)
		this._showLeaderHUD = DvLyon.HUDLeader.Default
	}

	Game_DvLyon.prototype.isLeaderHUDVisible = function() {
		return !!this._showLeaderHUD && $gameParty.leader()
	}

	Game_DvLyon.prototype.setLeaderHUDVisibility = function(value) {
		this._showLeaderHUD = value
	}

	//=============================================================================
	// Scenes
	//=============================================================================

	/* Scene_Map */

	const _Scene_Map_updateDvLyonHUDWindows = Scene_Map.prototype.updateDvLyonHUDWindows
	Scene_Map.prototype.updateDvLyonHUDWindows = function() {
		_Scene_Map_updateDvLyonHUDWindows.call(this)
		if ($gameDvLyon.isLeaderHUDVisible()) {
			this._dvLyonHUDLeaderWindow.show()
		} else {
			this._dvLyonHUDLeaderWindow.hide()
		}
	}

	const _Scene_Map_terminateDvLyonHUDWindows = Scene_Map.prototype.terminateDvLyonHUDWindows
	Scene_Map.prototype.terminateDvLyonHUDWindows = function() {
		_Scene_Map_terminateDvLyonHUDWindows.call(this)
		this._dvLyonHUDLeaderWindow.hide()
	}

	const _Scene_Map_createDvLyonHUDWindows = Scene_Map.prototype.createDvLyonHUDWindows
	Scene_Map.prototype.createDvLyonHUDWindows = function() {
		_Scene_Map_createDvLyonHUDWindows.call(this)
		this._dvLyonHUDLeaderWindow = new Window_DvLyonHUDLeader()
		this.addChild(this._dvLyonHUDLeaderWindow)
	}

	//=============================================================================
	// Windows
	//=============================================================================

	//-----------------------------------------------------------------------------
	// Window_DvLyonHUDLeader
	//
	// The window for displaying the Leader HUD.

	function Window_DvLyonHUDLeader() {
		this.initialize(...arguments)
	}

	Window_DvLyonHUDLeader.prototype = Object.create(Window_DvLyonHUD.prototype)
	Window_DvLyonHUDLeader.prototype.constructor = Window_DvLyonHUDLeader

	Window_DvLyonHUDLeader.prototype.initialize = function() {
		const x = DvLyon.HUDLeader.X
		const y = DvLyon.HUDLeader.Y
		const width = DvLyon.HUDLeader.Width
		const height = this.lineHeight() * (DvLyon.HUDLeader.Mana ? 3 : 2) + 24
		Window_DvLyonHUD.prototype.initialize.call(this, new Rectangle(x, y, width, height))
	}

	Window_DvLyonHUDLeader.prototype.loadWindowskin = function() {
		this.windowskin = ImageManager.loadSystem(DvLyon.HUDLeader.Window)
	}

	Window_DvLyonHUDLeader.prototype.refresh = function() {
		const leader = $gameParty.leader()
		if (leader) {
			const faceSize = this.contentsHeight()
			this.drawFace(leader.faceName(), leader.faceIndex(), 0, 0, faceSize, faceSize)
			const itemPadding = this.itemPadding()
			const x = faceSize + itemPadding
			const width = this.contentsWidth() - faceSize - itemPadding
			this.drawText(leader.name(), x, 0, width)
			const lineHeight = this.lineHeight()
			const bar = DvLyon.HUDLeader.Bar
			const barFill = DvLyon.HUDLeader.BarFill
			this.drawLifeBar(leader, x, lineHeight, width, lineHeight, bar, barFill)
			if (DvLyon.HUDLeader.Mana) {
				const manaBar = DvLyon.HUDLeader.ManaBar
				const manaBarFill = DvLyon.HUDLeader.ManaBarFill
				this.drawManaBar(leader, x, lineHeight * 2, width, lineHeight, manaBar, manaBarFill)
			}
		}
	}

})()

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
		if (body && body.hudLeader && (body.hudLeader.version > DvLyon.HUDLeader.version)) {
			const text = 'An updated version of DvLyon_HUD_Leader is available at https://dvlyon.com/plugins/hudLeader'
			console.info(text)
		}
	})
}

versionChecker()
