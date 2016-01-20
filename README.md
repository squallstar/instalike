# Instalike

Simple *Meteor-powered* webapp to search for Instagram pics by hashtag and min/max likes, then like all of them by pressing one button.

![Preview](https://cloud.githubusercontent.com/assets/574210/12422147/55375768-bebd-11e5-9706-61f90c0d807d.png)

**Please note**: due to rate limit on the Instagram APIs, you can only like up to 30 pics per hour.

## Run

1. Copy `settings.example.json` to `settings.json` and replace keys with your Instagram client keys. You can obtain yours here https://www.instagram.com/developer/clients/manage/

2. Run meteor

```
meteor --settings settings.json
```

and open [http://localhost:3000](http://localhost:3000)
