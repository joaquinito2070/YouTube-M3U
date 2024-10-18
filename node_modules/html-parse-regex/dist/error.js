"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var error = exports.error = {};

var resetError = exports.resetError = function resetError() {
  error.forcedCloseTag = [];
  error.lostCloseTag = [];
};

var isForcedCloseTag = exports.isForcedCloseTag = function isForcedCloseTag(openNode, closeNode) {
  if (!closeNode && !openNode.linked && openNode.open) {
    error.forcedCloseTag.push({
      tag: openNode.tag,
      start: openNode.start,
      end: openNode.end
    });
  }
};

var isLostCloseTag = exports.isLostCloseTag = function isLostCloseTag(closeNode) {
  if (closeNode) {
    error.lostCloseTag.push({
      tag: closeNode.tag,
      start: closeNode.start,
      end: closeNode.end
    });
  }
};