# js-engine
Attempt to make something similar to dfw, but with JS.

# Dependencies.

If you need to build, you'd better have an updated NodeJS version (and not the 0.10 that came preinstalled with my OS :/). 

I personally tried it with V6.

# Building.

- If your browser support ES6 style imports and exports:
	- Do nothing. Use index.html and be happy.
- Else:
	- Solve the package.json dependencies with npm. (npm install).
	- Do "npm run build".
	- Use index.html
