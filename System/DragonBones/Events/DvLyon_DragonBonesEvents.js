"use strict";

//=============================================================================
// DvLyon
// RPG Maker MZ - DvLyon_DragonBonesEvents.js
//=============================================================================

var DvLyon = DvLyon || {};
DvLyon.DragonBonesEvents = DvLyon.DragonBonesEvents || {};
DvLyon.DragonBonesEvents.version = 1;
DvLyon.DragonBonesEvents._isLoaded = false;

//=============================================================================
 /*:
 * @plugindesc v1.00 DragonBones Integration with YEP library compatibility!
 * Use DragonBones assets with your battlers!
 * @author Yanfly Engine Plugins + TheGreenKel Collaboration
 *
 * @param Replace Battler Sprite
 * @type boolean
 * @on Replace
 * @off Keep
 * @desc Fully replace the battler's sprite if it has an associated
 * DragonBones asset? REPLACE - true     KEEP - false
 * @default true
 *
 * @param Default ScaleX
 * @type number
 * @decimals 1
 * @desc The default amount to scale a DragonBones battler's X property.
 * @default 0.5
 *
 * @param Default ScaleY
 * @type number
 * @decimals 1
 * @desc The default amount to scale a DragonBones battler's Y property.
 * @default 0.5
 *
 * @param Default Width
 * @type number
 * @desc The default amount to set a DragonBones battler's width.
 * @default 100
 *
 * @param Default Height
 * @type number
 * @desc The default amount to scale a DragonBones battler's height.
 * @default 100
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * DragonBones allows your games to use skeletal animation, a type of computer
 * animation in which a character (or object) is represented by skins/textures
 * and a digital set of interconnected bones (called the skeleton). Using a set
 * of instructions, the game will create animations based off these skins,
 * skeletons, and instructions to create beautifully smooth and light-weight
 * movements.
 *
 * This plugin, made by TheGreenKel, and collaborated with Yanfly, will allow
 * you to use skeletal animations made by DragonBones for your battle system!
 * This means that with skeletal animation, you can make your battles look
 * extremely fluid, more flexible animations outside of only 3 frames per
 * motion, more than 18 possible motions, get rid of sprite based resources for
 * faster loading times, and smaller file sizes for your games! In other words,
 * there's practically no drawback to using it provided you have the resources.
 *
 * This is a collaboration plugin by TheGreenKel and Yanfly to ensure
 * compatibility with the Yanfly Engine Plugins library.
 *
 * ============================================================================
 * MIT License and Terms of Use
 * ============================================================================
 *
 * MIT License for the remaining code of the Plugin
 *
 * Copyright 2017 TheGreenKel
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * Yanfly Engine Plugins Terms of Use
 *
 * Any original material made by Yanfly is free for use with both free and
 * commercial RPG Maker games unless specified otherwise. I do not demand
 * royalties or special liberties if you choose to use Yanfly original content
 * in your commercial games. (Although a free copy of your game would be nice!)
 * I only ask that you provide 'Yanfly' or 'Yanfly Engine' a spot in your
 * game’s credits.
 *
 * Any edits made to Yanfly original material are okay as long as you still
 * provide the proper credit. Any non-Original content posted, linked, or
 * shared on my website and channel will still require you to contact the
 * respective parties for permission of use.
 *
 * ============================================================================
 * Installation Instructions
 * ============================================================================
 *
 * Follow these instructions to integrate DragonBones into your game:
 *
 * 1. Make sure you have at least RPG Maker MV version 1.4.0 or above.
 *    Recommended version is 1.5.0 and above!
 *
 * 2. Download the Installation Pack from DvLyon.moe or from:
 *    https://thegreenkel.itch.io/dragonbones-rpg-maker-mv-plugin
 *
 * 3. Extract the Installation Pack using WinZip or WinRar.
 *
 * 4. Copy the contents of the 'js' folder into your project's folder matching
 *    the directory structure and files.
 *
 * 5. Open up your game project's index.html file with Notepad/HTML editor
 *
 * 6. Find <script type="text/javascript" src="js/libs/pixi-picture.js">
 *    and insert the following lines under it:
 *
 * <script type="text/javascript" src="js/libs/dragonbones/dragonBones.js"></script>
 * <script type="text/javascript" src="js/libs/dragonbones/dragonBonesPixi.js"></script>
 *
 * 7. Install this plugin by adding it through your Plugin Manager.
 *
 * 8. Make sure this plugin is located UNDER the following plugins:
 *      YEP_BattleEngineCore
 *      YEP_X_ActSeqPack1
 *      YEP_X_ActSeqPack2
 *      YEP_X_ActSeqPack3
 *      YEP_X_AnimatedSVEnemies
 *
 * 9. Copy the DragonBone assets from the Installation pack into the respective
 *    folder you wish for your game project. Adjust the 'Assets Path' plugin
 *    parameter to match the folder path.
 *
 * 10. Save your game project!
 *
 * ============================================================================
 * General Usage by TheGreenKel
 * ============================================================================
 *
 * The plugin is only tested on DragonBones 5.2 & 5.3. I rewrote a chunk of the
 * plugin to make it compatible with Yanfly plugins, and possibly more.
 *
 * Usage:    
 *     1) After confirming your DragonBones Armature/Skeleton shares the name
 *        of your Battler, export DragonBones data into the 'Assets Path'
 *        parameter. Default is 'dragonbones_assets'
 * 
 *     2) Add the new armature data into 'Preload Assets' parameter
 * 
 *     3) This plugin will automatically look for the 18 default 
 *        animations inside the dragonbones armature. 
 *        [walk, swing, damage, dead, wait, chant, guard, etc.]
 * 
 *     4) You can overwrite default animation by using 
 *        'dragonbone_ani_' notes.  
 *        Example: 'dragonbone_ani_walk:steady', the 'steady' animation 
 *        will be played inplace of the 'walk'
 * 
 *     5) Vanilla actor/enemies now show up by default.  You need to 
 *        replace it with a blank image.  Check the demo project to see
 *        what a blank image would look like.  This change will make this
 *        plugin more compatible with plugins that changes UI.
 *          
 *     6) If you are using Yanfly Action Sequence 2, you can now play any 
 *        dragonbones' animation using the 'motion' command.
 *        Example: "motion dance".  The game will look into the dragonbones
 *        armature to see if it has the 'dance' animation.  If the animation 
 *        is there then the animation will be played.
 * 
 *     7) You can now control whether an animation is looping or not 
 *        by setting the 'Play Times' variable inside the Dragonbones Editor.
 *  
 *     8) Get more info/tutorial at forum link: 
 *        https://forums.rpgmakerweb.com/index.php?threads/rmmv-dragonbones-2d-animation-integration.81027/
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Use the following notetags to make full use of your DragonBone battler
 * integration for your RPG Maker MV game!
 *
 * Actor and Enemy Notetags:
 *
 *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <DragonBone: name>
 *   <DragonBone Battler: name>
 *   - Sets the DragonBones associated with this actor/enemy to be "name". The
 *   name will be associated with the assets used. It will be used to check for
 *   associated filenames that end with _ske.json, _tex.json, and _tex.png. The
 *   listed assets must be found in your assets folder.
 *
 *   * Note: The name is case sensitive.
 *
 *   **EXAMPLES**
 *
 *   <DragonBone: Demon>
 *   <DragonBone: DragonBoy>
 *   <DragonBone: Swordsman>
 *   <DragonBone: Ubbie>
 *
 *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   If a DragonBones battler is not detected here, it will not be able to
 *   utilize the following notetags and their effects.
 *
 *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <DragonBone ScaleX: n>
 *   <DragonBone ScaleY: n>
 *   - Replace 'n' with a number. It can be positive or negative, whole or
 *   decimal number. This will affect how much the battler will be scaled by.
 *   A number less than 1 will be smaller than the base asset itself while a
 *   number larger than 1 will be larger than the base asset. If the number is
 *   negative, it will be mirrored horizontally or vertically depending if
 *   ScaleX or ScaleY is used respectively.
 *
 *   * Note: This will overwrite the setting set in the plugin parameters for
 *   'Default ScaleX' and 'Default ScaleY'.
 * 
 *   **EXAMPLES**
 *
 *   <DragonBone ScaleX: -0.3>
 *   <DragonBone ScaleY: 0.3>
 *
 *   <DragonBone ScaleX: 1.2>
 *   <DragonBone ScaleY: 1.2>
 *
 *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <DragonBone Width: x>
 *   <DragonBone Height: x>
 *   - This allows you to set the 'width' and 'height' of the DragonBones
 *   battler by replacing 'x' with an integar value. This value is mostly used
 *   for collision purposes as well as mouse click activation. These values can
 *   be adjusted because each battler can be a dynamic width/height so it is
 *   important for you to adjust them properly. If not adjusted, they will take
 *   on the default width/height values found in the plugin parameters.
 *
 *   **EXAMPLES**
 *
 *   <DragonBone Width: 150>
 *   <DragonBone Height: 180>
 *
 *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <DragonBone Keep Sprite>
 *   <DragonBone Replace Sprite>
 *   - Lets you decide if you want to keep the original sprite used for the
 *   actor/enemy or have the DragonBone battler replace it altogether. If you
 *   opt to replace the sprite, then the sprite will be hidden during battle
 *   as long as there is a DragonBone battler in place of it.
 *
 *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <DragonBone Ani motion: animation>
 *   - Replace 'motion' with a proper battler motion name. 'animation' is to be
 *   replaced with a skeletal animation name from DragonBones. This is for any
 *   motion that doesn't have a specified skeletal animation of the same name
 *   in DragonBones.
 *
 *   Replace 'motion' with one of the following:
 *                  attack
 *     walk         thrust        escape
 *     wait         swing         victory
 *     chant        missile       dying
 *     guard        skill         abnormal
 *     damage       spell         sleep
 *     evade        item          dead
 *
 *   * Note: The 'animation' to be replaced is case sensitive.
 *
 *   **EXAMPLES**
 *
 *   <DragonBone Ani Attack: normalAttack>
 *   <DragonBone Ani Walk: steady>
 *   <DragonBone Ani Damage: hit>
 *   <DragonBone Ani Dead: dead>
 *   <DragonBone Ani Wait: steady>
 *   <DragonBone Ani Chant: stun>
 *   <DragonBone Ani Swing: stun>
 *   <DragonBone Ani Evade: stun>
 *   <DragonBone Ani Thrust: stun>
 *   <DragonBone Ani Missile: stun>
 *   <DragonBone Ani Skill: stun>
 *   <DragonBone Ani Spell: stun>
 *   <DragonBone Ani Item: stun>
 *   <DragonBone Ani Victory: stun>
 *   <DragonBone Ani Dying: stun>
 *   <DragonBone Ani Abnormal: stun>
 *   <DragonBone Ani Sleep: stun>
 *
 *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   For those who want a more condensed way to adjust the DragonBone battler
 *   settings, you can use the following notetag format:
 *
 *   <DragonBone Settings>
 *    Battler: name             // The name used for the DB battler
 *    
 *    ScaleX: 0.3               // Scale X used for the DB battler
 *    ScaleY: 0.3               // Scale Y used for the DB battler
 *    Width: 150                // Width used for the DB battler
 *    Height: 180               // Height used for the DB battler
 *
 *    // Below are a bunch of battler motions tied to skeletal animations
 *
 *    Ani Attack: normalAttack
 *    Ani Walk: steady
 *    Ani Damage: hit
 *    Ani Dead: dead
 *    Ani Wait: steady
 *    Ani Chant: stun
 *    Ani Swing: stun
 *    Ani Evade: stun
 *    Ani Thrust: stun
 *    Ani Missile: stun
 *    Ani Skill: stun
 *    Ani Spell: stun
 *    Ani Item: stun
 *    Ani Victory: stun
 *    Ani Dying: stun
 *    Ani Abnormal: stun
 *    Ani Sleep: stun
 *    
 *    Keep Sprite             // Allow the sprite to show alongside DB battler
 *    Replace Sprite          // Hide the sprite while the DB battler is active
 *   </DragonBone Settings>
 *
 *   - Anything placed in between the notetags: <DragonBone Settings> and
 *   </DragonBone Settings> will be used to determine the properties set for
 *   the DragonBone battler used for the actor/enemy. With the exception of the
 *   'name' property, all other properties are optional and can be omitted from
 *   the list of properties to sandwich inbetween your notetags.
 *
 *   **EXAMPLES**
 *
 *   <DragonBone Settings>
 *    Battler: Ubbie
 *    Replace Sprite
 *    ScaleX: -0.2
 *    ScaleY: 0.2
 *    Width: 150
 *    Height: 100
 *   </DragonBone Settings>
 *
 *   <DragonBone Settings>
 *    Battler: Demon
 *    Replace Sprite
 *    ScaleX: 0.3
 *    ScaleY: 0.3
 *    Width: 140
 *    Height: 140
 *   </DragonBone Settings>
 *
 *   <DragonBone Settings>
 *    Battler: Swordsman
 *    Replace Sprite
 *    ScaleX: -0.4
 *    ScaleY: 0.4
 *    Width: 150
 *    Height: 180
 *   </DragonBone Settings>
*/

