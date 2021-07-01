// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Dom2 = require("./Dom2.bs.js");
var Js_dict = require("rescript/lib/js/js_dict.js");
var Js_math = require("rescript/lib/js/js_math.js");
var PageSize = require("./PageSize.bs.js");
var Caml_array = require("rescript/lib/js/caml_array.js");
var Caml_option = require("rescript/lib/js/caml_option.js");

function make(width, height) {
  var canvas = Dom2.$$Document.createCanvasElement(document);
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

var CanvasFactory = {
  make: make
};

function makeFromUrl(url) {
  return new Promise((function (resolve, reject) {
                var image = new Image();
                image.onload = (function (param) {
                    return resolve(image);
                  });
                image.onerror = (function (error) {
                    return reject(error);
                  });
                image.src = url;
                
              }));
}

var ImageFactory = {
  makeFromUrl: makeFromUrl
};

function make$1(id) {
  var canvas = Dom2.$$Document.createCanvasElement(document);
  canvas.width = PageSize.A4.px.width;
  canvas.height = PageSize.A4.px.height;
  var context = Dom2.Canvas.getContext2d(canvas);
  return {
          id: id,
          width: canvas.width,
          height: canvas.height,
          canvas: canvas,
          context: context
        };
}

var Page = {
  make: make$1
};

function make$2(image, standardWidth, standardHeight) {
  var width = image.width;
  var height = image.height;
  var canvas = Dom2.$$Document.createCanvasElement(document);
  var context = Dom2.Canvas.getContext2d(canvas);
  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0);
  return {
          image: image,
          width: image.width,
          height: image.height,
          standardWidth: standardWidth,
          standardHeight: standardHeight,
          canvas: canvas,
          context: context
        };
}

function makeFromUrl$1(url, standardWidth, standardHeight) {
  return makeFromUrl(url).then(function (image) {
              return make$2(image, standardWidth, standardHeight);
            });
}

function drawNearestNeighbor(texture, page, sx, sy, sw, sh, dx, dy, dw, dh, options) {
  var imageData = texture.context.getImageData(sx, sy, sw, sh);
  var pix = imageData.data;
  var tempCanvas = make(dw, dh);
  var tempContext = Dom2.Canvas.getContext2d(tempCanvas);
  var deltax = dw / sw;
  var deltay = dh / sh;
  var pixw = Js_math.floor(deltax);
  var pixh = Js_math.floor(deltay);
  var pixw$1 = pixw < deltax ? pixw + 1 | 0 : pixw;
  var pixh$1 = pixh < deltay ? pixh + 1 | 0 : pixh;
  for(var y = 0; y < sh; ++y){
    for(var x = 0; x < sw; ++x){
      var tx = x * deltax;
      var ty = y * deltay;
      var i = ((Math.imul(y, sw) + x | 0) << 2);
      var r = Caml_array.get(pix, i + 0 | 0);
      var g = Caml_array.get(pix, i + 1 | 0);
      var b = Caml_array.get(pix, i + 2 | 0);
      var a = Caml_array.get(pix, i + 3 | 0) / 255.0;
      Dom2.Context2d.setFillStyleRGBA(tempContext, r, g, b, a);
      tempContext.fillRect(Js_math.floor(tx), Js_math.floor(ty), pixw$1, pixh$1);
    }
  }
  var context = page.context;
  context.save();
  context.translate(dx, dy);
  var match = options.rotate;
  if (typeof match === "object") {
    if (match.NAME === "Center") {
      var radians = match.VAL * Math.PI / 180.0;
      context.translate(dw / 2 | 0, dh / 2 | 0);
      context.rotate(radians);
      context.translate((-dw | 0) / 2 | 0, (-dh | 0) / 2 | 0);
    } else {
      var radians$1 = match.VAL * Math.PI / 180.0;
      context.rotate(radians$1);
    }
  }
  var match$1 = options.flip;
  if (match$1 === "Horizontal") {
    context.translate(dw, 0);
    context.scale(-1, 1);
  } else if (match$1 === "None") {
    
  } else {
    context.translate(0, dh);
    context.scale(1, -1);
  }
  context.drawImage(tempCanvas, 0, 0);
  context.restore();
  
}

function draw(texture, page, sx, sy, sw, sh, dx, dy, dw, dh, flip, rotate, param) {
  var sourceScaleX = texture.width / texture.standardWidth;
  var sourceScaleY = texture.height / texture.standardHeight;
  var sx$1 = Js_math.floor(sx * sourceScaleX);
  var sy$1 = Js_math.floor(sy * sourceScaleY);
  var sw$1 = Js_math.floor(sw * sourceScaleX);
  var sh$1 = Js_math.floor(sh * sourceScaleY);
  return drawNearestNeighbor(texture, page, sx$1, sy$1, sw$1, sh$1, dx, dy, dw, dh, {
              rotate: rotate,
              flip: flip
            });
}

