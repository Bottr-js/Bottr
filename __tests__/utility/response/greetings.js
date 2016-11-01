jest.unmock('../../../lib/utility/unique-random');
jest.unmock('../../../lib/utility/response/canned-response');

const greetings = require.requireActual('../../../lib/utility/response/greetings');

it('should generate greetings each time without repeating the previous greeting', () => {
	let current;
	let prev;

	for (let i = 0; i < 1000; i++) {
		current = greetings.get();

    expect(current).not.toEqual(prev);
    expect(current).not.toBeUndefined();

    prev = current;
	}
});
