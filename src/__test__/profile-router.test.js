'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST /profiles should get a 200 and the newly created profile', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'I have climbed to the top of the mountain and the view is great',
            firstName: 'Alexa',
            lastName: 'Amazon',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Alexa');
        expect(response.body.lastName).toEqual('Amazon');
        expect(response.body.bio).toEqual('I have climbed to the top of the mountain and the view is great');
      });
  });
});
