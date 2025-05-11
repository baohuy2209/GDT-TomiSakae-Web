// mods_manifest.js
var GDT_MOD_MANIFEST = [
    {
        "id": "gdt-modAPI",
        "name": "Game Dev Tycoon Mod API",
        "version": "0.1.2",
        "author": "support@greenheartgames.com",
        "description": "The Official Game Dev Tycoon Mod API which is commonly used by other mods.",
        "main": "modAPI.js",
        "folder": "./mods/gdt-modAPI",
        "image": "./mods/gdt-modAPI/image.png",
        "url": "https://github.com/greenheartgames/gdt-modAPI"
    },
    {
        "id": "UltimateLib",
        "name": "UltimateLib",
        "version": "1.3.3",
        "author": "Francesco Abbattista and Chad Keating",
        "url": "http://forum.greenheartgames.com/t/wip-tools-ultimatesuite-ultimatelib-1-2-0-and-ume-0-2-4-24/9855/",
        "description": "A foundation library on which other mods can be built upon. Some modules will require this library.",
        "main": "UltimateLib.js",
        "folder": "./mods/UltimateLib"
    },
    {
        "id": "CheatMod",
        "name": "CheatMod by kristof1104",
        "version": "1.0.5",
        "author": "kristof1104",
        "url": "https://github.com/kristof1104/CheatMod",
        "description": "A Mod for Game Dev Tycoon which provides users all kind of cheats.",
        "main": "CheatMod.js",
        "folder": "./mods/CheatMod"
    },
    {
        "id": "ExpansionPack",
        "name": "Expansion Pack Mod",
        "version": "1.2.0",
        "author": "DzjengisKhan (Founder & Leader) & LineLiar (Co-Leader)",
        "url": "https://github.com/DzjengisKhan/GDT-Expansion-Pack",
        "description": "The one and only 'Expansion Pack Mod' for Game Dev Tycoon.",
        "main": "ExpansionPack.js",
        "folder": "./mods/ExpansionPack",
        "dependencies": { "UltimateLib": "1.x.x" }
    },
    {
        "id": "Story_Expansion_Mod_2",
        "name": "Story Expansion Mod 2",
        "version": "27.6.24",
        "author": "TheOnlyGaming",
        "url": "",
        "description": "The Sequel to my Story Expansion Mod, featuring new dialogues and Platforms! This version is completely recoded from scratch and has none of the bugs of the original mod This mod is about expanding the story of Game Dev Tycoon, through many new dialogues a",
        "main": "main.js",
        "folder": "./mods/Story_Expansion_Mod_2",
        "image": "Story_Expansion_Mod_2_Logo_2-Thumbnail.png",
        "dependencies": {
            "gdt-modAPI": "0.1.x",
            "UltimateLib": "1.x.x"
        }
    },
    {
        "id": "TAG_Mod",
        "name": "TAG Mod",
        "version": "1.2.7",
        "author": "Bellwood Studios",
        "url": "https://www.bellwoodstudios.com/",
        "description": "TAG MOD CURRENT VERSION: V1.2.5\n\nExperience GDT like never before with this full overhaul of the UI. TAG Mod also adds additional features and insights to give you a more complete picture of your company's operation.",
        "main": "Main.js",
        "folder": "./mods/TAG_Mod",
        "image": "TM-Square-Logo-DM-Thumbnail.png"
    }
    // Thêm các mod khác vào đây
];