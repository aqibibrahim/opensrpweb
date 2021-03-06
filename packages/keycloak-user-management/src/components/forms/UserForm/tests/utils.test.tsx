import { submitForm, fetchRequiredActions, createOrEditPractitioners } from '../utils';
import { KeycloakService } from '@opensrp/keycloak-service';
import fetch from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { history } from '@onaio/connected-reducer-registry';
import * as notifications from '@opensrp/notifications';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import { OpenSRPService } from '@opensrp/react-utils';
import { ERROR_OCCURED } from '../../../../constants';
import * as fixtures from './fixtures';
import { keycloakUser } from './fixtures';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...jest.requireActual('@opensrp/notifications'),
}));

const mockV4 = '0b3a3311-6f5a-40dd-95e5-008001acebe1';

jest.mock('uuid', () => {
  const v4 = () => mockV4;

  return {
    __esModule: true,
    ...jest.requireActual('uuid'),
    v4,
  };
});

describe('forms/utils/fetchRequiredActions', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'token', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });

  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const serviceClass = KeycloakService;
  const setUserActionOptionsMock = jest.fn();

  it('fetches required actions', async () => {
    fetch.once(JSON.stringify(fixtures.userActions));

    fetchRequiredActions(keycloakBaseURL, setUserActionOptionsMock, serviceClass);

    await act(async () => {
      await flushPromises();
    });

    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/authentication/required-actions/',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);

    expect(setUserActionOptionsMock).toHaveBeenCalledWith([
      fixtures.userAction1,
      fixtures.userAction3,
      fixtures.userAction4,
      fixtures.userAction5,
      fixtures.userAction6,
    ]);
  });

  it('handles error if fetching fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');

    fetchRequiredActions(keycloakBaseURL, setUserActionOptionsMock, serviceClass);

    await act(async () => {
      await flushPromises();
    });

    expect(setUserActionOptionsMock).not.toHaveBeenCalled();

    expect(notificationErrorMock).toHaveBeenCalledWith(ERROR_OCCURED);
  });
});

describe('forms/utils/submitForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });

  const values = {
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'janedoe@example.com',
    email: 'janedoe@example.com',
    requiredActions: ['UPDATE_PASSWORD'],
    identifier: '40522954-a9cb-44d4-9ea9-735674717eb3',
    id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
  };
  const keycloakBaseURL =
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage';
  const opensrpBaseURL = OPENSRP_API_BASE_URL;
  const opensrpServiceClass = OpenSRPService;
  const serviceClass = KeycloakService;
  const setSubmittingMock = jest.fn();
  const notificationSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
  const notificationErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
  const historyPushMock = jest.spyOn(history, 'push');
  const userId = 'cab07278-c77b-4bc7-b154-bcbf01b7d35b';

  it('submits user creation correctly', async () => {
    submitForm(
      values,
      keycloakBaseURL,
      opensrpBaseURL,
      serviceClass,
      opensrpServiceClass,
      setSubmittingMock,
      undefined,
      undefined
    );

    await act(async () => {
      await flushPromises();
    });
    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(fetch.mock.calls[0]).toEqual([
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users',
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          ...values,
          enabled: true,
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('User created successfully');
    expect(historyPushMock).toHaveBeenCalledWith(
      '/admin/users/credentials/cab07278-c77b-4bc7-b154-bcbf01b7d35b'
    );
  });

  it('submits user edit correctly', async () => {
    submitForm(
      values,
      keycloakBaseURL,
      opensrpBaseURL,
      serviceClass,
      opensrpServiceClass,
      setSubmittingMock,
      fixtures.practitioner1,
      userId
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(fetch.mock.calls[0]).toEqual([
      `https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/${userId}`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify(values),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('User edited successfully');
    expect(historyPushMock).toHaveBeenCalledWith('/admin/users/list');
  });

  it('handles error when user creation fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));

    submitForm(
      values,
      keycloakBaseURL,
      opensrpBaseURL,
      serviceClass,
      opensrpServiceClass,
      setSubmittingMock,
      undefined,
      undefined
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(notificationErrorMock).toHaveBeenCalledWith(ERROR_OCCURED);
    expect(historyPushMock).not.toHaveBeenCalled();
  });

  it('handles error when user edit fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));

    submitForm(
      values,
      keycloakBaseURL,
      opensrpBaseURL,
      serviceClass,
      opensrpServiceClass,
      setSubmittingMock,
      fixtures.practitioner1,
      userId
    );

    await act(async () => {
      await flushPromises();
    });

    expect(setSubmittingMock.mock.calls[0][0]).toEqual(true);
    expect(setSubmittingMock.mock.calls[1][0]).toEqual(false);
    expect(notificationErrorMock).toHaveBeenCalledWith(ERROR_OCCURED);
    expect(historyPushMock).not.toHaveBeenCalled();
  });

  it('marks user as practitioner successfully', async () => {
    const valuesCopy = {
      ...values,
      active: true,
      id: keycloakUser.id,
    };

    createOrEditPractitioners(opensrpBaseURL, opensrpServiceClass, valuesCopy, undefined, false);

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls[0]).toEqual([
      `https://opensrp-stage.smartregister.org/opensrp/rest/practitioner`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          active: true,
          identifier: mockV4,
          name: 'Jane Doe',
          userId: keycloakUser.id,
          username: 'janedoe@example.com',
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'POST',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner created successfully');
  });

  it('updates practitioner successfully', async () => {
    const valuesCopy = {
      ...values,
      active: true,
      id: keycloakUser.id,
    };

    createOrEditPractitioners(
      opensrpBaseURL,
      opensrpServiceClass,
      valuesCopy,
      fixtures.practitioner1,
      true
    );

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls[0]).toEqual([
      `https://opensrp-stage.smartregister.org/opensrp/rest/practitioner`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          active: true,
          identifier: fixtures.practitioner1.identifier,
          name: 'Jane Doe',
          userId: keycloakUser.id,
          username: 'janedoe@example.com',
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner updated successfully');
  });

  it('calls API with userId if present in values', async () => {
    const valuesCopy = {
      ...values,
      active: true,
      id: keycloakUser.id,
      userId: fixtures.practitioner1.userId,
    };

    createOrEditPractitioners(
      opensrpBaseURL,
      opensrpServiceClass,
      valuesCopy,
      fixtures.practitioner1,
      true
    );

    await act(async () => {
      await flushPromises();
    });
    expect(fetch.mock.calls[0]).toEqual([
      `https://opensrp-stage.smartregister.org/opensrp/rest/practitioner`,
      {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        body: JSON.stringify({
          active: true,
          identifier: fixtures.practitioner1.identifier,
          name: 'Jane Doe',
          userId: fixtures.practitioner1.userId,
          username: 'janedoe@example.com',
        }),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer token',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'PUT',
      },
    ]);
    expect(notificationSuccessMock).toHaveBeenCalledWith('Practitioner updated successfully');
  });

  it('handles errors when marking practitioner fails', async () => {
    fetch.mockReject(() => Promise.reject('API is down'));
    const valuesCopy = {
      ...values,
      active: true,
      id: keycloakUser.id,
    };

    createOrEditPractitioners(opensrpBaseURL, opensrpServiceClass, valuesCopy, undefined, true);

    await act(async () => {
      await flushPromises();
    });
    expect(notificationErrorMock).toHaveBeenCalledWith('An error occurred');
  });
});
