import { all } from 'redux-saga/effects'
import { watchNewAddress } from '../reducers/home'
export default function * rootSaga () {
  yield all([
    watchNewAddress()
  ])
}
