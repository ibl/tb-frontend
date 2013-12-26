tb-frontend
===========

Tumor Board Frontend

Usage
-----

Clone this repo, then run the following commands within its directory:

    npm install
    bower install
    grunt

Deployment
----------

Loosely based on http://yeoman.io/deployment.html.

Start with usage above, then

    grunt build
    git add dist && git commit -m "Deploying a new version"
    git subtree push --prefix dist origin gh-pages
    
Don't forget to also commit your new changes to ``master``.

If you want to see what your changes look like in the ``dist`` version, run

    grunt server
