require('./sourcemap-register.js');module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(109);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const parser_1 = __webpack_require__(899);
const instruction_1 = __webpack_require__(923);
class Onbuild extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    getTrigger() {
        let trigger = this.getTriggerWord();
        return trigger === null ? null : trigger.toUpperCase();
    }
    getTriggerWord() {
        return this.getRangeContent(this.getTriggerRange());
    }
    getTriggerRange() {
        let args = this.getArguments();
        return args.length > 0 ? args[0].getRange() : null;
    }
    getTriggerInstruction() {
        let triggerRange = this.getTriggerRange();
        if (triggerRange === null) {
            return null;
        }
        let args = this.getArguments();
        return parser_1.Parser.createInstruction(this.document, this.dockerfile, this.escapeChar, vscode_languageserver_types_1.Range.create(args[0].getRange().start, this.getRange().end), this.getTriggerWord(), triggerRange);
    }
}
exports.Onbuild = Onbuild;


/***/ }),

/***/ 25:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const argument_1 = __webpack_require__(485);
class JSONArgument extends argument_1.Argument {
    constructor(value, range, jsonRange) {
        super(value, range);
        this.jsonRange = jsonRange;
    }
    getJSONRange() {
        return this.jsonRange;
    }
    getJSONValue() {
        let value = super.getValue();
        value = value.substring(1, value.length - 1);
        return value;
    }
}
exports.JSONArgument = JSONArgument;


/***/ }),

