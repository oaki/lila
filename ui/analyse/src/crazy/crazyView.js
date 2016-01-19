var crazyDrag = require('./crazyDrag');
var partial = require('chessground').util.partial;
var m = require('mithril');

function crazyPocketTag(role, color) {
  return {
    tag: 'div',
    attrs: {
      class: 'no-square'
    },
    children: [{
      tag: 'piece',
      attrs: {
        class: role + ' ' + color
      }
    }]
  };
}

module.exports = {
  pocket: function(ctrl, color, position) {
    var step = ctrl.vm.step;
    if (!step.crazy) return;
    var pocket = step.crazy.pockets[color === 'white' ? 0 : 1];
    var oKeys = Object.keys(pocket)
    var crowded = oKeys.length > 4;
    var usable = color === ctrl.chessground.data.movable.color;
    return m('div', {
        class: 'pocket ' + position + (oKeys.length > 4 ? ' crowded' : '') + (usable ? ' usable' : ''),
        config: function(el, isUpdate, context) {
          if (isUpdate) return;
          var onstart = partial(crazyDrag, ctrl, color);
          el.addEventListener('mousedown', onstart);
          context.onunload = function() {
            el.removeEventListener('mousedown', onstart);
          };
        }
      },
      oKeys.map(function(role) {
        var pieces = [];
        for (var i = 0; i < pocket[role]; i++) pieces.push(crazyPocketTag(role, color));
        return m('div', {
          class: 'role',
          'data-role': role,
          'data-color': color,
        }, pieces);
      })
    );
  }
};
