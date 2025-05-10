"use strict";
// Module Sales chịu trách nhiệm quản lý tất cả logic liên quan đến doanh thu,
// tính toán doanh số bán hàng, các yếu tố ảnh hưởng đến doanh số như vi phạm bản quyền,
// giá cả, và các sự kiện bán hàng đặc biệt.
var Sales = {};
(function () {
    // --- ĐỊNH NGHĨA GIÁ CƠ BẢN CHO CÁC LOẠI GAME VÀ CONSOLE ---
    Sales.smallUnitPrice = 7;       // Giá bán cho game nhỏ
    Sales.mediumUnitPrice = 11;     // Giá bán cho game vừa
    Sales.largeUnitPrice = 14;      // Giá bán cho game lớn
    Sales.aaaUnitPrice = 18;        // Giá bán cho game AAA
    Sales.consoleUnitPrice = 50;    // Giá bán cho console (cho mỗi đơn vị tương đương 1 triệu người dùng tiềm năng)

    // --- HÀM TÍNH TOÁN HỆ SỐ NHÂN DOANH SỐ DỰA TRÊN KÍCH THƯỚC GAME ---
    // Tham số:
    // - company: Đối tượng công ty (không được sử dụng trực tiếp trong hàm này, có thể là dư thừa)
    // - game: Đối tượng game cần tính hệ số
    // Trả về: Hệ số nhân doanh số (ví dụ: game lớn hơn có thể có hệ số cao hơn)
    var getGameSizeSalesFactor = function (company, game) {
        var gameSizeMultiplier = 0; // Hệ số nhân dựa trên kích thước game
        switch (game.gameSize) {
            case "medium":
                gameSizeMultiplier = 1;
                break;
            case "large":
                gameSizeMultiplier = 1.2;
                break;
            case "aaa":
                gameSizeMultiplier = 1.5;
                break;
            default: // Mặc định cho game "small" hoặc không xác định
                return 1;
        }
        return 1 + gameSizeMultiplier; // Hệ số cơ bản là 1, cộng thêm với hệ số kích thước
    };

    // --- MỤC TIÊU SỐ LƯỢNG FAN CHO CÁC LOẠI GAME ĐỂ TỰ PHÁT HÀNH HIỆU QUẢ ---
    Sales.MediumTargetFans = 1E5; // 100,000 fans
    Sales.LargeTargetFans = 25E4;  // 250,000 fans
    Sales.AAATargetFans = 1E6;    // 1,000,000 fans

    // Hàm lấy mục tiêu số lượng fan dựa trên kích thước game
    // Tham số:
    // - company: Đối tượng công ty (không được sử dụng)
    // - game: Đối tượng game
    // Trả về: Số lượng fan mục tiêu
    Sales.getTargetFans = function (company, game) {
        switch (game.gameSize) {
            case "medium":
                return Sales.MediumTargetFans;
            case "large":
                return Sales.LargeTargetFans;
            case "aaa":
                return Sales.AAATargetFans;
            default:
                return 1; // Giá trị mặc định không có ý nghĩa, có thể là lỗi logic hoặc game nhỏ không có mục tiêu cụ thể
        }
    };

    // --- CÁC HỆ SỐ LIÊN QUAN ĐẾN VI PHẠM BẢN QUYỀN (PIRACY) ---
    // piracyBaseRates: Tỷ lệ vi phạm bản quyền cơ bản dựa trên điểm số game (khi không có DRM)
    var piracyBaseRates = [0.95, 0.9, 0.85, 0.8, 0.75, 0.8, 0.85, 0.9, 0.9, 0.92]; // Index 0 cho game 1 điểm, index 9 cho game 10 điểm
    // drmEffectivenessRates: Tỷ lệ hiệu quả của DRM (giảm vi phạm) dựa trên điểm số game
    var drmEffectivenessRates = [0.05, 0.05, 0.05, 0.1, 0.1, 0.15, 0.2, 0.25, 0.25, 0.3];
    // drmTechLevels: Các mức công nghệ DRM
    var drmTechLevels = [2, 4, 6, 8, 10, 12];

    // Hàm tính toán hình phạt do vi phạm bản quyền
    // Tham số:
    // - company: Đối tượng công ty
    // - game: Đối tượng game
    // - clampedGameScore: Điểm số game đã được giới hạn (1-10)
    // Trả về: Đối tượng chứa { piracyFactor, hasDrm } hoặc null nếu không ở chế độ pirate
    Sales.calculatePiracyPenalty = function (company, game, clampedGameScore) {
        if (!company.flags.pirateMode) return null; // Nếu không ở chế độ pirate, không có hình phạt

        var drmFeature = game.features.first(function (feature) { // Tìm tính năng DRM trong game
            return "DRM" == feature.category;
        });
        var hasDrm = null != drmFeature && drmFeature.v; // Kiểm tra game có DRM và DRM có giá trị (phiên bản) không
        var scoreIndex = Math.round(clampedGameScore).clamp(1, 10) - 1; // Index cho mảng dựa trên điểm số

        var piracyFactorResult;
        if (hasDrm) {
            var currentYear = company.getCurrentDate().year;
            // Tính toán sự lỗi thời của công nghệ DRM
            // drmTechLevelIndex: Vị trí của công nghệ DRM hiện tại trong mảng drmTechLevels
            // yearBracket: "Khung" năm hiện tại, dùng để so sánh với mức độ lỗi thời của DRM
            var drmTechLevelIndex = drmTechLevels.indexOf(drmFeature.v);
            var yearBracket = Math.floor(currentYear / (5 / GameManager.flags.gameLengthModifier)).clamp(0, drmTechLevels.length - 1);
            var drmAgeDifference = yearBracket - drmTechLevelIndex;

            if (0 == drmAgeDifference) { // DRM hiện tại, không quá lỗi thời
                piracyFactorResult = drmEffectivenessRates[scoreIndex];
                game.flags.drmStrength = 1; // DRM hiệu quả
            } else if (0 < drmAgeDifference) { // DRM đã lỗi thời
                piracyFactorResult = piracyBaseRates[scoreIndex] - 0.3; // Giảm mạnh tỷ lệ vi phạm cơ bản (vì DRM lỗi thời ít tác dụng)
                game.flags.drmStrength = -1; // DRM yếu
            } else { // DRM còn mới (drmAgeDifference < 0)
                piracyFactorResult = drmEffectivenessRates[scoreIndex] - 0.1; // Hiệu quả hơn một chút
                game.flags.drmStrength = 2; // DRM rất mạnh
            }
        } else { // Không có DRM
            piracyFactorResult = piracyBaseRates[scoreIndex];
            game.flags.drmStrength = 0; // Không có DRM
        }

        // Áp dụng yếu tố ngẫu nhiên và điều chỉnh thêm nếu DRM yếu/không có
        if (0 >= game.flags.drmStrength) { // Nếu DRM yếu hoặc không có
            piracyFactorResult -= 0.1 * company.getRandom(); // Tăng thêm tỷ lệ vi phạm
        }
        piracyFactorResult += 0.05 * company.getRandom() * Math.randomSign(); // Thêm chút ngẫu nhiên
        piracyFactorResult = piracyFactorResult.clamp(0, 0.98); // Giới hạn tỷ lệ vi phạm

        return {
            piracyFactor: piracyFactorResult, // Tỷ lệ % doanh thu bị mất do vi phạm
            hasDrm: hasDrm
        };
    };

    // Hàm tính toán doanh số bán hàng chi tiết cho một game
    // Tham số:
    // - company: Đối tượng công ty
    // - game: Đối tượng game cần tính doanh số
    Sales.calculateSales = function (company, game) {
        game.flags.fansAtLaunch = company.fans; // Lưu lại số fan tại thời điểm ra mắt
        var currentYear = company.getCurrentDate().year;
        var clampedScore = game.score.clamp(1, 10); // Giới hạn điểm số game từ 1 đến 10

        // Sự kiện đặc biệt nếu game bị crack nặng (G782 là một cờ game đặc biệt)
        if (GameFlags.G782 && 12 <= currentYear && 0.75 >= company.getRandom()) {
            clampedScore = 1; // Giảm điểm số xuống 1 nếu bị crack nặng
            company.notifications.push(new Notification("Sales Report", "Boss, it seems that while many players play our new game, they steal it by downloading a cracked version rather than buying it legally.\nIf players don't buy the games they like, we will sooner or later go bankrupt.",
                ":-(", 3.3 + 2.8 * company.getRandom(), {
                type: NotificationType.AutoPopup
            }));
            game.flags.noSalesEvents = true; // Không có sự kiện bán hàng đặc biệt nào xảy ra
        }

        var scoreFactor = clampedScore / 10; // Hệ số dựa trên điểm số game
        // Tính toán lượng fan cơ sở có thể tiếp cận
        var existingFansReach = Math.min(15E5, company.fans) + Math.max(0, company.fans - 15E5) / 10;
        var marketSizePerPlatform = [0, 0, 0]; // Thị phần tiềm năng trên từng nền tảng (tối đa 3)
        var minTechLevelOfPlatforms = 8; // Mức công nghệ tối thiểu của các nền tảng (ngoại trừ PC)

        // Xác định mức công nghệ tối thiểu của các console mà game phát hành
        for (var platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
            if ("PC" != game.platforms[platformIndex].id) {
                minTechLevelOfPlatforms = Math.min(minTechLevelOfPlatforms, game.platforms[platformIndex].techLevel);
            }
        }

        // Tính toán thị phần trên từng nền tảng
        for (platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
            var platformTechLevel = game.platforms[platformIndex].techLevel;
            if ("PC" == game.platforms[platformIndex].id) { // Nếu là PC, lấy mức công nghệ của console yếu nhất đi kèm
                platformTechLevel = minTechLevelOfPlatforms;
            }
            var platformDistributionFactor = 1; // Hệ số phân phối cho nền tảng
            // Giảm hệ số nếu phát hành trên nhiều nền tảng
            if (0 == platformIndex && 1 < game.platforms.length) platformDistributionFactor = 0.7;
            else if (1 == platformIndex) platformDistributionFactor = (2 == game.platforms.length) ? 0.55 : 0.4;
            else if (2 == platformIndex) platformDistributionFactor = 0.3;

            // Tính thị phần = Thị phần nền tảng * Hệ số phân phối * (1/Mức CN nền tảng) * Mức CN tối thiểu * Hệ số kích thước game
            marketSizePerPlatform[platformIndex] += Platforms.getMarketSize(game.platforms[platformIndex], company) *
                platformDistributionFactor * (1 / platformTechLevel) * minTechLevelOfPlatforms * getGameSizeSalesFactor(company, game);
        }

        var unitsSoldPerPlatform = [0, 0, 0]; // Số đơn vị bán được trên từng nền tảng
        var baseSalesFactor = 0; // Hệ số bán hàng cơ bản
        var yearSalesMultiplier = 1; // Hệ số nhân doanh số theo năm

        // Tính hệ số bán hàng cơ bản và hệ số nhân theo năm
        if (9 >= clampedScore) {
            baseSalesFactor = Math.pow(clampedScore, 3) / 100 * 0.2;
            if (4 === company.currentLevel) yearSalesMultiplier = 1.25;
        } else { // Điểm > 9
            baseSalesFactor = Math.pow(clampedScore, 3) / (100 - 35 * (clampedScore - 9));
            yearSalesMultiplier = (6 > currentYear) ? 0.65 : (4 === company.currentLevel) ? 0.35 : 0.5;
        }
        baseSalesFactor = baseSalesFactor * yearSalesMultiplier / 15 * 0.2 + 0.008; // Điều chỉnh thêm
        baseSalesFactor = [baseSalesFactor, baseSalesFactor, baseSalesFactor]; // Áp dụng cho 3 nền tảng

        // Tính số đơn vị bán được trên từng nền tảng, có xét đến đối tượng khán giả
        for (platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
            baseSalesFactor[platformIndex] *= Platforms.getAudienceWeighting([game.platforms[platformIndex]], game.targetAudience);
            unitsSoldPerPlatform[platformIndex] += Math.floor(marketSizePerPlatform[platformIndex] * baseSalesFactor[platformIndex]);
        }

        // Ảnh hưởng của Hype
        if (game.hypePoints) {
            var hypeEffectiveness = Math.min(500, game.hypePoints) / 500; // Hype hiệu quả tối đa ở 500 điểm
            var isHypeEffective = (5 <= clampedScore);
            if (game.flags.interviewHyped && game.flags.interviewHyped.decision) { // Nếu có sự kiện phỏng vấn và quyết định hype
                isHypeEffective = (8 <= clampedScore);
            }
            if (isHypeEffective) { // Hype có tác động tích cực
                for (platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
                    unitsSoldPerPlatform[platformIndex] += Math.floor((clampedScore - 5) / 5 * marketSizePerPlatform[platformIndex] * hypeEffectiveness * 0.05);
                }
            } else { // Hype có tác động tiêu cực (nếu game không đủ tốt)
                for (platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
                    unitsSoldPerPlatform[platformIndex] -= Math.floor(clampedScore / 5 * baseSalesFactor[platformIndex] * 0.25 * hypeEffectiveness * marketSizePerPlatform[platformIndex]);
                }
            }
        }

        // Giới hạn số đơn vị bán được không vượt quá thị phần tiềm năng
        for (platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
            unitsSoldPerPlatform[platformIndex] = Math.floor(Math.min(unitsSoldPerPlatform[platformIndex], marketSizePerPlatform[platformIndex]));
        }

        // Điều chỉnh nếu có hợp đồng bản quyền (royalty)
        if (game.flags.royaltyRate) {
            // Thêm số đơn vị bán được từ việc vượt mục tiêu fan (nếu có)
            unitsSoldPerPlatform[0] += Math.max(0, Sales.getTargetFans(company, game) - existingFansReach) * scoreFactor;
            // Nhân số đơn vị bán được với 10 (doanh thu chia theo tỷ lệ)
            for (platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
                unitsSoldPerPlatform[platformIndex] *= 10;
            }
        } else { // Tự phát hành
            unitsSoldPerPlatform[0] += existingFansReach * scoreFactor;
        }

        LOGWEEKSALES || "market size {0}. total reach {1}. existing fans {2}".format(marketSizePerPlatform.sum(function (val) {
            return val;
        }), unitsSoldPerPlatform.sum(function (val) {
            return val;
        }), existingFansReach).log(); // Ghi log nếu bật debug

        // Tính tổng số đơn vị bán được cuối cùng, có yếu tố ngẫu nhiên
        var totalUnitsToSell = Math.floor(0.8 * unitsSoldPerPlatform.sum(function (val) { return val; }) * scoreFactor +
            0.2 * unitsSoldPerPlatform.sum(function (val) { return val; }) * company.getRandom());

        game.unitPrice = Sales.getUnitPrice(game); // Lấy giá bán đơn vị
        // Tăng doanh số cho game MMO AAA
        if (game.flags.mmo && "aaa" === game.gameSize) {
            totalUnitsToSell *= 1.45;
        }

        // Xử lý vi phạm bản quyền
        if (company.flags.pirateMode) {
            var originalUnitsToSell = totalUnitsToSell;
            var piracyPenaltyResult = Sales.calculatePiracyPenalty(company, game, clampedScore);
            if (piracyPenaltyResult) {
                if (0 < piracyPenaltyResult.piracyFactor) game.flags.pirated = true; // Đánh dấu game bị vi phạm bản quyền
                // Sự kiện ngẫu nhiên thông báo về vi phạm bản quyền
                if (0.3 >= company.getRandom()) {
                    if (piracyPenaltyResult.hasDrm) { // Nếu có DRM
                        if (0.2 > company.getRandom()) Sales.spawnDrmStory(company, game); // DRM gây khó chịu
                    } else { // Không có DRM
                        if (0 < piracyPenaltyResult.piracyFactor) Sales.spawnPirateStory(company, game); // Bị pirate chê
                    }
                }
                totalUnitsToSell -= Math.round(totalUnitsToSell * piracyPenaltyResult.piracyFactor); // Giảm số đơn vị bán được
                var piracyRatePercentage = Math.roundToDecimals(100 - 100 / originalUnitsToSell * totalUnitsToSell, 2);
                game.flags.piracyRate = piracyRatePercentage; // Lưu tỷ lệ vi phạm
                if (piracyPenaltyResult.hasDrm) {
                    // Nếu có DRM, yếu tố điểm số ảnh hưởng đến tỷ lệ vi phạm còn lại
                    scoreFactor = (clampedScore - 1).clamp(1, 10) / 10;
                }
            }
        }

        // Tính toán thay đổi lượng fan
        var fanChangeAmount = 0;
        if (7 <= clampedScore && !game.flags.sequelsTooClose) { // Game tốt và không ra mắt quá gần phần trước
            fanChangeAmount += 0.05 * existingFansReach + 0.05 * existingFansReach * company.getRandom();
        }
        // Điều chỉnh lượng fan thay đổi dựa trên điểm số, hợp đồng, và ngẫu nhiên
        fanChangeAmount = (5 <= clampedScore && !game.flags.sequelsTooClose) ?
            (game.flags.royaltyRate && 0 >= Sales.getTargetFans(company, game) - existingFansReach ? // Nếu có hợp đồng và không vượt mục tiêu fan
                fanChangeAmount + Math.floor((0.005 * totalUnitsToSell * scoreFactor + 0.005 * totalUnitsToSell * company.getRandom()) / 10) :
                fanChangeAmount + Math.floor(0.005 * totalUnitsToSell * scoreFactor + 0.005 * totalUnitsToSell * company.getRandom())) :
            -company.fans * (1 - scoreFactor) * 0.25 * company.getRandom(); // Game không tốt, mất fan

        var totalSalesRevenue = totalUnitsToSell * game.unitPrice; // Tổng doanh thu

        LOGWEEKSALES || "units sold: {0}, sales: {1}$, fanMod{2}".format(totalUnitsToSell, totalSalesRevenue, fanChangeAmount).log();

        game.totalSalesCash || (game.totalSalesCash = 0);
        game.totalSalesCash += totalSalesRevenue; // Cộng dồn doanh thu
        game.fansChangeTarget = fanChangeAmount; // Mục tiêu thay đổi fan
        game.initialSalesRank = Sales.getInitialSalesRank(company, game); // Thứ hạng bán hàng ban đầu
        game.topSalesRank = game.initialSalesRank; // Thứ hạng cao nhất

        // Kích hoạt sự kiện sau khi tính toán doanh số
        GDT.fire(GameManager, GDT.eventKeys.gameplay.salesCalculated, {
            company: company,
            game: game
        });
    };

    // Hàm tạo lời chào ngẫu nhiên cho email
    var generateEmailGreeting = function (company, game) {
        return ["Hey {0},".localize("email greeting, where {0} is company name").format(company.name),
        "Hi there,".localize("email greeting"),
        "Greetings,".localize("email greeting"),
        "Dear developers,".localize("email greeting"),
        "Hello {0},".localize("email greeting, where {0} is CEO name").format(company.staff[0].name)
        ].pickRandom();
    };

    // Hàm tạo lời khen ngẫu nhiên về game cho email
    var generateGamePraise = function (company, game) {
        return ["I quite liked {0}".localize("{0} is game name, continues with piracy fragment 2"),
        "I really enjoyed your game {0}".localize("{0} is game name, continues with piracy fragment 2"),
        "{0} is really interesting".localize("{0} is game name, continues with piracy fragment 2"),
        "{0} is awesome".localize("{0} is game name, continues with piracy fragment 2")
        ].pickRandom().format(game.title);
    };

    // Hàm tạo thông báo (email) từ một người chơi vi phạm bản quyền
    Sales.spawnPirateStory = function (company, game) {
        var greeting = generateEmailGreeting(company, game);
        var gamePraise = generateGamePraise(company, game);
        var currentYear = company.getCurrentDate().year;

        var excusesList = [
            "but I've played more interesting {0} games before".localize("piracy fragment 2 - continue with piracy fragment 3, {0} is genre name").format(game.genre.name),
            "but other {0} are more innovative".localize("piracy fragment 2 - continue with piracy fragment 3, {0} is genre name").format(game.genre.name),
            "but I've only played {0} hours of it".localize("piracy fragment 2 - continue with piracy fragment 3").format(Math.floor(12 + 300 * company.getRandom())),
            "but I hated the ending".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but it really needs more features".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but it needs more depth".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but it could use more polish".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but it's not as good as other games".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but other games are better".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but I think it's too expensive".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but I think it needs to be at least 30% cheaper".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but I don't like you".localize("piracy fragment 2 - continue with piracy fragment 3"),
            "but I think parts of it should work differently".localize("piracy fragment 2 - continue with piracy fragment 3")
        ];
        if (1 < company.staff.length) { // Nếu công ty có nhiều hơn 1 nhân viên
            excusesList.push("but I don't like that {0} works for you".localize("piracy fragment 2 - continue with piracy fragment 3").format(company.staff.skip(1).pickRandom().name));
        }
        if (15 <= currentYear) { // Nếu năm game lớn hơn hoặc bằng 15
            excusesList.push("but I'm saving up for this new graphics card".localize("piracy fragment 2 - continue with piracy fragment 3"));
            excusesList.push("but I think it's not really AAA quality".localize("piracy fragment 2 - continue with piracy fragment 3"));
            excusesList.push("but it isn't AAA quality".localize("piracy fragment 2 - continue with piracy fragment 3"));
        }
        var excuseText = excusesList.pickRandom(); // Chọn một lý do ngẫu nhiên

        var piracyActionsList = [
            "so I stole it.".localize("piracy fragment 3"),
            "so I pirated it.".localize("piracy fragment 3"),
            "so I think you don't deserve my money.".localize("piracy fragment 3")
        ];
        if (14 <= currentYear) {
            piracyActionsList.push("so I downloaded your game from a gamez website.".localize("piracy fragment 3"));
            if (20 <= currentYear) {
                piracyActionsList.push("so I used a torrent.".localize("piracy fragment 3"));
            }
        }
        var piracyMethodText = piracyActionsList.pickRandom(); // Chọn một cách vi phạm ngẫu nhiên

        var closingRemark = "";
        if (0.5 > company.getRandom()) { // 50% cơ hội có lời nhận xét cuối cùng
            closingRemark = ["Anyway, just make better games, okay?".localize(),
            "Anyway, you really should release more updates for it.".localize(),
            "Looking forward to the sequel.".localize(),
            "You should give the game away for free.".localize(),
            "But hey, I've told my friends of the game so that's free publicity for you!".localize()
            ].pickRandom();
        }

        var pirateName = (0.9 > company.getRandom()) ? UI.getRandomMaleFirstName() : UI.getRandomFemaleFirstName(); // Tên người gửi ngẫu nhiên
        var psMessages = ["PS: I want to work in the games industry. Do you have a job for me?".localize()];
        if (company.isLaterOrEqualThan(18, 9, 1)) { // Nếu sau năm 18, tháng 9, tuần 1
            psMessages.push("- Sent from my grPhone.".localize());
        }
        var psText = "";
        if (0.2 > company.getRandom()) { // 20% cơ hội có P.S.
            psText = "\n\n" + psMessages.pickRandom();
        }

        var emailBody = "{0}\n{1} {2} {3}\n{4}\n{5}{6}".format(greeting, gamePraise, excuseText, piracyMethodText, closingRemark, pirateName, psText);
        company.notifications.push(new Notification("Mail".localize("header"), emailBody, null, 2.5 + 7 * company.getRandom()));
    };

    // Hàm tạo thông báo (email) từ người chơi phàn nàn về DRM
    Sales.spawnDrmStory = function (company, game) {
        var drmFeature = game.features.first(function (feature) {
            return "DRM" == feature.category;
        });
        if (drmFeature && 6 >= drmFeature.v) { // Chỉ spawn nếu DRM không quá mạnh (v <= 6)
            var greeting = generateEmailGreeting(company, game);
            var gamePraise = generateGamePraise(company, game);
            var drmComplaint = ["but your use of copy protection makes the game really slow.".localize("piracy fragment"),
            "but the included copy protection software is really inconvenient.".localize("piracy fragment"),
            "but the game stopped working saying that it wasn't a genuine copy! I swear I bought it and I'm very unhappy about this.".localize("piracy fragment"),
            "but the copy protection in that game constantly crashes my system.".localize("piracy fragment"),
            "but I hate how inconvenient the copy protection is.".localize("piracy fragment")
            ].pickRandom();
            var drmDemand = ["Can you please not use it in the future?".localize(),
            "A friend of mine pirated the game and he doesn't have any issues! This isn't fair!".localize(),
            "Thanks for your understanding.".localize(),
            "Please don't punish your fans for piracy!".localize(),
            "I will never buy anything from your company again!".localize(),
            "I will make sure to warn all of my friends about this.".localize()
            ].pickRandom();
            var customerName = (0.5 > company.getRandom()) ? UI.getRandomMaleFirstName() : UI.getRandomFemaleFirstName();
            var emailBody = "{0}\n{1} {2}\n{3}\n{4}".format(greeting, gamePraise, drmComplaint, drmDemand, customerName);
            company.notifications.push(new Notification("Mail".localize("header"), emailBody, null, 2.5 + 7 * company.getRandom()));
        }
    };

    // Hàm lấy thứ hạng bán hàng ban đầu của game
    Sales.getInitialSalesRank = function (company, game) {
        var clampedScore = Math.floor(game.score);
        GameGenre.getGenreWeighting(game.topic.genreWeightings, game.genre, game.secondGenre); // Không sử dụng kết quả?
        var baseRank = -1;

        // Xác định thứ hạng cơ bản dựa trên điểm số
        if (10 === clampedScore) baseRank = 1;
        else if (9 === clampedScore) baseRank = 5;
        else if (8 === clampedScore) baseRank = 10;
        else if (7 === clampedScore) baseRank = 20;
        else if (6 === clampedScore) baseRank = 40;
        else if (5 === clampedScore) baseRank = 60;
        else return -1; // Game quá tệ, không có thứ hạng

        var rankVariationFactor = company.getRandom();
        var rankVariation = baseRank * rankVariationFactor + 0.5 * baseRank * company.getRandom() * Math.randomSign();
        var finalRank = Math.floor(baseRank + rankVariation);

        if (100 < finalRank) return -1; // Ngoài top 100
        if (0 >= finalRank) finalRank = 1; // Tối thiểu là hạng 1

        LOGWEEKSALES || "rank = {0} ({1}(initial)+{2}(variation))".format(finalRank, baseRank, Math.floor(rankVariation)).log();
        return finalRank;
    };

    // Hàm lấy thời gian bán hàng (tuần) dựa trên kích thước game
    Sales.getSalesLengthInWeek = function (game) {
        if ("small" === game.gameSize) return 10;
        if ("medium" === game.gameSize) return 15;
        if ("large" === game.gameSize) return 20;
        if ("aaa" === game.gameSize) return 25;
    };

    // Hàm lấy giá bán đơn vị dựa trên kích thước game
    Sales.getUnitPrice = function (game) {
        return "medium" === game.gameSize ? Sales.mediumUnitPrice :
            "large" === game.gameSize ? Sales.largeUnitPrice :
                "aaa" === game.gameSize ? Sales.aaaUnitPrice :
                    Sales.smallUnitPrice;
    };

    // Hàm tính doanh thu hàng tuần cho game MMO
    Sales.getMMOIncome = function (company, game) {
        var remainingPotentialSales = game.totalSalesCash - game.currentSalesCash;
        var incomeFactor = 1;
        if ("medium" === game.gameSize) incomeFactor = 0.75;
        else if ("large" === game.gameSize) incomeFactor = 0.65;
        else if ("aaa" === game.gameSize) incomeFactor = 0.5;

        var weeklyIncome = (game.totalSalesCash - game.currentSalesCash) * (0.05 * company.getRandom() * incomeFactor + 0.05 * incomeFactor);
        game.totalSalesCash += weeklyIncome / 2; // Tăng tổng doanh thu tiềm năng một chút
        if (1E4 > weeklyIncome) { // Đảm bảo doanh thu tối thiểu
            weeklyIncome = 1E4;
            game.totalSalesCash += weeklyIncome;
        }
        return weeklyIncome;
    };

    // Hàm tính doanh thu hàng tuần cho game thường
    Sales.getIncome = function (company, game) {
        var remainingPotentialSales = game.totalSalesCash - game.currentSalesCash;
        var incomeFactor = 1;
        if ("medium" === game.gameSize) incomeFactor = 0.75;
        else if ("large" === game.gameSize) incomeFactor = 0.65;
        else if ("aaa" === game.gameSize) incomeFactor = 0.5;

        var weeklyIncome;
        // Nếu gần hết vòng đời sản phẩm, doanh thu giảm chậm hơn
        if ((game.totalSalesCash - game.currentSalesCash) / game.totalSalesCash < 0.1 * incomeFactor) {
            if ((game.totalSalesCash - game.currentSalesCash) / game.totalSalesCash > 0.01 * incomeFactor) {
                weeklyIncome = (game.totalSalesCash - game.currentSalesCash) * (0.4 * company.getRandom() * incomeFactor + 0.4 * incomeFactor);
            }
        } else { // Giai đoạn đầu và giữa, doanh thu giảm nhanh hơn
            weeklyIncome = (game.totalSalesCash - game.currentSalesCash) * (0.2 * company.getRandom() * incomeFactor + 0.2 * incomeFactor);
        }
        return weeklyIncome;
    };

    // Hàm lấy danh sách các game đang được bán
    Sales.getGamesToSell = function (company) {
        var currentWeek = Math.floor(company.currentWeek);
        return company.gameLog.filter(function (game) {
            return currentWeek > game.releaseWeek && !game.soldOut && !game.flags.isExtensionPack;
        });
    };

    // Hàm lấy danh sách các console (custom) đang được bán
    Sales.getConsolesToSell = function (company) {
        var currentWeek = Math.floor(company.currentWeek);
        return company.licencedPlatforms.filter(function (platform) {
            return true === platform.isCustom && currentWeek > General.getWeekFromDateString(platform.published) && !platform.soldOut;
        });
    };

    // Hàm xử lý doanh số bán hàng hàng tuần cho tất cả sản phẩm
    Sales.processSales = function (company) {
        var currentWeek = Math.floor(company.currentWeek);
        // Xử lý các gói mở rộng
        var extensionPacks = company.gameLog.filter(function (game) {
            return currentWeek > game.releaseWeek && !game.soldOut && true === game.flags.isExtensionPack;
        });
        for (var i = 0, len = extensionPacks.length; i < len; i++) {
            var extensionPack = extensionPacks[i];
            var mainGame = company.getGameById(extensionPack.sequelTo);
            if (mainGame) { // Nếu tìm thấy game gốc
                mainGame.fansChangeTarget += extensionPack.fansChangeTarget;
                mainGame.initialSalesRank = extensionPack.initialSalesRank; // Cập nhật hạng cho game gốc?
                mainGame.packReleaseWeek = extensionPack.releaseWeek;
                mainGame.totalSalesCash += Math.floor(0.1 * mainGame.totalSalesCash + extensionPack.totalSalesCash); // Gói mở rộng đóng góp vào doanh thu game gốc
                mainGame.confAmount = extensionPack.totalSalesCash; // Lượng doanh thu từ hội chợ?
                extensionPack.soldOut = true; // Gói mở rộng được coi là "bán hết" sau khi cộng dồn
            } else {
                extensionPack.flags.isExtensionPack = false; // Nếu không tìm thấy game gốc, coi như game thường
            }
        }

        // Xử lý game thường
        var gamesToSell = Sales.getGamesToSell(company);
        for (i = 0, len = gamesToSell.length; i < len; i++) {
            Sales.sellGame(company, gamesToSell[i], currentWeek);
        }

        // Xử lý console (custom)
        var consolesToSell = Sales.getConsolesToSell(company);
        for (i = 0, len = consolesToSell.length; i < len; i++) {
            Sales.sellConsole(company, consolesToSell[i], currentWeek);
        }
    };

    // Hàm xử lý bán hàng cho một game cụ thể trong tuần
    Sales.sellGame = function (company, game, currentWeek) {
        game.unitsSold || (game.unitsSold = 0);
        game.revenue || (game.revenue = 0);

        // Nếu game bị hủy bán, coi như đã bán hết
        if (game.flags.saleCancelled) {
            game.totalSalesCash = game.currentSalesCash;
        }

        var salesLengthInWeeks = Sales.getSalesLengthInWeek(game);

        // Cập nhật thông tin từ tuần trước (nếu có)
        if (game.nextSalesCash) {
            game.currentSalesRank = game.nextSalesRank;
            game.fansChanged += game.nextfansChange;

            // Tính doanh thu và số đơn vị bán được dựa trên hợp đồng hoặc tự phát hành
            if (game.flags.royaltyRate) {
                game.currentSalesCash += game.nextSalesCash / game.flags.royaltyRate;
                game.unitsSold += Math.floor(game.nextSalesCash / game.flags.royaltyRate / game.unitPrice);
            } else {
                game.currentSalesCash += game.nextSalesCash;
                game.unitsSold += Math.floor(game.nextSalesCash / game.unitPrice);
            }

            if (0 != game.nextSalesCash) {
                company.adjustCash(game.nextSalesCash, "{0} sales".localize().format(game.title));
                game.revenue += Math.floor(game.nextSalesCash);
            }
            // Chi phí bảo trì cho MMO
            if (game.nextMaintenance && 0 != game.nextMaintenance) {
                company.adjustCash(-game.nextMaintenance, "{0} maintenance".localize().format(game.title));
                game.costs += Math.floor(game.nextMaintenance);
            }
            if (game.flags.mmo) {
                game.flags.isProfitable = (game.nextSalesCash >= game.nextMaintenance);
            }

            // Thay đổi lượng fan
            if (0 != game.nextfansChange) {
                var fanChangeAmount = Math.floor(game.nextfansChange);
                if (0 === company.fans && 0 < fanChangeAmount) { // Thông báo nếu có fan đầu tiên
                    var fanNotificationText = "{0} was so successful that we now have {1} fans!".localize().format(game.title, UI.getLongNumberString(fanChangeAmount));
                    fanNotificationText = new Notification({
                        header: "Fans".localize("heading"),
                        text: fanNotificationText,
                        type: NotificationType.CompanyMilestones,
                        weeksUntilFired: 0.2
                    });
                    company.notifications.push(fanNotificationText);
                }
                company.adjustFans(fanChangeAmount);
            }

            // Thông báo tuần đầu tiên bán hàng
            if (game.firstSales) {
                if (2 > company.gameLog.length || 10 <= game.rank) { // Điều kiện để hiện thông báo
                    var firstWeekSalesText = "{0} sold {1} units in its first week on the market.".localize().format(game.title, UI.getLongNumberString(game.unitsSold));
                    var currentRank = game.currentSalesRank;
                    if (0 < currentRank) {
                        firstWeekSalesText += "\n" + "We made it in the charts at #{0}!".localize().format(currentRank);
                    }
                    firstWeekSalesText = new Notification({
                        header: "First week of sales!".localize(),
                        text: firstWeekSalesText,
                        type: NotificationType.CompanyMilestones
                    });
                    company.notifications.push(firstWeekSalesText);
                    Tutorial.firstSales();
                }
                if (game.flags.mmo) Tutorial.mmoOnSale(); // Tutorial cho MMO
            }
            // Reset giá trị cho tuần tiếp theo
            game.nextfansChange = void 0;
            game.nextSalesCash = void 0;
        }

        // Nếu game vẫn còn tiềm năng bán hoặc là MMO và chưa bị hủy
        if (game.totalSalesCash > game.currentSalesCash || (game.flags.mmo && !game.flags.saleCancelled)) {
            var isFirstSaleOfWeek = (0 === game.currentSalesCash); // Kiểm tra có phải tuần đầu bán không
            var salesAnomalyBonusOrPenalty = 0;

            if (!game.flags.mmo) { // Xử lý sự kiện bán hàng đặc biệt (không cho MMO)
                var salesAnomalyAmount = game.getSalesAnomaly(); // Lấy yếu tố bất thường (ví dụ: kỷ lục)
                if (0 < salesAnomalyAmount) salesAnomalyBonusOrPenalty = Math.floor(game.totalSalesCash * salesAnomalyAmount * 0.3);
                else if (0 > salesAnomalyAmount) salesAnomalyBonusOrPenalty = Math.floor(game.totalSalesCash * salesAnomalyAmount * 0.3);
            }

            var currentWeekIncome = 0;
            currentWeekIncome = game.flags.mmo ? Sales.getMMOIncome(company, game) : Sales.getIncome(company, game); // Lấy doanh thu tuần này

            game.nextfansChange = Math.floor(currentWeekIncome / game.totalSalesCash * game.fansChangeTarget); // Tính thay đổi fan cho tuần tới
            game.nextSalesCash = Math.floor(currentWeekIncome + salesAnomalyBonusOrPenalty / 2); // Doanh thu tuần tới

            // Điều chỉnh doanh thu nếu có hợp đồng
            if (game.flags.royaltyRate) {
                game.nextSalesCash = Math.floor(game.nextSalesCash * game.flags.royaltyRate);
                salesAnomalyBonusOrPenalty = Math.floor(salesAnomalyBonusOrPenalty * game.flags.royaltyRate);
            }

            // Tính chi phí bảo trì cho MMO
            if (game.flags.mmo) {
                game.maintenanceLog || (game.maintenanceLog = []);
                game.nextMaintenance = Math.floor((game.currentSalesCash + game.nextSalesCash) / 100);
                game.nextMaintenance += Math.floor(game.nextSalesCash / (Math.pow(game.maintenanceLog.length, 3) + 3));
            }

            // Nếu không còn doanh thu tiềm năng, ngừng bán
            if (0 >= game.nextSalesCash) {
                game.nextSalesCash = void 0;
                game.nextMaintenance = void 0;
                game.totalSalesCash = game.currentSalesCash;
            } else { // Nếu còn, ghi log và cập nhật tổng doanh thu tiềm năng
                if (game.flags.mmo) game.maintenanceLog.push(game.nextMaintenance);
                game.salesCashLog.push(game.nextSalesCash);
                game.totalSalesCash += Math.floor(salesAnomalyBonusOrPenalty); // Cộng dồn phần thưởng/phạt từ sự kiện
            }

            // Cập nhật thứ hạng bán hàng
            if (-1 != game.initialSalesRank) {
                var progressThroughSalesCycle = (currentWeek - game.releaseWeek) / salesLengthInWeeks;
                if (game.packReleaseWeek) { // Nếu là gói mở rộng, tính từ ngày phát hành gói
                    progressThroughSalesCycle = (currentWeek - game.packReleaseWeek) / salesLengthInWeeks;
                }
                var newRank = Math.max(game.initialSalesRank, Math.floor(game.initialSalesRank + 2 * game.initialSalesRank * (progressThroughSalesCycle - 0.1)));
                newRank = GameManager.getUniqueSalesRank(newRank, game); // Đảm bảo thứ hạng là duy nhất
                game.nextSalesRank = (100 < newRank) ? -1 : newRank; // Ngoài top 100 thì không có hạng
            }

            // Cập nhật UI
            if (isFirstSaleOfWeek) {
                game.firstSales = true;
                UI.addSalesCard(game.id, game.title, game.currentSalesCash, game.totalSalesCash, game.unitsSold, game.currentSalesRank, game.salesCashLog, game.nextSalesCash, game.unitPrice, game.nextMaintenance, game.maintenanceLog, game.flags.royaltyRate);
            } else {
                game.firstSales = false;
                UI.updateSalesCard(game.id, game.unitsSold, game.nextSalesCash, game.salesCashLog, game.unitPrice, game.currentSalesRank, game.nextMaintenance, game.maintenanceLog, game.flags.royaltyRate);
            }
        } else { // Game đã bán hết hoặc bị ngừng
            game.soldOut = true;
            game.currentSalesRank = -1;
            UI.removeSalesCard(game.id, true); // Xóa card bán hàng khỏi UI
            var offMarketText = "{0} is now off the market. It sold {1} units generating {2} in sales.".localize().format(game.title, UI.getLongNumberString(game.unitsSold), UI.getLongNumberString(game.revenue));
            offMarketText = new Notification({
                header: "Game off the market.".localize("heading"),
                text: offMarketText,
                type: NotificationType.SalesReports
            });
            company.notifications.push(offMarketText);
        }
    };

    // Hàm tính doanh thu hàng tuần cho console (custom)
    Sales.getConsoleIncome = function (company, consolePlatform) {
        var potentialTotalRevenue = 1E6 * consolePlatform.unitsSold * Sales.consoleUnitPrice; // Doanh thu tiềm năng tối đa
        var remainingPotentialRevenue = potentialTotalRevenue - consolePlatform.currentSalesCash;
        var incomeRate = 0.1; // Tỷ lệ doanh thu hàng tuần
        // Tỷ lệ cao hơn ở giai đoạn đầu
        if (General.getWeekFromDateString(consolePlatform.published) + 10 > company.currentWeek) incomeRate = 0.2;
        else if (General.getWeekFromDateString(consolePlatform.published) + 20 > company.currentWeek) incomeRate = 0.13;

        var weeklyIncome = (potentialTotalRevenue - consolePlatform.currentSalesCash) * (company.getRandom() * incomeRate * 0.15 + 0.15 * incomeRate);
        // Đảm bảo doanh thu tối thiểu và cập nhật lại tổng đơn vị bán tiềm năng nếu cần
        if (1E4 > weeklyIncome) {
            weeklyIncome = 5E3 + 5E3 * company.getRandom();
            consolePlatform.unitsSold = (potentialTotalRevenue + weeklyIncome) / 1E6 / Sales.consoleUnitPrice;
        }
        return weeklyIncome;
    };

    // Hàm tính yếu tố bất thường cho doanh số console (dựa trên game hot trên console đó)
    Sales.getSalesAnomalyForConsole = function (company, consolePlatform) {
        var currentWeek = Math.floor(company.currentWeek);
        var anomalyFactor = 0;
        var gamesOnThisPlatform = company.gameLog.filter(function (game) {
            return currentWeek > game.releaseWeek && !game.soldOut &&
                0 < game.platforms.filter(function (platform) { return platform.id === consolePlatform.id; }).length &&
                100 >= game.currentSalesRank && 0 < game.currentSalesRank;
        });
        for (var i = 0, len = gamesOnThisPlatform.length; i < len; i++) {
            anomalyFactor = Math.max(anomalyFactor, (101 - gamesOnThisPlatform[i].currentSalesRank) / 100);
        }
        // Sự hài lòng của khách hàng cũng ảnh hưởng
        if (0 > consolePlatform.satisFaction - 1) {
            anomalyFactor += (consolePlatform.satisFaction - 1).clamp(-0.5, 0);
        }
        return anomalyFactor;
    };

    // Hàm xử lý bán hàng cho một console (custom) cụ thể trong tuần
    Sales.sellConsole = function (company, consolePlatform, currentWeek) {
        if (consolePlatform.saleCancelled) { // Nếu bị hủy bán
            consolePlatform.unitsSold = consolePlatform.currentSalesCash / Sales.consoleUnitPrice / 1E6;
            consolePlatform.soldOut = true;
        }
        var potentialTotalRevenue = 1E6 * consolePlatform.unitsSold * Sales.consoleUnitPrice;
        consolePlatform.currentSalesCash || (consolePlatform.currentSalesCash = 0);
        consolePlatform.currentUnitsSold || (consolePlatform.currentUnitsSold = 0);
        consolePlatform.salesCashLog || (consolePlatform.salesCashLog = []);

        // Cập nhật từ tuần trước
        if (consolePlatform.nextSalesCash) {
            consolePlatform.currentSalesCash += consolePlatform.nextSalesCash;
            consolePlatform.currentUnitsSold += Math.floor(consolePlatform.nextSalesCash / Sales.consoleUnitPrice);
            if (0 != consolePlatform.nextSalesCash) {
                company.adjustCash(consolePlatform.nextSalesCash, "{0} sales".localize().format(consolePlatform.name));
            }
            consolePlatform.nextSalesCash = void 0;
        }

        // Nếu vẫn còn tiềm năng bán
        if (Math.floor(potentialTotalRevenue) > consolePlatform.currentSalesCash) {
            // Tạo điểm bảo trì sau tuần đầu tiên
            if (currentWeek > General.getWeekFromDateString(consolePlatform.published) + 1) {
                Sales.generateMaintenancePoints(company, consolePlatform, currentWeek);
            }
            var isFirstSaleOfWeekForConsole = (0 === consolePlatform.currentSalesCash);
            General.getWeekFromDateString(consolePlatform.published); // Dòng này không có tác dụng?

            var currentWeekIncomeForConsole = Sales.getConsoleIncome(company, consolePlatform);
            var anomalyFactorForConsole = Sales.getSalesAnomalyForConsole(company, consolePlatform);
            var anomalyBonusOrPenaltyForConsole = 0;
            if (0 != anomalyFactorForConsole) {
                anomalyBonusOrPenaltyForConsole = Math.floor(currentWeekIncomeForConsole * anomalyFactorForConsole);
                consolePlatform.unitsSold += anomalyBonusOrPenaltyForConsole / Sales.consoleUnitPrice / 1E6; // Cập nhật lại tổng đơn vị bán tiềm năng
            }
            consolePlatform.nextSalesCash = Math.floor(currentWeekIncomeForConsole + anomalyBonusOrPenaltyForConsole); // Doanh thu tuần tới

            if (0 >= consolePlatform.nextSalesCash) {
                consolePlatform.nextSalesCash = void 0;
                consolePlatform.currentUnitsSold = consolePlatform.currentSalesCash / Sales.consoleUnitPrice;
            } else {
                consolePlatform.salesCashLog.push(consolePlatform.nextSalesCash);
            }

            // Cập nhật UI
            if (isFirstSaleOfWeekForConsole) {
                consolePlatform.firstSales = true;
                UI.addSalesCard(consolePlatform.id, consolePlatform.name, consolePlatform.currentSalesCash, potentialTotalRevenue, consolePlatform.currentUnitsSold, -1, consolePlatform.salesCashLog, consolePlatform.nextSalesCash, Sales.consoleUnitPrice);
            } else {
                consolePlatform.firstSales = false;
                UI.updateSalesCard(consolePlatform.id, consolePlatform.currentUnitsSold, consolePlatform.nextSalesCash, consolePlatform.salesCashLog, Sales.consoleUnitPrice, -1);
            }
        } else { // Hết tiềm năng bán
            UI.removeSalesCard(consolePlatform.id, true);
            UI.removeMaintenanceCard(consolePlatform, false); // Giả sử có hàm này
            "{0} is now off the market. It sold {1} units generating {2} in sales.".localize().format(consolePlatform.name, UI.getLongNumberString(consolePlatform.currentUnitsSold), UI.getLongNumberString(consolePlatform.currentSalesCash));
            // Đoạn trên có vẻ thiếu việc tạo Notification
        }
    };

    // Hàm lấy tổng số đơn vị console bán được trong vài tuần gần nhất (để tính điểm bảo trì)
    var getRecentConsoleSalesUnits = function (consolePlatform) {
        var logLength = consolePlatform.salesCashLog.length;
        var totalUnitsInRecentWeeks = 0;
        for (var i = logLength - 1; i > Math.max(logLength - 5, 0); i--) { // Xem xét 4 tuần gần nhất
            totalUnitsInRecentWeeks += consolePlatform.salesCashLog[i];
        }
        return Math.floor(totalUnitsInRecentWeeks / Sales.consoleUnitPrice);
    };

    // Hàm tạo điểm bảo trì cho console
    Sales.generateMaintenancePoints = function (company, consolePlatform, currentWeek) {
        if (void 0 === consolePlatform.maintenancePoints) {
            consolePlatform.repairPoints = 0;
            consolePlatform.maintenancePoints = 0;
            consolePlatform.maintenanceLog = [];
        }
        var totalUnitsSold = 1E6 * consolePlatform.unitsSold;
        // Điểm bảo trì cơ bản dựa trên tỷ lệ bán hàng gần đây so với tổng bán tiềm năng
        var maintenanceBasePoints = Math.min(32.5 * getRecentConsoleSalesUnits(consolePlatform) / totalUnitsSold * 10, 45);
        // Điểm bảo trì thực tế, giảm đi bởi yếu tố ngẫu nhiên và chất lượng console (qF)
        var pointsToAdd = Math.max(5, Math.floor(maintenanceBasePoints - maintenanceBasePoints * (0.4 * company.getRandom() + 0.6 * consolePlatform.qF)));

        consolePlatform.maintenancePoints += pointsToAdd; // Cộng dồn điểm bảo trì
        consolePlatform.maintenanceLog.push(consolePlatform.maintenancePoints); // Ghi log
        UI.updateMaintenanceCard(consolePlatform); // Cập nhật UI
    };

    // Hàm tính doanh thu từ việc bán SDK (Bộ công cụ phát triển)
    Sales.sellSDKs = function (company) {
        var sdkEngines = company.engines.filter(function (engine) { // Lọc các engine có SDK
            return -1 != engine.parts.indexOf(Research.sdk);
        });
        if (0 < sdkEngines.length) {
            sdkEngines = sdkEngines.sort(function (engineA, engineB) { // Sắp xếp theo mức công nghệ
                return engineA.techLevel - engineB.techLevel;
            });
            for (var i = 0; i < sdkEngines.length; i++) {
                // Chỉ bán SDK cho engine còn "mới" (trong vòng 96 tuần kể từ khi ra mắt)
                if (sdkEngines[i].releaseWeek + 96 > company.currentWeek) {
                    var sdkRevenue = sdkEngines[i].costs / 12; // Doanh thu cơ bản
                    // Điều chỉnh doanh thu dựa trên mức công nghệ so với thị trường
                    var maxTechLevelOnMarket = Platforms.getPlatformsOnMarket(company).filter(function (platform) {
                        return !platform.isCustom;
                    }).max(function (platform) {
                        return platform.techLevel;
                    });
                    if (maxTechLevelOnMarket) {
                        sdkRevenue *= sdkEngines[i].techLevel / maxTechLevelOnMarket;
                    }
                    company.adjustCash(sdkRevenue, sdkEngines[i].name + " SDK".localize("short for Software Development Kit"));
                    break; // Chỉ bán SDK cho engine mới nhất đủ điều kiện
                }
            }
        }
    };

    // Hàm áp dụng doanh thu từ nền tảng Grid (nếu có)
    Sales.applyGridSales = function (company) {
        if (company.flags.grid) { // Nếu công ty sở hữu Grid
            var platformsOnMarket = Platforms.getPlatformsOnMarket(company);
            var maxMarketSize = Platforms.getMarketSizeForWeek(platformsOnMarket.first(function (platform) {
                return "PC" === platform.id;
            }), company.currentWeek, company, true); // Lấy thị phần PC làm cơ sở
            var strongestPlatformId = "PC";

            // Tìm nền tảng (custom hoặc PC) có thị phần lớn nhất
            var customPlatforms = platformsOnMarket.filter(function (platform) { return platform.isCustom; });
            for (var i = 0; i < customPlatforms.length; i++) {
                var marketSizeOfPlatform = Platforms.getMarketSizeForWeek(customPlatforms[i], company.currentWeek, company, true);
                if (marketSizeOfPlatform > maxMarketSize) {
                    maxMarketSize = marketSizeOfPlatform;
                    strongestPlatformId = customPlatforms[i].id;
                }
            }
            var strongestPlatform = platformsOnMarket.first(function (platform) { return platform.id === strongestPlatformId; });
            // Thêm doanh thu từ Grid dựa trên % thị phần của nền tảng mạnh nhất
            company.adjustCash(Platforms.getTotalMarketSizePercent(strongestPlatform, GameManager.company) / 100 * 2E6, "Grid income".localize("heading"));
        }
    };
})(); // Kết thúc IIFE cho module Sales