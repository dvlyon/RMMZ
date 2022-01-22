"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_UniqueEquips.js
//=============================================================================

var Imported = Imported || {};
Imported.DvLyon_UniqueEquips = true;

var DvLyon = DvLyon || {};
DvLyon.UniqueEquips = DvLyon.UniqueEquips || {};
DvLyon.UniqueEquips.version = 1;

/*:
-------------------------------------------------------------------------------
@target MZ
@title DvLyon Unique Equips
@author DvLyon @ https://dvlyon.com
@date Sep 03, 2020
@version 1.0.0
@filename DvLyon_UniqueEquips.js
@url https://dvlyon.com

Contact:

* Website: https://dvlyon.com
* Twitter: https://twitter.com/DvLyon

-------------------------------------------------------------------------------
@plugindesc DvLyon's Unique Equips
@help 
-------------------------------------------------------------------------------
== Description ==

Visit https://dvlyon.com/plugins/uniqueEquips

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

function Game_Weapon() {
	this.initialize(...arguments)
}

function Game_Armour() {
	this.initialize(...arguments)
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

	DvLyon.UniqueEquips.Parameters = PluginManager.parameters('DvLyon_UniqueEquips')

	//=============================================================================
	// Managers
	//=============================================================================

	/* DataManager */

	const _DataManager_isWeapon = DataManager.isWeapon
	DataManager.isWeapon = function(item) {
		return (item && item._dataClass === 'weapon' && item._itemId > 0) || _DataManager_isWeapon.call(this, item)
	}

	const _DataManager_isArmor = DataManager.isArmor
	DataManager.isArmor = function(item) {
		return (item && item._dataClass === 'armor' && item._itemId > 0) || _DataManager_isArmor.call(this, item)
	}

	//=============================================================================
	// Objects
	//=============================================================================

	/* Game_Actor */

	Game_Actor.prototype.initEquips = function(equips) {
		const slots = this.equipSlots()
		const maxSlots = slots.length
		this._equips = []
		for (let i = 0; i < maxSlots; i++) {
			this._equips[i] = new Game_Item()
		}
		for (let j = 0; j < equips.length; j++) {
			if (j < maxSlots) {
				if (slots[j] === 1) {
					if ((equips[j] > 0) && $dataWeapons[equips[j]]) {
						this._equips[j] = new Game_Weapon($dataWeapons[equips[j]])
					}
				} else {
					if ((equips[j] > 0) && $dataArmors[equips[j]]) {
						this._equips[j] = new Game_Armour($dataArmors[equips[j]])
					}
				}
			}
		}
		this.releaseUnequippableItems(true)
		this.refresh()
	}

	Game_Actor.prototype.equips = function() {
		return this._equips.map((equip) => {
			return (equip && (equip._itemId > 0)) ? equip : null
		})
	}

	Game_Actor.prototype.changeEquip = function(slotId, item) {
		if (this.tradeItemWithParty(item, this.equips()[slotId]) && (!item || this.equipSlots()[slotId] === item.etypeId)) {
			this._equips[slotId] = item
			this.refresh()
		}
	}

	Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
		this._equips[slotId] = item
		this.releaseUnequippableItems(true)
		this.refresh()
	}

	Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
		if (newItem && !$gameParty.hasItem(newItem)) {
			return false
		} else {
			$gameParty.gainItem(oldItem, 1)
			$gameParty.loseItem(newItem, 1)
			return true
		}
	}

	/* Game_Party */

	const _Game_Party_initAllItems = Game_Party.prototype.initAllItems
	Game_Party.prototype.initAllItems = function() {
		_Game_Party_initAllItems.call(this)
		this._weapons = []
		this._armors = []
	}

	Game_Party.prototype.weapons = function() {
		return this._weapons
	}

	Game_Party.prototype.armors = function() {
		return this._armors
	}

	const _Game_Party_numItems = Game_Party.prototype.numItems
	Game_Party.prototype.numItems = function(item) {
		if (DataManager.isWeapon(item)) {
			return this._weapons.indexOf(item) >= 0 ? 1 : 0
		} else if (DataManager.isArmor(item)) {
			return this._armors.indexOf(item) >= 0 ? 1 : 0
		} else {
			return _Game_Party_numItems.call(this, item)
		}
	}

	const _Game_Party_gainItem = Game_Party.prototype.gainItem
	Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
		if (DataManager.isWeapon(item)) {
			this.gainWeapon(item, amount, includeEquip)
		} else if (DataManager.isArmor(item)) {
			this.gainArmour(item, amount, includeEquip)
		} else {
			_Game_Party_gainItem.call(this, item, amount, includeEquip)
		}
	}

	Game_Party.prototype.gainWeapon = function(item, amount, includeEquip) {
		if (amount > 0) {
			if (item._uniqueEquipKey) {
				this.weapons().push(item)
			} else {
				for (let i = 0; i < amount; i++) {
					this.weapons().push(new Game_Weapon(item))
				}
			}
		} else if (amount < 0) {
			if (item._uniqueEquipKey) {
				const index = this.weapons().indexOf(item)
				if (index >= 0) {
					this.weapons().splice(index, 1)
				}
			} else {
				/* NYI ¿? */
			}
		}
	}

	Game_Party.prototype.gainArmour = function(item, amount, includeEquip) {
		if (amount > 0) {
			if (item._uniqueEquipKey) {
				this.armors().push(item)
			} else {
				for (let i = 0; i < amount; i++) {
					this.armors().push(new Game_Armour(item))
				}
			}
		} else if (amount < 0) {
			if (item._uniqueEquipKey) {
				const index = this.armors().indexOf(item)
				if (index >= 0) {
					this.armors().splice(index, 1)
				}
			} else {
				/* NYI ¿? */
			}
		}
	}

	//-----------------------------------------------------------------------------
	// Game_UniqueEquip
	//
	// The superclass of Game_Weapon and Game_Armour.

	function Game_UniqueEquip() {
		this.initialize(...arguments)
	}

	Game_UniqueEquip.prototype = Object.create(Game_Item.prototype)
	Game_UniqueEquip.prototype.constructor = Game_UniqueEquip

	Game_UniqueEquip.prototype.initialize = function(item) {
		Game_Item.prototype.initialize.call(this, item)
		this._uniqueEquipKey = $gameDvLyon.getUniqueEquipKey()
		if (item) {
			this.setUniqueEquip(item)
		}
	}

	Game_UniqueEquip.prototype.setUniqueEquip = function(item) {
		this.id = item.id
		this.description = item.description
		this.etypeId = item.etypeId
		this.traits = item.traits
		this.iconIndex = item.iconIndex
		this.name = item.name
		this.note = item.note
		this.params = item.params
		this.price = item.price
	}

	//-----------------------------------------------------------------------------
	// Game_Weapon
	//
	// The game object class for a weapon.

	Game_Weapon.prototype = Object.create(Game_UniqueEquip.prototype)
	Game_Weapon.prototype.constructor = Game_Weapon

	Game_Weapon.prototype.initialize = function(item) {
		Game_UniqueEquip.prototype.initialize.call(this, item)
	}

	Game_Weapon.prototype.setEquip = function(isWeapon, itemId) {
		Game_UniqueEquip.prototype.setEquip.call(this, isWeapon, itemId)
		if (!!isWeapon && (itemId > 0) && $dataWeapons[itemId]) {
			this.setUniqueEquip($dataWeapons[itemId])
		}
	}

	Game_Weapon.prototype.setUniqueEquip = function(item) {
		Game_UniqueEquip.prototype.setUniqueEquip.call(this, item)
		this.animationId = item.animationId
		this.wtypeId = item.wtypeId
	}

	//-----------------------------------------------------------------------------
	// Game_Armour
	//
	// The game object class for an armour.

	Game_Armour.prototype = Object.create(Game_UniqueEquip.prototype)
	Game_Armour.prototype.constructor = Game_Armour

	Game_Armour.prototype.initialize = function(item) {
		Game_UniqueEquip.prototype.initialize.call(this, item)
	}

	Game_Armour.prototype.setEquip = function(isWeapon, itemId) {
		Game_UniqueEquip.prototype.setEquip.call(this, isWeapon, itemId)
		if (!isWeapon && (itemId > 0) && $dataArmors[itemId]) {
			this.setUniqueEquip($dataArmors[itemId])
		}
	}

	Game_Armour.prototype.setUniqueEquip = function(item) {
		Game_UniqueEquip.prototype.setUniqueEquip.call(this, item)
		this.atypeId = item.atypeId
	}

	/* Game_DvLyon */

	const _Game_DvLyon_initialize = Game_DvLyon.prototype.initialize
	Game_DvLyon.prototype.initialize = function() {
		_Game_DvLyon_initialize.call(this)
		this._uniqueEquipKey = 0
	}

	Game_DvLyon.prototype.getUniqueEquipKey = function() {
		this._uniqueEquipKey++
		return this._uniqueEquipKey
	}

	//=============================================================================
	// Windows
	//=============================================================================

	/* Window_ItemList */

	const _Window_ItemList_needsNumber = Window_ItemList.prototype.needsNumber
	Window_ItemList.prototype.needsNumber = function() {
		if ((this._category === 'weapon') || (this._category === 'armor')) {
			return false
		} else {
			return _Window_ItemList_needsNumber.call(this)
		}
	}

	/* Window_EquipItem */

	Window_EquipItem.prototype.needsNumber = function() {
		return false
	}

})()

//=============================================================================
// Plugin End
//=============================================================================

} else {
	const error = 'DvLyon_UniqueEquips requires DvLyon_Core at the latest version to run.'
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
		if (body && body.uniqueEquips && (body.uniqueEquips.version > DvLyon.UniqueEquips.version)) {
			const text = 'An updated version of DvLyon_UniqueEquips is available at https://dvlyon.com/plugins/uniqueEquips'
			console.info(text)
		}
	})
}

versionChecker()
