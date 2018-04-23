# js-engine
Attempt to make something similar to dfw, but with JS.

# TODO:

- Take a look at js-tile-mapper. See what we can do :).
	- Add support for custom sets.
	- Add support for multiple export types.
- Basic scrolling.
- Basic async room loading, promise based.

# Dependencies.

If you need to build, you'd better have an updated NodeJS version (and not the 0.10 that came preinstalled with my OS :/). 

I personally tried it with V6.

# Crash course.

Start by src/main.js. Move then to src/app directory for a few examples.

# Building.

- If your browser support ES6 style imports and exports:
	- Do nothing. Use index.html and be happy.
- Else:
	- Solve the package.json dependencies with npm. (npm install).
	- Do "npm run build".
	- Use index.html

# Credits:

Current assets from:

	https://opengameart.org/content/mini-knight
	https://opengameart.org/content/minimal-sidescroller-tileset_32_0

Thanks a lot :).
