# HTML-PARSE-REGEX

## USING NEW PARSER - MANY FIXED BUGS!!
## TWICE AS FAST - All process have a avg of 5 mileseconds!!!

## I will help if you have any difficulty =)
Contact me by [github:heyderpd](https://github.com/heyderpd). I'll be glad to help you.

[![NPM](https://nodei.co/npm/html-parse-regex.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/html-parse-regex/)
[![NPM](https://nodei.co/npm-dl/html-parse-regex.png?height=3&months=2)](https://nodei.co/npm-dl/html-parse-regex/)

Create tree object of html/xml raw file.
Each node have:
* tag name
* all params tag parsed to a js object
* link to inner tags

## First Steps NO MORE!
Now use es2015, don't need first steps!
Thanks for:
[npm~lucasmreis](https://www.npmjs.com/~lucasmreis)

npm install npm install html-parse-regex

## Example:
### HTML
```html
(<Object1>) <div id="A" align="left" style="margin-top:15px;">
  (<Object2>) <div id="B" class="yttre">
    (<Object3>) <strong>
      (<Object4>)  ASCII links
                </strong>
              </div>
            </div>
```

### MAIN DATA OBJECT
```javascript
html {
  list: [ /* same object's but in list mode */
    <Object1>,
    <Object2>,
    <Object3>,
    <Object4>
  ],
  tree: {
    root: true,
    link: {                 /* tree view mode */
      childs: [ <Object1> ] /* object tag of div#A, base of this example   */
    },                      /* inner this you found link for children tags */
  },
  shortcut: {
    id: { A: <Object1>, B: <Object2> } /* link to tag object find by id */
  }
  error: {
    forcedCloseTag: [ /* if need close any tag open tag will appear in this error object */
      { tag: 'a', start: 5, end: 38 }
    ]
  }
}
```

### TAG OBJECT
```javascript
/* TAG OBJECT */
<Object1> = {
  tag: "div",
  attrs: { id: "A", align: "left", style: "margin-top:15px;" },
  start: 0,
  end: 123,
  link: {
    father: tree,
    childs: [ <Object2> ]
  }
}

<Object2> = {
  tag: "div",
  attrs: { id: "B", class: "yttre" },
  start: 0,
  end: 123,
  link: {
    father: <Object1>,
    childs: [ <Object3> ]
  }
}

/* PURE TEXT OBJECT */
<Object4> = {
  text: "ASCII links",
  start: 20,
  end: 31,
  link: {
    father: <Object3>
  }
}
```

##To create tree from raw html/xml
Example:
```javascript
import fs from 'fs';
import parse from 'html-parse-regex';

const htmlRaw = fs.readFileSync(`index.html`, 'utf8');
const html = parse(htmlRaw);
```
