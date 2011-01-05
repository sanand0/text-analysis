;(function() {

function init() {
  var $ = window.jQuery,
      buffer = 50;          // Number of characters to show on the left and right

  // Get the text and process it
  var text = $('body').text();
  text = text.replace(/\s+/g, ' ');
  for (var i=0, spaces=' '; i<buffer; i++) { spaces += ' '; }
  text = spaces + text + spaces;

  // Display concordance for query in $result
  var concordance = function(query, $result) {
    var re = new RegExp('.{' + buffer + '}' + query + '.{' + buffer + '}', 'gi'),
        matches = text.match(re);
    if (matches) {
      for (var i=0, match; match=matches[i]; i++) {
        var l = match.length,
            show = match.substring(0, buffer) + '<b><u>' + match.substring(buffer, l-buffer) + '</u></b>' + match.substring(l-buffer, l);
        show = show.replace(/\s/g, '&nbsp;');
        $result.append(show + '<br>');
      }
    }
  };

  // Show a concordance window if it's not already shown
  $('#concordance').remove();
  var $out = $('<div>').attr('id', 'concordance').css({
    'position': 'absolute',
    'left': Math.round($(window).width() * 0.1) + 'px',
    'top': Math.round($(window).height() * 0.1) + 'px',
    'width': '80%',
    'height': '80%',
    'margin': 'auto',
    'background-color': '#eee',
    'overflow-y': 'auto',
    'padding': '4px',
    'text-align': 'center',
    'border': '3px solid black',
    'z-index': '9999'
  });
  var $input = $('<input>').appendTo($out);
  var $close = $('<a href="#">Close</a>').css({'position':'absolute', 'right': '4px', 'top': '4px'}).appendTo($out);
  $('<div>').css({'font':'14px monospace','color':'#000'}).appendTo($out);

  var close_concordance = function() {
    $out.remove();
    $('body').unbind('.concordance');
  };

  // Close the concordance if the user...
  // ... clicks on the close button
  $close.click(function(e) { e.preventDefault(); close_concordance(); });
  // ... clicks anywhere outside the window
  $('body').bind('click.concordance', function(e) {
    if ($(e.target).parents().andSelf().filter('#concordance').length == 0) { close_concordance(); }
  });
  // ... presses escape
  $('body').add($out).bind('keyup.concordance', function(e) {
    if (e.keyCode == 27) { close_concordance(); }
  });

  $out.appendTo('body');
  $input.focus();

  var timer = null;
  $out.delegate('input', 'keyup', function(e) {
    var query = $(this).val();
    if (timer) { clearTimeout(timer); }
    if (query.length > 1) {
      timer = setTimeout(function() { concordance(query, $('div', $out).empty()); timer = null; }, 200);
    }
  });
}


// Ensure that a recent version of jQuery is present, and initialise
if (!window.jQuery || !window.jQuery.fn.delegate) {
  var head = document.getElementsByTagName('head')[0],
      script = document.createElement('script');
  script.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js');
  head.appendChild(script);
  script.onload = script.onreadystatechange = function(){
      if ( !this.readyState || this.readyState == 'loaded' || this.readyState == 'complete' ) {
          init();
      }
  };
} else {
  init();
}

})();