/***/ 49:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const flag_1 = __webpack_require__(314);
const instruction_1 = __webpack_require__(923);
class ModifiableInstruction extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    getFlags() {
        if (!this.flags) {
            this.flags = [];
            for (let arg of this.getArguments()) {
                let value = arg.getValue();
                if (this.stopSearchingForFlags(value)) {
                    return this.flags;
                }
                else if (value.indexOf("--") === 0) {
                    let range = arg.getRange();
                    let rawValue = this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
                    let nameIndex = value.indexOf('=');
                    let index = rawValue.indexOf('=');
                    let firstMatch = false;
                    let secondMatch = false;
                    let startIndex = -1;
                    nameSearchLoop: for (let i = 0; i < rawValue.length; i++) {
                        switch (rawValue.charAt(i)) {
                            case '\\':
                            case ' ':
                            case '\t':
                            case '\r':
                            case '\n':
                                break;
                            case '-':
                                if (secondMatch) {
                                    startIndex = i;
                                    break nameSearchLoop;
                                }
                                else if (firstMatch) {
                                    secondMatch = true;
                                }
                                else {
                                    firstMatch = true;
                                }
                                break;
                            default:
                                startIndex = i;
                                break nameSearchLoop;
                        }
                    }
                    let nameStart = this.document.positionAt(this.document.offsetAt(range.start) + startIndex);
                    if (index === -1) {
                        this.flags.push(new flag_1.Flag(this.document, range, value.substring(2), vscode_languageserver_types_1.Range.create(nameStart, range.end), null, null));
                    }
                    else if (index === value.length - 1) {
                        let nameEnd = this.document.positionAt(this.document.offsetAt(range.start) + index);
                        this.flags.push(new flag_1.Flag(this.document, range, value.substring(2, index), vscode_languageserver_types_1.Range.create(nameStart, nameEnd), "", vscode_languageserver_types_1.Range.create(range.end, range.end)));
                    }
                    else {
                        let nameEnd = this.document.positionAt(this.document.offsetAt(range.start) + index);
                        this.flags.push(new flag_1.Flag(this.document, range, value.substring(2, nameIndex), vscode_languageserver_types_1.Range.create(nameStart, nameEnd), value.substring(nameIndex + 1), vscode_languageserver_types_1.Range.create(this.document.positionAt(this.document.offsetAt(range.start) + index + 1), range.end)));
                    }
                }
            }
        }
        return this.flags;
    }
    getArguments() {
        const args = super.getArguments();
        const flags = this.getFlags();
        if (flags.length === 0) {
            return args;
        }
        for (let i = 0; i < flags.length; i++) {
            args.shift();
        }
        return args;
    }
}
exports.ModifiableInstruction = ModifiableInstruction;


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 95:
/***/ (function(module, exports) {

(function (factory) {
    if ( true && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function () {
    /* --------------------------------------------------------------------------------------------
     * Copyright (c) Microsoft Corporation. All rights reserved.
     * Licensed under the MIT License. See License.txt in the project root for license information.
     * ------------------------------------------------------------------------------------------ */
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The Position namespace provides helper functions to work with
     * [Position](#Position) literals.
     */
    var Position;
    (function (Position) {
        /**
         * Creates a new Position literal from the given line and character.
         * @param line The position's line.
         * @param character The position's character.
         */
        function create(line, character) {
            return { line: line, character: character };
        }
        Position.create = create;
        /**
         * Checks whether the given liternal conforms to the [Position](#Position) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.number(candidate.line) && Is.number(candidate.character);
        }
        Position.is = is;
    })(Position = exports.Position || (exports.Position = {}));
    /**
     * The Range namespace provides helper functions to work with
     * [Range](#Range) literals.
     */
    var Range;
    (function (Range) {
        function create(one, two, three, four) {
            if (Is.number(one) && Is.number(two) && Is.number(three) && Is.number(four)) {
                return { start: Position.create(one, two), end: Position.create(three, four) };
            }
            else if (Position.is(one) && Position.is(two)) {
                return { start: one, end: two };
            }
            else {
                throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
            }
        }
        Range.create = create;
        /**
         * Checks whether the given literal conforms to the [Range](#Range) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
        }
        Range.is = is;
    })(Range = exports.Range || (exports.Range = {}));
    /**
     * The Location namespace provides helper functions to work with
     * [Location](#Location) literals.
     */
    var Location;
    (function (Location) {
        /**
         * Creates a Location literal.
         * @param uri The location's uri.
         * @param range The location's range.
         */
        function create(uri, range) {
            return { uri: uri, range: range };
        }
        Location.create = create;
        /**
         * Checks whether the given literal conforms to the [Location](#Location) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
        }
        Location.is = is;
    })(Location = exports.Location || (exports.Location = {}));
    /**
     * The LocationLink namespace provides helper functions to work with
     * [LocationLink](#LocationLink) literals.
     */
    var LocationLink;
    (function (LocationLink) {
        /**
         * Creates a LocationLink literal.
         * @param targetUri The definition's uri.
         * @param targetRange The full range of the definition.
         * @param targetSelectionRange The span of the symbol definition at the target.
         * @param originSelectionRange The span of the symbol being defined in the originating source file.
         */
        function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
            return { targetUri: targetUri, targetRange: targetRange, targetSelectionRange: targetSelectionRange, originSelectionRange: originSelectionRange };
        }
        LocationLink.create = create;
        /**
         * Checks whether the given literal conforms to the [LocationLink](#LocationLink) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.targetRange) && Is.string(candidate.targetUri)
                && (Range.is(candidate.targetSelectionRange) || Is.undefined(candidate.targetSelectionRange))
                && (Range.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
        }
        LocationLink.is = is;
    })(LocationLink = exports.LocationLink || (exports.LocationLink = {}));
    /**
     * The Color namespace provides helper functions to work with
     * [Color](#Color) literals.
     */
    var Color;
    (function (Color) {
        /**
         * Creates a new Color literal.
         */
        function create(red, green, blue, alpha) {
            return {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha,
            };
        }
        Color.create = create;
        /**
         * Checks whether the given literal conforms to the [Color](#Color) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.number(candidate.red)
                && Is.number(candidate.green)
                && Is.number(candidate.blue)
                && Is.number(candidate.alpha);
        }
        Color.is = is;
    })(Color = exports.Color || (exports.Color = {}));
    /**
     * The ColorInformation namespace provides helper functions to work with
     * [ColorInformation](#ColorInformation) literals.
     */
    var ColorInformation;
    (function (ColorInformation) {
        /**
         * Creates a new ColorInformation literal.
         */
        function create(range, color) {
            return {
                range: range,
                color: color,
            };
        }
        ColorInformation.create = create;
        /**
         * Checks whether the given literal conforms to the [ColorInformation](#ColorInformation) interface.
         */
        function is(value) {
            var candidate = value;
            return Range.is(candidate.range) && Color.is(candidate.color);
        }
        ColorInformation.is = is;
    })(ColorInformation = exports.ColorInformation || (exports.ColorInformation = {}));
    /**
     * The Color namespace provides helper functions to work with
     * [ColorPresentation](#ColorPresentation) literals.
     */
    var ColorPresentation;
    (function (ColorPresentation) {
        /**
         * Creates a new ColorInformation literal.
         */
        function create(label, textEdit, additionalTextEdits) {
            return {
                label: label,
                textEdit: textEdit,
                additionalTextEdits: additionalTextEdits,
            };
        }
        ColorPresentation.create = create;
        /**
         * Checks whether the given literal conforms to the [ColorInformation](#ColorInformation) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.string(candidate.label)
                && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate))
                && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
        }
        ColorPresentation.is = is;
    })(ColorPresentation = exports.ColorPresentation || (exports.ColorPresentation = {}));
    /**
     * Enum of known range kinds
     */
    var FoldingRangeKind;
    (function (FoldingRangeKind) {
        /**
         * Folding range for a comment
         */
        FoldingRangeKind["Comment"] = "comment";
        /**
         * Folding range for a imports or includes
         */
        FoldingRangeKind["Imports"] = "imports";
        /**
         * Folding range for a region (e.g. `#region`)
         */
        FoldingRangeKind["Region"] = "region";
    })(FoldingRangeKind = exports.FoldingRangeKind || (exports.FoldingRangeKind = {}));
    /**
     * The folding range namespace provides helper functions to work with
     * [FoldingRange](#FoldingRange) literals.
     */
    var FoldingRange;
    (function (FoldingRange) {
        /**
         * Creates a new FoldingRange literal.
         */
        function create(startLine, endLine, startCharacter, endCharacter, kind) {
            var result = {
                startLine: startLine,
                endLine: endLine
            };
            if (Is.defined(startCharacter)) {
                result.startCharacter = startCharacter;
            }
            if (Is.defined(endCharacter)) {
                result.endCharacter = endCharacter;
            }
            if (Is.defined(kind)) {
                result.kind = kind;
            }
            return result;
        }
        FoldingRange.create = create;
        /**
         * Checks whether the given literal conforms to the [FoldingRange](#FoldingRange) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.number(candidate.startLine) && Is.number(candidate.startLine)
                && (Is.undefined(candidate.startCharacter) || Is.number(candidate.startCharacter))
                && (Is.undefined(candidate.endCharacter) || Is.number(candidate.endCharacter))
                && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
        }
        FoldingRange.is = is;
    })(FoldingRange = exports.FoldingRange || (exports.FoldingRange = {}));
    /**
     * The DiagnosticRelatedInformation namespace provides helper functions to work with
     * [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) literals.
     */
    var DiagnosticRelatedInformation;
    (function (DiagnosticRelatedInformation) {
        /**
         * Creates a new DiagnosticRelatedInformation literal.
         */
        function create(location, message) {
            return {
                location: location,
                message: message
            };
        }
        DiagnosticRelatedInformation.create = create;
        /**
         * Checks whether the given literal conforms to the [DiagnosticRelatedInformation](#DiagnosticRelatedInformation) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
        }
        DiagnosticRelatedInformation.is = is;
    })(DiagnosticRelatedInformation = exports.DiagnosticRelatedInformation || (exports.DiagnosticRelatedInformation = {}));
    /**
     * The diagnostic's severity.
     */
    var DiagnosticSeverity;
    (function (DiagnosticSeverity) {
        /**
         * Reports an error.
         */
        DiagnosticSeverity.Error = 1;
        /**
         * Reports a warning.
         */
        DiagnosticSeverity.Warning = 2;
        /**
         * Reports an information.
         */
        DiagnosticSeverity.Information = 3;
        /**
         * Reports a hint.
         */
        DiagnosticSeverity.Hint = 4;
    })(DiagnosticSeverity = exports.DiagnosticSeverity || (exports.DiagnosticSeverity = {}));
    /**
     * The diagnostic tags.
     *
     * @since 3.15.0
     */
    var DiagnosticTag;
    (function (DiagnosticTag) {
        /**
         * Unused or unnecessary code.
         *
         * Clients are allowed to render diagnostics with this tag faded out instead of having
         * an error squiggle.
         */
        DiagnosticTag.Unnecessary = 1;
        /**
         * Deprecated or obsolete code.
         *
         * Clients are allowed to rendered diagnostics with this tag strike through.
         */
        DiagnosticTag.Deprecated = 2;
    })(DiagnosticTag = exports.DiagnosticTag || (exports.DiagnosticTag = {}));
    /**
     * The Diagnostic namespace provides helper functions to work with
     * [Diagnostic](#Diagnostic) literals.
     */
    var Diagnostic;
    (function (Diagnostic) {
        /**
         * Creates a new Diagnostic literal.
         */
        function create(range, message, severity, code, source, relatedInformation) {
            var result = { range: range, message: message };
            if (Is.defined(severity)) {
                result.severity = severity;
            }
            if (Is.defined(code)) {
                result.code = code;
            }
            if (Is.defined(source)) {
                result.source = source;
            }
            if (Is.defined(relatedInformation)) {
                result.relatedInformation = relatedInformation;
            }
            return result;
        }
        Diagnostic.create = create;
        /**
         * Checks whether the given literal conforms to the [Diagnostic](#Diagnostic) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate)
                && Range.is(candidate.range)
                && Is.string(candidate.message)
                && (Is.number(candidate.severity) || Is.undefined(candidate.severity))
                && (Is.number(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code))
                && (Is.string(candidate.source) || Is.undefined(candidate.source))
                && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
        }
        Diagnostic.is = is;
    })(Diagnostic = exports.Diagnostic || (exports.Diagnostic = {}));
    /**
     * The Command namespace provides helper functions to work with
     * [Command](#Command) literals.
     */
    var Command;
    (function (Command) {
        /**
         * Creates a new Command literal.
         */
        function create(title, command) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result = { title: title, command: command };
            if (Is.defined(args) && args.length > 0) {
                result.arguments = args;
            }
            return result;
        }
        Command.create = create;
        /**
         * Checks whether the given literal conforms to the [Command](#Command) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
        }
        Command.is = is;
    })(Command = exports.Command || (exports.Command = {}));
    /**
     * The TextEdit namespace provides helper function to create replace,
     * insert and delete edits more easily.
     */
    var TextEdit;
    (function (TextEdit) {
        /**
         * Creates a replace text edit.
         * @param range The range of text to be replaced.
         * @param newText The new text.
         */
        function replace(range, newText) {
            return { range: range, newText: newText };
        }
        TextEdit.replace = replace;
        /**
         * Creates a insert text edit.
         * @param position The position to insert the text at.
         * @param newText The text to be inserted.
         */
        function insert(position, newText) {
            return { range: { start: position, end: position }, newText: newText };
        }
        TextEdit.insert = insert;
        /**
         * Creates a delete text edit.
         * @param range The range of text to be deleted.
         */
        function del(range) {
            return { range: range, newText: '' };
        }
        TextEdit.del = del;
        function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate)
                && Is.string(candidate.newText)
                && Range.is(candidate.range);
        }
        TextEdit.is = is;
    })(TextEdit = exports.TextEdit || (exports.TextEdit = {}));
    /**
     * The TextDocumentEdit namespace provides helper function to create
     * an edit that manipulates a text document.
     */
    var TextDocumentEdit;
    (function (TextDocumentEdit) {
        /**
         * Creates a new `TextDocumentEdit`
         */
        function create(textDocument, edits) {
            return { textDocument: textDocument, edits: edits };
        }
        TextDocumentEdit.create = create;
        function is(value) {
            var candidate = value;
            return Is.defined(candidate)
                && VersionedTextDocumentIdentifier.is(candidate.textDocument)
                && Array.isArray(candidate.edits);
        }
        TextDocumentEdit.is = is;
    })(TextDocumentEdit = exports.TextDocumentEdit || (exports.TextDocumentEdit = {}));
    var CreateFile;
    (function (CreateFile) {
        function create(uri, options) {
            var result = {
                kind: 'create',
                uri: uri
            };
            if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
                result.options = options;
            }
            return result;
        }
        CreateFile.create = create;
        function is(value) {
            var candidate = value;
            return candidate && candidate.kind === 'create' && Is.string(candidate.uri) &&
                (candidate.options === void 0 ||
                    ((candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))));
        }
        CreateFile.is = is;
    })(CreateFile = exports.CreateFile || (exports.CreateFile = {}));
    var RenameFile;
    (function (RenameFile) {
        function create(oldUri, newUri, options) {
            var result = {
                kind: 'rename',
                oldUri: oldUri,
                newUri: newUri
            };
            if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
                result.options = options;
            }
            return result;
        }
        RenameFile.create = create;
        function is(value) {
            var candidate = value;
            return candidate && candidate.kind === 'rename' && Is.string(candidate.oldUri) && Is.string(candidate.newUri) &&
                (candidate.options === void 0 ||
                    ((candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))));
        }
        RenameFile.is = is;
    })(RenameFile = exports.RenameFile || (exports.RenameFile = {}));
    var DeleteFile;
    (function (DeleteFile) {
        function create(uri, options) {
            var result = {
                kind: 'delete',
                uri: uri
            };
            if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
                result.options = options;
            }
            return result;
        }
        DeleteFile.create = create;
        function is(value) {
            var candidate = value;
            return candidate && candidate.kind === 'delete' && Is.string(candidate.uri) &&
                (candidate.options === void 0 ||
                    ((candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))));
        }
        DeleteFile.is = is;
    })(DeleteFile = exports.DeleteFile || (exports.DeleteFile = {}));
    var WorkspaceEdit;
    (function (WorkspaceEdit) {
        function is(value) {
            var candidate = value;
            return candidate &&
                (candidate.changes !== void 0 || candidate.documentChanges !== void 0) &&
                (candidate.documentChanges === void 0 || candidate.documentChanges.every(function (change) {
                    if (Is.string(change.kind)) {
                        return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
                    }
                    else {
                        return TextDocumentEdit.is(change);
                    }
                }));
        }
        WorkspaceEdit.is = is;
    })(WorkspaceEdit = exports.WorkspaceEdit || (exports.WorkspaceEdit = {}));
    var TextEditChangeImpl = /** @class */ (function () {
        function TextEditChangeImpl(edits) {
            this.edits = edits;
        }
        TextEditChangeImpl.prototype.insert = function (position, newText) {
            this.edits.push(TextEdit.insert(position, newText));
        };
        TextEditChangeImpl.prototype.replace = function (range, newText) {
            this.edits.push(TextEdit.replace(range, newText));
        };
        TextEditChangeImpl.prototype.delete = function (range) {
            this.edits.push(TextEdit.del(range));
        };
        TextEditChangeImpl.prototype.add = function (edit) {
            this.edits.push(edit);
        };
        TextEditChangeImpl.prototype.all = function () {
            return this.edits;
        };
        TextEditChangeImpl.prototype.clear = function () {
            this.edits.splice(0, this.edits.length);
        };
        return TextEditChangeImpl;
    }());
    /**
     * A workspace change helps constructing changes to a workspace.
     */
    var WorkspaceChange = /** @class */ (function () {
        function WorkspaceChange(workspaceEdit) {
            var _this = this;
            this._textEditChanges = Object.create(null);
            if (workspaceEdit) {
                this._workspaceEdit = workspaceEdit;
                if (workspaceEdit.documentChanges) {
                    workspaceEdit.documentChanges.forEach(function (change) {
                        if (TextDocumentEdit.is(change)) {
                            var textEditChange = new TextEditChangeImpl(change.edits);
                            _this._textEditChanges[change.textDocument.uri] = textEditChange;
                        }
                    });
                }
                else if (workspaceEdit.changes) {
                    Object.keys(workspaceEdit.changes).forEach(function (key) {
                        var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                        _this._textEditChanges[key] = textEditChange;
                    });
                }
            }
        }
        Object.defineProperty(WorkspaceChange.prototype, "edit", {
            /**
             * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
             * use to be returned from a workspace edit operation like rename.
             */
            get: function () {
                return this._workspaceEdit;
            },
            enumerable: true,
            configurable: true
        });
        WorkspaceChange.prototype.getTextEditChange = function (key) {
            if (VersionedTextDocumentIdentifier.is(key)) {
                if (!this._workspaceEdit) {
                    this._workspaceEdit = {
                        documentChanges: []
                    };
                }
                if (!this._workspaceEdit.documentChanges) {
                    throw new Error('Workspace edit is not configured for document changes.');
                }
                var textDocument = key;
                var result = this._textEditChanges[textDocument.uri];
                if (!result) {
                    var edits = [];
                    var textDocumentEdit = {
                        textDocument: textDocument,
                        edits: edits
                    };
                    this._workspaceEdit.documentChanges.push(textDocumentEdit);
                    result = new TextEditChangeImpl(edits);
                    this._textEditChanges[textDocument.uri] = result;
                }
                return result;
            }
            else {
                if (!this._workspaceEdit) {
                    this._workspaceEdit = {
                        changes: Object.create(null)
                    };
                }
                if (!this._workspaceEdit.changes) {
                    throw new Error('Workspace edit is not configured for normal text edit changes.');
                }
                var result = this._textEditChanges[key];
                if (!result) {
                    var edits = [];
                    this._workspaceEdit.changes[key] = edits;
                    result = new TextEditChangeImpl(edits);
                    this._textEditChanges[key] = result;
                }
                return result;
            }
        };
        WorkspaceChange.prototype.createFile = function (uri, options) {
            this.checkDocumentChanges();
            this._workspaceEdit.documentChanges.push(CreateFile.create(uri, options));
        };
        WorkspaceChange.prototype.renameFile = function (oldUri, newUri, options) {
            this.checkDocumentChanges();
            this._workspaceEdit.documentChanges.push(RenameFile.create(oldUri, newUri, options));
        };
        WorkspaceChange.prototype.deleteFile = function (uri, options) {
            this.checkDocumentChanges();
            this._workspaceEdit.documentChanges.push(DeleteFile.create(uri, options));
        };
        WorkspaceChange.prototype.checkDocumentChanges = function () {
            if (!this._workspaceEdit || !this._workspaceEdit.documentChanges) {
                throw new Error('Workspace edit is not configured for document changes.');
            }
        };
        return WorkspaceChange;
    }());
    exports.WorkspaceChange = WorkspaceChange;
    /**
     * The TextDocumentIdentifier namespace provides helper functions to work with
     * [TextDocumentIdentifier](#TextDocumentIdentifier) literals.
     */
    var TextDocumentIdentifier;
    (function (TextDocumentIdentifier) {
        /**
         * Creates a new TextDocumentIdentifier literal.
         * @param uri The document's uri.
         */
        function create(uri) {
            return { uri: uri };
        }
        TextDocumentIdentifier.create = create;
        /**
         * Checks whether the given literal conforms to the [TextDocumentIdentifier](#TextDocumentIdentifier) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri);
        }
        TextDocumentIdentifier.is = is;
    })(TextDocumentIdentifier = exports.TextDocumentIdentifier || (exports.TextDocumentIdentifier = {}));
    /**
     * The VersionedTextDocumentIdentifier namespace provides helper functions to work with
     * [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) literals.
     */
    var VersionedTextDocumentIdentifier;
    (function (VersionedTextDocumentIdentifier) {
        /**
         * Creates a new VersionedTextDocumentIdentifier literal.
         * @param uri The document's uri.
         * @param uri The document's text.
         */
        function create(uri, version) {
            return { uri: uri, version: version };
        }
        VersionedTextDocumentIdentifier.create = create;
        /**
         * Checks whether the given literal conforms to the [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.number(candidate.version));
        }
        VersionedTextDocumentIdentifier.is = is;
    })(VersionedTextDocumentIdentifier = exports.VersionedTextDocumentIdentifier || (exports.VersionedTextDocumentIdentifier = {}));
    /**
     * The TextDocumentItem namespace provides helper functions to work with
     * [TextDocumentItem](#TextDocumentItem) literals.
     */
    var TextDocumentItem;
    (function (TextDocumentItem) {
        /**
         * Creates a new TextDocumentItem literal.
         * @param uri The document's uri.
         * @param languageId The document's language identifier.
         * @param version The document's version number.
         * @param text The document's text.
         */
        function create(uri, languageId, version, text) {
            return { uri: uri, languageId: languageId, version: version, text: text };
        }
        TextDocumentItem.create = create;
        /**
         * Checks whether the given literal conforms to the [TextDocumentItem](#TextDocumentItem) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.number(candidate.version) && Is.string(candidate.text);
        }
        TextDocumentItem.is = is;
    })(TextDocumentItem = exports.TextDocumentItem || (exports.TextDocumentItem = {}));
    /**
     * Describes the content type that a client supports in various
     * result literals like `Hover`, `ParameterInfo` or `CompletionItem`.
     *
     * Please note that `MarkupKinds` must not start with a `$`. This kinds
     * are reserved for internal usage.
     */
    var MarkupKind;
    (function (MarkupKind) {
        /**
         * Plain text is supported as a content format
         */
        MarkupKind.PlainText = 'plaintext';
        /**
         * Markdown is supported as a content format
         */
        MarkupKind.Markdown = 'markdown';
    })(MarkupKind = exports.MarkupKind || (exports.MarkupKind = {}));
    (function (MarkupKind) {
        /**
         * Checks whether the given value is a value of the [MarkupKind](#MarkupKind) type.
         */
        function is(value) {
            var candidate = value;
            return candidate === MarkupKind.PlainText || candidate === MarkupKind.Markdown;
        }
        MarkupKind.is = is;
    })(MarkupKind = exports.MarkupKind || (exports.MarkupKind = {}));
    var MarkupContent;
    (function (MarkupContent) {
        /**
         * Checks whether the given value conforms to the [MarkupContent](#MarkupContent) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
        }
        MarkupContent.is = is;
    })(MarkupContent = exports.MarkupContent || (exports.MarkupContent = {}));
    /**
     * The kind of a completion entry.
     */
    var CompletionItemKind;
    (function (CompletionItemKind) {
        CompletionItemKind.Text = 1;
        CompletionItemKind.Method = 2;
        CompletionItemKind.Function = 3;
        CompletionItemKind.Constructor = 4;
        CompletionItemKind.Field = 5;
        CompletionItemKind.Variable = 6;
        CompletionItemKind.Class = 7;
        CompletionItemKind.Interface = 8;
        CompletionItemKind.Module = 9;
        CompletionItemKind.Property = 10;
        CompletionItemKind.Unit = 11;
        CompletionItemKind.Value = 12;
        CompletionItemKind.Enum = 13;
        CompletionItemKind.Keyword = 14;
        CompletionItemKind.Snippet = 15;
        CompletionItemKind.Color = 16;
        CompletionItemKind.File = 17;
        CompletionItemKind.Reference = 18;
        CompletionItemKind.Folder = 19;
        CompletionItemKind.EnumMember = 20;
        CompletionItemKind.Constant = 21;
        CompletionItemKind.Struct = 22;
        CompletionItemKind.Event = 23;
        CompletionItemKind.Operator = 24;
        CompletionItemKind.TypeParameter = 25;
    })(CompletionItemKind = exports.CompletionItemKind || (exports.CompletionItemKind = {}));
    /**
     * Defines whether the insert text in a completion item should be interpreted as
     * plain text or a snippet.
     */
    var InsertTextFormat;
    (function (InsertTextFormat) {
        /**
         * The primary text to be inserted is treated as a plain string.
         */
        InsertTextFormat.PlainText = 1;
        /**
         * The primary text to be inserted is treated as a snippet.
         *
         * A snippet can define tab stops and placeholders with `$1`, `$2`
         * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
         * the end of the snippet. Placeholders with equal identifiers are linked,
         * that is typing in one will update others too.
         *
         * See also: https://github.com/Microsoft/vscode/blob/master/src/vs/editor/contrib/snippet/common/snippet.md
         */
        InsertTextFormat.Snippet = 2;
    })(InsertTextFormat = exports.InsertTextFormat || (exports.InsertTextFormat = {}));
    /**
     * Completion item tags are extra annotations that tweak the rendering of a completion
     * item.
     *
     * @since 3.15.0
     */
    var CompletionItemTag;
    (function (CompletionItemTag) {
        /**
         * Render a completion as obsolete, usually using a strike-out.
         */
        CompletionItemTag.Deprecated = 1;
    })(CompletionItemTag = exports.CompletionItemTag || (exports.CompletionItemTag = {}));
    /**
     * The CompletionItem namespace provides functions to deal with
     * completion items.
     */
    var CompletionItem;
    (function (CompletionItem) {
        /**
         * Create a completion item and seed it with a label.
         * @param label The completion item's label
         */
        function create(label) {
            return { label: label };
        }
        CompletionItem.create = create;
    })(CompletionItem = exports.CompletionItem || (exports.CompletionItem = {}));
    /**
     * The CompletionList namespace provides functions to deal with
     * completion lists.
     */
    var CompletionList;
    (function (CompletionList) {
        /**
         * Creates a new completion list.
         *
         * @param items The completion items.
         * @param isIncomplete The list is not complete.
         */
        function create(items, isIncomplete) {
            return { items: items ? items : [], isIncomplete: !!isIncomplete };
        }
        CompletionList.create = create;
    })(CompletionList = exports.CompletionList || (exports.CompletionList = {}));
    var MarkedString;
    (function (MarkedString) {
        /**
         * Creates a marked string from plain text.
         *
         * @param plainText The plain text.
         */
        function fromPlainText(plainText) {
            return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
        }
        MarkedString.fromPlainText = fromPlainText;
        /**
         * Checks whether the given value conforms to the [MarkedString](#MarkedString) type.
         */
        function is(value) {
            var candidate = value;
            return Is.string(candidate) || (Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value));
        }
        MarkedString.is = is;
    })(MarkedString = exports.MarkedString || (exports.MarkedString = {}));
    var Hover;
    (function (Hover) {
        /**
         * Checks whether the given value conforms to the [Hover](#Hover) interface.
         */
        function is(value) {
            var candidate = value;
            return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) ||
                MarkedString.is(candidate.contents) ||
                Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range.is(value.range));
        }
        Hover.is = is;
    })(Hover = exports.Hover || (exports.Hover = {}));
    /**
     * The ParameterInformation namespace provides helper functions to work with
     * [ParameterInformation](#ParameterInformation) literals.
     */
    var ParameterInformation;
    (function (ParameterInformation) {
        /**
         * Creates a new parameter information literal.
         *
         * @param label A label string.
         * @param documentation A doc string.
         */
        function create(label, documentation) {
            return documentation ? { label: label, documentation: documentation } : { label: label };
        }
        ParameterInformation.create = create;
    })(ParameterInformation = exports.ParameterInformation || (exports.ParameterInformation = {}));
    /**
     * The SignatureInformation namespace provides helper functions to work with
     * [SignatureInformation](#SignatureInformation) literals.
     */
    var SignatureInformation;
    (function (SignatureInformation) {
        function create(label, documentation) {
            var parameters = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                parameters[_i - 2] = arguments[_i];
            }
            var result = { label: label };
            if (Is.defined(documentation)) {
                result.documentation = documentation;
            }
            if (Is.defined(parameters)) {
                result.parameters = parameters;
            }
            else {
                result.parameters = [];
            }
            return result;
        }
        SignatureInformation.create = create;
    })(SignatureInformation = exports.SignatureInformation || (exports.SignatureInformation = {}));
    /**
     * A document highlight kind.
     */
    var DocumentHighlightKind;
    (function (DocumentHighlightKind) {
        /**
         * A textual occurrence.
         */
        DocumentHighlightKind.Text = 1;
        /**
         * Read-access of a symbol, like reading a variable.
         */
        DocumentHighlightKind.Read = 2;
        /**
         * Write-access of a symbol, like writing to a variable.
         */
        DocumentHighlightKind.Write = 3;
    })(DocumentHighlightKind = exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
    /**
     * DocumentHighlight namespace to provide helper functions to work with
     * [DocumentHighlight](#DocumentHighlight) literals.
     */
    var DocumentHighlight;
    (function (DocumentHighlight) {
        /**
         * Create a DocumentHighlight object.
         * @param range The range the highlight applies to.
         */
        function create(range, kind) {
            var result = { range: range };
            if (Is.number(kind)) {
                result.kind = kind;
            }
            return result;
        }
        DocumentHighlight.create = create;
    })(DocumentHighlight = exports.DocumentHighlight || (exports.DocumentHighlight = {}));
    /**
     * A symbol kind.
     */
    var SymbolKind;
    (function (SymbolKind) {
        SymbolKind.File = 1;
        SymbolKind.Module = 2;
        SymbolKind.Namespace = 3;
        SymbolKind.Package = 4;
        SymbolKind.Class = 5;
        SymbolKind.Method = 6;
        SymbolKind.Property = 7;
        SymbolKind.Field = 8;
        SymbolKind.Constructor = 9;
        SymbolKind.Enum = 10;
        SymbolKind.Interface = 11;
        SymbolKind.Function = 12;
        SymbolKind.Variable = 13;
        SymbolKind.Constant = 14;
        SymbolKind.String = 15;
        SymbolKind.Number = 16;
        SymbolKind.Boolean = 17;
        SymbolKind.Array = 18;
        SymbolKind.Object = 19;
        SymbolKind.Key = 20;
        SymbolKind.Null = 21;
        SymbolKind.EnumMember = 22;
        SymbolKind.Struct = 23;
        SymbolKind.Event = 24;
        SymbolKind.Operator = 25;
        SymbolKind.TypeParameter = 26;
    })(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
    /**
     * Symbol tags are extra annotations that tweak the rendering of a symbol.
     * @since 3.15
     */
    var SymbolTag;
    (function (SymbolTag) {
        /**
         * Render a symbol as obsolete, usually using a strike-out.
         */
        SymbolTag.Deprecated = 1;
    })(SymbolTag = exports.SymbolTag || (exports.SymbolTag = {}));
    var SymbolInformation;
    (function (SymbolInformation) {
        /**
         * Creates a new symbol information literal.
         *
         * @param name The name of the symbol.
         * @param kind The kind of the symbol.
         * @param range The range of the location of the symbol.
         * @param uri The resource of the location of symbol, defaults to the current document.
         * @param containerName The name of the symbol containing the symbol.
         */
        function create(name, kind, range, uri, containerName) {
            var result = {
                name: name,
                kind: kind,
                location: { uri: uri, range: range }
            };
            if (containerName) {
                result.containerName = containerName;
            }
            return result;
        }
        SymbolInformation.create = create;
    })(SymbolInformation = exports.SymbolInformation || (exports.SymbolInformation = {}));
    var DocumentSymbol;
    (function (DocumentSymbol) {
        /**
         * Creates a new symbol information literal.
         *
         * @param name The name of the symbol.
         * @param detail The detail of the symbol.
         * @param kind The kind of the symbol.
         * @param range The range of the symbol.
         * @param selectionRange The selectionRange of the symbol.
         * @param children Children of the symbol.
         */
        function create(name, detail, kind, range, selectionRange, children) {
            var result = {
                name: name,
                detail: detail,
                kind: kind,
                range: range,
                selectionRange: selectionRange
            };
            if (children !== void 0) {
                result.children = children;
            }
            return result;
        }
        DocumentSymbol.create = create;
        /**
         * Checks whether the given literal conforms to the [DocumentSymbol](#DocumentSymbol) interface.
         */
        function is(value) {
            var candidate = value;
            return candidate &&
                Is.string(candidate.name) && Is.number(candidate.kind) &&
                Range.is(candidate.range) && Range.is(candidate.selectionRange) &&
                (candidate.detail === void 0 || Is.string(candidate.detail)) &&
                (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) &&
                (candidate.children === void 0 || Array.isArray(candidate.children));
        }
        DocumentSymbol.is = is;
    })(DocumentSymbol = exports.DocumentSymbol || (exports.DocumentSymbol = {}));
    /**
     * A set of predefined code action kinds
     */
    var CodeActionKind;
    (function (CodeActionKind) {
        /**
         * Empty kind.
         */
        CodeActionKind.Empty = '';
        /**
         * Base kind for quickfix actions: 'quickfix'
         */
        CodeActionKind.QuickFix = 'quickfix';
        /**
         * Base kind for refactoring actions: 'refactor'
         */
        CodeActionKind.Refactor = 'refactor';
        /**
         * Base kind for refactoring extraction actions: 'refactor.extract'
         *
         * Example extract actions:
         *
         * - Extract method
         * - Extract function
         * - Extract variable
         * - Extract interface from class
         * - ...
         */
        CodeActionKind.RefactorExtract = 'refactor.extract';
        /**
         * Base kind for refactoring inline actions: 'refactor.inline'
         *
         * Example inline actions:
         *
         * - Inline function
         * - Inline variable
         * - Inline constant
         * - ...
         */
        CodeActionKind.RefactorInline = 'refactor.inline';
        /**
         * Base kind for refactoring rewrite actions: 'refactor.rewrite'
         *
         * Example rewrite actions:
         *
         * - Convert JavaScript function to class
         * - Add or remove parameter
         * - Encapsulate field
         * - Make method static
         * - Move method to base class
         * - ...
         */
        CodeActionKind.RefactorRewrite = 'refactor.rewrite';
        /**
         * Base kind for source actions: `source`
         *
         * Source code actions apply to the entire file.
         */
        CodeActionKind.Source = 'source';
        /**
         * Base kind for an organize imports source action: `source.organizeImports`
         */
        CodeActionKind.SourceOrganizeImports = 'source.organizeImports';
        /**
         * Base kind for auto-fix source actions: `source.fixAll`.
         *
         * Fix all actions automatically fix errors that have a clear fix that do not require user input.
         * They should not suppress errors or perform unsafe fixes such as generating new types or classes.
         *
         * @since 3.15.0
         */
        CodeActionKind.SourceFixAll = 'source.fixAll';
    })(CodeActionKind = exports.CodeActionKind || (exports.CodeActionKind = {}));
    /**
     * The CodeActionContext namespace provides helper functions to work with
     * [CodeActionContext](#CodeActionContext) literals.
     */
    var CodeActionContext;
    (function (CodeActionContext) {
        /**
         * Creates a new CodeActionContext literal.
         */
        function create(diagnostics, only) {
            var result = { diagnostics: diagnostics };
            if (only !== void 0 && only !== null) {
                result.only = only;
            }
            return result;
        }
        CodeActionContext.create = create;
        /**
         * Checks whether the given literal conforms to the [CodeActionContext](#CodeActionContext) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string));
        }
        CodeActionContext.is = is;
    })(CodeActionContext = exports.CodeActionContext || (exports.CodeActionContext = {}));
    var CodeAction;
    (function (CodeAction) {
        function create(title, commandOrEdit, kind) {
            var result = { title: title };
            if (Command.is(commandOrEdit)) {
                result.command = commandOrEdit;
            }
            else {
                result.edit = commandOrEdit;
            }
            if (kind !== void 0) {
                result.kind = kind;
            }
            return result;
        }
        CodeAction.create = create;
        function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.title) &&
                (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) &&
                (candidate.kind === void 0 || Is.string(candidate.kind)) &&
                (candidate.edit !== void 0 || candidate.command !== void 0) &&
                (candidate.command === void 0 || Command.is(candidate.command)) &&
                (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) &&
                (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
        }
        CodeAction.is = is;
    })(CodeAction = exports.CodeAction || (exports.CodeAction = {}));
    /**
     * The CodeLens namespace provides helper functions to work with
     * [CodeLens](#CodeLens) literals.
     */
    var CodeLens;
    (function (CodeLens) {
        /**
         * Creates a new CodeLens literal.
         */
        function create(range, data) {
            var result = { range: range };
            if (Is.defined(data)) {
                result.data = data;
            }
            return result;
        }
        CodeLens.create = create;
        /**
         * Checks whether the given literal conforms to the [CodeLens](#CodeLens) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
        }
        CodeLens.is = is;
    })(CodeLens = exports.CodeLens || (exports.CodeLens = {}));
    /**
     * The FormattingOptions namespace provides helper functions to work with
     * [FormattingOptions](#FormattingOptions) literals.
     */
    var FormattingOptions;
    (function (FormattingOptions) {
        /**
         * Creates a new FormattingOptions literal.
         */
        function create(tabSize, insertSpaces) {
            return { tabSize: tabSize, insertSpaces: insertSpaces };
        }
        FormattingOptions.create = create;
        /**
         * Checks whether the given literal conforms to the [FormattingOptions](#FormattingOptions) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.number(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
        }
        FormattingOptions.is = is;
    })(FormattingOptions = exports.FormattingOptions || (exports.FormattingOptions = {}));
    /**
     * The DocumentLink namespace provides helper functions to work with
     * [DocumentLink](#DocumentLink) literals.
     */
    var DocumentLink;
    (function (DocumentLink) {
        /**
         * Creates a new DocumentLink literal.
         */
        function create(range, target, data) {
            return { range: range, target: target, data: data };
        }
        DocumentLink.create = create;
        /**
         * Checks whether the given literal conforms to the [DocumentLink](#DocumentLink) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
        }
        DocumentLink.is = is;
    })(DocumentLink = exports.DocumentLink || (exports.DocumentLink = {}));
    /**
     * The SelectionRange namespace provides helper function to work with
     * SelectionRange literals.
     */
    var SelectionRange;
    (function (SelectionRange) {
        /**
         * Creates a new SelectionRange
         * @param range the range.
         * @param parent an optional parent.
         */
        function create(range, parent) {
            return { range: range, parent: parent };
        }
        SelectionRange.create = create;
        function is(value) {
            var candidate = value;
            return candidate !== undefined && Range.is(candidate.range) && (candidate.parent === undefined || SelectionRange.is(candidate.parent));
        }
        SelectionRange.is = is;
    })(SelectionRange = exports.SelectionRange || (exports.SelectionRange = {}));
    exports.EOL = ['\n', '\r\n', '\r'];
    /**
     * @deprecated Use the text document from the new vscode-languageserver-textdocument package.
     */
    var TextDocument;
    (function (TextDocument) {
        /**
         * Creates a new ITextDocument literal from the given uri and content.
         * @param uri The document's uri.
         * @param languageId  The document's language Id.
         * @param content The document's content.
         */
        function create(uri, languageId, version, content) {
            return new FullTextDocument(uri, languageId, version, content);
        }
        TextDocument.create = create;
        /**
         * Checks whether the given literal conforms to the [ITextDocument](#ITextDocument) interface.
         */
        function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.number(candidate.lineCount)
                && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
        }
        TextDocument.is = is;
        function applyEdits(document, edits) {
            var text = document.getText();
            var sortedEdits = mergeSort(edits, function (a, b) {
                var diff = a.range.start.line - b.range.start.line;
                if (diff === 0) {
                    return a.range.start.character - b.range.start.character;
                }
                return diff;
            });
            var lastModifiedOffset = text.length;
            for (var i = sortedEdits.length - 1; i >= 0; i--) {
                var e = sortedEdits[i];
                var startOffset = document.offsetAt(e.range.start);
                var endOffset = document.offsetAt(e.range.end);
                if (endOffset <= lastModifiedOffset) {
                    text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
                }
                else {
                    throw new Error('Overlapping edit');
                }
                lastModifiedOffset = startOffset;
            }
            return text;
        }
        TextDocument.applyEdits = applyEdits;
        function mergeSort(data, compare) {
            if (data.length <= 1) {
                // sorted
                return data;
            }
            var p = (data.length / 2) | 0;
            var left = data.slice(0, p);
            var right = data.slice(p);
            mergeSort(left, compare);
            mergeSort(right, compare);
            var leftIdx = 0;
            var rightIdx = 0;
            var i = 0;
            while (leftIdx < left.length && rightIdx < right.length) {
                var ret = compare(left[leftIdx], right[rightIdx]);
                if (ret <= 0) {
                    // smaller_equal -> take left to preserve order
                    data[i++] = left[leftIdx++];
                }
                else {
                    // greater -> take right
                    data[i++] = right[rightIdx++];
                }
            }
            while (leftIdx < left.length) {
                data[i++] = left[leftIdx++];
            }
            while (rightIdx < right.length) {
                data[i++] = right[rightIdx++];
            }
            return data;
        }
    })(TextDocument = exports.TextDocument || (exports.TextDocument = {}));
    var FullTextDocument = /** @class */ (function () {
        function FullTextDocument(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = undefined;
        }
        Object.defineProperty(FullTextDocument.prototype, "uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FullTextDocument.prototype, "languageId", {
            get: function () {
                return this._languageId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FullTextDocument.prototype, "version", {
            get: function () {
                return this._version;
            },
            enumerable: true,
            configurable: true
        });
        FullTextDocument.prototype.getText = function (range) {
            if (range) {
                var start = this.offsetAt(range.start);
                var end = this.offsetAt(range.end);
                return this._content.substring(start, end);
            }
            return this._content;
        };
        FullTextDocument.prototype.update = function (event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = undefined;
        };
        FullTextDocument.prototype.getLineOffsets = function () {
            if (this._lineOffsets === undefined) {
                var lineOffsets = [];
                var text = this._content;
                var isLineStart = true;
                for (var i = 0; i < text.length; i++) {
                    if (isLineStart) {
                        lineOffsets.push(i);
                        isLineStart = false;
                    }
                    var ch = text.charAt(i);
                    isLineStart = (ch === '\r' || ch === '\n');
                    if (ch === '\r' && i + 1 < text.length && text.charAt(i + 1) === '\n') {
                        i++;
                    }
                }
                if (isLineStart && text.length > 0) {
                    lineOffsets.push(text.length);
                }
                this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
        };
        FullTextDocument.prototype.positionAt = function (offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
                return Position.create(0, offset);
            }
            while (low < high) {
                var mid = Math.floor((low + high) / 2);
                if (lineOffsets[mid] > offset) {
                    high = mid;
                }
                else {
                    low = mid + 1;
                }
            }
            // low is the least x for which the line offset is larger than the current offset
            // or array.length if no line offset is larger than the current offset
            var line = low - 1;
            return Position.create(line, offset - lineOffsets[line]);
        };
        FullTextDocument.prototype.offsetAt = function (position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
                return this._content.length;
            }
            else if (position.line < 0) {
                return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = (position.line + 1 < lineOffsets.length) ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
        };
        Object.defineProperty(FullTextDocument.prototype, "lineCount", {
            get: function () {
                return this.getLineOffsets().length;
            },
            enumerable: true,
            configurable: true
        });
        return FullTextDocument;
    }());
    var Is;
    (function (Is) {
        var toString = Object.prototype.toString;
        function defined(value) {
            return typeof value !== 'undefined';
        }
        Is.defined = defined;
        function undefined(value) {
            return typeof value === 'undefined';
        }
        Is.undefined = undefined;
        function boolean(value) {
            return value === true || value === false;
        }
        Is.boolean = boolean;
        function string(value) {
            return toString.call(value) === '[object String]';
        }
        Is.string = string;
        function number(value) {
            return toString.call(value) === '[object Number]';
        }
        Is.number = number;
        function func(value) {
            return toString.call(value) === '[object Function]';
        }
        Is.func = func;
        function objectLiteral(value) {
            // Strictly speaking class instances pass this check as well. Since the LSP
            // doesn't use classes we ignore this for now. If we do we need to add something
            // like this: `Object.getPrototypeOf(Object.getPrototypeOf(x)) === null`
            return value !== null && typeof value === 'object';
        }
        Is.objectLiteral = objectLiteral;
        function typedArray(value, check) {
            return Array.isArray(value) && value.every(check);
        }
        Is.typedArray = typedArray;
    })(Is || (Is = {}));
});


/***/ }),

/***/ 109:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(186);
const obfuscator_1 = __webpack_require__(414);
// import {readFileSync, writeFileSync} from 'fs';
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folder = core_1.getInput('folder');
            const dockerFile = yield fs_1.promises.readFile(path_1.join(folder, 'Dockerfile'));
            const obf = new obfuscator_1.Obfuscator(dockerFile.toString());
            const newDockerFile = obf.dumpEncrypted();
            yield fs_1.promises.writeFile(path_1.join(folder, 'Dockerfile'), newDockerFile);
            yield obf.compile(path_1.join(folder, 'csteps'));
        }
        catch (error) {
            // setFailed(error.message);
        }
    });
}
run();


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 162:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = __webpack_require__(95);
const ast = __webpack_require__(989);
const imageTemplate_1 = __webpack_require__(829);
const from_1 = __webpack_require__(970);
const util_1 = __webpack_require__(215);
const main_1 = __webpack_require__(989);
class Dockerfile extends imageTemplate_1.ImageTemplate {
    constructor(document) {
        super();
        this.initialInstructions = new imageTemplate_1.ImageTemplate();
        this.buildStages = [];
        this.directives = [];
        /**
         * Whether a FROM instruction has been added to this Dockerfile or not.
         */
        this.foundFrom = false;
        this.document = document;
    }
    getEscapeCharacter() {
        for (const directive of this.directives) {
            if (directive.getDirective() === ast.Directive.escape) {
                const value = directive.getValue();
                if (value === '\\' || value === '`') {
                    return value;
                }
            }
        }
        return '\\';
    }
    getInitialARGs() {
        return this.initialInstructions.getARGs();
    }
    getContainingImage(position) {
        let range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), this.document.positionAt(this.document.getText().length));
        if (!util_1.Util.isInsideRange(position, range)) {
            // not inside the document, invalid position
            return null;
        }
        if (this.initialInstructions.getComments().length > 0 || this.initialInstructions.getInstructions().length > 0) {
            if (util_1.Util.isInsideRange(position, this.initialInstructions.getRange())) {
                return this.initialInstructions;
            }
        }
        for (const buildStage of this.buildStages) {
            if (util_1.Util.isInsideRange(position, buildStage.getRange())) {
                return buildStage;
            }
        }
        return this;
    }
    addInstruction(instruction) {
        if (instruction.getKeyword() === main_1.Keyword.FROM) {
            this.currentBuildStage = new imageTemplate_1.ImageTemplate();
            this.buildStages.push(this.currentBuildStage);
            this.foundFrom = true;
        }
        else if (!this.foundFrom) {
            this.initialInstructions.addInstruction(instruction);
        }
        if (this.foundFrom) {
            this.currentBuildStage.addInstruction(instruction);
        }
        super.addInstruction(instruction);
    }
    setDirectives(directives) {
        this.directives = directives;
    }
    getDirective() {
        return this.directives.length === 0 ? null : this.directives[0];
    }
    getDirectives() {
        return this.directives;
    }
    resolveVariable(variable, line) {
        for (let from of this.getFROMs()) {
            let range = from.getRange();
            if (range.start.line <= line && line <= range.end.line) {
                // resolve the FROM variable against the initial ARGs
                let initialARGs = new imageTemplate_1.ImageTemplate();
                for (let instruction of this.initialInstructions.getARGs()) {
                    initialARGs.addInstruction(instruction);
                }
                return initialARGs.resolveVariable(variable, line);
            }
        }
        let image = this.getContainingImage(vscode_languageserver_types_1.Position.create(line, 0));
        if (image === null) {
            return undefined;
        }
        let resolvedVariable = image.resolveVariable(variable, line);
        if (resolvedVariable === null) {
            // refers to an uninitialized ARG variable,
            // try resolving it against the initial ARGs then
            let initialARGs = new imageTemplate_1.ImageTemplate();
            for (let instruction of this.initialInstructions.getARGs()) {
                initialARGs.addInstruction(instruction);
            }
            return initialARGs.resolveVariable(variable, line);
        }
        return resolvedVariable;
    }
    getAvailableVariables(currentLine) {
        if (this.getInstructionAt(currentLine) instanceof from_1.From) {
            let variables = [];
            for (let arg of this.getInitialARGs()) {
                let property = arg.getProperty();
                if (property) {
                    variables.push(property.getName());
                }
            }
            return variables;
        }
        let image = this.getContainingImage(vscode_languageserver_types_1.Position.create(currentLine, 0));
        return image ? image.getAvailableVariables(currentLine) : [];
    }
    /**
     * Internally reorganize the comments in the Dockerfile and allocate
     * them to the relevant build stages that they belong to.
     */
    organizeComments() {
        const comments = this.getComments();
        for (let i = 0; i < comments.length; i++) {
            if (util_1.Util.isInsideRange(comments[i].getRange().end, this.initialInstructions.getRange())) {
                this.initialInstructions.addComment(comments[i]);
            }
            else {
                for (const buildStage of this.buildStages) {
                    if (util_1.Util.isInsideRange(comments[i].getRange().start, buildStage.getRange())) {
                        buildStage.addComment(comments[i]);
                    }
                }
            }
        }
    }
    getRange() {
        const comments = this.getComments();
        const instructions = this.getInstructions();
        let range = null;
        if (comments.length === 0) {
            if (instructions.length > 0) {
                range = vscode_languageserver_types_1.Range.create(instructions[0].getRange().start, instructions[instructions.length - 1].getRange().end);
            }
        }
        else if (instructions.length === 0) {
            range = vscode_languageserver_types_1.Range.create(comments[0].getRange().start, comments[comments.length - 1].getRange().end);
        }
        else {
            const commentStart = comments[0].getRange().start;
            const commentEnd = comments[comments.length - 1].getRange().end;
            const instructionStart = instructions[0].getRange().start;
            const instructionEnd = instructions[instructions.length - 1].getRange().end;
            if (commentStart.line < instructionStart.line) {
                if (commentEnd.line < instructionEnd.line) {
                    range = vscode_languageserver_types_1.Range.create(commentStart, instructionEnd);
                }
                range = vscode_languageserver_types_1.Range.create(commentStart, commentEnd);
            }
            else if (commentEnd.line < instructionEnd.line) {
                range = vscode_languageserver_types_1.Range.create(instructionStart, instructionEnd);
            }
            else {
                range = vscode_languageserver_types_1.Range.create(instructionStart, commentEnd);
            }
        }
        if (range === null) {
            if (this.directives.length === 0) {
                return null;
            }
            return this.directives[0].getRange();
        }
        else if (this.directives.length === 0) {
            return range;
        }
        return vscode_languageserver_types_1.Range.create(this.directives[0].getRange().start, range.end);
    }
}
exports.Dockerfile = Dockerfile;


/***/ }),

/***/ 186:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(351);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 215:
/***/ (function(__unusedmodule, exports) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    static isWhitespace(char) {
        return char === ' ' || char === '\t' || Util.isNewline(char);
    }
    static isNewline(char) {
        return char === '\r' || char === '\n';
    }
    static findLeadingNonWhitespace(content, escapeChar) {
        whitespaceCheck: for (let i = 0; i < content.length; i++) {
            switch (content.charAt(i)) {
                case ' ':
                case '\t':
                    continue;
                case escapeChar:
                    escapeCheck: for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                // offset one more for \r\n
                                i = j + 1;
                                continue whitespaceCheck;
                            case '\n':
                                i = j;
                                continue whitespaceCheck;
                            default:
                                break escapeCheck;
                        }
                    }
                    // found an escape character and then reached EOF
                    return -1;
                default:
                    return i;
            }
        }
        // only possible if the content is the empty string
        return -1;
    }
    /**
     * Determines if the given position is contained within the given range.
     *
     * @param position the position to check
     * @param range the range to see if the position is inside of
     */
    static isInsideRange(position, range) {
        if (range.start.line === range.end.line) {
            return range.start.line === position.line
                && range.start.character <= position.character
                && position.character <= range.end.character;
        }
        else if (range.start.line === position.line) {
            return range.start.character <= position.character;
        }
        else if (range.end.line === position.line) {
            return position.character <= range.end.character;
        }
        return range.start.line < position.line && position.line < range.end.line;
    }
}
exports.Util = Util;


/***/ }),

/***/ 248:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class FlagOption {
    constructor(range, name, nameRange, value, valueRange) {
        this.range = range;
        this.name = name;
        this.nameRange = nameRange;
        this.value = value;
        this.valueRange = valueRange;
    }
    toString() {
        if (this.valueRange !== null) {
            return this.name + "=" + this.value;
        }
        return this.name;
    }
    getRange() {
        return this.range;
    }
    getName() {
        return this.name;
    }
    getNameRange() {
        return this.nameRange;
    }
    getValue() {
        return this.value;
    }
    getValueRange() {
        return this.valueRange;
    }
}
exports.FlagOption = FlagOption;


/***/ }),

/***/ 272:
/***/ (function(module) {

// This file has been generated from mustache.mjs
(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  /*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   *
   * Tokens for partials also contain two more elements: 1) a string value of
   * indendation prior to that tag and 2) the index of that tag on that line -
   * eg a value of 2 indicates the partial is the third tag on this line.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?
    var indentation = '';  // Tracks indentation for tags that use it
    var tagIndex = 0;      // Stores a count of number of tags encountered on a line

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += ' ';
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
            indentation = '';
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      if (type == '>') {
        token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
      } else {
        token = [ type, value, start, scanner.pos ];
      }
      tagIndex++;
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    stripSpace();

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index])
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.templateCache = {
      _cache: {},
      set: function set (key, value) {
        this._cache[key] = value;
      },
      get: function get (key) {
        return this._cache[key];
      },
      clear: function clear () {
        this._cache = {};
      }
    };
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    if (typeof this.templateCache !== 'undefined') {
      this.templateCache.clear();
    }
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.templateCache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var isCacheEnabled = typeof cache !== 'undefined';
    var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined;

    if (tokens == undefined) {
      tokens = parseTemplate(template, tags);
      isCacheEnabled && cache.set(cacheKey, tokens);
    }
    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `tags` argument is given here it must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   */
  Writer.prototype.render = function render (template, view, partials, tags) {
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view, undefined);
    return this.renderTokens(tokens, context, partials, template, tags);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, tags) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, tags);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, '');
    var partialByNl = partial.split('\n');
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join('\n');
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, tags) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      return this.renderTokens(this.parse(indentedValue, tags), context, partials, indentedValue, tags);
    }
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  var mustache = {
    name: 'mustache.js',
    version: '4.0.1',
    tags: [ '{{', '}}' ],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined,
    /**
     * Allows a user to override the default caching strategy, by providing an
     * object with set, get and clear methods. This can also be used to disable
     * the cache by setting it to the literal `undefined`.
     */
    set templateCache (cache) {
      defaultWriter.templateCache = cache;
    },
    /**
     * Gets the default or overridden caching object from the default writer.
     */
    get templateCache () {
      return defaultWriter.templateCache;
    }
  };

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer. If the optional `tags` argument is given here it must be an
   * array with two string values: the opening and closing tags used in the
   * template (e.g. [ "<%", "%>" ]). The default is to mustache.tags.
   */
  mustache.render = function render (template, view, partials, tags) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, tags);
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;

})));


/***/ }),

/***/ 282:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const instruction_1 = __webpack_require__(923);
const property_1 = __webpack_require__(965);
const argument_1 = __webpack_require__(485);
const util_1 = __webpack_require__(215);
class PropertyInstruction extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
        this.properties = undefined;
    }
    getProperties() {
        if (this.properties === undefined) {
            let args = this.getPropertyArguments();
            if (args.length === 0) {
                this.properties = [];
            }
            else if (args.length === 1) {
                this.properties = [new property_1.Property(this.document, this.escapeChar, args[0])];
            }
            else if (args.length === 2) {
                if (args[0].getValue().indexOf('=') === -1) {
                    this.properties = [new property_1.Property(this.document, this.escapeChar, args[0], args[1])];
                }
                else {
                    this.properties = [
                        new property_1.Property(this.document, this.escapeChar, args[0]),
                        new property_1.Property(this.document, this.escapeChar, args[1])
                    ];
                }
            }
            else if (args[0].getValue().indexOf('=') === -1) {
                let text = this.document.getText();
                let start = args[1].getRange().start;
                let end = args[args.length - 1].getRange().end;
                text = text.substring(this.document.offsetAt(start), this.document.offsetAt(end));
                this.properties = [new property_1.Property(this.document, this.escapeChar, args[0], new argument_1.Argument(text, vscode_languageserver_types_1.Range.create(args[1].getRange().start, args[args.length - 1].getRange().end)))];
            }
            else {
                this.properties = [];
                for (let i = 0; i < args.length; i++) {
                    this.properties.push(new property_1.Property(this.document, this.escapeChar, args[i]));
                }
            }
        }
        return this.properties;
    }
    /**
     * Goes from the back of the string and returns the first
     * non-whitespace character that is found. If an escape character
     * is found with newline characters, the escape character will
     * not be considered a non-whitespace character and its index in
     * the string will not be returned.
     *
     * @param content the string to search through
     * @return the index in the string for the first non-whitespace
     *         character when searching from the end of the string
     */
    findTrailingNonWhitespace(content) {
        // loop back to find the first non-whitespace character
        let index = content.length;
        whitespaceCheck: for (let i = content.length - 1; i >= 0; i--) {
            switch (content.charAt(i)) {
                case ' ':
                case '\t':
                    continue;
                case '\n':
                    if (content.charAt(i - 1) === '\r') {
                        i = i - 1;
                    }
                case '\r':
                    newlineCheck: for (let j = i - 1; j >= 0; j--) {
                        switch (content.charAt(j)) {
                            case ' ':
                            case '\t':
                            case '\r':
                            case '\n':
                            case this.escapeChar:
                                continue;
                            default:
                                index = j;
                                break newlineCheck;
                        }
                    }
                    break whitespaceCheck;
                default:
                    index = i;
                    break whitespaceCheck;
            }
        }
        return index;
    }
    getPropertyArguments() {
        const args = [];
        let range = this.getInstructionRange();
        let instructionNameEndOffset = this.document.offsetAt(range.end);
        let extra = instructionNameEndOffset - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra);
        let start = util_1.Util.findLeadingNonWhitespace(fullArgs, this.escapeChar);
        if (start === -1) {
            // only whitespace found, no arguments
            return [];
        }
        const startPosition = this.document.positionAt(instructionNameEndOffset + start);
        // records whether the parser has just processed an escaped newline or not,
        // if our starting position is not on the same line as the instruction then
        // the start of the content is already on an escaped line
        let escaped = range.start.line !== startPosition.line;
        // flag to track if the last character was an escape character
        let endingEscape = false;
        // position before the first escape character was hit
        let mark = -1;
        let end = this.findTrailingNonWhitespace(fullArgs);
        content = fullArgs.substring(start, end + 1);
        let argStart = escaped ? -1 : 0;
        let spaced = false;
        argumentLoop: for (let i = 0; i < content.length; i++) {
            let char = content.charAt(i);
            switch (char) {
                case this.escapeChar:
                    if (i + 1 === content.length) {
                        endingEscape = true;
                        break argumentLoop;
                    }
                    if (!escaped) {
                        mark = i;
                    }
                    switch (content.charAt(i + 1)) {
                        case ' ':
                        case '\t':
                            if (!util_1.Util.isWhitespace(content.charAt(i + 2))) {
                                // space was escaped, continue as normal
                                i = i + 1;
                                continue argumentLoop;
                            }
                            // whitespace encountered, need to figure out if it extends to EOL
                            whitespaceCheck: for (let j = i + 2; j < content.length; j++) {
                                switch (content.charAt(j)) {
                                    case '\r':
                                        // offset one more for \r\n
                                        j++;
                                    case '\n':
                                        // whitespace only, safe to skip
                                        escaped = true;
                                        i = j;
                                        continue argumentLoop;
                                    case ' ':
                                    case '\t':
                                        // ignore whitespace
                                        break;
                                    default:
                                        // whitespace doesn't extend to EOL, create an argument
                                        args.push(new argument_1.Argument(content.substring(argStart, i), vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + i + 2))));
                                        argStart = j;
                                        break whitespaceCheck;
                                }
                            }
                            // go back and start processing the encountered non-whitespace character
                            i = argStart - 1;
                            continue argumentLoop;
                        case '\r':
                            // offset one more for \r\n
                            i++;
                        case '\n':
                            // immediately followed by a newline, skip the newline
                            escaped = true;
                            i = i + 1;
                            continue argumentLoop;
                        case this.escapeChar:
                            // double escape found, skip it and move on
                            if (argStart === -1) {
                                argStart = i;
                            }
                            i = i + 1;
                            continue argumentLoop;
                        default:
                            if (argStart === -1) {
                                argStart = i;
                            }
                            // non-whitespace encountered, skip the escape and process the
                            // character normally
                            continue argumentLoop;
                    }
                case '\'':
                case '"':
                    if (argStart === -1) {
                        argStart = i;
                    }
                    for (let j = i + 1; j < content.length; j++) {
                        switch (content.charAt(j)) {
                            case char:
                                if (content.charAt(j + 1) !== ' ' && content.charAt(j + 1) !== '') {
                                    // there is more content after this quote,
                                    // continue so that it is all processed as
                                    // one single argument
                                    i = j;
                                    continue argumentLoop;
                                }
                                args.push(new argument_1.Argument(content.substring(argStart, j + 1), vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + j + 1))));
                                i = j;
                                argStart = -1;
                                continue argumentLoop;
                            case this.escapeChar:
                                j++;
                                break;
                        }
                    }
                    break argumentLoop;
                case ' ':
                case '\t':
                    if (escaped) {
                        // consider there to be a space only if an argument
                        // is not spanning multiple lines
                        if (argStart !== -1) {
                            spaced = true;
                        }
                    }
                    else if (argStart !== -1) {
                        args.push(new argument_1.Argument(content.substring(argStart, i), vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + i))));
                        argStart = -1;
                    }
                    break;
                case '\r':
                    // offset one more for \r\n
                    i++;
                case '\n':
                    spaced = false;
                    break;
                case '#':
                    if (escaped) {
                        // a newline was escaped and now there's a comment
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case '\r':
                                    j++;
                                case '\n':
                                    i = j;
                                    spaced = false;
                                    continue argumentLoop;
                            }
                        }
                        // went to the end without finding a newline,
                        // the comment was the last line in the instruction,
                        // just stop parsing, create an argument if needed
                        if (argStart !== -1) {
                            let value = content.substring(argStart, mark);
                            args.push(new argument_1.Argument(value, vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + mark))));
                            argStart = -1;
                        }
                        break argumentLoop;
                    }
                    else if (argStart === -1) {
                        argStart = i;
                    }
                    break;
                default:
                    if (spaced) {
                        if (argStart !== -1) {
                            args.push(new argument_1.Argument(content.substring(argStart, mark), vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + mark))));
                            argStart = -1;
                        }
                        spaced = false;
                    }
                    escaped = false;
                    if (argStart === -1) {
                        argStart = i;
                    }
                    // variable detected
                    if (char === '$' && content.charAt(i + 1) === '{') {
                        let singleQuotes = false;
                        let doubleQuotes = false;
                        let escaped = false;
                        for (let j = i + 1; j < content.length; j++) {
                            switch (content.charAt(j)) {
                                case this.escapeChar:
                                    escaped = true;
                                    break;
                                case '\r':
                                case '\n':
                                    break;
                                case '\'':
                                    singleQuotes = !singleQuotes;
                                    escaped = false;
                                    break;
                                case '"':
                                    doubleQuotes = !doubleQuotes;
                                    escaped = false;
                                    break;
                                case ' ':
                                case '\t':
                                    if (escaped || singleQuotes || doubleQuotes) {
                                        break;
                                    }
                                    i = j - 1;
                                    continue argumentLoop;
                                case '}':
                                    i = j;
                                    continue argumentLoop;
                                default:
                                    escaped = false;
                                    break;
                            }
                        }
                        break argumentLoop;
                    }
                    break;
            }
        }
        if (argStart !== -1 && argStart !== content.length) {
            let end = endingEscape ? content.length - 1 : content.length;
            let value = content.substring(argStart, end);
            args.push(new argument_1.Argument(value, vscode_languageserver_types_1.Range.create(this.document.positionAt(instructionNameEndOffset + start + argStart), this.document.positionAt(instructionNameEndOffset + start + end))));
        }
        return args;
    }
}
exports.PropertyInstruction = PropertyInstruction;


