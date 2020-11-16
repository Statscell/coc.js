"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTag = void 0;
function validateTag(tag, encode = true) {
    if (!tag)
        return false;
    const _tag = tag.toUpperCase().replace(/O/g, '0').replace('#', '');
    const tagRegex = /[0289PYLQGRJCUV]{3,9}/g;
    const result = tagRegex.exec(_tag);
    return result ? encode ? encodeURIComponent(`#${result[0]}`) : result[0] : false;
}
exports.validateTag = validateTag;
//# sourceMappingURL=utils.js.map