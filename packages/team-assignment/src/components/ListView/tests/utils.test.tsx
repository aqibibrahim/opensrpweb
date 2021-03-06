import MockDate from 'mockdate';
import { getPayload } from '../utils';
import { assignments, samplePlan } from './fixtures';

describe('PlanAssignment/helpers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    MockDate.set('12/30/2020');
  });

  it('works for new assignments', () => {
    const selectedOrgs = ['1', '2', '3'];

    const payload = getPayload(
      selectedOrgs,
      samplePlan.identifier,
      'b652b2f4-a95d-489b-9e28-4629746db96a'
    );
    expect(payload).toEqual([
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '1',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2040-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '3',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2050-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('works for removing assignments', () => {
    const initialOrgs = ['1', '2', '3'];
    const selectedOrgs = ['1'];

    const payload = getPayload(
      selectedOrgs,
      samplePlan.identifier,
      'b652b2f4-a95d-489b-9e28-4629746db96a',
      initialOrgs,
      assignments
    );
    expect(payload).toEqual([
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '1',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '3',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('works for removing and adding at the same time assignments', () => {
    const initialOrgs = ['1', '2', '3'];
    const selectedOrgs = ['1', '4', '5'];

    const payload = getPayload(
      selectedOrgs,
      samplePlan.identifier,
      'b652b2f4-a95d-489b-9e28-4629746db96a',
      initialOrgs
    );
    expect(payload).toEqual([
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '1',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '4',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2040-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '5',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2050-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2050-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '3',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2050-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('does not allow duplicates', () => {
    const initialOrgs = ['2', '3'];
    const selectedOrgs = ['1', '1', '1'];

    const payload = getPayload(
      selectedOrgs,
      samplePlan.identifier,
      'b652b2f4-a95d-489b-9e28-4629746db96a',
      initialOrgs
    );
    expect(payload).toEqual([
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '1',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '2',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-30T00:00:00+00:00',
        jurisdiction: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        organization: '3',
        plan: '27362060-0309-411a-910c-64f55ede3758',
        toDate: '2030-12-30T00:00:00+00:00',
      },
    ]);
  });
});
