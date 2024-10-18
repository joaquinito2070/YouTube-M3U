"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var tagCatcher = exports.tagCatcher = /[\r\n\s]*<(\/)?([^ =>]+)([^>]*?)(\/)?>/gim;

var paramCatcher = exports.paramCatcher = /(?:("[\w\W]+?"|[^ ?=]+))(?:="((?:\\"|.)+?)")?/gim;