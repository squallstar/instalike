Template.search.events({
  'submit form': function (event, instance) {
    event.preventDefault();
    var $form = instance.$('form');

    $form.hide();

    Meteor.call('fetchPics', getFormData(instance), function () {
      $form.show();
    });
  },
  'click [data-save-job]': function (event, instance) {
    event.preventDefault();
    event.stopPropagation();

    Meteor.call('saveQueryAsJob', getFormData(instance));
  }
});

function getFormData (instance) {
  return {
    query: instance.$('input[name="query"]').val().replace('#', '').trim(),
    min_likes: parseInt(instance.$('input[name="min-likes"]').val()),
    max_likes: parseInt(instance.$('input[name="max-likes"]').val()),
    limit: parseInt(instance.$('input[name="limit"]').val())
  };
}