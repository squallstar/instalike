var async = Meteor.npmRequire('async');
var instagramNode = Meteor.npmRequire('instagram-node');

var wrapperGetPics = Meteor.wrapAsync(getPics);
var wrapperLikeMedia = Meteor.wrapAsync(likeMedia);

Meteor.methods({
  fetchPics: function (options) {
    var pics = [],
        loops = 0,
        inserted = 0,
        limit = parseInt(options.limit || 20),
        done = false;

    while (!done) {
      var newPics = wrapperGetPics(options);

      for (var i = 0; i < newPics.length; i++) {
        var pic = newPics[i];

        Media.upsert(pic.id, {
          $set: pic
        });

        inserted++;

        if (inserted >= limit) {
          done = true;
          break;
        }
      }

      loops++;

      if (loops > 20) {
        done = true;
      }
    }
  },
  likeAllMedias: function () {
    var pics = Media.find({
      user: Meteor.userId()
    }).fetch();

    pics.forEach(function (pic) {
      if (wrapperLikeMedia(pic)) {
        Media.remove(pic.id);
      }
    });
  }
});

function likeMedia (pic, next) {
  var ig = instagramNode.instagram();

  ig.use({
    access_token: Meteor.user().services.instagram.accessToken
  });

  console.log('Liking', pic.instagram_id);

  ig.add_like(pic.instagram_id, function (err, remaining, limit) {
    next(err, true);
  });
}

function getPics (options, next) {
  var userId = Meteor.userId(),
      pics = [];

  check(userId, String);
  check(options.query, String);

  console.log('Fetching with options', options);

  var ig = instagramNode.instagram(),
      attrs = {};

  ig.use({
    access_token: Meteor.user().services.instagram.accessToken
  });

  ig.tag_media_recent(options.query, options, function (err, medias, pagination, remaining, limit) {
    var count = 0;

    options.max_tag_id = pagination.next_max_id;

    console.log('Got', medias.length, 'medias');

    _.each(medias, function (media) {
      var likes = media.likes.count;

      if (media.user_has_liked
          || (options.min_likes && likes < options.min_likes)
          || (options.max_likes && likes > options.max_likes)) {
        console.log('Skipping media', media.id, 'with likes', likes, ', liked', media.user_has_liked);
        return;
      }

      pics.push({
        id: media.id + '-' + userId,
        user: userId,
        instagram_id: media.id,
        created_time: Date.now(),
        image: media.images.standard_resolution.url,
        liked: media.user_has_liked,
        likes: likes
      });

      count++;
    });

    console.log('Fetched', count, 'medias');

    next(null, pics);
  });
}