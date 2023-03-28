import test from 'node:test';
import assert from 'node:assert';
import diff from '../lib/index.js';

test('Should be empty for two same lists', () => {
  const oldState = [
    { run: 'a' },
    { startRoutine: 1 },
    { routine: 1, run: '1' },
    { run: 'b' },
    { startRoutine: 2 },
    { routine: 2, run: '1' },
    { routine: 2, run: '2' },
    { routine: 2, startRoutine: 3 },
    { routine: 3, run: '3' },
    { run: 'c' },
  ];
  const result = diff(oldState, oldState);
  assert.deepStrictEqual(result, [
    { startRoutine: 1 },
    { startRoutine: 2 },
    { routine: 2, startRoutine: 3 },
  ]);
})

test('Should contain differences', () => {
  const oldState = [
    { run: 'a' },
    { startRoutine: 1 },
    { routine: 1, run: '1' },
    { run: 'b' },
    { startRoutine: 2 },
    { routine: 2, run: '1' },
    { routine: 2, run: '2' },
    { routine: 2, startRoutine: 3 },
    { routine: 3, run: '3' },
    { run: 'c' },
    { run: 'd' },
  ];

  const newState = [
    { run: 'a' },
    { startRoutine: 1 },
    { routine: 1, run: '1' },
    { run: 'b' },
    { startRoutine: 2 },
    { routine: 2, run: '1' },
    { routine: 2, run: '22' },
    { routine: 2, startRoutine: 3 },
    { routine: 3, run: '3' },
    { run: 'cc' },
    { run: 'd' },
  ];

  const result = diff(oldState, newState);
  assert.deepStrictEqual(result, [
    { startRoutine: 1 },
    { startRoutine: 2 },
    { routine: 2, run: '22' },
    { routine: 2, startRoutine: 3 },
    { routine: 3, run: '3' },
    { run: 'cc' },
    { run: 'd' },
  ]);
})
