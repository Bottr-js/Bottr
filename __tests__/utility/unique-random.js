const uniqueRandom = require.requireActual('../../lib/utility/unique-random');
it('should generate a random number from min to max without the same number in a row', () => {
  const random = uniqueRandom(1, 10);

	let fail = false;
	let current;
	let prev;

	for (let i = 0; i < 1000; i++) {
		current = random();

		if (current === prev || current > 10 || current < 1) {
			fail = true;
		}

		prev = current;
	}

	expect(fail).toBe(false);
});