/***/ }),

/***/ 292:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __webpack_require__(989);
const line_1 = __webpack_require__(921);
class ParserDirective extends line_1.Line {
    constructor(document, range, nameRange, valueRange) {
        super(document, range);
        this.nameRange = nameRange;
        this.valueRange = valueRange;
    }
    toString() {
        return "# " + this.getName() + '=' + this.getValue();
    }
    getNameRange() {
        return this.nameRange;
    }
    getValueRange() {
        return this.valueRange;
    }
    getName() {
        return this.document.getText().substring(this.document.offsetAt(this.nameRange.start), this.document.offsetAt(this.nameRange.end));
    }
    getValue() {
        return this.document.getText().substring(this.document.offsetAt(this.valueRange.start), this.document.offsetAt(this.valueRange.end));
    }
    getDirective() {
        const directive = main_1.Directive[this.getName().toLowerCase()];
        return directive === undefined ? null : directive;
    }
}
exports.ParserDirective = ParserDirective;


/***/ }),

/***/ 314:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const flagOption_1 = __webpack_require__(248);
class Flag {
    constructor(document, range, name, nameRange, value, valueRange) {
        this.options = [];
        this.range = range;
        this.name = name;
        this.nameRange = nameRange;
        this.value = value;
        this.valueRange = valueRange;
        if (this.value !== null) {
            let offset = document.offsetAt(valueRange.start);
            let nameStart = -1;
            let valueStart = -1;
            let hasOptions = false;
            for (let i = 0; i < value.length; i++) {
                switch (value.charAt(i)) {
                    case '=':
                        hasOptions = true;
                        if (valueStart === -1) {
                            valueStart = i + 1;
                            break;
                        }
                        break;
                    case ',':
                        this.options.push(this.createFlagOption(document, value, offset, nameStart, valueStart, i));
                        nameStart = -1;
                        valueStart = -1;
                        break;
                    default:
                        if (nameStart === -1) {
                            nameStart = i;
                        }
                        break;
                }
            }
            if (hasOptions && nameStart !== -1) {
                this.options.push(this.createFlagOption(document, value, offset, nameStart, valueStart, value.length));
            }
        }
    }
    createFlagOption(document, content, documentOffset, nameStart, valueStart, valueEnd) {
        const optionRange = vscode_languageserver_types_1.Range.create(document.positionAt(documentOffset + nameStart), document.positionAt(documentOffset + valueEnd));
        if (valueStart === -1) {
            return new flagOption_1.FlagOption(optionRange, content.substring(nameStart, valueEnd), optionRange, null, null);
        }
        return new flagOption_1.FlagOption(optionRange, content.substring(nameStart, valueStart - 1), vscode_languageserver_types_1.Range.create(document.positionAt(documentOffset + nameStart), document.positionAt(documentOffset + valueStart - 1)), content.substring(valueStart, valueEnd), vscode_languageserver_types_1.Range.create(document.positionAt(documentOffset + valueStart), document.positionAt(documentOffset + valueEnd)));
    }
    toString() {
        if (this.valueRange) {
            return "--" + this.name + "=" + this.value;
        }
        return "--" + this.name;
    }
    /**
     * Returns the range that encompasses this entire flag. This includes the
     * -- prefix in the beginning to the last character of the flag's value (if
     * it has been defined).
     *
     * @return the entire range of this flag
     */
    getRange() {
        return this.range;
    }
    /**
     * Returns the name of this flag. The name does not include the -- prefix.
     * Thus, for HEALTHCHECK's --interval flag, interval is the flag's name and
     * not --interval.
     *
     * @return this flag's name
     */
    getName() {
        return this.name;
    }
    /**
     * Returns the range that encompasses the flag's name
     *
     * @return the range containing the flag's name
     */
    getNameRange() {
        return this.nameRange;
    }
    /**
     * Returns the value that has been set to this flag. May be null if the
     * flag is invalid and has no value set like a --start-period. If the flag
     * is instead a --start-period= with an equals sign then the flag's value
     * is the empty string.
     *
     * @return this flag's value if it has been defined, null otherwise
     */
    getValue() {
        return this.value;
    }
    /**
     * Returns the range that encompasses this flag's value. If no value has
     * been set then null will be returned.
     *
     * @return the range containing this flag's value, or null if the flag
     *         has no value defined
     */
    getValueRange() {
        return this.valueRange;
    }
    getOption(name) {
        for (const option of this.options) {
            if (option.getName() === name) {
                return option;
            }
        }
        return null;
    }
    getOptions() {
        return this.options;
    }
    hasOptions() {
        return this.options.length > 0;
    }
}
exports.Flag = Flag;


