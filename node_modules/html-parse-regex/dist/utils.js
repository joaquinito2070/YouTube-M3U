'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoot = exports.createPureTextNode = exports.createShortcutAndAttributes = exports._pushList = exports._linkNodes = exports._findOpen = exports.oneMapToFilter = exports._tryPushNode = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _pytils = require('pytils');

var _regex = require('./regex');

var _error = require('./error');

var _tryPushNode = exports._tryPushNode = function _tryPushNode(Pattern, Nodes) {
  return function (match) {
    var tag = match[2] !== undefined ? match[2] : '';
    if (tag) {
      var node = {
        tag: tag,
        attrs: match[3] !== undefined ? match[3] : '',
        start: match.index,
        end: Pattern.lastIndex
      };
      match[4] !== undefined ? node.linked = true : match[1] !== undefined ? node.close = true : node.open = true;
      Nodes.push(node);
    }
  };
};

var oneMapToFilter = exports.oneMapToFilter = function oneMapToFilter(Nodes) {
  var closes = [],
      noCloses = [];
  Nodes.map(function (n, k) {
    return n.close ? closes[k] = n : noCloses[k] = n;
  });
  return { closes: closes, noCloses: noCloses };
};

var _findOpen = exports._findOpen = function _findOpen(noCloses) {
  return function (tag, key) {
    var node = void 0;
    for (var kOpen = key; kOpen >= 0; kOpen--) {
      node = noCloses[kOpen];
      if (node && node.open && node.tag === tag) {
        return kOpen;
      }
    }
    return false;
  };
};

var createNode = function createNode(openNode, closeNode) {
  (0, _error.isForcedCloseTag)(openNode, closeNode);
  delete openNode.open;
  delete openNode.linked;
  closeNode && (openNode.end = closeNode.end);
  openNode.link = {
    father: null,
    childs: []
  };
  return openNode;
};

var _forceCreateNode = function _forceCreateNode(pushList, father) {
  return function (child) {
    if (child) {
      if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
        if (!child.text && !child.link) {
          child = createNode(child);
        }
        child.link.father = father;
      }
      father.link.childs.push(child);
      pushList(child);
    }
  };
};

var _linkNodes = exports._linkNodes = function _linkNodes(pushList, closes, noCloses) {
  return function (kOpen, kClose) {
    var father = createNode(noCloses[kOpen], closes[kClose]);
    var forceCreateNode = _forceCreateNode(pushList, father);
    for (var key = kOpen + 1; key <= kClose; key++) {
      forceCreateNode(noCloses[key]);
      delete noCloses[key];
      delete closes[key];
    }
    noCloses[kOpen] = father;
  };
};

var _pushList = exports._pushList = function _pushList(list) {
  return function (node) {
    return list.push(node);
  };
};

var getTagParams = function getTagParams(_params) {
  var params = {};
  var match = void 0;
  while (match = _regex.paramCatcher.exec(_params)) {
    var key = match[1];
    var value = match[2] ? match[2] : true;
    if (key) {
      params[key] = value;
    }
  }
  return params;
};

var createShortcutAndAttributes = exports.createShortcutAndAttributes = function createShortcutAndAttributes(list) {
  var id = {};
  list.map(function (n, k) {
    n.uniq = k;
    if (n.tag) {
      n.attrs = getTagParams(n.attrs);
      var Class = (0, _pytils.path)(['class'], n.attrs);
      n.class = (0, _pytils.isString)(Class) ? Class.split(' ') : [];
      delete n.attrs['class'];
      if (n.attrs.id) {
        id[n.attrs.id] = n;
      }
    }
  });
  return {
    id: id
  };
};

var createPureTextNode = exports.createPureTextNode = function createPureTextNode(text, start, end) {
  return {
    text: text,
    start: start,
    end: end,
    link: {
      father: null
    }
  };
};

var createRoot = exports.createRoot = function createRoot(pushList, noCloses) {
  var root = {
    root: true,
    link: {
      childs: []
    }
  };
  var forceCreateNode = _forceCreateNode(pushList, root);
  noCloses.map(function (n) {
    return forceCreateNode(n);
  });
  return root;
};