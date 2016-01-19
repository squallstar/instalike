Template.medias.helpers({
  medias: function () {
    return Media.find({}, {
      sort: { created_time: -1 }
    });
  }
})

Template.medias.onCreated(function () {
  this.subscribe('medias');
});

Template.medias.events({
  'submit [name="like-all"]': function (event) {
    event.preventDefault();

    Meteor.call('likeAllMedias', function (err) {
      if (err) {
        console.log(err);
        alert(err);
      }
    });
  }
})