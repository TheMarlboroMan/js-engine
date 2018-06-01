# js-engine

Attempt to make something similar to dfw, but with JS.

# Structure:

/src/core contains the core files (the framework)
/src/app contains the application files.
/src/main.js contains the bootstrapping logic.

# TODO:

- Reorganize files: have assets and src/app under "example". Build command will have to be modified, probably.
- Draw text.

# Dependencies.

If you need to build, you'd better have an updated NodeJS version (and not the 0.10 that came preinstalled with my OS :/). 

I personally tried it with V6.

# Crash course.

Start by src/main.js. Move then to src/app directory for a few examples.

# Building.

- If your browser support ES6 style imports and exports:
	- Do nothing. Use index.html and be happy.
	- Warning, firefox 60 is not working anymore... Do the "else" below.
- Else:
	- Solve the package.json dependencies with npm. (npm install).
	- Do "npm run build".
	- Use index.html

# Credits:

Current assets from:

	https://opengameart.org/content/mini-knight
	https://opengameart.org/content/minimal-sidescroller-tileset_32_0
	https://opengameart.org/content/generic-platformer-tileset-16x16-background

//TODO: Add the sounds here too...

Thanks a lot :).
