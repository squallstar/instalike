SyncedCron.add({
  name: 'Process user jobs',
  schedule: function(parser) {
    return parser.text('every 30 minutes');
  },
  job: function() {
    var users = Meteor.users.find({
      job: { $ne: null }
    }).fetch();

    console.log('Parsing jobs for', users.length, 'users');

    users.forEach(function (user) {
      var job = user.job;
      job.userId = user._id;

      console.log('starting job', job);

      var found = Instagram.fetchPics(job);

      console.log('found', found, 'pics');

      var liked = Instagram.likeAllMedias({
        userId: user._id
      });
    });

    console.log('Done! See you in a bit');

  }
});

SyncedCron.start();