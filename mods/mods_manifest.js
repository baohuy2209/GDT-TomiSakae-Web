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
        "id": "allconsoles935_UMEtesttesttesttesttesttest",
        "name": "All The Consoles Mod! (Part 1) 2025 UPDATE!",
        "version": "1.8.8",
        "author": "UME",
        "url": "",
        "description": "[h1][img]https://i.imgur.com/JNDFKWd.png[/img][/h1]\n[i]The OG All The Consoles picture[/i]\n\n\n[b]100+ Consoles Added to Game Dev Tycoon![/b]\n\nWant more variety in your game? This mod expands your experience by adding 100 consoles (even more with Part 2 of the mod!).\n\n[h2]Requirements, Recommendations & Compatibility:[/h2]\n\n[list]\n[*] Requires UltimateLib  \n[*] Due to GDT's limitations, this mod is split into two parts. Subscribe to Part 2 to unlock 75 more consoles!  \n[*] TAG mod overhauls the whole UI and makes the game look modern! Check it out!  \n[*] It's compatible with almost every mod, but I wouldn't recommend adding another mod that also adds more consoles... or using a 10 year old mod for that matter.  \n[/list]\n\n[h2]📜 Update Log:[/h2]\n(2025-03-15)  \n- Remade Units sold (Again) overall increesed the marketshare of most consoles\n- Removed DS lite\n- Added Dendy \n- Fixed better pictures for some consoles\n- Other small fixes\n\n(2025-03-13) \n- Basically remade the whole mod and mod page.\n- Resized all images to fit nicely.  \n- Fixed unit sales numbers to be accurate with GDT's logic (which makes no sense).  \n- Fixed the name of Virtual boy.\n\n(2025-03-12)  \n- Updated all console release & discontinuation dates to align with GDT's unconventional format.  \n\n👉 Full update history in the built-in Steam Changelog!\n\n[h2]📜 Full Console List:[/h2]  \nWant to see all 100+ consoles included in both mods? Check out the full list here:  \n👉 [url=https://docs.google.com/document/d/11zj14A9beMTxvGt5jojbzfZ2XIVKVrXMj981eDLM0eQ/edit?usp=sharing]List[/url]\n\n[h2]🛠️ How to Install:[/h2]\n1️⃣ Subscribe to this mod.  \n2️⃣ Subscribe to All The Consoles Mod [Part 2].  \n3️⃣ Subscribe to UltimateLib.  \n4️⃣ Enable all mods in the mod menu by clicking them (The built in API mod aswell).\n5️⃣ Restart the game to activate the mods and enjoy!  \n\n[h2]📊 What It Took To Make This Mod[/h2]\nThis graph represents the [b]sheer insanity[/b] I went through to make sure every console had [b]accurate release dates and sales numbers so it would make sense with the vanilla consoles[/b].\n\nDid I need to do this? Probably not.  \nDid I do it anyway? Absolutely... Now i can sleep Zzzz\n\n[i]First pic: Sales calculations for irl sales to fit in-game sales. Second pic: Calculations how irl dates compare to in-game dates.[/i]\n[img]https://i.imgur.com/17HT3aF.png[/img]\n[img]https://i.imgur.com/pliXyFc.png[/img]\n\n[h2]💬 Support & Feedback:[/h2]  \nFound a bug or know another console that should be added? Leave a comment below!  \n\n[h2]⭐ Enjoy the Mod? Support It! ⭐[/h2]  \nGive it a thumbs up & favorite!\nI have spent over 100 hours working on this mod, so I would really appreciate it!  \nIt also helps more people find it and keeps updates coming! 🚀  \n\n\n[quote=Yoda]Do or do not, there is no try[/quote]",
        "main": "./main.js",
        "folder": "./mods/allconsoles935",
        "image": "allconsoles2025 kvadrat-Thumbnail.png",
        "dependencies": {
            "gdt-modAPI": "0.1.x",
            "UltimateLib": "1.x.x"
        }
    },
    {
        "id": "AllconsolesII65_UME",
        "name": "All The Consoles Mod! (Part 2) 2025 UPDATE!",
        "version": "0.6.5",
        "author": "UME",
        "url": "",
        "description": "Part 2 of the All The Consoles Mod! Adds 75+ more consoles to Game Dev Tycoon!",
        "main": "./main.js",
        "folder": "./mods/AllconsolesII65",
        "image": "allconsoles2025part2-Thumbnail.png",
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