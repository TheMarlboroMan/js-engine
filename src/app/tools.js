"use strict"

export function countdown_to_zero_delta(_val, _delta) {

	_val-=_delta;
	if(_val < 0.0) {
		_val=0.0;
	}

	return _val;
}
