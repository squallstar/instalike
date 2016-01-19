Template.search.events({
  'submit form': function (event, instance) {
    event.preventDefault();
    var $form = instance.$('form'),
        query = instance.$('input').val();

    $form.hide();

    Meteor.call('fetchPics', {
      query: instance.$('input[name="query"]').val(),
      min_likes: parseInt(instance.$('input[name="min-likes"]').val()),
      max_likes: parseInt(instance.$('input[name="max-likes"]').val()),
      limit: parseInt(instance.$('input[name="limit"]').val())
    }, function () {
      $form.show();
    });
  }
});