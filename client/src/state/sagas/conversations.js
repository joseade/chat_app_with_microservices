import { takeLatest, call, put, fork } from "redux-saga/effects";
import * as actions from "../actions/conversations";
import * as api from "../actions/api";

function* apiProcess({ payload, meta }) {
  try {
    const { data } = yield call(api.request, payload, meta);
    let name;
    if (meta.graphql) {
      name = Object.keys(data.data)[0];
      yield put(api.succes(meta.succes, data.data[name]));
    } else {
      yield put(api.succes(meta.succes, data));
    }
    if (meta.succes === actions.Types.CREATE_CONVERSATION_SUCCES) {
      for (const receiver of meta.receiverId) {
        yield put(
          actions.sendConversation(meta.senderId, receiver, data.data[name])
        );
      }
    }

    if (meta.succes === actions.Types.USER_QUITS_CONVERSATION_SUCCES) {
      for (const receiver of data.data[name].members) {
        yield put(
          actions.sendConversation(
            meta.removedUserId,
            receiver,
            data.data[name]
          )
        );
      }
    }
    if (meta.succes === actions.Types.ADD_FRIEND_TO_CONVERSATION_SUCCES) {
      for (const receiver of data.data[name].members) {
        if (receiver !== data.data[name].members[0]) {
          yield put(
            actions.sendConversation(
              data.data[name].members[0],
              receiver,
              data.data[name]
            )
          );
        }
      }
    }
    if (meta.succes === actions.Types.DELETE_FRIEND_FROM_CONVERSATION_SUCCES) {
      for (const receiver of data.data[name].members) {
        if (receiver !== data.data[name].members[0]) {
          yield put(
            actions.sendConversation(
              data.data[name].members[0],
              receiver,
              data.data[name]
            )
          );
        }
      }
      if (meta.graphql) {
        yield put(
          actions.sendConversation(
            data.data[name].members[0],
            meta.removedUserId,
            {
              ...data.data[name],
              removedUserId: meta.removedUserId,
            }
          )
        );
      } else {
        yield put(
          actions.sendConversation(data.members[0], payload.removedUserId, {
            ...data,
            removedUserId: payload.removedUserId,
          })
        );
      }
    }
  } catch (error) {
    yield put(api.error(meta.error, error.response.data.errors));
  }
}

function* onConversations() {
  yield takeLatest(actions.Types.CONVERSATIONS_REQUEST, apiProcess);
}

function* onNewConversations() {
  yield takeLatest(actions.Types.CREATE_CONVERSATION_REQUEST, apiProcess);
}

function* onAddingFriendToConversations() {
  yield takeLatest(
    actions.Types.ADD_FRIEND_TO_CONVERSATION_REQUEST,
    apiProcess
  );
}

function* onDeletingFriendFromConversations() {
  yield takeLatest(
    actions.Types.DELETE_FRIEND_FROM_CONVERSATION_REQUEST,
    apiProcess
  );
}

function* onQuittingConversations() {
  yield takeLatest(actions.Types.USER_QUITS_CONVERSATION_REQUEST, apiProcess);
}

const conversationsSagas = [
  fork(onConversations),
  fork(onNewConversations),
  fork(onAddingFriendToConversations),
  fork(onDeletingFriendFromConversations),
  fork(onQuittingConversations),
];
export default conversationsSagas;
