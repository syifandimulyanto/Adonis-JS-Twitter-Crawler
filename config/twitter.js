'use strict'

const Env = use('Env')

module.exports = {
  url 				  : Env.get('TWITTER_URL'),
  consumer_key        : Env.get('TWITTER_CONSUMER_KEY'),
  consumer_secret     : Env.get('TWITTER_CONSUMER_SECRET'),
  access_token        : Env.get('TWITTER_ACCESS_TOKEN'),
  access_token_secret : Env.get('TWITTER_ACCESS_TOKEN_SECRET')
}