//=============================================================================
// Plugin Start
//=============================================================================

(function() {

    dragonBonesIntegration.ArmatureDatabaseEvent = []

    //=============================================================================
	// Parameters
	//=============================================================================

    DvLyon.DragonBonesEvents.Parameters = PluginManager.parameters('DvLyon_DragonBonesEvents')

    dragonBonesIntegration.ReplaceBattleSprite = JSON.parse(DvLyon.DragonBonesEvents.Parameters['Replace Battler Sprite'])
    dragonBonesIntegration.DefaultScaleX = Number(DvLyon.DragonBonesEvents.Parameters['Default ScaleX'])
    dragonBonesIntegration.DefaultScaleY = Number(DvLyon.DragonBonesEvents.Parameters['Default ScaleY'])
    dragonBonesIntegration.DefaultWidth = Number(DvLyon.DragonBonesEvents.Parameters['Default Width'])
    dragonBonesIntegration.DefaultHeight = Number(DvLyon.DragonBonesEvents.Parameters['Default Height'])

    //=============================================================================
	// Managers
	//=============================================================================

    // DataManager

    const _DataManager_isMapLoaded = DataManager.isMapLoaded
    DataManager.isMapLoaded = function() {
        if (_DataManager_isMapLoaded.call(this)) {
            if (!DvLyon.DragonBonesEvents._isLoaded) {
                for (const event of $dataMap.events) {
                    if (event) {
                        const pages = event.pages
                        event.meta.dragonbones = []
                        for (let i = 0; i < pages.length; i++) {
                            event.meta.dragonbones.push({})
                            const page = pages[i]
                            for (const item of page.list) {
                                if (item.code === 108 || item.code === 408) {
                                    for (const parameter of item.parameters) {
                                        const params = parameter.split(":")
                                        if (params[1]) {
                                            event.meta.dragonbones[i][params[0].trim()] = params[1].trim()
                                        }
                                    }
                                }
                            }
                        }

                        for (const dragonBoneData of event.meta.dragonbones) {
                            const asset = dragonBoneData.dragonbone
                            if (asset && !dragonBonesIntegration.AssetsArray.contains(asset)) {
                                dragonBonesIntegration.AssetsArray.push(asset)
                            }
                        }
                    }
                }

                dragonBonesIntegration.PreLoadAllArmatures()
                DvLyon.DragonBonesEvents._isLoaded = true

                return false
            }

            if (dragonBonesIntegration.bIsPreloading) {
                return false
            }

            return true
        }

        return false
    }

    //=============================================================================
	// Objects
	//=============================================================================

    // Game_Event

    const _Game_Event_initialize = Game_Event.prototype.initialize
    Game_Event.prototype.initialize = function(mapId, eventId) {
        this._setupNewDragonBones = false
        _Game_Event_initialize.call(this, mapId, eventId)
    }

    const _Game_Event_setupPage = Game_Event.prototype.setupPage
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.call(this)
        if (this._pageIndex >= 0) {
            this._setupNewDragonBones = true
        }
    }

    //=============================================================================
	// Sprites
	//=============================================================================

    // Sprite_Character

    const _Sprite_Character_initialize = Sprite_Character.prototype.initialize
    Sprite_Character.prototype.initialize = function(character) {
        this.dragonBoneIndex = -1
        this.dragonboneAnimation = {}
        _Sprite_Character_initialize.call(this, character)
    }

    const _Sprite_Character_update = Sprite_Character.prototype.update
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this)

        if (this._character._eventId) {
            if (this._character._setupNewDragonBones) {
                this._character._setupNewDragonBones = false
                this.dragonBoneData = this._character.event().meta.dragonbones[this._character._pageIndex]
                this.setUpDragonBones()
            }

            if (this.dragonBoneIndex >= 0) {
                const scaleX = this.dragonBoneData.dragonbone_scalex || dragonBonesIntegration.DefaultScaleX
                if (this._character.direction() === 6) {
                    dragonBonesIntegration.ArmatureDatabaseEvent[this.dragonBoneIndex].scale.x = scaleX
                } else if (this._character.direction() === 4) {
                    dragonBonesIntegration.ArmatureDatabaseEvent[this.dragonBoneIndex].scale.x = -scaleX
                }

                const page = this._character.page()
                const armature = dragonBonesIntegration.ArmatureDatabaseEvent[this.dragonBoneIndex]
                if (armature.animation.isCompleted || !armature.animation.lastAnimationName) {
                    if (page.walkAnime && this._character.isMoving()) {
                        dragonBonesIntegration.PlayAnimationOnEvent(this, "walk")
                    } else if (page.stepAnime) {
                        dragonBonesIntegration.PlayAnimationOnEvent(this, "wait")
                    }
                }
            }
        }
    }

    const _Sprite_Character_patternWidth = Sprite_Character.prototype.patternWidth
    Sprite_Character.prototype.patternWidth = function() {
        if (this.dragonBoneIndex >= 0) {
            return 0
        } else {
            return _Sprite_Character_patternWidth.call(this)
        }
    }
    
    const _Sprite_Character_patternHeight = Sprite_Character.prototype.patternHeight
    Sprite_Character.prototype.patternHeight = function() {
        if (this.dragonBoneIndex >= 0) {
            return 0
        } else {
            return _Sprite_Character_patternHeight.call(this)
        }
    }

    Sprite_Character.prototype.setUpDragonBones = function() {
        const eventId = this._character._eventId
        this.dragonBoneIndex = -1

        if (dragonBonesIntegration.ArmatureDatabaseEvent[eventId]) {
            dragonBonesIntegration.ArmatureDatabaseEvent[eventId].dispose()
        }
        
        const armatureName = this.dragonBoneData.dragonbone
        if (armatureName) {
            dragonBonesIntegration.ArmatureDatabaseEvent[eventId] = dragonBonesIntegration.CreateArmature(armatureName, 0, 0)

            if (dragonBonesIntegration.ArmatureDatabaseEvent[eventId]) {
                this.dragonBoneIndex = eventId
                this.dragonboneAnimation = {}

                for (const key in this.dragonBoneData) {
                    if (this.dragonBoneData.hasOwnProperty(key)) {
                        const animationIndex = key.split("dragonbone_ani_")
                        if (animationIndex[1]) {
                            this.dragonboneAnimation[animationIndex[1]] = this.dragonBoneData[key]
                        }
                    }
                }

                const scaleX = this.dragonBoneData.dragonbone_scalex || dragonBonesIntegration.DefaultScaleX
                const scaleY = this.dragonBoneData.dragonbone_scaley || dragonBonesIntegration.DefaultScaleX
                
                if (scaleX) {
                    dragonBonesIntegration.ArmatureDatabaseEvent[eventId].scale.x = scaleX
                }
                if (scaleY) {
                    dragonBonesIntegration.ArmatureDatabaseEvent[eventId].scale.y = scaleY
                }
    
                this.addChild(dragonBonesIntegration.ArmatureDatabaseEvent[eventId])
            }
        }
    }

    //=============================================================================
	// Utils
	//=============================================================================

    dragonBonesIntegration.PlayAnimationOnEvent = function(event, aniName) {
        const armature = dragonBonesIntegration.ArmatureDatabaseEvent[event.dragonBoneIndex]

        let cmd = aniName.toLowerCase()
        const dragonBoneAniName = event.dragonboneAnimation[cmd]
        if (dragonBoneAniName) {
            cmd = dragonBoneAniName
        }

        if (armature.animation.animationNames.contains(cmd)) {
            armature.animation.play(cmd)
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
		if (body && body.dragonBonesEvents && (body.dragonBonesEvents.version > DvLyon.DragonBonesEvents.version)) {
			const text = 'An updated version of DvLyon_DragonBonesEvents is available at https://dvlyon.com/rmmz/plugins/dragonBonesEvents'
			console.info(text)
		}
	})
}

// versionChecker()
