const Stream = use('App/Models/Stream')
const Config = use('Config')
const fs     = require('fs')
const Twit 	 = require('twit')

class StreamController {

  	* index (request, response) {
    	
  		const results 	= {}
		results.status 	= true
    	results.data 	= yield Stream.query(request.getQuery()).fetch()

		response.json(results)

  	}

  	* group(request, response)
  	{
  		const streams = yield Stream.query(request.getQuery()).fetch()
  		const temp 	  = {}
  		const group   = []
    	streams.forEach((item, index) => {
  			const date 		= new Date(item.date_unix)
			const key 		= date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()

		  	temp[key] = temp[key] || 0
		  	temp[key]++
		})

    	for (const i in temp) 
    	{
			if (temp.hasOwnProperty(i)) 
			{
			   group.push({date:i,count:temp[i]});
			}
		}
		const results 	= {}
		results.status 	= true
		results.data 	= group

		response.json(results)
  

  	}

  	* crawl (request, responses) 
  	{
	  	const Credentials = new Twit({
		    consumer_key 		: Config.get('twitter.consumer_key')
		  , consumer_secret 	: Config.get('twitter.consumer_secret')
		  , access_token 		: Config.get('twitter.access_token')
		  , access_token_secret : Config.get('twitter.access_token_secret')
		})


	  	const arrayData = []

		let mapping = function(data)
		{
			const avatar   = data.user.profile_image_url
			const response = {
				'id' 			: data.id,
				'source' 		: Config.get('twitter.url') + data.user.screen_name + '/status/' + data.id_str,
				'text'			: data.text,
				'service' 		: 'twitter',
				'date'			: data.created_at,
				'date_unix'		: new Date(data.created_at),
				'is_bookmark' 	: 0,
				'sentiment' 	: {
					'positif' : false,
					'negatif' : false,
					'netral'  : true
				},
				'user'			: {
					'avatar'  : avatar.replace("http:", ""),
					'name'	  : data.user.name
				}
		 	}

		 	return response
		 	
		}

	  	Credentials.get('search/tweets', { q: 'indomie', count: 10000 }, function(err, data, response) {
			data.statuses.forEach((item, index) => {
	  			arrayData.push( mapping(item) )
			})
		})

		const stream = new Stream( {'lorem' : 1} )
	  	yield stream.save()

	  	setTimeout(function(){ 
	  		responses.json(arrayData)

	  		fs.appendFile('tweets.json', JSON.stringify(arrayData), function(err) {
			    if(err) 
			    {
			      console.log(err);
			    } else {
			      console.log("JSON saved to tweets.json");
			    }
			}); 

	  	}, 10000);
			
  	}	

}

module.exports = StreamController