// Replace emoji wtih spans
// Adapted from http://crocodillon.com/blog/parsing-emoji-unicode-in-javascript
function findSurrogatePair(point) {
  // assumes point > 0xffff
  var offset = point - 0x10000,
      lead = 0xd800 + (offset >> 10),
      trail = 0xdc00 + (offset & 0x3ff);
  return [lead.toString(16), trail.toString(16)];
}

function emojiSupported() {
  var node = document.createElement('canvas');
  if (!node.getContext || !node.getContext('2d') ||
      typeof node.getContext('2d').fillText !== 'function')
    return false;
  var ctx = node.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '32px Arial';
  ctx.fillText('\ud83d\ude03', 0, 0);
  return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
}

var ranges = [
  '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
  '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
  '\ud83d[\ude80-\udeff]',  // U+1F680 to U+1F6FF
  '\u2728', '\u270A', '\u270B', '\u270C', '\u270D',
  '\u26a0\ufe0f', '\u26A1', '\u2764', '🇺🇸'
];

$(document).ready(function() {
  if(emojiSupported()) return;
  $("body").find('*').each(function(idx, el) {
    el.innerHTML = el.innerHTML.replace(
    new RegExp(ranges.join('|'), 'g'),
    '<span class="emoji" data-emoji="$&">$&</span>');
  })
})