var Texture = {
  make: make$2,
  makeFromUrl: makeFromUrl$1,
  drawNearestNeighbor: drawNearestNeighbor,
  draw: draw
};

function draw$1(image, page, x, y) {
  var context = Dom2.Canvas.getContext2d(page.canvas);
  context.drawImage(image, x, y);
  
}

var $$Image$1 = {
  draw: draw$1
};

var Input = {};

function make$3(param) {
  return {
          inputs: [],
          pages: [],
          currentPage: undefined,
          values: {
            images: {},
            textures: {},
            booleans: {},
            selects: {},
            ranges: {},
            strings: {}
          }
        };
}

var Model = {
  make: make$3
};

function hasInput(model, idToFind) {
  return Caml_option.undefined_to_opt(model.inputs.find(function (input) {
                  var id;
                  id = input.TAG === /* RegionInput */2 ? "" : input._0;
                  return id === idToFind;
                }));
}

function setStringInputValue(model, id, value) {
  var strings = Js_dict.fromArray(Js_dict.entries(model.values.strings));
  strings[id] = value;
  var init = model.values;
  return {
          inputs: model.inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: {
            images: init.images,
            textures: init.textures,
            booleans: init.booleans,
            selects: init.selects,
            ranges: init.ranges,
            strings: strings
          }
        };
}

function getStringInputValue(model, id) {
  var value = Js_dict.get(model.values.strings, id);
  if (value !== undefined) {
    return value;
  } else {
    return "";
  }
}

function setBooleanInputValue(model, id, value) {
  var booleans = Js_dict.fromArray(Js_dict.entries(model.values.booleans));
  booleans[id] = value;
  var init = model.values;
  return {
          inputs: model.inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: {
            images: init.images,
            textures: init.textures,
            booleans: booleans,
            selects: init.selects,
            ranges: init.ranges,
            strings: init.strings
          }
        };
}

function getBooleanInputValue(model, id) {
  var value = Js_dict.get(model.values.booleans, id);
  if (value !== undefined) {
    return value;
  } else {
    return false;
  }
}

function setSelectInputValue(model, id, value) {
  var selects = Js_dict.fromArray(Js_dict.entries(model.values.selects));
  selects[id] = value;
  var init = model.values;
  return {
          inputs: model.inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: {
            images: init.images,
            textures: init.textures,
            booleans: init.booleans,
            selects: selects,
            ranges: init.ranges,
            strings: init.strings
          }
        };
}

function getSelectInputValue(model, id) {
  var value = Js_dict.get(model.values.selects, id);
  if (value !== undefined) {
    return value;
  } else {
    return "";
  }
}

function hasBooleanValue(model, id) {
  return Js_dict.get(model.values.booleans, id) !== undefined;
}

function hasSelectValue(model, id) {
  return Js_dict.get(model.values.selects, id) !== undefined;
}

function findPage(model, id) {
  return Caml_option.undefined_to_opt(model.pages.find(function (page) {
                  return page.id === id;
                }));
}

function usePage(model, id) {
  var page = findPage(model, id);
  if (page !== undefined) {
    return model;
  }
  var page$1 = make$1(id);
  var pages = model.pages.concat([page$1]);
  return {
          inputs: model.inputs,
          pages: pages,
          currentPage: page$1,
          values: model.values
        };
}

function getDefaultPageId(param) {
  return "Page";
}

function getCurrentDefinedPageId(model) {
  var length = model.pages.length;
  if (length > 0) {
    return Caml_array.get(model.pages, length - 1 | 0).id;
  } else {
    return "Page";
  }
}

function ensureCurrentPage(model) {
  var match = model.currentPage;
  if (match !== undefined) {
    return model;
  } else {
    return usePage(model, "Page");
  }
}

function defineRegionInput(model, region, callback) {
  var pageId = getCurrentDefinedPageId(model);
  var inputs = model.inputs.concat([{
          TAG: /* RegionInput */2,
          _0: pageId,
          _1: region,
          _2: callback
        }]);
  return {
          inputs: inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: model.values
        };
}

function defineCustomStringInput(model, id, fn) {
  var inputs = model.inputs.concat([{
          TAG: /* CustomStringInput */1,
          _0: id,
          _1: fn
        }]);
  return {
          inputs: inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: model.values
        };
}

function defineBooleanInput(model, id, initial) {
  var inputs = model.inputs.concat([{
          TAG: /* BooleanInput */4,
          _0: id
        }]);
  var newModel_pages = model.pages;
  var newModel_currentPage = model.currentPage;
  var newModel_values = model.values;
  var newModel = {
    inputs: inputs,
    pages: newModel_pages,
    currentPage: newModel_currentPage,
    values: newModel_values
  };
  if (hasBooleanValue(model, id)) {
    return newModel;
  } else {
    return setBooleanInputValue(newModel, id, initial);
  }
}

