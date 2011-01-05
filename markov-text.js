(function() {
// Load readability CSS and jQuery
var head  = document.getElementsByTagName('head')[0],
    script= document.createElement('script'),
    css   = document.createElement('link');
css.rel   ='stylesheet';
css.href  ='http://lab.arc90.com/experiments/readability/css/readability.css';
script.src  = 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js';
head.appendChild(css);
head.appendChild(script);

// Once loaded,
script.onload = script.onreadystatechange = function() {
  if ( !this.readyState || this.readyState == 'loaded' || this.readyState == 'complete' ) {
    window.readStyle  = 'style-newspaper';
    window.readSize = 'size-large';
    window.readMargin  = 'margin-wide';

    // Load the Readability bookmarklet
    $.getScript('http://lab.arc90.com/experiments/readability/js/readability-0.1.js', function() {
      // Create a Markov model of order 2
      // http://cm.bell-labs.com/cm/cs/tpop/markov.pl
      var text = $('#readInner').text()
                  .replace(/\S*(http|ftp|mailto):\S*/g, '')   // Remove URLs
                  .replace(/\[\d*\]/g, '');                   // Remove [footnotes]
          words = text.split(/\s\s*/),
        model = {},
        w1 = '\n', w2 = '\n';
      for (var i=0, l=words.length; i<l; i++) {
        var w = words[i];
        if (w.match(/\w/)) {
          var a1 = model[w1] = model[w1] || {},
            a2 = a1[w2] = a1[w2] || [];
          a2[a2.length] = w;
          w1 = w2;
          w2 = w.toLowerCase();
        }
      }

      // Generate a Markov-chain of n words.
      var generate = function(n) {
        var w1 = '\n', w2 = '\n', out = [];
        for (var i=0; i<n; i++) { try {
          var list = model[w1][w2],
            w = list[Math.random() * list.length >> 0];
          out[out.length] = w;
          w1 = w2;
          w2 = w.toLowerCase();
        } catch(e) { } }

        out = out.slice(10);                    // Skip the first few
        do { out.shift(); } while (!out[0].match(/^[A-Z]/));    // Begin with a sentence
        do { out.pop(); } while (out.length && !out[out.length-1].match(/\.$/));  // End with a full-stop

        return out;
      };

      // Split the random text into paragraphs
      var show_quotes = function(num_words, words_per_para) {
        var words = generate(num_words);
        for (var i=words_per_para, l=words.length; i<l; i++) {
          if (words[i].match(/\.$/)) {            // If it's a sentence end,
            words.splice(i+1, 0, '</p><p>');        // Make it the para end
            l++;
            i += words_per_para;              // Go to next para
          }
        }
        $('h1').next().html(words.join(' '));
      };

      show_quotes(150, 40);
      $('.footer-right').html('<a href="http://www.s-anand.net/blog/random-quotes-generator/"><img style="position:relative; top:-18px" src="http://www.s-anand.net/i/random-quotes-v1.png"></a>')
          .append($('<a href="">Refresh</a>').click(function() { show_quotes(150,40); }));
    });
  }
};

})();
