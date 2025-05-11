// modSupport.js

var ModSupport = {};

ModSupport.availableMods = [];
ModSupport.currentMods = []; // Sẽ chứa ID của tất cả các mod từ manifest

// ModSupport.modsDescriptionsToLoad = 0; // Không cần biến này nữa

ModSupport.loadMods = function () {
	// Không cần đọc 'enabledMods' từ DataStore vì chúng ta tải tất cả
	var modsToLoad = ModSupport.availableMods.map(function (mod) { return mod.id; }); // Lấy ID của tất cả mod có sẵn

	var i = 0;
	GDT.off(GDT.eventKeys.mod.loaded); // Xóa listener cũ nếu có
	GDT.off(GDT.eventKeys.mod.loadError); // Xóa listener cũ nếu có

	GDT.on(GDT.eventKeys.mod.loaded, function (e) {
		ModSupport.loadMod(modsToLoad, ++i);
	});
	GDT.on(GDT.eventKeys.mod.loadError, function (e) {
		// Có thể thêm xử lý lỗi ở đây nếu muốn dừng lại khi một mod lỗi
		console.error("Lỗi khi tải mod:", e);
		ModSupport.loadMod(modsToLoad, ++i); // Vẫn cố gắng tải mod tiếp theo
	});
	ModSupport.loadMod(modsToLoad, i);
};

ModSupport.loadMod = function (modsToLoadIDs, i) {
	try {
		if (modsToLoadIDs.length > i) {
			var modId = modsToLoadIDs[i];
			var mod = ModSupport.availableMods.find(function (f) {
				return f.id == modId;
			});

			if (!mod) {
				console.error("Không tìm thấy thông tin mod cho ID: " + modId);
				ModSupport.loadMod(modsToLoadIDs, ++i); // Bỏ qua và tải mod tiếp theo
				return;
			}

			// Đường dẫn tới file main của mod sẽ là mod.folder + '/' + mod.main
			// Ví dụ: './mods/CheatModKristof1104/source.js'
			var scriptPath = mod.folder + '/' + mod.main;
			// Loại bỏ dấu ./ nếu có để đường dẫn tương đối chính xác từ thư mục gốc của index.html
			if (scriptPath.startsWith('./')) {
				scriptPath = scriptPath.substring(2);
			}


			console.log("Đang tải mod: " + mod.name + " từ " + scriptPath);
			GDT.loadJs([scriptPath], function (util) { // GDT.loadJs mong đợi một mảng các đường dẫn
				// Mod đã tải thành công, sự kiện GDT.eventKeys.mod.loaded sẽ tự động kích hoạt loadMod tiếp theo
				return;
			}, function (util) {
				var text = 'Không thể tải mod';
				Logger.LogModError(text, util, text + ": " + mod.name);
				// GDT.eventKeys.mod.loadError sẽ được kích hoạt, và loadMod tiếp theo sẽ được gọi
			});
		} else {
			// Tất cả các mod đã được xử lý (tải hoặc lỗi)
			console.log("Đã tải xong tất cả các mod.");
			GDT.fire({}, GDT.eventKeys.mod.allLoaded);
		}
	} catch (e) {
		Logger.LogModError('Lỗi nghiêm trọng khi tải mod: {0}.'.format(modsToLoadIDs[i]), e, "Lỗi nghiêm trọng khi tải mod: {0}.".format(modsToLoadIDs[i]));
		ModSupport.loadMod(modsToLoadIDs, ++i); // Cố gắng tải mod tiếp theo dù có lỗi
	}
};

