import { put, call, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
// import qs from 'qs'

export const REINITIALIZE = 'api/REINITIALIZE'
export const SUBMIT = 'api/SUBMIT'
export const SUBMIT_SUCCESS = 'api/SUBMIT_SUCCESS'
export const SUBMIT_ERROR = 'api/SUBMIT_ERROR'
export const UPDATE_DATA = 'api/UPDATE_DATA'

const SERVER_URL = typeof window !== 'undefined' ? '' : 'http://localhost:' + process.env.PORT

const findNeibourhood = (data) => {
  console.log('data', (data.address + ' ' + data.suburb + ' ' + data.city + ' ' + data.country))
  return axios.post(SERVER_URL + '/data/address/submit/', data)
    .then(response => response.data)
    .catch(err => {
      console.error(err)
      throw err
    })
}

function * setNeighbourhoodSaga ({ data }) {
  try {
    let result = yield call(findNeibourhood, data)
    yield put({ type: SUBMIT_SUCCESS, payload: result })
  } catch (e) {
    console.error('ERROR while submitting', e.message)
    yield put({ type: SUBMIT_ERROR, payload: { message: e.message } })
  }
}

export function * watchNewAddress () {
  yield takeLatest(SUBMIT, setNeighbourhoodSaga)
}
export const updateForm = (data) => ({ 'type': UPDATE_DATA, payload: data })
export const submitAddress = (data) => ({ 'type': SUBMIT, data })
export const reinitialise = (data) => ({ 'type': REINITIALIZE, data })
const defaultState = {
  address: '',
  suburb: '',
  city: '',
  country: ''
}

export const Reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPDATE_DATA:
      return Object.assign({}, state, payload)
    case REINITIALIZE:
      return Object.assign({}, state, {
        character: '0.00'
      })
    case SUBMIT:
      return Object.assign({}, state, {
        isSubmitting: true,
        hasSubmitted: false,
        hasError: false
      })
    case SUBMIT_SUCCESS:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: true,
        hasError: false,
        content: payload
      })
    case SUBMIT_ERROR:
      return Object.assign({}, state, {
        isSubmitting: false,
        hasSubmitted: false,
        hasError: true,
        errorMessage: payload.message
      })
    default:
      return state
  }
}
