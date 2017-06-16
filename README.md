# HTTP Service _(@trust/http-service)_

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Modular HTTP Services

This package codifies a design pattern for defining reusable HTTP services.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#mit-license)

## Background

It's desireable in many cases to reuse encapsulated bundles of server behavior.
For example, library authors implementing an open standard may wish to export
an object that is completely responsible for behavior within it's scope and
entirely self-contained, such that integrators have virtually nothing to do
other than import the code and pass a few configuration parameters.

```javascript
const express = require('express')
const SomeService = require('some-service')

let server = express()
let service = SomeService.create(settings)

// mount the service into the new Express server
server.use(service.router)

// register additional route handlers
server.get('/', (req, res) => {
  res.send('Unlike SomeService\'s endpoints, I am specific to this server')
})

server.listen(process.env.PORT || 3000)
```

## Install

```
$ npm install --save @trust/http-service
```

## Usage

```javascript
const { BaseRequest, HTTPService } = require('@trust/http-service')
```

## API

### BaseRequest

A request handler is a class which optionally extends
[BaseRequest](#baserequest) and defines, at a bare minimum, a static `route`
getter and a static `handle` method. The `route` getter describes the handler
to the service so it can be wired up to an Express router. The `handle` method
is the route handler, with a special extra argument `service`. At runtime, the
instantiated `HTTPService` will be passed to this argument. This is a form of
dependency injection.

```javascript
class AlphaRequest extends BaseRequest {

  /**
   * The static `route` method defines the information required to
   * register the request handler with an Express router.
   */
  static get route () {
    return {
      path: '/alpha',
      method: 'GET'
    }
  }

  /**
   * The static `handle` method defines endpoint behavior. This method takes
   * three arguments. The first two are the IncomingRequest and HTTPResponse
   * objects to be passed by Express. The third argument allows state and
   * dependencies associated with the respective service to be injected.
   */
  static handle (req, res, service) {
    res.status(418).send(`I am a teapot. My name is ${service.name}`)
  }

}
```

> Note that there is no `next` argument to `handle(req, res, service)`. This is
> by design. Services are meant to be self-contained and responsible for every
> possible outcome of each request within their scope.

This extended `BaseRequest` may look like boilerplate without a purpose until
we consider a more complex request.

The main advantage of defining a request handler as a class is that we can
decompose very complex request logic with mixed synchronicity into smaller
functions that can be recomposed to represent complicated control flows
using promise chains and share state between them using a request instance.
This is a helpful technique for avoiding bad patterns with callbacks and middleware
stacks.


```javascript
class BravoRequest extends BaseRequest {

  /**
   * Route definition
   */
  static get route () {
    return {
      path: '/bravo',
      method: 'GET'
    }
  }

  /**
   * A more complex request handler, with promise-based control flow
   * and state.
   */
  static handle (req, res, service) {
    let request = new BravoRequest({ req, res, service })

    Promise.resolve()
      .then(() => request.step1())
      .then(() => request.step2())
      .then(() => request.step3())
      .catch(err => request.error(err))
  }

  step1 () {
    // do something synchronous
  }

  step2 () {
    // do something asynchronous
  }

  step3 () {
    let {res} = this

    if (!this.isOk()) {
      return this.badRequest()
    }

    res.send('asynchronously, with feeling')
  }

  isOk () {
    return true
  }

}
```

Here, `handle` instantiates the request handler class, creating an object
representing all the state and behavior required to handle this request.

Handlers should never mutate the `req` argument, as is common (and bad) practice
in Node.js development. Our request handler instance provides a safer scope for
accessing mutable data that won't come into conflict with any state defined by
middleware upstream.

This technique makes it possible to decompose a complex route handler
into a series of methods that are easier to understand and test.

The `BaseRequest` class provides common response and error handling methods.

#### request.noContent()
#### request.badRequest()
#### request.unauthorized()
#### request.notFound()
#### request.internalServerError()
#### request.error(err)

### HTTPService

```javascript
class MyService extends HTTPService {

  /**
   * The `handlers` method returns an array of request handler classes.
   */
  get handlers () {
    return [
      AlphaRequest,
      BravoRequest
    ]
  }

}
```

#### (static) create(data, dependencies) → {service}
#### (static) handlers(directory) → {service}
#### (static) with(shared, data, dependencies) → {service}
#### (get) handlers → {Array}
#### (get) router → {express.Router}
#### mount()
#### unmount()

## Contribute

### Issues

* please file [issues](https://github.com/anvilresearch/http-service/issues) :)
* for bug reports, include relevant details such as platform, version, relevant data, and stack traces
* be sure to check for existing issues before opening new ones
* read the documentation before asking questions
* it's strongly recommended to open an issue before hacking and submitting a PR
* we reserve the right to close an issue for excessive bikeshedding

### Pull requests

#### Policy

* we're not presently accepting *unsolicited* pull requests
* create an issue to discuss proposed features before submitting a pull request
* create an issue to propose changes of code style or introduce new tooling
* ensure your work is harmonious with the overall direction of the project
* ensure your work does not duplicate existing effort
* keep the scope compact; avoid PRs with more than one feature or fix
* code review with maintainers is required before any merging of pull requests
* new code must respect the style guide and overall architecture of the project
* be prepared to defend your work

#### Style guide

* ES6
* Standard JavaScript
* jsdocs

#### Code reviews

* required before merging PRs
* reviewers SHOULD run the code under review

### Collaborating

#### Weekly project meeting

* Thursdays from 1:00 PM to 2:00 Eastern US time at [TBD]
* Join remotely with Google Hangouts

#### Pair programming

* Required for new contributors
* Work directly with one or more members of the core development team


### Code of conduct

* @trust/http-service follows the [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.

### Contributors

* Christian Smith [@christiansmith](https://github.com/christiansmith)

## MIT License

Copyright (c) 2017 Anvil Research, Inc.
