// modSupport.js

var ModSupport = {};

ModSupport.availableMods = [];
ModSupport.currentMods = []; // Sẽ chứa ID của các mod được kích hoạt

// Hàm khởi tạo DataStore cho mod nếu chưa có
ModSupport.initModStore = function () {
	if (!window.localStorage.getItem('enabledMods')) {
		window.localStorage.setItem('enabledMods', JSON.stringify([]));
	}
	return JSON.parse(window.localStorage.getItem('enabledMods') || '[]');
};

// Hàm lưu danh sách mod được kích hoạt vào localStorage
ModSupport.saveEnabledMods = function (enabledMods) {
	window.localStorage.setItem('enabledMods', JSON.stringify(enabledMods));
	ModSupport.currentMods = enabledMods;
};

ModSupport.loadMods = function () {
	// Lấy danh sách mod được kích hoạt từ LocalStorage
	var enabledMods = ModSupport.initModStore();
	ModSupport.currentMods = enabledMods;

	// Chỉ tải những mod đã được kích hoạt
	var modsToLoad = ModSupport.availableMods.filter(function (mod) {
		return enabledMods.includes(mod.id);
	}).map(function (mod) {
		mod.active = true;
		return mod.id;
	});

	var i = 0;
	GDT.off(GDT.eventKeys.mod.loaded); // Xóa listener cũ nếu có
	GDT.off(GDT.eventKeys.mod.loadError); // Xóa listener cũ nếu có

	GDT.on(GDT.eventKeys.mod.loaded, function (e) {
		ModSupport.loadMod(modsToLoad, ++i);
	});
	GDT.on(GDT.eventKeys.mod.loadError, function (e) {
		console.error("Lỗi khi tải mod:", e);
		ModSupport.loadMod(modsToLoad, ++i); // Vẫn cố gắng tải mod tiếp theo
	});

	if (modsToLoad.length > 0) {
		ModSupport.loadMod(modsToLoad, i);
	} else {
		// Không có mod nào được kích hoạt
		console.log("Không có mod nào được kích hoạt.");
		GDT.fire({}, GDT.eventKeys.mod.allLoaded);
	}
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
			var scriptPath = mod.folder + '/' + mod.main;
			// Loại bỏ dấu ./ nếu có để đường dẫn tương đối chính xác từ thư mục gốc của index.html
			if (scriptPath.startsWith('./')) {
				scriptPath = scriptPath.substring(2);
			}

			console.log("Đang tải mod: " + mod.name + " từ " + scriptPath);
			GDT.loadJs([scriptPath], function (util) {
				// Mod đã tải thành công
				return;
			}, function (util) {
				var text = 'Không thể tải mod';
				Logger.LogModError(text, util, text + ": " + mod.name);
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

ModSupport.sortMods = function () {
	// Lấy danh sách mod đã được kích hoạt
	var enabledMods = ModSupport.initModStore();

	// Logic sắp xếp dựa trên dependencies
	var modsChecked = [];
	var sortedMods = [];

	// Đánh dấu tất cả các mod đã được kích hoạt
	ModSupport.availableMods.forEach(function (mod) {
		mod.active = enabledMods.includes(mod.id);
		mod.unresolvedDependency = false; // Reset cờ này
	});

	// Xử lý dependencies
	var checkDependencies = function () {
		var hasChanges = false;

		ModSupport.availableMods.forEach(function (mod) {
			if (modsChecked.includes(mod.id)) return;

			if (mod.dependencies && Object.keys(mod.dependencies).length > 0) {
				var allDependenciesChecked = true;
				var hasMissingDependency = false;

				for (var key in mod.dependencies) {
					if (!mod.dependencies.hasOwnProperty(key)) continue;

					// Nếu dependency chưa được xử lý
					if (!modsChecked.includes(key)) {
						allDependenciesChecked = false;
						break;
					}

					// Nếu dependency không tồn tại trong availableMods
					var dependencyMod = ModSupport.availableMods.find(function (m) { return m.id === key; });
					if (!dependencyMod) {
						hasMissingDependency = true;
						mod.unresolvedDependency = true;
						console.error("Mod '" + mod.name + "' có dependency không giải quyết được: " + key);
						break;
					}
				}

				if (allDependenciesChecked && !hasMissingDependency) {
					modsChecked.push(mod.id);
					sortedMods.push(mod);
					hasChanges = true;
				}
			} else {
				// Không có dependencies
				modsChecked.push(mod.id);
				sortedMods.push(mod);
				hasChanges = true;
			}
		});

		return hasChanges;
	};

	// Lặp cho đến khi không còn thay đổi nào
	while (checkDependencies()) { }

	// Thêm các mod còn lại (có thể là dependency vòng tròn hoặc không giải quyết được)
	ModSupport.availableMods.forEach(function (mod) {
		if (!sortedMods.includes(mod)) {
			mod.unresolvedDependency = true; // Đánh dấu là không giải quyết được
			sortedMods.push(mod);
		}
	});

	// Cập nhật lại danh sách mods
	ModSupport.availableMods = sortedMods;

	// Tự động vô hiệu hóa mod có dependency không giải quyết được
	var modsToDisable = [];
	ModSupport.availableMods.forEach(function (mod) {
		if (mod.unresolvedDependency && mod.active) {
			modsToDisable.push(mod.id);
		}
	});

	if (modsToDisable.length > 0) {
		modsToDisable.forEach(function (modId) {
			enabledMods = enabledMods.filter(function (id) { return id !== modId; });
		});

		ModSupport.saveEnabledMods(enabledMods);
		console.warn("Đã vô hiệu hóa " + modsToDisable.length + " mod do thiếu dependencies.");
	}
};

ModSupport.disableMod = function (mod) {
	if (!mod) return false;

	var enabledMods = ModSupport.initModStore();
	var index = enabledMods.indexOf(mod.id);
	if (index !== -1) {
		// Vô hiệu hóa mod chính trước
		enabledMods.splice(index, 1);
		mod.active = false;

		// Danh sách các mod đã vô hiệu hóa (để tránh đệ quy vô hạn)
		var disabledMods = [mod.id];

		// Hàm tìm tất cả các mod phụ thuộc (trực tiếp và gián tiếp)
		var findAllDependentMods = function () {
			var foundNewDeps = false;

			// Duyệt qua tất cả các mod
			ModSupport.availableMods.forEach(function (m) {
				// Bỏ qua nếu mod không active hoặc đã được xử lý
				if (!m.active || disabledMods.includes(m.id)) return;

				// Kiểm tra xem mod có phụ thuộc vào bất kỳ mod nào trong danh sách đã bị vô hiệu hóa
				if (m.dependencies) {
					for (var key in m.dependencies) {
						if (disabledMods.includes(key)) {
							console.log("Tự động vô hiệu hóa mod phụ thuộc: " + m.name);

							// Vô hiệu hóa mod này
							var idx = enabledMods.indexOf(m.id);
							if (idx !== -1) {
								enabledMods.splice(idx, 1);
							}

							m.active = false;
							disabledMods.push(m.id);
							foundNewDeps = true;
							break;
						}
					}
				}
			});

			// Nếu tìm thấy các mod phụ thuộc mới, tiếp tục tìm kiếm
			return foundNewDeps;
		};

		// Tìm tất cả các mod phụ thuộc cho đến khi không còn mod nào phụ thuộc
		while (findAllDependentMods()) { }

		// Lưu danh sách mod đã được kích hoạt
		ModSupport.saveEnabledMods(enabledMods);

		// Hiển thị thông báo nếu đã vô hiệu hóa các mod khác
		if (disabledMods.length > 1) {
			var disabledModNames = disabledMods.map(function (id) {
				var foundMod = ModSupport.availableMods.find(function (m) { return m.id === id; });
				return foundMod ? foundMod.name : id;
			});

			var message = "Đã vô hiệu hóa " + (disabledMods.length - 1) + " mod phụ thuộc: " +
				disabledModNames.slice(1).join(", ");

			console.warn(message);

			// Hiển thị thông báo trực quan cho người dùng nếu có nhiều hơn 1 mod bị vô hiệu hóa
			if (disabledMods.length > 1) {
				var notificationDiv = $("<div class='modDisableNotification' style='position: fixed; bottom: 20px; right: 20px; background-color: #ffcc00; padding: 15px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.3); z-index: 9999; max-width: 400px;'></div>");
				notificationDiv.html("<b>Vô hiệu hóa cả mod phụ thuộc:</b><br>" + disabledModNames.slice(1).join("<br>"));
				$("body").append(notificationDiv);

				// Tự động ẩn thông báo sau 5 giây
				setTimeout(function () {
					notificationDiv.fadeOut(500, function () {
						$(this).remove();
					});
				}, 5000);
			}
		}

		// Cập nhật số lượng mod trong UI
		if (typeof UI !== 'undefined' && UI.populateModsPanel) {
			var totalMods = ModSupport.availableMods.length;
			var activeMods = ModSupport.availableMods.filter(function (mod) { return mod.active; }).length;
			var inactiveMods = totalMods - activeMods;

			$("#modsTotalCount").text(totalMods);
			$("#modsActiveCount").text(activeMods);
			$("#modsInactiveCount").text(inactiveMods);
		}

		return true;
	}

	return false;
};

ModSupport.enableMod = function (mod) {
	if (!mod || mod.unresolvedDependency) return false;

	// Kiểm tra và kích hoạt tất cả các dependencies của mod này trước
	if (mod.dependencies) {
		for (var key in mod.dependencies) {
			if (!mod.dependencies.hasOwnProperty(key)) continue;

			// Tìm mod dependency
			var dependencyMod = ModSupport.availableMods.find(function (m) {
				return m.id === key;
			});

			// Nếu tìm thấy dependency và nó chưa được kích hoạt thì kích hoạt nó
			if (dependencyMod && !dependencyMod.active) {
				console.log("Tự động kích hoạt dependency: " + dependencyMod.name + " cho mod: " + mod.name);
				ModSupport.enableMod(dependencyMod); // Gọi đệ quy để kích hoạt dependency
			}
		}
	}

	// Sau khi kích hoạt tất cả dependencies, kích hoạt mod này
	var enabledMods = ModSupport.initModStore();
	if (!enabledMods.includes(mod.id)) {
		enabledMods.push(mod.id);
		mod.active = true;
		ModSupport.saveEnabledMods(enabledMods);

		// Cập nhật số lượng mod trong UI
		if (typeof UI !== 'undefined' && UI.populateModsPanel) {
			var totalMods = ModSupport.availableMods.length;
			var activeMods = ModSupport.availableMods.filter(function (mod) { return mod.active; }).length;
			var inactiveMods = totalMods - activeMods;

			$("#modsTotalCount").text(totalMods);
			$("#modsActiveCount").text(activeMods);
			$("#modsInactiveCount").text(inactiveMods);
		}

		return true;
	}
	return false;
};

ModSupport.checkMissingMods = function (companyMods, activeMods) {
	var missingMods = [];

	if (!companyMods || companyMods.length === 0) return missingMods;
	if (companyMods.length === 1 && companyMods[0].id === "gdt-modAPI") return missingMods;

	missingMods = companyMods.filter(function (element) {
		return !activeMods.includes(element.id);
	});

	return missingMods;
};

ModSupport.checkAdditionalMods = function (companyMods, activeMods) {
	var additionalMods = [];

	if (!activeMods || activeMods.length === 0) return additionalMods;
	if (activeMods.length === 1 && activeMods[0] === "gdt-modAPI") return additionalMods;

	var companyModIds = companyMods.map(function (mod) { return mod.id; });

	additionalMods = activeMods.filter(function (modId) {
		return !companyModIds.includes(modId) && modId !== "gdt-modAPI";
	}).map(function (modId) {
		return ModSupport.availableMods.find(function (mod) { return mod.id === modId; });
	}).filter(function (mod) { return mod !== undefined; });

	return additionalMods;
};

ModSupport.init = function (callback) {
	// Đọc manifest
	if (typeof GDT_MOD_MANIFEST !== 'undefined') {
		ModSupport.availableMods = GDT_MOD_MANIFEST.map(function (modData) {
			// Xử lý đường dẫn hình ảnh đúng cách
			var imagePath = modData.image;
			if (imagePath && !imagePath.startsWith('http')) {
				// Nếu đường dẫn hình ảnh không phải URL tuyệt đối và không bắt đầu với folder của mod
				if (!imagePath.startsWith(modData.folder)) {
					// Ghép đường dẫn đến thư mục của mod với tên file hình ảnh
					imagePath = modData.folder + "/" + imagePath.replace(/^\.\//, '');
				}
			}

			// Tạo đối tượng mod chuẩn từ manifest
			return {
				id: modData.id,
				name: modData.name,
				version: modData.version,
				author: modData.author,
				description: modData.description,
				main: modData.main,
				folder: modData.folder,
				image: imagePath, // Đường dẫn hình ảnh đã được xử lý
				dependencies: modData.dependencies || {},
				active: false, // Mặc định không active
				unresolvedDependency: false // Khởi tạo
			};
		});

		// Khởi tạo mod đã kích hoạt
		var enabledMods = ModSupport.initModStore();
		ModSupport.currentMods = enabledMods;

		// Nếu chưa có mod nào được kích hoạt, mặc định kích hoạt mod API
		if (enabledMods.length === 0) {
			var modAPI = ModSupport.availableMods.find(function (mod) { return mod.id === "gdt-modAPI"; });
			if (modAPI) {
				enabledMods.push(modAPI.id);
				ModSupport.saveEnabledMods(enabledMods);
			}
		}
	} else {
		console.error("Không tìm thấy GDT_MOD_MANIFEST. Hãy đảm bảo file mods_manifest.js đã được tải.");
		ModSupport.availableMods = [];
		ModSupport.currentMods = [];
	}

	// Sắp xếp các mod dựa trên dependencies 
	ModSupport.sortMods();

	// Cập nhật trạng thái active cho mỗi mod
	var enabledMods = ModSupport.initModStore();
	ModSupport.availableMods.forEach(function (mod) {
		mod.active = enabledMods.includes(mod.id);
	});

	// Tải các mod đã được kích hoạt
	ModSupport.loadMods();

	// Lưu thông tin mod vào company khi save game
	var setActiveModsInfo = function (s) {
		GameManager.company.mods = [];
		ModSupport.availableMods.forEach(function (mod) {
			if (mod.active && !mod.unresolvedDependency) {
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

	// Gọi callback nếu có, sau khi tất cả mod đã được tải
	if (callback) {
		GDT.on(GDT.eventKeys.mod.allLoaded, function () {
			console.log("ModSupport init: Gọi callback sau khi tất cả mod đã tải.");
			callback();
		});
	}
};