const ghpages = require('gh-pages');

ghpages.publish('docs/', error => { if (error) console.error(error) });
