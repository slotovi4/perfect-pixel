import { TEST } from "../actions/types";

export interface IAction {
  type: "TEST";
}

const initialState = {
  test: true
};

export default (state = initialState, action: IAction) => {
  switch (action.type) {
    case TEST:
      return state;
    default:
      return state;
  }
};