/***/ }),

/***/ 351:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 362:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const propertyInstruction_1 = __webpack_require__(282);
const util_1 = __webpack_require__(215);
class Label extends propertyInstruction_1.PropertyInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    getVariables() {
        const variables = super.getVariables();
        const properties = this.getProperties();
        // iterate over all of this LABEL's properties
        for (const property of properties) {
            const value = property.getUnescapedValue();
            // check if the value is contained in single quotes,
            // single quotes would indicate a literal value
            if (value !== null && value.length > 2 && value.charAt(0) === '\'' && value.charAt(value.length - 1) === '\'') {
                const range = property.getValueRange();
                for (let i = 0; i < variables.length; i++) {
                    // if a variable is in a single quote, remove it from the list
                    if (util_1.Util.isInsideRange(variables[i].getRange().start, range)) {
                        variables.splice(i, 1);
                        i--;
                    }
                }
            }
        }
        return variables;
    }
    getProperties() {
        return super.getProperties();
    }
}
exports.Label = Label;


/***/ }),

/***/ 414:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obfuscator = void 0;
const dockerfile_ast_1 = __webpack_require__(989);
const mustache_1 = __webpack_require__(272);
const child_process_1 = __webpack_require__(129);
class Obfuscator {
    constructor(source) {
        this.source = source;
        this.ast = dockerfile_ast_1.DockerfileParser.parse(source);
        this.nextNumber = 1;
        this.commandMappings = new Map();
    }
    encryptCommand(cmd) {
        if (!cmd) {
            return '';
        }
        else {
            if (this.commandMappings.has(cmd)) {
                return (this.commandMappings.get(cmd) || 0).toString();
            }
            else {
                this.commandMappings.set(cmd, this.nextNumber);
                return `csteps ${this.nextNumber++}`;
            }
        }
    }
    dumpEncrypted() {
        const instructions = this.ast.getInstructions();
        const result = [];
        for (const ins of instructions) {
            if (ins.getKeyword() === 'RUN') {
                result.push(`${ins.getKeyword()} ${this.encryptCommand(ins.getArgumentsContent())}`);
            }
            else {
                result.push(`${ins.getKeyword()} ${ins.getArgumentsContent()}`);
                if (ins.getKeyword() === 'FROM') {
                    result.push('COPY csteps /usr/local/bin/');
                }
            }
        }
        return result.join('\r\n');
    }
    escape(input) {
        input = input.replace(/\\/g, '\\\\');
        return input.replace(/"/g, '\\"');
    }
    dumpC() {
        const source = `
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main (int argc, char *argv[]) {
    int cmd=0;
    if (argc!=2) {
        printf("Error in command line args");
        return -1;
    }
    cmd = atoi(argv[1]);
    switch(cmd) {
        {{#commands}}
        case {{key}}:
            system("{{{command}}}");
            break;
        {{/commands}}
        default:
            printf("[Error]: unknown command: %d (%s), 1?%d  ", cmd, argv[1], cmd==1);
            return -1;
    }
    return(0);
 } 
`;
        const view = {
            commands: Array.from(this.commandMappings, ([k, v]) => ({
                key: v,
                command: this.escape(k)
            }))
        };
        return mustache_1.render(source, view);
    }
    compile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = ['-xc', '-', '-o', path];
            if (process.platform !== 'darwin') {
                // Static compilation fails on mac
                options.push('-static');
                options.push('-static-libgcc');
            }
            const compiler = child_process_1.spawn('gcc', options);
            compiler.stdout.pipe(process.stdout);
            compiler.stderr.pipe(process.stderr);
            const cSource = this.dumpC();
            console.log('Will compile', cSource);
            compiler.stdin.write(cSource);
            compiler.stdin.end();
            return new Promise((resolve, reject) => {
                compiler.on('close', code => {
                    if (code === 0) {
                        // console.log('compilation succeeded');
                        resolve();
                    }
                    else {
                        console.log('Compilation failed with error', code);
                        reject(code);
                    }
                });
            });
        });
    }
}
exports.Obfuscator = Obfuscator;


