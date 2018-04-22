import {rect} from '../rect.js';

class results {
	constructor() {
		this.success_count=0;
		this.fail_count=0;
	}

	succeed() {
		++this.success_count;
	}

	fail() {
		++this.fail_count;
	}

	add(_other) {
		this.success_count+=_other.success_count;
		this.fail_count+=_other.fail_count;
	}

	announce() {
		console.log("success: "+this.success_count+" fail:"+this.fail_count);
	}
}

//!Adds a name to a rect.
class testrect extends rect {
	constructor(_n, _x, _y) {
		super(_x*10, _y*10, 10, 10);
		this.name=_n;
	}
}

//TODO: I guess I could actually have an interface for this.
//TODO: Add parent class with the results and name and stuff.
class testblock {

	constructor(_name, _fn, _table) {
		this.name=_name;
		this.func=_fn;
		this.table=_table;
		this.tres=new results;
	}

	run() {
		this.table.forEach((_item) => {
			let res=this.func.apply(_item.a, [_item.b]);
			if(res!==_item.expectation) {
				this.tres.fail();
				console.error("Error ["+this.name+"] : "+_item.a.name+" vs "+_item.b.name+" was expected to be "+_item.expectation);
			}
			else {
				this.tres.succeed();
			}
		});

		return this;
	}

	collect() {
		return this.tres;
	}

}

class testcase {
	constructor(_a, _b, _expectation) {
		this.a=_a;
		this.b=_b;
		this.expectation=_expectation;
	}
}

let 	tleft=	new testrect("topleft", 0, 0),
	top=	new testrect("topcenter", 1, 0),
	tright=	new testrect("topright", 2, 0),
	left=	new testrect("left", 0, 1),
	center=	new testrect("center", 1, 1),
	right=	new testrect("right", 2, 1),
	bleft=	new testrect("bottomleft", 0, 2),
	bottom=	new testrect("bottomcenter", 1, 2),
	bright=	new testrect("bottomright", 2, 2);

function bt(_a, _b, _expectation) {
	return new testcase(_a, _b, _expectation);
}

export class test_suite {
	constructor() {
		console.log("begin rect test suite");

		let 	accumulator=new results();

		[
			new testblock("collision", testrect.prototype.collides_with ,[
				bt(center, tleft, false),	bt(center, top, false),	bt(center, tright, false),
				bt(center, left, false),	bt(center, center, true), bt(center, right, false),
				bt(center, bleft, false),	bt(center, bottom, false), bt(center, bright, false)
			]).run().collect(),

			new testblock("over", testrect.prototype.is_over ,[
				bt(center, tleft, false),	bt(center, top, false),	bt(center, tright, false),
				bt(center, left, false),	bt(center, center, false), bt(center, right, false),
				bt(center, bleft, true),	bt(center, bottom, true), bt(center, bright, true)
			]).run().collect(),

			new testblock("under", testrect.prototype.is_under ,[
				bt(center, tleft, true),	bt(center, top, true),	bt(center, tright, true),
				bt(center, left, false),	bt(center, center, false), bt(center, right, false),
				bt(center, bleft, false),	bt(center, bottom, false), bt(center, bright, false)
			]).run().collect(),

			new testblock("left", testrect.prototype.is_left_of ,[
				bt(center, tleft, false),	bt(center, top, false),	bt(center, tright, true),
				bt(center, left, false),	bt(center, center, false), bt(center, right, true),
				bt(center, bleft, false),	bt(center, bottom, false), bt(center, bright, true)
			]).run().collect(),

			new testblock("right", testrect.prototype.is_right_of ,[
				bt(center, tleft, true),	bt(center, top, false),	bt(center, tright, false),
				bt(center, left, true),	bt(center, center, false), bt(center, right, false),
				bt(center, bleft, true),	bt(center, bottom, false), bt(center, bright, false)
			]).run().collect()
		].forEach( (_item) => {accumulator.add(_item);});

		accumulator.announce();
	}
};
