"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_UniqueEquips.js
//=============================================================================

var DvLyon = DvLyon || {};
DvLyon.UniqueEquips = DvLyon.UniqueEquips || {};
DvLyon.UniqueEquips.version = 1;

/*:
@target MZ
@base DvLyon_Core
@orderAfter DvLyon_Core
@plugindesc Unique Equips
@author DvLyon
@url https://dvlyon.com
@help
== Description ==

Visit https://dvlyon.com/rmmz/plugins/uniqueEquips

== License ==

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

== Support ==

Crediting DvLyon.com in your games is much appreciated!

Follow us on socials:
@dvlyon on Twitter, Instagram, Twitch, TikTok and more!
*/

//=============================================================================
// Declarations
//=============================================================================

function Game_DvLyonUniqueEquip() {
    this.initialize(...arguments)
}

function Game_DvLyonWeapon() {
    this.initialize(...arguments)
}

function Game_DvLyonArmour() {
    this.initialize(...arguments)
}

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

    // DataManager

    const _DataManager_isWeapon = DataManager.isWeapon
    DataManager.isWeapon = function(item) {
        return _DataManager_isWeapon.call(this, item) || (item && item._weaponId > 0)
    }
    
    const _DataManager_isArmor = DataManager.isArmor
    DataManager.isArmor = function(item) {
        return _DataManager_isArmor.call(this, item) || (item && item._armourId > 0)
    }

	//=============================================================================
	// Objects
	//=============================================================================

    //-----------------------------------------------------------------------------
	// Game_DvLyonUniqueEquip
	//
	// The superclass of Game_DvLyonWeapon and Game_DvLyonArmour.

    Game_DvLyonUniqueEquip.prototype.initialize = function() {
        this._uniqueEquipId = $gameDvLyon.getNextUniqueEquipId()
        this._weaponId = 0
        this._armourId = 0
	}

    Game_DvLyonUniqueEquip.prototype.object = function() {
        return {
            ...this.uniqueObject(),
            _uniqueEquipId: this._uniqueEquipId,
            _weaponId: this._weaponId,
            _armourId: this._armourId
        }
	}

    Game_DvLyonUniqueEquip.prototype.uniqueObject = function() {
        return { ...this.baseObject() }
	}

    //-----------------------------------------------------------------------------
	// Game_DvLyonWeapon
	//
	// The game object class for an unique weapon.

    Game_DvLyonWeapon.prototype = Object.create(Game_DvLyonUniqueEquip.prototype)
    Game_DvLyonWeapon.prototype.constructor = Game_DvLyonWeapon

    Game_DvLyonWeapon.prototype.initialize = function(itemId) {
        Game_DvLyonUniqueEquip.prototype.initialize.call(this)
        this._weaponId = itemId
	}

    Game_DvLyonWeapon.prototype.baseObject = function() {
        return $dataWeapons[this._weaponId]
	}

    //-----------------------------------------------------------------------------
	// Game_DvLyonArmour
	//
	// The game object class for an unique armour.

    Game_DvLyonArmour.prototype = Object.create(Game_DvLyonUniqueEquip.prototype)
    Game_DvLyonArmour.prototype.constructor = Game_DvLyonArmour

    Game_DvLyonArmour.prototype.initialize = function(itemId) {
        Game_DvLyonUniqueEquip.prototype.initialize.call(this)
        this._armourId = itemId
	}

    Game_DvLyonArmour.prototype.baseObject = function() {
        return $dataArmors[this._armourId]
	}

    // Game_DvLyon

    const _Game_DvLyon_initialize = Game_DvLyon.prototype.initialize
    Game_DvLyon.prototype.initialize = function() {
		_Game_DvLyon_initialize.call(this)
        this._nextUniqueEquipId = 0
        this._uniqueEquips = []
	}

    Game_DvLyon.prototype.getNextUniqueEquipId = function() {
        return this._nextUniqueEquipId++
    }

    Game_DvLyon.prototype.uniqueEquips = function() {
		return this._uniqueEquips.map(uE => uE.object())
	}

    Game_DvLyon.prototype.weapons = function() {
		return this._uniqueEquips.map(uE => uE._weaponId > 0)
	}

    Game_DvLyon.prototype.armours = function() {
		return this._uniqueEquips.map(uE => uE._armourId > 0)
	}

    Game_DvLyon.prototype.getUniqueEquip = function(uniqueEquipId) {
        return this._uniqueEquips.find(ue => ue._uniqueEquipId === uniqueEquipId)
    }

    Game_DvLyon.prototype.gainUniqueEquip = function(isWeapon, itemId) {
        let uniqueEquip = isWeapon ? new Game_DvLyonWeapon(itemId) : new Game_DvLyonArmour(itemId)
        this._uniqueEquips.push(uniqueEquip)
	}

    Game_DvLyon.prototype.loseUniqueEquip = function(uniqueEquipId) {
        const index = this._uniqueEquips.findIndex(ue => ue._uniqueEquipId === uniqueEquipId)
        this._uniqueEquips.splice(index, 1)
    }

    // Game_Actor

    Game_Actor.prototype.initEquips = function(equips) {
        const slots = this.equipSlots()
        const maxSlots = slots.length
        this._equips = []
        for (let i = 0; i < maxSlots; i++) {
            if (equips[i]) {
                if (slots[i] === 1) {
                    this._equips.push(new Game_DvLyonWeapon(equips[i]))
                } else {
                    this._equips.push(new Game_DvLyonArmour(equips[i]))
                }
            } else {
                this._equips.push(null)
            }
        }
        this.releaseUnequippableItems(true)
        this.refresh()
    }

    Game_Actor.prototype.equips = function() {
        return this._equips.map(item => item ? item.object() : null)
    }

    Game_Actor.prototype.changeEquip = function(slotId, item) {
        const newItem = item ? $gameDvLyon.getUniqueEquip(item._uniqueEquipId) : null
        if (this.tradeItemWithParty(item, this.equips()[slotId]) && (!item || this.equipSlots()[slotId] === item.etypeId)) {
            this._equips[slotId] = newItem
            this.refresh()
        }
    }
    
    Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
        this._equips[slotId] = item ? $gameDvLyon.getUniqueEquip(item._uniqueEquipId) : null
        this.releaseUnequippableItems(true)
        this.refresh()
    }

    // Game_Party

    Game_Party.prototype.weapons = function() {
        return $gameDvLyon.weapons()
    }
    
    Game_Party.prototype.armors = function() {
        return $gameDvLyon.armours()
    }

    Game_Party.prototype.equipItems = function() {
        return $gameDvLyon.uniqueEquips()
    }

    const _Game_Party_numItems = Game_Party.prototype.numItems
    Game_Party.prototype.numItems = function(item) {
        if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            return !!$gameDvLyon.getNextUniqueEquipId(item._uniqueEquipId) ? 1 : 0
        } else {
            return _Game_Party_numItems.call(this, item)
        }
    }

    const _Game_Party_hasItem = Game_Party.prototype.hasItem
    Game_Party.prototype.hasItem = function(item, includeEquip) {
        if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            return !!$gameDvLyon.getNextUniqueEquipId(item._uniqueEquipId)
        } else {
            return _Game_Party_hasItem.call(this, item, includeEquip)
        }
    }

    const _Game_Party_gainItem = Game_Party.prototype.gainItem
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        if (amount < 0 && (DataManager.isWeapon(item) || DataManager.isArmor(item)) && item._uniqueEquipId) {
            $gameDvLyon.loseUniqueEquip(item._uniqueEquipId)
            $gameMap.requestRefresh()
        } else if (DataManager.isWeapon(item)) {
            for (let i = 0; i < amount; i++) {
                $gameDvLyon.gainUniqueEquip(true, item.id)
            }
            $gameMap.requestRefresh()
        } else if (DataManager.isArmor(item)) {
            for (let i = 0; i < amount; i++) {
                $gameDvLyon.gainUniqueEquip(false, item.id)
            }
            $gameMap.requestRefresh()
        } else {
            _Game_Party_gainItem.call(this, item, amount, includeEquip)
        }
    }

    //=============================================================================
	// Windows
	//=============================================================================

    // Window_ItemList

    const _Window_ItemList_needsNumber = Window_ItemList.prototype.needsNumber
    Window_ItemList.prototype.needsNumber = function() {
        if (this._category === "weapon" || this._category === "armor") {
            return false
        } else {
            return _Window_ItemList_needsNumber.call(this)
        }
    }

    // Window_EquipItem

    Window_EquipItem.prototype.needsNumber = function() {
        return false
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
		if (body && body.uniqueEquips && (body.uniqueEquips.version > DvLyon.UniqueEquips.version)) {
			const text = 'An updated version of DvLyon_UniqueEquips is available at https://dvlyon.com/rmmz/plugins/uniqueEquips'
			console.info(text)
		}
	})
}

versionChecker()
