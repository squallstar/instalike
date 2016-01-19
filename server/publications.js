Meteor.publish('medias', function () {
  check(this.userId, String);

  return Media.find({
    user: this.userId
  });
});