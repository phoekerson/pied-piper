"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUser = exports.detectProvider = exports.DefaultDatabaseAdapter = exports.piedPiper = void 0;
var import_1 = require("./api/import");
Object.defineProperty(exports, "piedPiper", { enumerable: true, get: function () { return import_1.piedPiper; } });
var dbAdapter_1 = require("./core/database/dbAdapter");
Object.defineProperty(exports, "DefaultDatabaseAdapter", { enumerable: true, get: function () { return dbAdapter_1.DefaultDatabaseAdapter; } });
var ProviderDetector_1 = require("./core/identity/ProviderDetector");
Object.defineProperty(exports, "detectProvider", { enumerable: true, get: function () { return ProviderDetector_1.detectProvider; } });
var userNormalizer_1 = require("./core/normalizer/userNormalizer");
Object.defineProperty(exports, "normalizeUser", { enumerable: true, get: function () { return userNormalizer_1.normalizeUser; } });
//# sourceMappingURL=index.js.map