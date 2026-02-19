import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { restaurantSaga } from './restaurantSaga';
import { reservationSaga } from './reservationSaga';
import { tableSaga } from './tableSaga';

export function* rootSaga() {
  yield all([authSaga(), restaurantSaga(), reservationSaga(), tableSaga()]);
}