/***/ }),

/***/ 449:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jsonInstruction_1 = __webpack_require__(549);
class Shell extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Shell = Shell;


/***/ }),

/***/ 479:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jsonInstruction_1 = __webpack_require__(549);
class Cmd extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Cmd = Cmd;


/***/ }),

/***/ 485:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Argument {
    constructor(value, range) {
        this.value = value;
        this.range = range;
    }
    toString() {
        return this.value;
    }
    getRange() {
        return this.range;
    }
    getValue() {
        return this.value;
    }
    isAfter(position) {
        if (this.range.end.line < position.line) {
            return false;
        }
        return this.range.start.line > position.line ? true : this.range.start.character > position.character;
    }
    isBefore(position) {
        if (this.range.start.line < position.line) {
            return true;
        }
        return this.range.end.line > position.line ? false : this.range.end.character < position.character;
    }
}
exports.Argument = Argument;


/***/ }),

/***/ 518:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jsonInstruction_1 = __webpack_require__(549);
class Copy extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        return argument.indexOf("--") === -1;
    }
    getFromFlag() {
        let flags = super.getFlags();
        return flags.length === 1 && flags[0].getName() === "from" ? flags[0] : null;
    }
}
exports.Copy = Copy;


/***/ }),

/***/ 541:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jsonInstruction_1 = __webpack_require__(549);
class Add extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        return argument.indexOf("--") === -1;
    }
}
exports.Add = Add;


/***/ }),

/***/ 545:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const modifiableInstruction_1 = __webpack_require__(49);
class Healthcheck extends modifiableInstruction_1.ModifiableInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        argument = argument.toUpperCase();
        return argument === "CMD" || argument === "NONE";
    }
    getSubcommand() {
        let args = this.getArguments();
        return args.length !== 0 ? args[0] : null;
    }
}
exports.Healthcheck = Healthcheck;


/***/ }),

/***/ 549:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const argument_1 = __webpack_require__(485);
const jsonArgument_1 = __webpack_require__(25);
const modifiableInstruction_1 = __webpack_require__(49);
class JSONInstruction extends modifiableInstruction_1.ModifiableInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
        this.openingBracket = null;
        this.closingBracket = null;
        this.jsonStrings = [];
        const argsContent = this.getRawArgumentsContent();
        if (argsContent === null) {
            return;
        }
        const args = this.getArguments();
        if (args.length === 1 && args[0].getValue() === "[]") {
            let argRange = args[0].getRange();
            this.openingBracket = new argument_1.Argument("[", vscode_languageserver_types_1.Range.create(argRange.start.line, argRange.start.character, argRange.start.line, argRange.start.character + 1));
            this.closingBracket = new argument_1.Argument("]", vscode_languageserver_types_1.Range.create(argRange.start.line, argRange.start.character + 1, argRange.end.line, argRange.end.character));
            return;
        }
        else if (args.length === 2 && args[0].getValue() === '[' && args[1].getValue() === ']') {
            this.openingBracket = args[0];
            this.closingBracket = args[1];
            return;
        }
        const argsOffset = document.offsetAt(this.getArgumentsRange().start);
        let start = -1;
        let last = "";
        let quoted = false;
        let escapedArg = "";
        argsCheck: for (let i = 0; i < argsContent.length; i++) {
            let char = argsContent.charAt(i);
            switch (char) {
                case '[':
                    if (last === "") {
                        this.openingBracket = new argument_1.Argument("[", vscode_languageserver_types_1.Range.create(document.positionAt(argsOffset + i), document.positionAt(argsOffset + i + 1)));
                        last = '[';
                    }
                    else if (quoted) {
                        escapedArg = escapedArg + char;
                    }
                    else {
                        break argsCheck;
                    }
                    break;
                case '"':
                    if (last === '[' || last === ',') {
                        start = i;
                        quoted = true;
                        last = '"';
                        escapedArg = escapedArg + char;
                        continue;
                    }
                    else if (last === '"') {
                        if (quoted) {
                            escapedArg = escapedArg + char;
                            // quoted string done
                            quoted = false;
                            this.jsonStrings.push(new jsonArgument_1.JSONArgument(escapedArg, vscode_languageserver_types_1.Range.create(document.positionAt(argsOffset + start), document.positionAt(argsOffset + i + 1)), vscode_languageserver_types_1.Range.create(document.positionAt(argsOffset + start + 1), document.positionAt(argsOffset + i))));
                            escapedArg = "";
                        }
                        else {
                            // should be a , or a ]
                            break argsCheck;
                        }
                    }
                    else {
                        break argsCheck;
                    }
                    break;
                case ',':
                    if (quoted) {
                        escapedArg = escapedArg + char;
                    }
                    else {
                        if (last === '"') {
                            last = ',';
                        }
                        else {
                            break argsCheck;
                        }
                    }
                    break;
                case ']':
                    if (quoted) {
                        escapedArg = escapedArg + char;
                    }
                    else if (last !== "") {
                        this.closingBracket = new argument_1.Argument("]", vscode_languageserver_types_1.Range.create(document.positionAt(argsOffset + i), document.positionAt(argsOffset + i + 1)));
                        break argsCheck;
                    }
                    break;
                case ' ':
                case '\t':
                    break;
                case '\\':
                    if (quoted) {
                        switch (argsContent.charAt(i + 1)) {
                            case '"':
                            case '\\':
                                escapedArg = escapedArg + argsContent.charAt(i + 1);
                                i++;
                                continue;
                            case ' ':
                            case '\t':
                                escapeCheck: for (let j = i + 2; j < argsContent.length; j++) {
                                    switch (argsContent.charAt(j)) {
                                        case '\r':
                                            // offset one more for \r\n
                                            j++;
                                        case '\n':
                                            i = j;
                                            continue argsCheck;
                                        case ' ':
                                        case '\t':
                                            break;
                                        default:
                                            break escapeCheck;
                                    }
                                }
                                break;
                            case '\r':
                                // offset one more for \r\n
                                i++;
                            default:
                                i++;
                                continue;
                        }
                    }
                    else {
                        escapeCheck: for (let j = i + 1; j < argsContent.length; j++) {
                            switch (argsContent.charAt(j)) {
                                case '\r':
                                    // offset one more for \r\n
                                    j++;
                                case '\n':
                                    i = j;
                                    continue argsCheck;
                                case ' ':
                                case '\t':
                                    break;
                                default:
                                    break escapeCheck;
                            }
                        }
                    }
                    break argsCheck;
                default:
                    if (!quoted) {
                        break argsCheck;
                    }
                    escapedArg = escapedArg + char;
                    break;
            }
        }
    }
    stopSearchingForFlags(_value) {
        return true;
    }
    getOpeningBracket() {
        return this.openingBracket;
    }
    getJSONStrings() {
        return this.jsonStrings;
    }
    getClosingBracket() {
        return this.closingBracket;
    }
}
exports.JSONInstruction = JSONInstruction;


/***/ }),

/***/ 591:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jsonInstruction_1 = __webpack_require__(549);
class Entrypoint extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Entrypoint = Entrypoint;


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 700:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const propertyInstruction_1 = __webpack_require__(282);
class Env extends propertyInstruction_1.PropertyInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    getProperties() {
        return super.getProperties();
    }
}
exports.Env = Env;


/***/ }),

/***/ 713:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const instruction_1 = __webpack_require__(923);
class Workdir extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Workdir = Workdir;


/***/ }),

/***/ 743:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const line_1 = __webpack_require__(921);
const util_1 = __webpack_require__(215);
class Comment extends line_1.Line {
    constructor(document, range) {
        super(document, range);
    }
    toString() {
        const content = this.getContent();
        if (content) {
            return "# " + content;
        }
        return "#";
    }
    /**
     * Returns the content of this comment. This excludes leading and
     * trailing whitespace as well as the # symbol. If the comment only
     * consists of whitespace, the empty string will be returned.
     */
    getContent() {
        let range = this.getContentRange();
        if (range === null) {
            return "";
        }
        return this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
    }
    /**
     * Returns a range that includes the content of the comment
     * excluding any leading and trailing whitespace as well as the #
     * symbol. May return null if the comment only consists of whitespace
     * characters.
     */
    getContentRange() {
        let range = this.getRange();
        const startOffset = this.document.offsetAt(range.start);
        let raw = this.document.getText().substring(startOffset, this.document.offsetAt(range.end));
        let start = -1;
        let end = -1;
        // skip the first # symbol
        for (let i = 1; i < raw.length; i++) {
            if (!util_1.Util.isWhitespace(raw.charAt(i))) {
                start = i;
                break;
            }
        }
        if (start === -1) {
            return null;
        }
        // go backwards up to the first # symbol
        for (let i = raw.length - 1; i >= 1; i--) {
            if (!util_1.Util.isWhitespace(raw.charAt(i))) {
                end = i + 1;
                break;
            }
        }
        return vscode_languageserver_types_1.Range.create(this.document.positionAt(startOffset + start), this.document.positionAt(startOffset + end));
    }
}
exports.Comment = Comment;


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 814:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jsonInstruction_1 = __webpack_require__(549);
class Run extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        return argument.indexOf("--") === -1;
    }
}
exports.Run = Run;


/***/ }),

/***/ 829:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = __webpack_require__(95);
const arg_1 = __webpack_require__(864);
const cmd_1 = __webpack_require__(479);
const copy_1 = __webpack_require__(518);
const env_1 = __webpack_require__(700);
const entrypoint_1 = __webpack_require__(591);
const from_1 = __webpack_require__(970);
const healthcheck_1 = __webpack_require__(545);
const onbuild_1 = __webpack_require__(8);
const util_1 = __webpack_require__(215);
class ImageTemplate {
    constructor() {
        this.comments = [];
        this.instructions = [];
    }
    addComment(comment) {
        this.comments.push(comment);
    }
    getComments() {
        return this.comments;
    }
    addInstruction(instruction) {
        this.instructions.push(instruction);
    }
    getInstructions() {
        return this.instructions;
    }
    getInstructionAt(line) {
        for (let instruction of this.instructions) {
            if (util_1.Util.isInsideRange(vscode_languageserver_types_1.Position.create(line, 0), instruction.getRange())) {
                return instruction;
            }
        }
        return null;
    }
    /**
     * Gets all the ARG instructions that are defined in this image.
     */
    getARGs() {
        let args = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof arg_1.Arg) {
                args.push(instruction);
            }
        }
        return args;
    }
    /**
     * Gets all the CMD instructions that are defined in this image.
     */
    getCMDs() {
        let cmds = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof cmd_1.Cmd) {
                cmds.push(instruction);
            }
        }
        return cmds;
    }
    /**
     * Gets all the COPY instructions that are defined in this image.
     */
    getCOPYs() {
        let copies = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof copy_1.Copy) {
                copies.push(instruction);
            }
        }
        return copies;
    }
    /**
     * Gets all the ENTRYPOINT instructions that are defined in this image.
     */
    getENTRYPOINTs() {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof entrypoint_1.Entrypoint) {
                froms.push(instruction);
            }
        }
        return froms;
    }
    /**
     * Gets all the ENV instructions that are defined in this image.
     */
    getENVs() {
        let args = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof env_1.Env) {
                args.push(instruction);
            }
        }
        return args;
    }
    /**
     * Gets all the FROM instructions that are defined in this image.
     */
    getFROMs() {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof from_1.From) {
                froms.push(instruction);
            }
        }
        return froms;
    }
    /**
     * Gets all the HEALTHCHECK instructions that are defined in this image.
     */
    getHEALTHCHECKs() {
        let froms = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof healthcheck_1.Healthcheck) {
                froms.push(instruction);
            }
        }
        return froms;
    }
    getOnbuildTriggers() {
        let triggers = [];
        for (let instruction of this.instructions) {
            if (instruction instanceof onbuild_1.Onbuild) {
                let trigger = instruction.getTriggerInstruction();
                if (trigger) {
                    triggers.push(trigger);
                }
            }
        }
        return triggers;
    }
    getAvailableVariables(currentLine) {
        const variables = [];
        for (const arg of this.getARGs()) {
            if (arg.isBefore(currentLine)) {
                const property = arg.getProperty();
                if (property) {
                    const variable = property.getName();
                    if (variables.indexOf(variable) === -1) {
                        variables.push(variable);
                    }
                }
            }
        }
        for (const env of this.getENVs()) {
            if (env.isBefore(currentLine)) {
                for (const property of env.getProperties()) {
                    const variable = property.getName();
                    if (variables.indexOf(variable) === -1) {
                        variables.push(variable);
                    }
                }
            }
        }
        return variables;
    }
    /**
     * Resolves a variable with the given name at the specified line
     * to its value. If null is returned, then the variable has been
     * defined but no value was given. If undefined is returned, then
     * a variable with the given name has not been defined yet as of
     * the given line.
     *
     * @param variable the name of the variable to resolve
     * @param line the line number that the variable is on, zero-based
     * @return the value of the variable as defined by an ARG or ENV
     *         instruction, or null if no value has been specified, or
     *         undefined if a variable with the given name has not
     *         been defined
     */
    resolveVariable(variable, line) {
        let envs = this.getENVs();
        for (let i = envs.length - 1; i >= 0; i--) {
            if (envs[i].isBefore(line)) {
                for (let property of envs[i].getProperties()) {
                    if (property.getName() === variable) {
                        return property.getValue();
                    }
                }
            }
        }
        let args = this.getARGs();
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i].isBefore(line)) {
                let property = args[i].getProperty();
                if (property && property.getName() === variable) {
                    return property.getValue();
                }
            }
        }
        return undefined;
    }
    getRange() {
        const instructions = this.getInstructions();
        if (instructions.length === 0) {
            // all templates should have instructions, this only happens for
            // the initial set of instruction
            return vscode_languageserver_types_1.Range.create(0, 0, 0, 0);
        }
        const instructionStart = instructions[0].getRange().start;
        const instructionEnd = instructions[instructions.length - 1].getRange().end;
        return vscode_languageserver_types_1.Range.create(instructionStart, instructionEnd);
    }
    contains(position) {
        const range = this.getRange();
        if (range === null) {
            return false;
        }
        return util_1.Util.isInsideRange(position, range);
    }
}
exports.ImageTemplate = ImageTemplate;


/***/ }),

