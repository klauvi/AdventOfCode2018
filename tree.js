var Tree = function(children, meta, parent = null) {
  this.childCount = children;
  this.metaCount = meta;
  this.parent = parent;
  this.children = [];
  this.metaValues = [];
  this.value = 0;
};

Tree.prototype.getParent = function() {
  return this.parent;
};

Tree.prototype.isRoot = function() {
  return this.parent === null;
};

Tree.prototype.addChild = function(child) {
  this.children.push(child);
};

Tree.prototype.getChildCount = function() {
  return this.children.length;
};

Tree.prototype.isChildrenFull = function() {
  return this.children.length === this.childCount;
};

Tree.prototype.getMetaCount = function() {
  return this.metaCount;
};

Tree.prototype.addMetaValue = function(value) {
  this.metaValues.push(value);
};

Tree.prototype.getMetaValue = function(index) {
  return this.metaValues[index - 1] ? this.metaValues[index - 1] : 0;
};

module.exports = Tree;
