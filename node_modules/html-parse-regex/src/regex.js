export const tagCatcher = /[\r\n\s]*<(\/)?([^ =>]+)([^>]*?)(\/)?>/gim

export const paramCatcher = /(?:("[\w\W]+?"|[^ ?=]+))(?:="((?:\\"|.)+?)")?/gim
