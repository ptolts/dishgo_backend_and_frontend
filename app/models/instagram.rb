class Instagram
	def grab foursquare
		client = "b17758aab2b445c7929ed1e722a5a6da"
		secret = "bf5c785e3d904453997e9b63ac27ed35"
		Instagram.configure do |config|
		  config.client_id = client
		  config.access_token = secret
		end
		locations = Instagram.location_search(foursquare.remote_id)		
		#Instagram.location_recent_media(514276)
	end

	def test
		test = Sources.where(:name => /restaurant/i).first
		grab test
	end
end