function defineSelectInput(model, id, options) {
  var inputs = model.inputs.concat([{
          TAG: /* SelectInput */5,
          _0: id,
          _1: options
        }]);
  var newModel_pages = model.pages;
  var newModel_currentPage = model.currentPage;
  var newModel_values = model.values;
  var newModel = {
    inputs: inputs,
    pages: newModel_pages,
    currentPage: newModel_currentPage,
    values: newModel_values
  };
  if (hasSelectValue(model, id)) {
    return newModel;
  }
  var value = options.length > 0 ? Caml_array.get(options, 0) : "";
  return setSelectInputValue(newModel, id, value);
}

function defineTextureInput(model, id, options) {
  var input = {
    TAG: /* TextureInput */3,
    _0: id,
    _1: options
  };
  var inputs = model.inputs.concat([input]);
  return {
          inputs: inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: model.values
        };
}

function defineText(model, text) {
  var isText = function (input) {
    if (input.TAG === /* Text */0) {
      return true;
    } else {
      return false;
    }
  };
  var textCount = model.inputs.filter(isText).length;
  var id = "text-" + (textCount + 1 | 0).toString();
  var input = {
    TAG: /* Text */0,
    _0: id,
    _1: text
  };
  var inputs = model.inputs.concat([input]);
  return {
          inputs: inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: model.values
        };
}

function drawImage(model, id, param) {
  var model$1 = ensureCurrentPage(model);
  var currentPage = model$1.currentPage;
  var image = Js_dict.get(model$1.values.images, id);
  if (currentPage !== undefined && image !== undefined) {
    draw$1(Caml_option.valFromOption(image), currentPage, param[0], param[1]);
  }
  return model$1;
}

function addImage(model, id, image) {
  var images = Js_dict.fromArray(Js_dict.entries(model.values.images));
  images[id] = image;
  var init = model.values;
  return {
          inputs: model.inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: {
            images: images,
            textures: init.textures,
            booleans: init.booleans,
            selects: init.selects,
            ranges: init.ranges,
            strings: init.strings
          }
        };
}

function addTexture(model, id, texture) {
  var textures = Js_dict.fromArray(Js_dict.entries(model.values.textures));
  textures[id] = texture;
  var init = model.values;
  return {
          inputs: model.inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: {
            images: init.images,
            textures: textures,
            booleans: init.booleans,
            selects: init.selects,
            ranges: init.ranges,
            strings: init.strings
          }
        };
}

function clearTexture(model, id) {
  var entries = Js_dict.entries(model.values.textures).filter(function (param) {
        return param[0] !== id;
      });
  var textures = Js_dict.fromArray(entries);
  var init = model.values;
  return {
          inputs: model.inputs,
          pages: model.pages,
          currentPage: model.currentPage,
          values: {
            images: init.images,
            textures: textures,
            booleans: init.booleans,
            selects: init.selects,
            ranges: init.ranges,
            strings: init.strings
          }
        };
}

function drawTexture(model, id, param, param$1, flip, rotate, param$2) {
  var model$1 = ensureCurrentPage(model);
  var currentPage = model$1.currentPage;
  var texture = Js_dict.get(model$1.values.textures, id);
  if (currentPage !== undefined && texture !== undefined) {
    draw(texture, currentPage, param[0], param[1], param[2], param[3], param$1[0], param$1[1], param$1[2], param$1[3], flip, rotate, undefined);
  }
  return model$1;
}

function hasImage(model, id) {
  return Js_dict.get(model.values.images, id) !== undefined;
}

function hasTexture(model, id) {
  return Js_dict.get(model.values.textures, id) !== undefined;
}

exports.CanvasFactory = CanvasFactory;
exports.ImageFactory = ImageFactory;
exports.Page = Page;
exports.Texture = Texture;
exports.$$Image = $$Image$1;
exports.Input = Input;
exports.Model = Model;
exports.hasInput = hasInput;
exports.setStringInputValue = setStringInputValue;
exports.getStringInputValue = getStringInputValue;
exports.setBooleanInputValue = setBooleanInputValue;
exports.getBooleanInputValue = getBooleanInputValue;
exports.setSelectInputValue = setSelectInputValue;
exports.getSelectInputValue = getSelectInputValue;
exports.hasBooleanValue = hasBooleanValue;
exports.hasSelectValue = hasSelectValue;
exports.findPage = findPage;
exports.usePage = usePage;
exports.getDefaultPageId = getDefaultPageId;
exports.getCurrentDefinedPageId = getCurrentDefinedPageId;
exports.ensureCurrentPage = ensureCurrentPage;
exports.defineRegionInput = defineRegionInput;
exports.defineCustomStringInput = defineCustomStringInput;
exports.defineBooleanInput = defineBooleanInput;
exports.defineSelectInput = defineSelectInput;
exports.defineTextureInput = defineTextureInput;
exports.defineText = defineText;
exports.drawImage = drawImage;
exports.addImage = addImage;
exports.addTexture = addTexture;
exports.clearTexture = clearTexture;
exports.drawTexture = drawTexture;
exports.hasImage = hasImage;
exports.hasTexture = hasTexture;
/* No side effect */
