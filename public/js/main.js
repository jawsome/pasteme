(function($) {
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
            beforeSend: function () {
             $('#bin textarea').attr('disabled');
             $('#pastearea').prepend('<div class="progress progress-striped active">  <div class="progress-bar" style="width: 100%"></div></div>');
            },
            success: function(data) {
              $('#pastearea .progress').remove();
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
          $('#pastearea').prepend('<div class="progress progress-striped active">  <div class="progress-bar" style="width: 100%"></div></div>');
        },
        success: function(data) {
          $('#pastearea .progress').remove();
          console.log(data, 'json');
          context.render('/templates/paste.template', {paste: data}).replace('#pastearea').then(function() {
            $('pre').syntaxHighlight();
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
          $('#pastearea').prepend('<div class="progress progress-striped active">  <div class="progress-bar" style="width: 100%"></div></div>');
        },
        success: function(data) {
          $('#pastearea .progress').remove();
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
            beforeSend: function() {
             $('#pastearea').prepend('<div class="progress progress-striped active">  <div class="progress-bar" style="width: 100%"></div></div>');
            },
            data: { 'paste': {'content': $('#bin textarea').val(), 'master': context.params['id'] } },
            success: function(data) {
              $('#pastearea .progress').remove();
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
