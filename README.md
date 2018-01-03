## Install

```
$ npm i
```

create an app.yaml file and deploy to google app engine

```yaml
runtime: nodejs
env: flex
env_variables:
      TARGET_GROUP: 1234085530026762
      ACCESS_TOKEN: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

and then deploy:
```
$ gcloud app deploy --project my-project
```
