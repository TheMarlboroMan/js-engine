"use strict"

export class map {
	__construct() {
		this.w=0;
		this.h=0;
		this.logic={};
		this.background={};
	}
}

export class map_loader {

	//TODO: The joke here is to resolve the promise and shit.
	load_from_url(_url) {
		return fetch(_url)
			.then((_response) => { return _response.json();})
			.then((_result) => {return this.parse_map(_result);})
			.then((_map) => {return _map;})
			.catch((_err) => {return _err;});
	}

	parse_map(_data) {

		let result=new map();
		result.w=_data.tablas[0].w;
		result.h=_data.tablas[0].h;
		result.logic=_data.tablas[0].celdas.filter((_item) => {return _item.t!=0;});
		result.background=_data.tablas[1].celdas.filter((_item) => {return _item.t!=0;});
		console.log(result);
		throw new Error('catch this!');
	}

}
