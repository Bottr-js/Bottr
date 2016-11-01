jest.unmock('../../../lib/utility/unique-random');
jest.unmock('../../../lib/utility/response/canned-response');

const acceptThanks = require.requireActual('../../../lib/utility/response/accept-thanks');

it('should generate string each time without repeating the previous string', () => {
	let current;
	let prev;

	for (let i = 0; i < 1000; i++) {
		current = acceptThanks.get();

    expect(current).not.toEqual(prev);
    expect(current).not.toBeUndefined();

    prev = current;
	}
});
