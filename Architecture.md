## Architecture

There are three main principles driving the design of Pozi:

- Stateless - Due to the nature of Bot building each message triggers a new request, therefore we need to build the bot in a stateless manner.
- Flexible - The framework must have ability to easily plug into multiple services with minimal modification and work from the developer. In addition the bot should be composable and gain additional functionality via the use of components.
- Minimal - Implementing a bot using this framework should be like writing any other web application. We build on the concept of convention of configuration to meet this goal.
