import { createModel } from '@rematch/core';

const initialState = {
	test: '123'
};

export default createModel({
	state: initialState,
	reducers: {
	},
	effects: dispatch => ({
		clearTestMoselState() {
			console.log(123);
		},
	})
});