/***/ 864:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const property_1 = __webpack_require__(965);
const propertyInstruction_1 = __webpack_require__(282);
class Arg extends propertyInstruction_1.PropertyInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
        this.property = null;
        const args = this.getPropertyArguments();
        if (args.length === 1) {
            this.property = new property_1.Property(this.document, this.escapeChar, args[0]);
        }
        else {
            this.property = null;
        }
    }
    /**
     * Returns the variable defined by this ARG. This may be null if
     * this ARG instruction is malformed and has no variable
     * declaration.
     */
    getProperty() {
        return this.property;
    }
}
exports.Arg = Arg;


/***/ }),

/***/ 868:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jsonInstruction_1 = __webpack_require__(549);
class Volume extends jsonInstruction_1.JSONInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Volume = Volume;


/***/ }),

/***/ 884:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Variable {
    constructor(name, nameRange, range, modifier, modifierRange, substitutionParameter, substitutionRange, defined, buildVariable, stringValue) {
        this.name = name;
        this.nameRange = nameRange;
        this.range = range;
        this.modifier = modifier;
        this.modifierRange = modifierRange;
        this.substitutionParameter = substitutionParameter;
        this.substitutionRange = substitutionRange;
        this.defined = defined;
        this.buildVariable = buildVariable;
        this.stringValue = stringValue;
    }
    toString() {
        return this.stringValue;
    }
    getName() {
        return this.name;
    }
    getNameRange() {
        return this.nameRange;
    }
    /**
     * Returns the range of the entire variable. This includes the symbols for
     * the declaration of the variable such as the $, {, and } symbols.
     *
     * @return the range in the document that this variable encompasses in its
     *         entirety
     */
    getRange() {
        return this.range;
    }
    /**
     * Returns the modifier character that has been set for
     * specifying how this variable should be expanded and resolved.
     * If this variable is ${variable:+value} then the modifier
     * character is '+'. Will be the empty string if the variable is
     * declared as ${variable:}. Otherwise, will be null if this
     * variable will not use variable substitution at all (such as
     * ${variable} or $variable).
     *
     * @return this variable's modifier character, or the empty
     *         string if it does not have one, or null if this
     *         variable will not use variable substitution
     */
    getModifier() {
        return this.modifier;
    }
    getModifierRange() {
        return this.modifierRange;
    }
    /**
     * Returns the parameter that will be used for substitution if
     * this variable uses modifiers to define how its value should be
     * resolved. If this variable is ${variable:+value} then the
     * substitution value will be 'value'. Will be the empty string
     * if the variable is declared as ${variable:+} or some other
     * variant where the only thing that follows the modifier
     * character (excluding considerations of escape characters and
     * so on) is the variable's closing bracket. May be null if this
     * variable does not have a modifier character defined (such as
     * ${variable} or $variable).
     *
     * @return this variable's substitution parameter, or the empty
     *         string if it does not have one, or null if there is
     *         not one defined
     */
    getSubstitutionParameter() {
        return this.substitutionParameter;
    }
    getSubstitutionRange() {
        return this.substitutionRange;
    }
    /**
     * Returns whether this variable has been defined or not.
     *
     * @return true if this variable has been defined, false otherwise
     */
    isDefined() {
        return this.defined;
    }
    isBuildVariable() {
        return this.buildVariable === true;
    }
    isEnvironmentVariable() {
        return this.buildVariable === false;
    }
}
exports.Variable = Variable;


/***/ }),

/***/ 898:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const instruction_1 = __webpack_require__(923);
class User extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.User = User;


/***/ }),

