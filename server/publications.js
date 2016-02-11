Meteor.publish('medias', function () {
  check(this.userId, String);

  return Media.find({
    user: this.userId
  }, {
    limit: 200
  });
});

Meteor.publish('userData', function () {
  return Meteor.users.find(
    { _id: this.userId },
    { fields: { job: 1, liked: 1 }
  });
});