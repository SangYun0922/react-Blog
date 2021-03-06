import { all, call, fork, put, take } from 'redux-saga/effects';
import { boardActions } from '../slices/boardSlice';
import axios from '../utils/axios';

//api 서버 연결 주소
function apiGetBoard(boardId) {
    return axios.get(`boards/${boardId}`);
}

function apiGetBoardList() {
    return axios.get(`boards`);
}

//api 서버 연결 후 action 호출
function* asyncGetBoardList() {
    try {
        const response = yield call(apiGetBoardList);
        console.log(response);
        if (response?.status == 200) {
            yield put(boardActions.getBoardListSuccess(response));
        } else {
            yield put(boardActions.getBoadListFail(response));
        }
    } catch (e) {
        console.error(e);
        yield put(boardActions.getBoadListFail(e.response));
    }
}

// action 호출을 감시하는 watch 함수 
function* watchGetBoardList() {
    while (true) {
        yield take(boardActions.getBoardList);
        yield call(asyncGetBoardList);
    }
}

export default function* boardSaga() {
    yield all([fork(watchGetBoardList)]);
}