/***/ 899:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = __webpack_require__(95);
const comment_1 = __webpack_require__(743);
const parserDirective_1 = __webpack_require__(292);
const instruction_1 = __webpack_require__(923);
const add_1 = __webpack_require__(541);
const arg_1 = __webpack_require__(864);
const cmd_1 = __webpack_require__(479);
const copy_1 = __webpack_require__(518);
const env_1 = __webpack_require__(700);
const entrypoint_1 = __webpack_require__(591);
const from_1 = __webpack_require__(970);
const healthcheck_1 = __webpack_require__(545);
const label_1 = __webpack_require__(362);
const onbuild_1 = __webpack_require__(8);
const run_1 = __webpack_require__(814);
const shell_1 = __webpack_require__(449);
const stopsignal_1 = __webpack_require__(904);
const workdir_1 = __webpack_require__(713);
const user_1 = __webpack_require__(898);
const volume_1 = __webpack_require__(868);
const dockerfile_1 = __webpack_require__(162);
class Parser {
    constructor() {
        this.escapeChar = null;
    }
    static createInstruction(document, dockerfile, escapeChar, lineRange, instruction, instructionRange) {
        switch (instruction.toUpperCase()) {
            case "ADD":
                return new add_1.Add(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ARG":
                return new arg_1.Arg(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "CMD":
                return new cmd_1.Cmd(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "COPY":
                return new copy_1.Copy(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ENTRYPOINT":
                return new entrypoint_1.Entrypoint(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ENV":
                return new env_1.Env(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "FROM":
                return new from_1.From(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "HEALTHCHECK":
                return new healthcheck_1.Healthcheck(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "LABEL":
                return new label_1.Label(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "ONBUILD":
                return new onbuild_1.Onbuild(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "RUN":
                return new run_1.Run(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "SHELL":
                return new shell_1.Shell(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "STOPSIGNAL":
                return new stopsignal_1.Stopsignal(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "WORKDIR":
                return new workdir_1.Workdir(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "USER":
                return new user_1.User(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
            case "VOLUME":
                return new volume_1.Volume(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
        }
        return new instruction_1.Instruction(document, lineRange, dockerfile, escapeChar, instruction, instructionRange);
    }
    getParserDirectives(document, buffer) {
        // reset the escape directive in between runs
        const directives = [];
        this.escapeChar = '';
        directiveCheck: for (let i = 0; i < buffer.length; i++) {
            switch (buffer.charAt(i)) {
                case ' ':
                case '\t':
                    break;
                case '\r':
                case '\n':
                    // blank lines stop the parsing of directives immediately
                    break directiveCheck;
                case '#':
                    let commentStart = i;
                    let directiveStart = -1;
                    let directiveEnd = -1;
                    for (let j = i + 1; j < buffer.length; j++) {
                        let char = buffer.charAt(j);
                        switch (char) {
                            case ' ':
                            case '\t':
                                if (directiveStart !== -1 && directiveEnd === -1) {
                                    directiveEnd = j;
                                }
                                break;
                            case '\r':
                            case '\n':
                                break directiveCheck;
                            case '=':
                                let valueStart = -1;
                                let valueEnd = -1;
                                if (directiveEnd === -1) {
                                    directiveEnd = j;
                                }
                                // assume the line ends with the file
                                let lineEnd = buffer.length;
                                directiveValue: for (let k = j + 1; k < buffer.length; k++) {
                                    char = buffer.charAt(k);
                                    switch (char) {
                                        case '\r':
                                        case '\n':
                                            if (valueStart !== -1 && valueEnd === -1) {
                                                valueEnd = k;
                                            }
                                            // line break found, reset
                                            lineEnd = k;
                                            break directiveValue;
                                        case '\t':
                                        case ' ':
                                            if (valueStart !== -1 && valueEnd === -1) {
                                                valueEnd = k;
                                            }
                                            continue;
                                        default:
                                            if (valueStart === -1) {
                                                valueStart = k;
                                            }
                                            break;
                                    }
                                }
                                let lineRange = vscode_languageserver_types_1.Range.create(document.positionAt(commentStart), document.positionAt(lineEnd));
                                if (directiveStart === -1) {
                                    // no directive, it's a regular comment
                                    break directiveCheck;
                                }
                                if (valueStart === -1) {
                                    // no non-whitespace characters found, highlight all the characters then
                                    valueStart = j + 1;
                                    valueEnd = lineEnd;
                                }
                                else if (valueEnd === -1) {
                                    // reached EOF
                                    valueEnd = buffer.length;
                                }
                                let nameRange = vscode_languageserver_types_1.Range.create(document.positionAt(directiveStart), document.positionAt(directiveEnd));
                                let valueRange = vscode_languageserver_types_1.Range.create(document.positionAt(valueStart), document.positionAt(valueEnd));
                                directives.push(new parserDirective_1.ParserDirective(document, lineRange, nameRange, valueRange));
                                directiveStart = -1;
                                if (buffer.charAt(valueEnd) === '\r') {
                                    // skip over the \r
                                    i = valueEnd + 1;
                                }
                                else {
                                    i = valueEnd;
                                }
                                continue directiveCheck;
                            default:
                                if (directiveStart === -1) {
                                    directiveStart = j;
                                }
                                break;
                        }
                    }
                    break;
                default:
                    break directiveCheck;
            }
        }
        return directives;
    }
    parse(buffer) {
        let document = vscode_languageserver_types_1.TextDocument.create("", "", 0, buffer);
        let dockerfile = new dockerfile_1.Dockerfile(document);
        let directives = this.getParserDirectives(document, buffer);
        let offset = 0;
        this.escapeChar = '\\';
        if (directives.length > 0) {
            dockerfile.setDirectives(directives);
            this.escapeChar = dockerfile.getEscapeCharacter();
            // start parsing after the directives
            offset = document.offsetAt(vscode_languageserver_types_1.Position.create(directives.length, 0));
        }
        lineCheck: for (let i = offset; i < buffer.length; i++) {
            let char = buffer.charAt(i);
            switch (char) {
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    break;
                case '#':
                    for (let j = i + 1; j < buffer.length; j++) {
                        char = buffer.charAt(j);
                        switch (char) {
                            case '\r':
                                dockerfile.addComment(new comment_1.Comment(document, vscode_languageserver_types_1.Range.create(document.positionAt(i), document.positionAt(j))));
                                // offset one more for \r\n
                                i = j + 1;
                                continue lineCheck;
                            case '\n':
                                dockerfile.addComment(new comment_1.Comment(document, vscode_languageserver_types_1.Range.create(document.positionAt(i), document.positionAt(j))));
                                i = j;
                                continue lineCheck;
                        }
                    }
                    // reached EOF
                    let range = vscode_languageserver_types_1.Range.create(document.positionAt(i), document.positionAt(buffer.length));
                    dockerfile.addComment(new comment_1.Comment(document, range));
                    break lineCheck;
                default:
                    let instruction = char;
                    let instructionStart = i;
                    let instructionEnd = -1;
                    let lineRange = null;
                    let instructionRange = null;
                    let escapedInstruction = false;
                    instructionCheck: for (let j = i + 1; j < buffer.length; j++) {
                        char = buffer.charAt(j);
                        switch (char) {
                            case this.escapeChar:
                                escapedInstruction = true;
                                char = buffer.charAt(j + 1);
                                if (char === '\r') {
                                    // skip two for \r\n
                                    j += 2;
                                }
                                else if (char === '\n') {
                                    j++;
                                }
                                else if (char === ' ' || char === '\t') {
                                    for (let k = j + 2; k < buffer.length; k++) {
                                        switch (buffer.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                                break;
                                            case '\r':
                                                // skip another for \r\n
                                                j = k + 1;
                                                continue instructionCheck;
                                            case '\n':
                                                j = k;
                                                continue instructionCheck;
                                            default:
                                                instructionEnd = j + 1;
                                                instruction = instruction + this.escapeChar;
                                                j = k - 2;
                                                continue instructionCheck;
                                        }
                                    }
                                    instructionEnd = j + 1;
                                    instruction = instruction + this.escapeChar;
                                    break instructionCheck;
                                }
                                else {
                                    instructionEnd = j + 1;
                                    instruction = instruction + this.escapeChar;
                                }
                                break;
                            case ' ':
                            case '\t':
                                if (escapedInstruction) {
                                    // on an escaped newline, need to search for non-whitespace
                                    escapeCheck: for (let k = j + 1; k < buffer.length; k++) {
                                        switch (buffer.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                                break;
                                            case '\r':
                                                // skip another for \r\n
                                                j = k + 1;
                                                continue instructionCheck;
                                            case '\n':
                                                j = k;
                                                continue instructionCheck;
                                            default:
                                                break escapeCheck;
                                        }
                                    }
                                    escapedInstruction = false;
                                }
                                if (instructionEnd === -1) {
                                    instructionEnd = j;
                                }
                                let escaped = false;
                                argumentsCheck: for (let k = j + 1; k < buffer.length; k++) {
                                    switch (buffer.charAt(k)) {
                                        case '\r':
                                        case '\n':
                                            if (escaped) {
                                                continue;
                                            }
                                            i = k;
                                            lineRange = vscode_languageserver_types_1.Range.create(document.positionAt(instructionStart), document.positionAt(k));
                                            instructionRange = vscode_languageserver_types_1.Range.create(document.positionAt(instructionStart), document.positionAt(instructionEnd));
                                            dockerfile.addInstruction(Parser.createInstruction(document, dockerfile, this.escapeChar, lineRange, instruction, instructionRange));
                                            continue lineCheck;
                                        case this.escapeChar:
                                            let next = buffer.charAt(k + 1);
                                            if (next === '\n') {
                                                escaped = true;
                                                k++;
                                            }
                                            else if (next === '\r') {
                                                escaped = true;
                                                // skip two chars for \r\n
                                                k = k + 2;
                                            }
                                            else if (next === ' ' || next === '\t') {
                                                escapeCheck: for (let l = k + 2; l < buffer.length; l++) {
                                                    switch (buffer.charAt(l)) {
                                                        case ' ':
                                                        case '\t':
                                                            break;
                                                        case '\r':
                                                            // skip another char for \r\n
                                                            escaped = true;
                                                            k = l + 1;
                                                            break escapeCheck;
                                                        case '\n':
                                                            escaped = true;
                                                            k = l;
                                                            break escapeCheck;
                                                        default:
                                                            k = l;
                                                            break escapeCheck;
                                                    }
                                                }
                                            }
                                            continue;
                                        case '#':
                                            if (escaped) {
                                                for (let l = k + 1; l < buffer.length; l++) {
                                                    switch (buffer.charAt(l)) {
                                                        case '\r':
                                                            dockerfile.addComment(new comment_1.Comment(document, vscode_languageserver_types_1.Range.create(document.positionAt(k), document.positionAt(l))));
                                                            // offset one more for \r\n
                                                            k = l + 1;
                                                            continue argumentsCheck;
                                                        case '\n':
                                                            let range = vscode_languageserver_types_1.Range.create(document.positionAt(k), document.positionAt(l));
                                                            dockerfile.addComment(new comment_1.Comment(document, range));
                                                            k = l;
                                                            continue argumentsCheck;
                                                    }
                                                }
                                                let range = vscode_languageserver_types_1.Range.create(document.positionAt(k), document.positionAt(buffer.length));
                                                dockerfile.addComment(new comment_1.Comment(document, range));
                                                break argumentsCheck;
                                            }
                                            break;
                                        case ' ':
                                        case '\t':
                                            break;
                                        default:
                                            if (escaped) {
                                                escaped = false;
                                            }
                                            break;
                                    }
                                }
                                // reached EOF
                                lineRange = vscode_languageserver_types_1.Range.create(document.positionAt(instructionStart), document.positionAt(buffer.length));
                                instructionRange = vscode_languageserver_types_1.Range.create(document.positionAt(instructionStart), document.positionAt(instructionEnd));
                                dockerfile.addInstruction(Parser.createInstruction(document, dockerfile, this.escapeChar, lineRange, instruction, instructionRange));
                                break lineCheck;
                            case '\r':
                                if (instructionEnd === -1) {
                                    instructionEnd = j;
                                }
                                // skip for \r\n
                                j++;
                            case '\n':
                                if (escapedInstruction) {
                                    continue;
                                }
                                if (instructionEnd === -1) {
                                    instructionEnd = j;
                                }
                                lineRange = vscode_languageserver_types_1.Range.create(document.positionAt(instructionStart), document.positionAt(instructionEnd));
                                dockerfile.addInstruction(Parser.createInstruction(document, dockerfile, this.escapeChar, lineRange, instruction, lineRange));
                                i = j;
                                continue lineCheck;
                            default:
                                instructionEnd = j + 1;
                                instruction = instruction + char;
                                break;
                        }
                    }
                    // reached EOF
                    if (instructionEnd === -1) {
                        instructionEnd = buffer.length;
                    }
                    lineRange = vscode_languageserver_types_1.Range.create(document.positionAt(instructionStart), document.positionAt(instructionEnd));
                    dockerfile.addInstruction(Parser.createInstruction(document, dockerfile, this.escapeChar, lineRange, instruction, lineRange));
                    break lineCheck;
            }
        }
        dockerfile.organizeComments();
        return dockerfile;
    }
}
exports.Parser = Parser;


/***/ }),

/***/ 904:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const instruction_1 = __webpack_require__(923);
class Stopsignal extends instruction_1.Instruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
}
exports.Stopsignal = Stopsignal;


/***/ }),

/***/ 921:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Line {
    constructor(document, range) {
        this.document = document;
        this.range = range;
    }
    getRange() {
        return this.range;
    }
    getTextContent() {
        return this.document.getText().substring(this.document.offsetAt(this.range.start), this.document.offsetAt(this.range.end));
    }
    isAfter(line) {
        return this.range.start.line > line.range.start.line;
    }
    isBefore(line) {
        return this.range.start.line < line;
    }
}
exports.Line = Line;


/***/ }),

/***/ 923:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const util_1 = __webpack_require__(215);
const line_1 = __webpack_require__(921);
const argument_1 = __webpack_require__(485);
const variable_1 = __webpack_require__(884);
const main_1 = __webpack_require__(989);
class Instruction extends line_1.Line {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range);
        this.dockerfile = dockerfile;
        this.escapeChar = escapeChar;
        this.instruction = instruction;
        this.instructionRange = instructionRange;
    }
    toString() {
        let value = this.getKeyword();
        for (let arg of this.getRawArguments()) {
            value += ' ';
            value += arg.getValue();
        }
        return value;
    }
    getRangeContent(range) {
        if (range === null) {
            return null;
        }
        return this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
    }
    getInstructionRange() {
        return this.instructionRange;
    }
    getInstruction() {
        return this.instruction;
    }
    getKeyword() {
        return this.getInstruction().toUpperCase();
    }
    getArgumentsRange() {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }
        return vscode_languageserver_types_1.Range.create(args[0].getRange().start, args[args.length - 1].getRange().end);
    }
    getArgumentsRanges() {
        let args = this.getArguments();
        if (args.length === 0) {
            return [];
        }
        if (args[0].getRange().start.line === args[args.length - 1].getRange().end.line) {
            return [vscode_languageserver_types_1.Range.create(args[0].getRange().start, args[args.length - 1].getRange().end)];
        }
        let ranges = [];
        let end = -1;
        let startPosition = args[0].getRange().start;
        let range = this.getInstructionRange();
        let extra = this.document.offsetAt(startPosition) - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra, this.document.offsetAt(args[args.length - 1].getRange().end) - this.document.offsetAt(range.start));
        let offset = this.document.offsetAt(range.start) + extra;
        let start = false;
        let comment = false;
        for (let i = 0; i < fullArgs.length; i++) {
            let char = fullArgs.charAt(i);
            if (char === this.escapeChar) {
                let next = fullArgs.charAt(i + 1);
                if (next === ' ' || next === '\t') {
                    whitespaceCheck: for (let j = i + 2; j < fullArgs.length; j++) {
                        switch (fullArgs.charAt(j)) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                j++;
                            case '\n':
                                if (startPosition !== null) {
                                    ranges.push(vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                                }
                                startPosition = null;
                                start = true;
                                comment = false;
                                i = j;
                                break whitespaceCheck;
                            default:
                                break whitespaceCheck;
                        }
                    }
                }
                else if (next === '\r') {
                    if (startPosition !== null) {
                        ranges.push(vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                        startPosition = null;
                    }
                    start = true;
                    comment = false;
                    i += 2;
                }
                else if (next === '\n') {
                    if (startPosition !== null) {
                        ranges.push(vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(offset + end + 1)));
                    }
                    startPosition = null;
                    start = true;
                    comment = false;
                    i++;
                }
                else {
                    i++;
                }
            }
            else if (util_1.Util.isNewline(char)) {
                if (comment) {
                    startPosition = null;
                    start = true;
                    comment = false;
                }
            }
            else {
                if (!comment) {
                    if (startPosition === null) {
                        if (char === '#') {
                            comment = true;
                            continue;
                        }
                        let position = this.document.positionAt(offset + i);
                        if (position.character !== 0) {
                            startPosition = vscode_languageserver_types_1.Position.create(position.line, 0);
                        }
                    }
                    end = i;
                }
            }
        }
        if (startPosition === null) {
            // should only happen if the last argument is on its own line with
            // no leading whitespace
            ranges.push(vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + end), this.document.positionAt(offset + end + 1)));
        }
        else {
            ranges.push(vscode_languageserver_types_1.Range.create(startPosition, this.document.positionAt(offset + end + 1)));
        }
        return ranges;
    }
    getRawArgumentsContent() {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }
        return this.getRangeContent(vscode_languageserver_types_1.Range.create(args[0].getRange().start, args[args.length - 1].getRange().end));
    }
    getArgumentsContent() {
        let args = this.getArguments();
        if (args.length === 0) {
            return null;
        }
        let content = "";
        let ranges = this.getArgumentsRanges();
        let documentText = this.document.getText();
        for (let range of ranges) {
            content += documentText.substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
        }
        return content;
    }
    getArguments() {
        return this.getRawArguments();
    }
    getRawArguments() {
        let args = [];
        let range = this.getInstructionRange();
        let extra = this.document.offsetAt(range.end) - this.document.offsetAt(range.start);
        let content = this.getTextContent();
        let fullArgs = content.substring(extra);
        let offset = this.document.offsetAt(range.start) + extra;
        let start = false;
        let comment = false;
        let found = -1;
        // determines whether the parser has found a space or tab
        // whitespace character that's a part of an escaped newline sequence
        let escapedWhitespaceDetected = false;
        // determines if the parser is currently in an escaped newline sequence
        let escaping = false;
        let escapeMarker = -1;
        let escapedArg = "";
        for (let i = 0; i < fullArgs.length; i++) {
            let char = fullArgs.charAt(i);
            if (util_1.Util.isWhitespace(char)) {
                if (escaping) {
                    escapedWhitespaceDetected = true;
                    if (util_1.Util.isNewline(char)) {
                        // reached a newline, any previously
                        // detected whitespace should be ignored
                        escapedWhitespaceDetected = false;
                        if (comment) {
                            // reached a newline, no longer in a comment
                            comment = false;
                            start = true;
                        }
                    }
                    continue;
                }
                else if (found !== -1) {
                    if (escapeMarker === -1) {
                        args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + i))));
                    }
                    else {
                        args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
                    }
                    escapeMarker = -1;
                    escapedArg = "";
                    found = -1;
                }
            }
            else if (char === this.escapeChar) {
                let next = fullArgs.charAt(i + 1);
                if (next === ' ' || next === '\t') {
                    whitespaceCheck: for (let j = i + 2; j < fullArgs.length; j++) {
                        let newlineCheck = fullArgs.charAt(j);
                        switch (newlineCheck) {
                            case ' ':
                            case '\t':
                                continue;
                            case '\r':
                                j++;
                            case '\n':
                                comment = false;
                                escaping = true;
                                start = true;
                                if (found !== -1) {
                                    escapeMarker = i;
                                }
                                i = j;
                                break whitespaceCheck;
                            default:
                                escapeMarker = i;
                                if (found === -1) {
                                    i = j - 1;
                                }
                                break whitespaceCheck;
                        }
                    }
                }
                else if (next === '\r') {
                    comment = false;
                    escaping = true;
                    start = true;
                    if (found !== -1 && escapeMarker === -1) {
                        escapeMarker = i;
                    }
                    i += 2;
                }
                else if (next === '\n') {
                    comment = false;
                    escaping = true;
                    start = true;
                    if (found !== -1 && escapeMarker === -1) {
                        escapeMarker = i;
                    }
                    i++;
                }
                else {
                    if (escapedWhitespaceDetected && escapeMarker !== -1) {
                        args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
                        escapedArg = "";
                        found = -1;
                    }
                    escapeMarker = -1;
                    escapedWhitespaceDetected = false;
                    escaping = false;
                    if (next === '$') {
                        escapedArg = escapedArg + char + next;
                    }
                    else if (next === '') {
                        // reached EOF, stop processing
                        break;
                    }
                    else {
                        escapedArg = escapedArg + next;
                    }
                    if (found === -1) {
                        found = i;
                    }
                    i++;
                }
            }
            else if (!comment) {
                if (start && char === '#') {
                    comment = true;
                }
                else {
                    if (escapedWhitespaceDetected && escapeMarker !== -1) {
                        args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
                        escapedArg = "";
                        found = -1;
                    }
                    escapedWhitespaceDetected = false;
                    escaping = false;
                    escapeMarker = -1;
                    escapedArg = escapedArg + char;
                    if (found === -1) {
                        found = i;
                    }
                }
                // non-whitespace character detected, reset
                start = false;
            }
        }
        if (found !== -1) {
            if (escapeMarker === -1) {
                args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + fullArgs.length))));
            }
            else {
                args.push(new argument_1.Argument(escapedArg, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + found), this.document.positionAt(offset + escapeMarker))));
            }
        }
        return args;
    }
    getExpandedArguments() {
        let args = this.getArguments();
        for (let i = 0; i < args.length; i++) {
            const argRange = args[i].getRange();
            let offset = this.document.offsetAt(argRange.start);
            const variables = this.parseVariables(offset, args[i].getValue());
            const swaps = [];
            let requiresExpansion = false;
            for (let variable of variables) {
                const value = this.dockerfile.resolveVariable(variable.getName(), variable.getNameRange().start.line);
                swaps.push(value);
                requiresExpansion = requiresExpansion || value !== undefined;
            }
            if (requiresExpansion) {
                let expanded = "";
                for (let j = 0; j < swaps.length; j++) {
                    const variableRange = variables[j].getRange();
                    const start = this.document.offsetAt(variableRange.start);
                    const end = this.document.offsetAt(variableRange.end);
                    if (swaps[j]) {
                        // replace variable with its resolved value
                        expanded += this.document.getText().substring(offset, start);
                        expanded += swaps[j];
                        offset = end;
                    }
                    else {
                        expanded += this.document.getText().substring(offset, end);
                        offset = end;
                    }
                }
                const argEnd = this.document.offsetAt(argRange.end);
                if (argEnd !== offset) {
                    // if the variable's range doesn't match the argument,
                    // append the remaining text
                    expanded += this.document.getText().substring(offset, argEnd);
                }
                args[i] = new argument_1.Argument(expanded, argRange);
            }
        }
        return args;
    }
    getVariables() {
        const variables = [];
        const args = this.getRawArguments();
        for (const arg of args) {
            let range = arg.getRange();
            let rawValue = this.document.getText().substring(this.document.offsetAt(range.start), this.document.offsetAt(range.end));
            const parsedVariables = this.parseVariables(this.document.offsetAt(arg.getRange().start), rawValue);
            for (const parsedVariable of parsedVariables) {
                variables.push(parsedVariable);
            }
        }
        return variables;
    }
    parseVariables(offset, arg) {
        let variables = [];
        variableLoop: for (let i = 0; i < arg.length; i++) {
            switch (arg.charAt(i)) {
                case this.escapeChar:
                    if (arg.charAt(i + 1) === '$') {
                        i++;
                    }
                    break;
                case '$':
                    if (arg.charAt(i + 1) === '{') {
                        let escapedString = "${";
                        let escapedName = "";
                        let nameEnd = -1;
                        let escapedSubstitutionParameter = "";
                        let substitutionStart = -1;
                        let substitutionEnd = -1;
                        let modifierRead = -1;
                        nameLoop: for (let j = i + 2; j < arg.length; j++) {
                            let char = arg.charAt(j);
                            switch (char) {
                                case this.escapeChar:
                                    for (let k = j + 1; k < arg.length; k++) {
                                        switch (arg.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                            case '\r':
                                                // ignore whitespace
                                                continue;
                                            case '\n':
                                                // escape this newline
                                                j = k;
                                                continue nameLoop;
                                        }
                                    }
                                    break;
                                case '}':
                                    escapedString += '}';
                                    let modifier = null;
                                    let modifierRange = null;
                                    let substitutionParameter = modifierRead !== -1 ? escapedSubstitutionParameter : null;
                                    let substitutionRange = null;
                                    if (nameEnd === -1) {
                                        nameEnd = j;
                                    }
                                    else if (nameEnd + 1 === j) {
                                        modifier = "";
                                        modifierRange = vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + nameEnd + 1), this.document.positionAt(offset + nameEnd + 1));
                                    }
                                    else {
                                        if (substitutionStart === -1) {
                                            // no substitution parameter found,
                                            // but a modifier character existed,
                                            // just offset the range by 1 from
                                            // the modifier character
                                            substitutionStart = modifierRead + 1;
                                            substitutionEnd = modifierRead + 1;
                                        }
                                        else {
                                            // offset one more from the last
                                            // character found
                                            substitutionEnd = substitutionEnd + 1;
                                        }
                                        modifier = arg.substring(modifierRead, modifierRead + 1);
                                        modifierRange = vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + modifierRead), this.document.positionAt(offset + modifierRead + 1));
                                        substitutionRange = vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + substitutionStart), this.document.positionAt(offset + substitutionEnd));
                                    }
                                    let start = this.document.positionAt(offset + i);
                                    variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 2), this.document.positionAt(offset + nameEnd)), vscode_languageserver_types_1.Range.create(start, this.document.positionAt(offset + j + 1)), modifier, modifierRange, substitutionParameter, substitutionRange, this.dockerfile.resolveVariable(escapedName, start.line) !== undefined, this.isBuildVariable(escapedName, start.line), escapedString));
                                    i = j;
                                    continue variableLoop;
                                case ':':
                                    if (nameEnd === -1) {
                                        nameEnd = j;
                                    }
                                    else if (modifierRead !== -1) {
                                        if (substitutionStart === -1) {
                                            substitutionStart = j;
                                            substitutionEnd = j;
                                        }
                                        else {
                                            substitutionEnd = j;
                                        }
                                        escapedSubstitutionParameter += ':';
                                    }
                                    else {
                                        modifierRead = j;
                                    }
                                    escapedString += ':';
                                    break;
                                case '\n':
                                case '\r':
                                case ' ':
                                case '\t':
                                    break;
                                default:
                                    if (nameEnd === -1) {
                                        escapedName += char;
                                    }
                                    else if (modifierRead !== -1) {
                                        if (substitutionStart === -1) {
                                            substitutionStart = j;
                                            substitutionEnd = j;
                                        }
                                        else {
                                            substitutionEnd = j;
                                        }
                                        escapedSubstitutionParameter += char;
                                    }
                                    else {
                                        modifierRead = j;
                                    }
                                    escapedString += char;
                                    break;
                            }
                        }
                        // no } found, not a valid variable, stop processing
                        break variableLoop;
                    }
                    else if (util_1.Util.isWhitespace(arg.charAt(i + 1)) || i === arg.length - 1) {
                        // $ followed by whitespace or EOF, ignore this variable
                        continue;
                    }
                    else {
                        let escapedName = "";
                        nameLoop: for (let j = i + 1; j < arg.length; j++) {
                            let char = arg.charAt(j);
                            switch (char) {
                                case '\r':
                                case '\n':
                                case ' ':
                                case '\t':
                                    continue;
                                case '$':
                                case '\'':
                                case '"':
                                    let varStart = this.document.positionAt(offset + i);
                                    variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + j)), vscode_languageserver_types_1.Range.create(varStart, this.document.positionAt(offset + j)), null, null, null, null, this.dockerfile.resolveVariable(escapedName, varStart.line) !== undefined, this.isBuildVariable(escapedName, varStart.line), '$' + escapedName));
                                    i = j - 1;
                                    continue variableLoop;
                                case this.escapeChar:
                                    for (let k = j + 1; k < arg.length; k++) {
                                        switch (arg.charAt(k)) {
                                            case ' ':
                                            case '\t':
                                            case '\r':
                                                // ignore whitespace
                                                continue;
                                            case '\n':
                                                // escape this newline
                                                j = k;
                                                continue nameLoop;
                                        }
                                    }
                                    // reached EOF after an escape character
                                    let start = this.document.positionAt(offset + i);
                                    variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + j)), vscode_languageserver_types_1.Range.create(start, this.document.positionAt(offset + j)), null, null, null, null, this.dockerfile.resolveVariable(escapedName, start.line) !== undefined, this.isBuildVariable(escapedName, start.line), '$' + escapedName));
                                    break variableLoop;
                            }
                            if (char.match(/^[a-z0-9_]+$/i) === null) {
                                let varStart = this.document.positionAt(offset + i);
                                variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + j)), vscode_languageserver_types_1.Range.create(varStart, this.document.positionAt(offset + j)), null, null, null, null, this.dockerfile.resolveVariable(escapedName, varStart.line) !== undefined, this.isBuildVariable(escapedName, varStart.line), '$' + escapedName));
                                i = j - 1;
                                continue variableLoop;
                            }
                            escapedName += char;
                        }
                        let start = this.document.positionAt(offset + i);
                        variables.push(new variable_1.Variable(escapedName, vscode_languageserver_types_1.Range.create(this.document.positionAt(offset + i + 1), this.document.positionAt(offset + arg.length)), vscode_languageserver_types_1.Range.create(start, this.document.positionAt(offset + arg.length)), null, null, null, null, this.dockerfile.resolveVariable(escapedName, start.line) !== undefined, this.isBuildVariable(escapedName, start.line), '$' + escapedName));
                    }
                    break variableLoop;
            }
        }
        return variables;
    }
    isBuildVariable(variable, line) {
        if (this.getKeyword() === main_1.Keyword.FROM) {
            for (const initialArg of this.dockerfile.getInitialARGs()) {
                const arg = initialArg;
                const property = arg.getProperty();
                if (property && variable === property.getName()) {
                    return true;
                }
            }
            return undefined;
        }
        let image = this.dockerfile.getContainingImage(vscode_languageserver_types_1.Position.create(line, 0));
        let envs = image.getENVs();
        for (let i = envs.length - 1; i >= 0; i--) {
            if (envs[i].isBefore(line)) {
                for (let property of envs[i].getProperties()) {
                    if (property.getName() === variable) {
                        return false;
                    }
                }
            }
        }
        let args = image.getARGs();
        for (let i = args.length - 1; i >= 0; i--) {
            if (args[i].isBefore(line)) {
                let property = args[i].getProperty();
                if (property && property.getName() === variable) {
                    return true;
                }
            }
        }
        return undefined;
    }
}
exports.Instruction = Instruction;


/***/ }),

