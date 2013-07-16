(function($) {

function selectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
  var app = $.sammy(function() {
    this.use('Template');
    this.get('(/)', function(context) {
      $('#bin').show();
      $('#submitpaste').click(function() {
        if($('#bin textarea').val() != ""){
          $.ajax({
            url: '/api',
            type: 'POST',
            dataType: 'json',
            data: { 'paste': {'content': $('#bin textarea').val()} },
            success: function(data) {
              window.location = '/view/' +  data.id;
            }
          });
        }; 
      });
     
    });

    this.get('/view/:id', function () {
     var context = this;
      $.ajax({
        url: '/api/' + this.params['id'],
        dataType: 'json',
        beforeSend: function() {
          console.log('Before send.');
          $('#bin').hide();
          $('#pastearea').html('Loading...');
        },
        success: function(data) {
          console.log(data, 'json');
          context.render('/templates/paste.template', {paste: data}).replace('#pastearea').then(function() {
            $('pre').syntaxHighlight();
            $('#newpaste').click(function() {
              window.location = '/';
            });
	  });
        }
      });
    });

    this.get('/fork/:id', function () {
      var context = this;
      $.ajax({
        url: '/api/' + this.params['id'],
        dataType: 'json',
        beforeSend: function() {
          console.log('Before send.');
        },
        success: function(data) {
          console.log(data, 'json');
            $('#bin textarea').val($('<div/>').html(data.body).text());
            $('#pastearea').hide();
            $('#bin').show();
      $('#submitpaste').click(function() {
        if($('#bin textarea').val() != ""){
          $.ajax({
            url: '/api',
            type: 'POST',
            dataType: 'json',
            data: { 'paste': {'content': $('#bin textarea').val(), 'master': context.params['id'] } },
            success: function(data) {
              window.location = '/view/' +  data.id;
            }
          });
        };
      });
     }
    });
   });
    this.get('(#/|/)test', function() {
    });

});
app.run();

})(jQuery);