// sortMods, disableMod, enableMod có thể không cần thiết hoặc cần đơn giản hóa
// vì chúng ta luôn tải tất cả.
ModSupport.sortMods = function () {
	// Vì chúng ta tải tất cả, việc sắp xếp dựa trên enabledMods không còn quá quan trọng.
	// Tuy nhiên, việc kiểm tra dependencies vẫn có thể hữu ích.
	// Nếu không có dependencies phức tạp, có thể bỏ qua hoặc đơn giản hóa hàm này.

	// Logic sắp xếp dựa trên dependencies (nếu bạn vẫn muốn giữ lại)
	var modsChecked = [];
	var checkMod = ModSupport.availableMods.find(function (f) { return !modsChecked.includes(f.id); });

	while (checkMod != undefined) {
		checkMod.unresolvedDependency = false; // Reset cờ này
		if (checkMod.dependencies && Object.keys(checkMod.dependencies).length > 0) {
			var unresolvedDependency = undefined;
			for (var key in checkMod.dependencies) {
				if (checkMod.dependencies.hasOwnProperty(key)) {
					if (!modsChecked.includes(key)) { // Dependency chưa được xử lý
						unresolvedDependency = key;
						// Kiểm tra xem dependency có tồn tại trong availableMods không
						if (!ModSupport.availableMods.find(function (f) { return f.id == key; })) {
							checkMod.unresolvedDependency = true; // Đánh dấu dependency không giải quyết được
							console.error("Mod '" + checkMod.name + "' có dependency không giải quyết được: " + key);
							// Với web tĩnh, chúng ta không thể tự động vô hiệu hóa, chỉ cảnh báo
						}
						break; // Dừng kiểm tra dependencies cho mod này
					}
				}
			}
			if (unresolvedDependency == undefined) { // Tất cả dependencies đã được xử lý
				modsChecked.push(checkMod.id);
			} else if (!checkMod.unresolvedDependency) { // Có dependency chưa xử lý nhưng vẫn tồn tại
				// Đẩy mod này về sau để xử lý dependency của nó trước
				var currentIndex = ModSupport.availableMods.indexOf(checkMod);
				ModSupport.availableMods.splice(currentIndex, 1); // Xóa khỏi vị trí hiện tại
				ModSupport.availableMods.push(checkMod); // Thêm vào cuối để thử lại sau
				// Cần cơ chế tránh lặp vô hạn nếu có dependency vòng tròn
			} else { // Dependency không giải quyết được
				modsChecked.push(checkMod.id); // Vẫn thêm vào đã check để tránh lặp vô hạn
			}
		} else { // Không có dependencies
			modsChecked.push(checkMod.id);
		}
		checkMod = ModSupport.availableMods.find(function (f) { return !modsChecked.includes(f.id); });
	}
	// Sắp xếp lại availableMods theo thứ tự đã check (đã giải quyết dependency)
	var sortedMods = [];
	modsChecked.forEach(function (id) {
		var mod = ModSupport.availableMods.find(function (m) { return m.id === id; });
		if (mod) sortedMods.push(mod);
	});
	// Thêm các mod còn lại (có thể là dependency vòng tròn hoặc chưa xử lý được)
	ModSupport.availableMods.forEach(function (mod) {
		if (!sortedMods.includes(mod)) sortedMods.push(mod);
	});
	ModSupport.availableMods = sortedMods;
};

ModSupport.disableMod = function (mod) {
	// Không làm gì cả, vì chúng ta luôn tải tất cả mod
	console.warn("Chức năng disableMod không hoạt động khi tự động tải tất cả mod.");
};

ModSupport.enableMod = function (mod) {
	// Không làm gì cả, vì chúng ta luôn tải tất cả mod
	console.warn("Chức năng enableMod không hoạt động khi tự động tải tất cả mod.");
};

ModSupport.checkMissingMods = function (companyMods, activeMods) {
	// Không còn ý nghĩa nhiều vì chúng ta tải tất cả
	return [];
};

ModSupport.checkAdditionalMods = function (companyMods, activeMods) {
	// Không còn ý nghĩa nhiều
	return [];
};

ModSupport.init = function (callback) { // Thêm callback để báo hiệu ModSupport đã sẵn sàng
	// Đọc manifest
	if (typeof GDT_MOD_MANIFEST !== 'undefined') {
		ModSupport.availableMods = GDT_MOD_MANIFEST.map(function (modData) {
			// Tạo đối tượng mod chuẩn từ manifest
			return {
				id: modData.id,
				name: modData.name,
				version: modData.version,
				author: modData.author,
				description: modData.description,
				main: modData.main,
				folder: modData.folder, // Đường dẫn này sẽ được sử dụng để tải file main
				image: modData.image,
				dependencies: modData.dependencies || {},
				active: true, // Mặc định tất cả là active
				unresolvedDependency: false // Khởi tạo
			};
		});
		ModSupport.currentMods = ModSupport.availableMods.map(function (mod) { return mod.id; });
	} else {
		console.error("Không tìm thấy GDT_MOD_MANIFEST. Hãy đảm bảo file mods_manifest.js đã được tải.");
		ModSupport.availableMods = [];
		ModSupport.currentMods = [];
	}

	// Sắp xếp các mod dựa trên dependencies (nếu có)
	ModSupport.sortMods();

	// Tải tất cả các mod đã được đánh dấu active (tức là tất cả mod từ manifest)
	ModSupport.loadMods(); // Không cần truyền callback vào đây nữa vì loadMods sẽ gọi allLoaded

	// Lưu thông tin mod vào company khi save game
	var setActiveModsInfo = function (s) {
		GameManager.company.mods = [];
		ModSupport.availableMods.forEach(function (mod) { // Duyệt qua availableMods vì tất cả đều active
			if (mod.active && !mod.unresolvedDependency) { // Chỉ lưu những mod thực sự được tải
				GameManager.company.mods.push({
					id: mod.id,
					name: mod.name,
					author: mod.author,
					version: mod.version
				});
			}
		});
	};
	GDT.on(GDT.eventKeys.saves.saving, setActiveModsInfo);

	// Gọi callback nếu có, sau khi tất cả mod đã được tải (thông qua sự kiện allLoaded)
	if (callback) {
		GDT.on(GDT.eventKeys.mod.allLoaded, function () {
			console.log("ModSupport init: Gọi callback sau khi tất cả mod đã tải.");
			callback();
		});
	}
};