/***/ 965:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const util_1 = __webpack_require__(215);
class Property {
    constructor(document, escapeChar, arg, arg2) {
        this.valueRange = null;
        this.value = null;
        this.document = document;
        this.escapeChar = escapeChar;
        this.nameRange = Property.getNameRange(document, arg);
        let value = document.getText().substring(document.offsetAt(this.nameRange.start), document.offsetAt(this.nameRange.end));
        this.name = Property.getValue(value, escapeChar);
        if (arg2) {
            this.valueRange = arg2.getRange();
            value = document.getText().substring(document.offsetAt(this.valueRange.start), document.offsetAt(this.valueRange.end));
            this.value = Property.getValue(value, escapeChar);
            this.range = vscode_languageserver_types_1.Range.create(this.nameRange.start, this.valueRange.end);
        }
        else {
            let argRange = arg.getRange();
            if (this.nameRange.start.line === argRange.start.line
                && this.nameRange.start.character === argRange.start.character
                && this.nameRange.end.line === argRange.end.line
                && this.nameRange.end.character === argRange.end.character) {
            }
            else {
                this.valueRange = Property.getValueRange(document, arg);
                value = document.getText().substring(document.offsetAt(this.valueRange.start), document.offsetAt(this.valueRange.end));
                this.value = Property.getValue(value, escapeChar);
            }
            this.range = argRange;
        }
    }
    getRange() {
        return this.range;
    }
    getName() {
        return this.name;
    }
    getNameRange() {
        return this.nameRange;
    }
    getValue() {
        return this.value;
    }
    getValueRange() {
        return this.valueRange;
    }
    /**
     * Returns the value of this property including any enclosing
     * single or double quotes and relevant escape characters.
     * Escaped newlines and its associated contiguous whitespace
     * characters however will not be returned as they are deemed to
     * be uninteresting to clients trying to return a Dockerfile.
     *
     * @return the unescaped value of this property or null if this
     *         property has no associated value
     */
    getUnescapedValue() {
        if (this.valueRange === null) {
            return null;
        }
        let escaped = false;
        let rawValue = "";
        let value = this.document.getText().substring(this.document.offsetAt(this.valueRange.start), this.document.offsetAt(this.valueRange.end));
        rawLoop: for (let i = 0; i < value.length; i++) {
            let char = value.charAt(i);
            switch (char) {
                case this.escapeChar:
                    for (let j = i + 1; j < value.length; j++) {
                        switch (value.charAt(j)) {
                            case '\r':
                                j++;
                            case '\n':
                                escaped = true;
                                i = j;
                                continue rawLoop;
                            case ' ':
                            case '\t':
                                break;
                            default:
                                rawValue = rawValue + char;
                                continue rawLoop;
                        }
                    }
                    // this happens if there's only whitespace after the escape character
                    rawValue = rawValue + char;
                    break;
                case '\r':
                case '\n':
                    break;
                case ' ':
                case '\t':
                    if (!escaped) {
                        rawValue = rawValue + char;
                    }
                    break;
                case '#':
                    if (escaped) {
                        for (let j = i + 1; j < value.length; j++) {
                            switch (value.charAt(j)) {
                                case '\r':
                                    j++;
                                case '\n':
                                    i = j;
                                    continue rawLoop;
                            }
                        }
                    }
                    else {
                        rawValue = rawValue + char;
                    }
                    break;
                default:
                    rawValue = rawValue + char;
                    escaped = false;
                    break;
            }
        }
        return rawValue;
    }
    static getNameRange(document, arg) {
        let value = arg.getValue();
        let index = value.indexOf('=');
        if (index !== -1) {
            let initial = value.charAt(0);
            let before = value.charAt(index - 1);
            // check if content before the equals sign are in quotes
            // "var"=value
            // 'var'=value
            // otherwise, just assume it's a standard definition
            // var=value
            if ((initial === '"' && before === '"') || (initial === '\'' && before === '\'') || (initial !== '"' && initial !== '\'')) {
                return vscode_languageserver_types_1.Range.create(arg.getRange().start, document.positionAt(document.offsetAt(arg.getRange().start) + index));
            }
        }
        // no '=' found, just defined the property's name
        return arg.getRange();
    }
    static getValueRange(document, arg) {
        return vscode_languageserver_types_1.Range.create(document.positionAt(document.offsetAt(arg.getRange().start) + arg.getValue().indexOf('=') + 1), document.positionAt(document.offsetAt(arg.getRange().end)));
    }
    /**
     * Returns the actual value of this key-value pair. The value will
     * have its escape characters removed if applicable. If the value
     * spans multiple lines and there are comments nested within the
     * lines, they too will be removed.
     *
     * @return the value that this key-value pair will actually be, may
     *         be null if no value is defined, may be the empty string
     *         if the value only consists of whitespace
     */
    static getValue(value, escapeChar) {
        let escaped = false;
        const skip = util_1.Util.findLeadingNonWhitespace(value, escapeChar);
        if (skip !== 0 && value.charAt(skip) === '#') {
            // need to skip over comments
            escaped = true;
        }
        value = value.substring(skip);
        let first = value.charAt(0);
        let last = value.charAt(value.length - 1);
        let literal = first === '\'' || first === '"';
        let inSingle = (first === '\'' && last === '\'');
        let inDouble = false;
        if (first === '"') {
            for (let i = 1; i < value.length; i++) {
                if (value.charAt(i) === escapeChar) {
                    i++;
                }
                else if (value.charAt(i) === '"' && i === value.length - 1) {
                    inDouble = true;
                }
            }
        }
        if (inSingle || inDouble) {
            value = value.substring(1, value.length - 1);
        }
        let commentCheck = -1;
        let escapedValue = "";
        let start = 0;
        parseValue: for (let i = 0; i < value.length; i++) {
            let char = value.charAt(i);
            switch (char) {
                case escapeChar:
                    if (i + 1 === value.length) {
                        escapedValue = escapedValue + escapeChar;
                        break parseValue;
                    }
                    char = value.charAt(i + 1);
                    if (char === ' ' || char === '\t') {
                        whitespaceCheck: for (let j = i + 2; j < value.length; j++) {
                            let char2 = value.charAt(j);
                            switch (char2) {
                                case ' ':
                                case '\t':
                                    break;
                                case '\r':
                                    j++;
                                case '\n':
                                    escaped = true;
                                    i = j;
                                    continue parseValue;
                                default:
                                    if (!inDouble && !inSingle && !literal) {
                                        if (char2 === escapeChar) {
                                            // add the escaped character
                                            escapedValue = escapedValue + char;
                                            // now start parsing from the next escape character
                                            i = i + 1;
                                        }
                                        else {
                                            // the expectation is that this j = i + 2 here
                                            escapedValue = escapedValue + char + char2;
                                            i = j;
                                        }
                                        continue parseValue;
                                    }
                                    break whitespaceCheck;
                            }
                        }
                    }
                    if (inDouble) {
                        if (char === '\r') {
                            escaped = true;
                            i = i + 2;
                        }
                        else if (char === '\n') {
                            escaped = true;
                            i++;
                        }
                        else if (char !== '"') {
                            if (char === escapeChar) {
                                i++;
                            }
                            escapedValue = escapedValue + escapeChar;
                        }
                        continue parseValue;
                    }
                    else if (inSingle || literal) {
                        if (char === '\r') {
                            escaped = true;
                            i = i + 2;
                        }
                        else if (char === '\n') {
                            escaped = true;
                            i++;
                        }
                        else {
                            escapedValue = escapedValue + escapeChar;
                        }
                        continue parseValue;
                    }
                    else if (char === escapeChar) {
                        // double escape, append one and move on
                        escapedValue = escapedValue + escapeChar;
                        i++;
                    }
                    else if (char === '\r') {
                        escaped = true;
                        // offset one more for \r\n
                        i = i + 2;
                    }
                    else if (char === '\n') {
                        escaped = true;
                        i++;
                        start = i;
                    }
                    else {
                        // any other escapes are simply ignored
                        escapedValue = escapedValue + char;
                        i++;
                    }
                    break;
                case ' ':
                case '\t':
                    if (escaped && commentCheck === -1) {
                        commentCheck = i;
                    }
                    escapedValue = escapedValue + char;
                    break;
                case '\r':
                    i++;
                case '\n':
                    if (escaped && commentCheck !== -1) {
                        // rollback and remove the whitespace that was previously appended
                        escapedValue = escapedValue.substring(0, escapedValue.length - (i - commentCheck - 1));
                        commentCheck = -1;
                    }
                    break;
                case '#':
                    // a newline was escaped and now there's a comment
                    if (escaped) {
                        if (commentCheck !== -1) {
                            // rollback and remove the whitespace that was previously appended
                            escapedValue = escapedValue.substring(0, escapedValue.length - (i - commentCheck));
                            commentCheck = -1;
                        }
                        newlineCheck: for (let j = i + 1; j < value.length; j++) {
                            switch (value.charAt(j)) {
                                case '\r':
                                    j++;
                                case '\n':
                                    i = j;
                                    break newlineCheck;
                            }
                        }
                        continue parseValue;
                    }
                default:
                    if (escaped) {
                        escaped = false;
                        commentCheck = -1;
                    }
                    escapedValue = escapedValue + char;
                    break;
            }
        }
        return escapedValue;
    }
}
exports.Property = Property;


/***/ }),

/***/ 970:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode_languageserver_types_1 = __webpack_require__(95);
const modifiableInstruction_1 = __webpack_require__(49);
class From extends modifiableInstruction_1.ModifiableInstruction {
    constructor(document, range, dockerfile, escapeChar, instruction, instructionRange) {
        super(document, range, dockerfile, escapeChar, instruction, instructionRange);
    }
    stopSearchingForFlags(argument) {
        return argument.indexOf("--") === -1;
    }
    getImage() {
        return this.getRangeContent(this.getImageRange());
    }
    /**
     * Returns the name of the image that will be used as the base image.
     *
     * @return the base image's name, or null if unspecified
     */
    getImageName() {
        return this.getRangeContent(this.getImageNameRange());
    }
    /**
     * Returns the range that covers the name of the image used by
     * this instruction.
     *
     * @return the range of the name of this instruction's argument,
     *         or null if no image has been specified
     */
    getImageNameRange() {
        let range = this.getImageRange();
        if (range) {
            let registryRange = this.getRegistryRange();
            if (registryRange) {
                range.start = this.document.positionAt(this.document.offsetAt(registryRange.end) + 1);
            }
            let tagRange = this.getImageTagRange();
            let digestRange = this.getImageDigestRange();
            if (tagRange === null) {
                if (digestRange !== null) {
                    range.end = this.document.positionAt(this.document.offsetAt(digestRange.start) - 1);
                }
            }
            else {
                range.end = this.document.positionAt(this.document.offsetAt(tagRange.start) - 1);
            }
            return range;
        }
        return null;
    }
    /**
     * Returns the range that covers the image argument of this
     * instruction. This includes the tag or digest of the image if
     * it has been specified by the instruction.
     *
     * @return the range of the image argument, or null if no image
     *         has been specified
     */
    getImageRange() {
        let args = this.getArguments();
        return args.length !== 0 ? args[0].getRange() : null;
    }
    getImageTag() {
        return this.getRangeContent(this.getImageTagRange());
    }
    /**
     * Returns the range in the document that the tag of the base
     * image encompasses.
     *
     * @return the base image's tag's range in the document, or null
     *         if no tag has been specified
     */
    getImageTagRange() {
        const range = this.getImageRange();
        if (range) {
            if (this.getImageDigestRange() === null) {
                let content = this.getRangeContent(range);
                let index = this.lastIndexOf(this.document.offsetAt(range.start), content, ':');
                // the colon might be for a private registry's port and not a tag
                if (index > content.indexOf('/')) {
                    return vscode_languageserver_types_1.Range.create(range.start.line, range.start.character + index + 1, range.end.line, range.end.character);
                }
            }
        }
        return null;
    }
    getImageDigest() {
        return this.getRangeContent(this.getImageDigestRange());
    }
    /**
     * Returns the range in the document that the digest of the base
     * image encompasses.
     *
     * @return the base image's digest's range in the document, or null
     *         if no digest has been specified
     */
    getImageDigestRange() {
        let range = this.getImageRange();
        if (range) {
            let content = this.getRangeContent(range);
            let index = this.lastIndexOf(this.document.offsetAt(range.start), content, '@');
            if (index !== -1) {
                return vscode_languageserver_types_1.Range.create(range.start.line, range.start.character + index + 1, range.end.line, range.end.character);
            }
        }
        return null;
    }
    indexOf(documentOffset, content, searchString) {
        let index = content.indexOf(searchString);
        const variables = this.getVariables();
        for (let i = 0; i < variables.length; i++) {
            const position = documentOffset + index;
            const variableRange = variables[i].getRange();
            if (this.document.offsetAt(variableRange.start) < position && position < this.document.offsetAt(variableRange.end)) {
                const offset = this.document.offsetAt(variableRange.end) - documentOffset;
                const substring = content.substring(offset);
                const subIndex = substring.indexOf(searchString);
                if (subIndex === -1) {
                    return -1;
                }
                index = subIndex + offset;
                i = -1;
                continue;
            }
        }
        return index;
    }
    lastIndexOf(documentOffset, content, searchString) {
        let index = content.lastIndexOf(searchString);
        const variables = this.getVariables();
        for (let i = 0; i < variables.length; i++) {
            const position = documentOffset + index;
            const variableRange = variables[i].getRange();
            if (this.document.offsetAt(variableRange.start) < position && position < this.document.offsetAt(variableRange.end)) {
                index = content.substring(0, index).lastIndexOf(searchString);
                if (index === -1) {
                    return -1;
                }
                i = -1;
                continue;
            }
        }
        return index;
    }
    getRegistry() {
        return this.getRangeContent(this.getRegistryRange());
    }
    getRegistryRange() {
        const range = this.getImageRange();
        if (range) {
            const tagRange = this.getImageTagRange();
            const digestRange = this.getImageDigestRange();
            if (tagRange === null) {
                if (digestRange !== null) {
                    range.end = this.document.positionAt(this.document.offsetAt(digestRange.start) - 1);
                }
            }
            else {
                range.end = this.document.positionAt(this.document.offsetAt(tagRange.start) - 1);
            }
            const content = this.getRangeContent(range);
            const rangeStart = this.document.offsetAt(range.start);
            const portIndex = this.indexOf(rangeStart, content, ':');
            const dotIndex = this.indexOf(rangeStart, content, '.');
            const startingSlashIndex = this.indexOf(rangeStart, content, '/');
            // hostname detected
            if (portIndex !== -1 || dotIndex !== -1) {
                return vscode_languageserver_types_1.Range.create(range.start, this.document.positionAt(rangeStart + startingSlashIndex));
            }
            const registry = content.substring(0, startingSlashIndex);
            // localhost registry detected
            if (registry === 'localhost') {
                return vscode_languageserver_types_1.Range.create(range.start, this.document.positionAt(rangeStart + startingSlashIndex));
            }
        }
        return null;
    }
    getBuildStage() {
        let range = this.getBuildStageRange();
        return range === null ? null : this.getRangeContent(range);
    }
    getBuildStageRange() {
        let args = this.getArguments();
        if (args.length > 2 && args[1].getValue().toUpperCase() === "AS") {
            return args[2].getRange();
        }
        return null;
    }
    getPlatformFlag() {
        let flags = super.getFlags();
        return flags.length === 1 && flags[0].getName() === "platform" ? flags[0] : null;
    }
}
exports.From = From;


/***/ }),

/***/ 989:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var argument_1 = __webpack_require__(485);
exports.Argument = argument_1.Argument;
var jsonArgument_1 = __webpack_require__(25);
exports.JSONArgument = jsonArgument_1.JSONArgument;
const comment_1 = __webpack_require__(743);
exports.Comment = comment_1.Comment;
const parser_1 = __webpack_require__(899);
var flag_1 = __webpack_require__(314);
exports.Flag = flag_1.Flag;
const instruction_1 = __webpack_require__(923);
exports.Instruction = instruction_1.Instruction;
var line_1 = __webpack_require__(921);
exports.Line = line_1.Line;
const parserDirective_1 = __webpack_require__(292);
exports.ParserDirective = parserDirective_1.ParserDirective;
var property_1 = __webpack_require__(965);
exports.Property = property_1.Property;
var variable_1 = __webpack_require__(884);
exports.Variable = variable_1.Variable;
var add_1 = __webpack_require__(541);
exports.Add = add_1.Add;
const arg_1 = __webpack_require__(864);
exports.Arg = arg_1.Arg;
const cmd_1 = __webpack_require__(479);
exports.Cmd = cmd_1.Cmd;
const copy_1 = __webpack_require__(518);
exports.Copy = copy_1.Copy;
const entrypoint_1 = __webpack_require__(591);
exports.Entrypoint = entrypoint_1.Entrypoint;
const env_1 = __webpack_require__(700);
exports.Env = env_1.Env;
const from_1 = __webpack_require__(970);
exports.From = from_1.From;
const healthcheck_1 = __webpack_require__(545);
exports.Healthcheck = healthcheck_1.Healthcheck;
var jsonInstruction_1 = __webpack_require__(549);
exports.JSONInstruction = jsonInstruction_1.JSONInstruction;
var label_1 = __webpack_require__(362);
exports.Label = label_1.Label;
var modifiableInstruction_1 = __webpack_require__(49);
exports.ModifiableInstruction = modifiableInstruction_1.ModifiableInstruction;
var onbuild_1 = __webpack_require__(8);
exports.Onbuild = onbuild_1.Onbuild;
var propertyInstruction_1 = __webpack_require__(282);
exports.PropertyInstruction = propertyInstruction_1.PropertyInstruction;
var shell_1 = __webpack_require__(449);
exports.Shell = shell_1.Shell;
var stopsignal_1 = __webpack_require__(904);
exports.Stopsignal = stopsignal_1.Stopsignal;
var user_1 = __webpack_require__(898);
exports.User = user_1.User;
var volume_1 = __webpack_require__(868);
exports.Volume = volume_1.Volume;
var workdir_1 = __webpack_require__(713);
exports.Workdir = workdir_1.Workdir;
var Keyword;
(function (Keyword) {
    Keyword["ADD"] = "ADD";
    Keyword["ARG"] = "ARG";
    Keyword["CMD"] = "CMD";
    Keyword["COPY"] = "COPY";
    Keyword["ENTRYPOINT"] = "ENTRYPOINT";
    Keyword["ENV"] = "ENV";
    Keyword["EXPOSE"] = "EXPOSE";
    Keyword["FROM"] = "FROM";
    Keyword["HEALTHCHECK"] = "HEALTHCHECK";
    Keyword["LABEL"] = "LABEL";
    Keyword["MAINTAINER"] = "MAINTAINER";
    Keyword["ONBUILD"] = "ONBUILD";
    Keyword["RUN"] = "RUN";
    Keyword["SHELL"] = "SHELL";
    Keyword["STOPSIGNAL"] = "STOPSIGNAL";
    Keyword["USER"] = "USER";
    Keyword["VOLUME"] = "VOLUME";
    Keyword["WORKDIR"] = "WORKDIR";
})(Keyword = exports.Keyword || (exports.Keyword = {}));
var Directive;
(function (Directive) {
    Directive["escape"] = "escape";
    Directive["syntax"] = "syntax";
})(Directive = exports.Directive || (exports.Directive = {}));
exports.DefaultVariables = [
    "FTP_PROXY", "ftp_proxy",
    "HTTP_PROXY", "http_proxy",
    "HTTPS_PROXY", "https_proxy",
    "NO_PROXY", "no_proxy"
];
var DockerfileParser;
(function (DockerfileParser) {
    function parse(content) {
        let parser = new parser_1.Parser();
        return parser.parse(content);
    }
    DockerfileParser.parse = parse;
})(DockerfileParser = exports.DockerfileParser || (exports.DockerfileParser = {}));


/***/ })

/******/ });
//# sourceMappingURL=index.js.map