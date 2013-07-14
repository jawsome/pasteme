(function($) {

function showPaste(data) {
 $('#pastearea').html('<pre>' + JSON.stringify(data) + '</pre>');

}


  var app = $.sammy(function() {
    this.get('(/)', function() {
      $('#bin').show();
      
     
    });

    this.get('/view/:id', function () {
    
      $.ajax({
        url: '/api/' + this.params['id'],
        dataType: 'json',
        beforeSend: function() {
          $('#bin').hide();
          $('#pastearea').html('Loading...');
        },
        success: function(data) {
          showPaste(data);
        }
      });
    });

    this.get('(#/|/)test', function() {
    });

  });

app.run();

})(jQuery);
