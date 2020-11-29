import React from 'react';
import { Home } from '../../components';
import { connect } from 'react-redux';
import { IRootState, Dispatch } from '../../redux/store';

const HomeContainer = (props: TProps) => <Home />;

const mapState = (state: IRootState) => ({
	textModelText: state.testModel.text,
});

const mapDispatch = (dispatch: Dispatch) => ({
	clearTestMoselState: dispatch.testModel.clearTestMoselState,
});

export default connect(mapState, mapDispatch)(HomeContainer);

type TProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;