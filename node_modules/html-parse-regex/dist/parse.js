'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlValidator = undefined;

var _pytils = require('pytils');

var _dejavuCall = require('dejavu-call');

var _regex = require('./regex');

var _error = require('./error');

var _utils = require('./utils');

var getAllTags = function getAllTags(html) {
  var Nodes = [];
  var tryPushNode = (0, _utils._tryPushNode)(_regex.tagCatcher, Nodes);
  var match = void 0;
  while (match = _regex.tagCatcher.exec(html)) {
    tryPushNode(match);
  }
  return Nodes;
};

var addAllPureTexts = function addAllPureTexts(Nodes, html) {
  var fullNodes = [],
      before = 0,
      text = '';
  Nodes.concat({ start: html.length }).map(function (node) {
    var len = node.start - before;
    text = html.substr(before, len);
    if (text) {
      fullNodes.push((0, _utils.createPureTextNode)(text, before, node.start));
    }
    before = node.end;
    fullNodes.push(node);
  });
  fullNodes.pop();
  return fullNodes;
};

var mountTree = function mountTree(pushList, Nodes) {
  var kOpen = void 0;

  var _oneMapToFilter = (0, _utils.oneMapToFilter)(Nodes),
      closes = _oneMapToFilter.closes,
      noCloses = _oneMapToFilter.noCloses;

  var findOpen = (0, _utils._findOpen)(noCloses);
  var linkNodes = (0, _utils._linkNodes)(pushList, closes, noCloses);
  closes.map(function (n, kClose) {
    kOpen = findOpen(n.tag, kClose);
    if (kOpen !== false) {
      linkNodes(kOpen, kClose);
    } else {
      (0, _error.isLostCloseTag)(closes[kClose]);
    }
  });
  return (0, _utils.createRoot)(pushList, noCloses);
};

var parse = function parse(html) {
  if (html === undefined) {
    throw 'param "html" is undefined';
  }
  if (typeof html !== 'string') {
    throw 'param "html" is undefined';
  }

  (0, _error.resetError)();
  var list = [];
  var pushList = (0, _utils._pushList)(list);
  var tree = mountTree(pushList, addAllPureTexts(getAllTags(html), html));
  return {
    hash: (0, _dejavuCall.getHash)(html),
    file: html,
    list: list,
    tree: tree,
    shortcut: (0, _utils.createShortcutAndAttributes)(list),
    error: _error.error
  };
};

var htmlValidator = exports.htmlValidator = function htmlValidator(moduleName) {
  return function (html) {
    var erro = moduleName + ': html is a essential! and need to be a valid html object';
    (0, _pytils.ifThrow)(!(0, _pytils.isObject)(html), erro);

    (0, _pytils.ifThrow)(!(0, _pytils.isString)(html.hash), erro);
    (0, _pytils.ifThrow)(!(0, _pytils.isString)(html.file), erro);
    (0, _pytils.ifThrow)(!(0, _pytils.isArray)(html.list), erro);
    (0, _pytils.ifThrow)(!(0, _pytils.isObject)(html.tree), erro);
    (0, _pytils.ifThrow)(!(0, _pytils.isObject)(html.shortcut), erro);
    (0, _pytils.ifThrow)(!(0, _pytils.isObject)(html.error), erro);

    (0, _pytils.ifThrow)(html.tree.root !== true, erro);
    (0, _pytils.ifThrow)(!(0, _pytils.isObject)(html.tree.link), erro);
  };
};

exports.default = parse;