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
        "id": "Half-Dragon",
        "name": "More Research Mod. A lot More.",
        "version": "0.1.0",
        "author": "Half Dragon",
        "url": "https://discord.gg/dd4fMpY",
        "description": "The Official Half Dragon Mod. v0.1.0\nThis mod add a lot of research options.\n\n\nEngine:\n\n>8bit Support\n>16bit Support\n>32bit Support\n>64bit Support\n>720p Resolution\n>1080p Resolution\n>2K Resolution\n>4k Resolution\n>Turn-Based\n>Adjustable Fov\n>Pause Menu\n>Split Screen Support\n>Class Selection\n>Race Selection\n>Custom Input\n>Basic Ragdoll\n>Advanced Ragdoll\n>Co-op\n>Automatic Save\n>Occlusion Culling\n>Baked Lighting\n>Skybox\n>Post Processing\n>Particle System\n>Lens Flare\n>PBR Shader\n>Console\n>LOD Group\n>Cloth Physic\n>Basic Baked Ray Tracing\n>Advanced Baked Ray Tracing\n>Ambient Occlusion\n\nGameplay:\n\n>Inventory\n>Competence Tree\n>Dodge Mechanic\n>Wave Mechanic\n>Army Management\n>City Management\n>Block Mechanic\n>Interactive Tutorial\n\nDialogues:\n\n>Roleplay Dialogues\n>Personality Dialogues\n>Funny Dialogues\n\nAi:\n\n>Basic PathFinding\n>Advanced PathFinding\n>AI Soft-Learning\n>AI Mass Control\n>AI Co-op\n\nWorld Design:\n\n>Destructible World\n>Collectable Objects\n>Lifeful World\n>Multiple World\n>Procedural World\n\nSounds:\n\n>Sound Effects\n>Audio Mixer",
        "main": "./modAPI.js",
        "folder": "./mods/More Research Mod. Alot More",
        "image": "icon-full-Thumbnail.png"
    },
    {
        "id": "ABYSSFINANCE",
        "name": "ABYSS Finances (bank, loans, investments and more)",
        "version": "0.2.1",
        "author": "Acuru",
        "url": "",
        "description": "[h1]What this mod do?[/h1]\nMost mod options are avaible throught \"click\" menu -> Bank.\n\n[b]Bank Account[/b]\nYou can deposit money, and intrest every month.\n\nInterest rate will degrade over time - it starts on about 15% (yearly), and decrease to about",
        "main": "./main.js",
        "folder": "./mods/AbyssFinanceMod_0_2_1",
        "image": "aflogo-Thumbnail.png",
        "dependencies": {
            "gdt-modAPI": "0.1.x"
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