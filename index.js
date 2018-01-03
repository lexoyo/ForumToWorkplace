const request = require('request');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Setup hooks in fttt or <a href="/github">on github</a>');
});


app.get('/github/', (req, res) => {
	console.log('github route called: ', req.query);
	postToWP(req.query.url, req.query.title, req.query.description)
	.then(() => res.status(200).send('OK'))
	.catch((err) => res.status(500).send(err));
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`listening at http://${host}:${port}`);
});

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const TARGET_GROUP = process.env.TARGET_GROUP;

var graphapi = request.defaults({
    baseUrl: 'https://graph.facebook.com',
    auth: {
        'bearer' : ACCESS_TOKEN
    }
});

function postToWP(url, title, description) {
	console.log('postToWP', url, title, description);
	return new Promise((resolve, reject) => {
		if(!url || !title || !description) {
			console.error('trying to post', url, description, title);
			reject('a param is missing');
		}
		graphapi({
				method: 'POST',
				url: '/' + TARGET_GROUP + '/feed',
				qs: {
						'message': `${title}: ${description}`,
						'link': url
				}
		}, function(error,response,bodyStr) {
				const body = typeof(bodyStr) === 'string' ? JSON.parse(bodyStr) : bodyStr;
				const err = error || body.error;
				if(err) {
						console.error(err);
						reject(err);
				} else {
						var post_id = body.id;
						console.log('Published "' + title + '": ' + post_id, body);
						resolve(post_id);
				}
		});
	});
}

