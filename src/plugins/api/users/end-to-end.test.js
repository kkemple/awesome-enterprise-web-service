import test from 'tape'
import Hapi from 'hapi'
import RedisEngine from 'catbox-redis'

import authPlugin from '../auth'
import dbPlugin from '../../db'
import hasherPlugin from '../../hasher'
import usersPlugin from './index'

test('[End to End] API.Users Plugin Integration with Hapi', (t) => {
  const server = new Hapi.Server({
    cache: {
      name: 'redis',
      engine: RedisEngine,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      partition: process.env.REDIS_PARTITION,
    },
  })

  server.connection({
    host: 'localhost',
    port: 80,
    labels: ['api'],
  })

  const dbConfig = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
  }

  server.app.secret = process.env.SECRET

  server.register([
    { register: require('hapi-auth-basic') },
    { register: require('hapi-auth-jwt2') },
    { register: hasherPlugin },
    { register: dbPlugin, options: dbConfig },
    { register: authPlugin, options: { prefix: '/api' } },
    { register: usersPlugin, options: { prefix: '/api' } },
  ], (err) => {
    if (err) t.fail(err.message)

    server.inject({
      url: '/api/authenticate',
      payload: { email: 'test@test.com', password: 'test' },
      method: 'POST',
    }, (response) => {
      const headers = { authorization: response.result.payload.token }

      t.test('GET /users', (t) => {
        t.test('with good credentials', (assert) => {
          server.inject({
            url: '/api/users',
            headers,
          }, (response) => {
            assert.equal(Array.isArray(response.result.payload.users), true, 'returns an array')
            assert.equal(response.result.payload.users.length, 1, 'with all users')
            assert.end()
          })
        })

        t.test('with bad credentials', (assert) => {
          server.inject({
            url: '/api/users',
          }, (response) => {
            assert.equal(response.result.statusCode, 401, 'should return unauthorized response')
            assert.end()
          })
        })
      })

      t.test('POST /users', (t) => {
        t.test('with good credentials', (assert) => {
          server.inject({
            url: '/api/users',
            method: 'POST',
            payload: { email: 'test1@test.com', password: 'test1', role: 'user' },
            headers,
          }, (response) => {
            const { user } = response.result.payload

            assert.equal(user.email, 'test1@test.com', 'returns the created user')

            server.inject({
              url: `/api/users/${user.id}`,
              method: 'DELETE',
              headers,
            }, () => {
              assert.end()
            })
          })
        })

        t.test('with bad credentials', (assert) => {
          server.inject({
            url: '/api/users',
            method: 'POST',
            payload: { email: 'test1@test.com', password: 'test1', role: 'user' },
          }, (response) => {
            assert.equal(response.result.statusCode, 401, 'should return unauthorized response')
            assert.end()
          })
        })
      })

      t.test('GET /users/current', (t) => {
        t.test('with good credentials', (assert) => {
          server.inject({
            url: '/api/users/current',
            headers,
          }, (response) => {
            const { email } = response.result.payload.user
            assert.equal(email, 'test@test.com', 'returns current user')
            assert.end()
          })
        })

        t.test('with bad credentials', (assert) => {
          server.inject({
            url: '/api/users/current',
          }, (response) => {
            assert.equal(response.result.statusCode, 401, 'should return unauthorized response')
            assert.end()
          })
        })
      })

      t.test('GET /users/{id}', (t) => {
        t.test('with good credentials', (assert) => {
          server.inject({
            url: '/api/users/1',
            headers,
          }, (response) => {
            const { email } = response.result.payload.user
            assert.equal(email, 'test@test.com', 'returns user')
            assert.end()
          })
        })

        t.test('with bad credentials', (assert) => {
          server.inject({
            url: '/api/users/1',
          }, (response) => {
            assert.equal(response.result.statusCode, 401, 'should return unauthorized response')
            assert.end()
          })
        })
      })

      t.test('PATCH /users/{id}', (t) => {
        t.test('with good credentials', (assert) => {
          server.inject({
            url: '/api/users',
            method: 'POST',
            payload: { email: 'test2@test.com', password: 'test2', role: 'user' },
            headers,
          }, (response) => {
            const { user } = response.result.payload

            server.inject({
              url: `/api/users/${user.id}`,
              method: 'PATCH',
              payload: { email: 'updated@test.com' },
              headers,
            }, (response) => {
              const updated = response.result.payload.user
              assert.equal(updated.email, 'updated@test.com', 'returns the updated user')

              server.inject({
                url: `/api/users/${user.id}`,
                method: 'DELETE',
                headers,
              }, () => {
                assert.end()
              })
            })
          })
        })

        t.test('with bad credentials', (assert) => {
          server.inject({
            url: '/api/users/1',
            method: 'PATCH',
            payload: { email: 'updated@test.com' },
          }, (response) => {
            assert.equal(response.result.statusCode, 401, 'should return unauthorized response')
            assert.end()
          })
        })
      })

      t.test('PUT /users/{id}', (t) => {
        t.test('with good credentials', (assert) => {
          server.inject({
            url: '/api/users',
            method: 'POST',
            payload: { email: 'test3@test.com', password: 'test3', role: 'user' },
            headers,
          }, (response) => {
            const { user } = response.result.payload

            server.inject({
              url: `/api/users/${user.id}`,
              method: 'PUT',
              payload: { email: 'updated@test.com' },
              headers,
            }, (response) => {
              const updated = response.result.payload.user
              assert.equal(updated.email, 'updated@test.com', 'returns the updated user')
              assert.equal(updated.role, 'user', 'returns the updated user')

              server.inject({
                url: `/api/users/${user.id}`,
                method: 'DELETE',
                headers,
              }, () => {
                assert.end()
              })
            })
          })
        })

        t.test('with bad credentials', (assert) => {
          server.inject({
            url: '/api/users/1',
            method: 'PATCH',
            payload: { email: 'updated@test.com' },
          }, (response) => {
            assert.equal(response.result.statusCode, 401, 'should return unauthorized response')
            assert.end()
          })
        })
      })

      t.test('DELETE /users', (t) => {
        t.test('with good credentials', (assert) => {
          server.inject({
            url: '/api/users',
            method: 'POST',
            payload: { email: 'test4@test.com', password: 'test4', role: 'user' },
            headers,
          }, (response) => {
            const { user } = response.result.payload

            server.inject({
              url: `/api/users/${user.id}`,
              method: 'DELETE',
              headers,
            }, () => {
              assert.pass('user successfully deleted')
              assert.end()
            })
          })
        })

        t.test('with bad credentials', (assert) => {
          server.inject({
            url: '/api/users/1',
            method: 'DELETE',
          }, (response) => {
            assert.equal(response.result.statusCode, 401, 'should return unauthorized response')
            assert.end()
          })
        })
      })
    })
  })
})
