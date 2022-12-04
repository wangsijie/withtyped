import assert from 'node:assert';
import { describe, it } from 'node:test';

import sinon from 'sinon';

import { createQueryClient } from './query-client.js';
import { sql } from './sql.js';

class FakePg {
  connect = sinon.stub();
  end = sinon.stub();
  query = sinon.stub();
}

describe('PostgresQueryClient', () => {
  it('should call the inner instance methods accordingly', () => {
    const queryClient = createQueryClient();
    const fakePg = new FakePg();
    // @ts-expect-error for testing
    sinon.replace(queryClient, 'pool', fakePg);

    assert.deepStrictEqual(
      [fakePg.connect.notCalled, fakePg.end.notCalled, fakePg.query.notCalled],
      [true, true, true]
    );

    void queryClient.connect();
    assert.ok(fakePg.connect.calledOnce);

    void queryClient.end();
    assert.ok(fakePg.end.calledOnce);

    const query = sql`select * from ${'foo'}`;
    void queryClient.query(query);
    assert.ok(fakePg.query.calledOnceWithExactly('select * from $1', ['foo']));
  });
});
