import React from 'react';
import { ImageHistory, IImageHistoryProps } from 'components';
import { connect } from 'react-redux';
import { TState, TDispatch } from 'store';

const HomeContainer = (props: TProps) => <ImageHistory {...props} />;

const mapState = (state: TState) => ({
	textModelText: state.imageHistory.test,
});

const mapDispatch = (dispatch: TDispatch) => ({
	clearTestMoselState: dispatch.imageHistory.clearTestMoselState,
});

export default connect(mapState, mapDispatch)(HomeContainer);

type TProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch> & IImageHistoryProps;