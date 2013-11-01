#encoding: utf-8
require 'digest/sha1'
require 'open-uri'

class InstagramWrapper

	def initialize
		client = "b17758aab2b445c7929ed1e722a5a6da"
		secret = "bf5c785e3d904453997e9b63ac27ed35"
		Instagram.configure do |config|
		  config.client_id = client
		  config.client_secret = secret
		end
	end

	def grab foursquare
		location = Instagram.location_search(foursquare.remote_id)
		if location = location.first and id = location.id
			media = Instagram.location_recent_media(id)
			media_bucket = []
			media.each do |m|
				media_hash = {}
				if m.caption? and m.caption.text?
					media_hash[:text] = m.caption.text
				end

				if m.images? and m.images.standard_resolution?
					media_hash[:url] = m.images.standard_resolution.url
					`mkdir #{Rails.root}/app/assets/images/sources` if !File.exists?("#{Rails.root}/app/assets/images/sources")
					Rails.logger.warn "mkdir #{Rails.root}/app/assets/images/sources/#{foursquare.remote_id}"
					`mkdir #{Rails.root}/app/assets/images/sources/#{foursquare.remote_id}` if !File.exists?("#{Rails.root}/app/assets/images/sources/#{foursquare.remote_id}")
					filename = Digest::SHA1.hexdigest(m.images.standard_resolution.url)
					unless File.exists?("#{Rails.root}/app/assets/images/sources/#{foursquare.remote_id}/#{filename}.jpg")
						image = open(m.images.standard_resolution.url).read
						File.open("#{Rails.root}/app/assets/images/sources/#{foursquare.remote_id}/#{filename}.jpg", 'wb') { |file| file.write(image) }
						image = nil
					end
					media_hash[:local_url] = "#{foursquare.remote_id}/#{filename}.jpg"
				end

				if m.likes? and m.likes.count?
					media_hash[:likes] = m.likes.count
				end
				media_bucket << media_hash
			end
			foursquare.update_attribute(:images, media_bucket)
			foursquare
		end
		sleep 0.5
	end

	def test
		test = Sources.where(:name => /restaurant/i).limit(25)
		test.each do |t|
			grab t
		end
		nil
	end
end


#<Hashie::Mash attribution=nil caption=#<Hashie::Mash created_time="1377038628" from=#<Hashie::Mash full_name="carloscanizares" id="11415058" profile_picture="http://images.ak.instagram.com/profiles/profile_11415058_75sq_1374507072.jpg" username="carloscanizares"> id="526960668583194486" text="Lunch break with Jaclyn Guillou."> comments=#<Hashie::Mash count=0 data=[]> created_time="1377038535" filter="X-Pro II" id="526959883778584065_11415058" images=#<Hashie::Mash low_resolution=#<Hashie::Mash height=306 url="http://distilleryimage9.s3.amazonaws.com/c2c2b22c09e911e3808322000a9e0144_6.jpg" width=306> standard_resolution=#<Hashie::Mash height=612 url="http://distilleryimage9.s3.amazonaws.com/c2c2b22c09e911e3808322000a9e0144_7.jpg" width=612> thumbnail=#<Hashie::Mash height=150 url="http://distilleryimage9.s3.amazonaws.com/c2c2b22c09e911e3808322000a9e0144_5.jpg" width=150>> likes=#<Hashie::Mash count=2 data=[#<Hashie::Mash full_name="Jaclyn" id="272696774" profile_picture="http://images.ak.instagram.com/profiles/profile_272696774_75sq_1378444788.jpg" username="jaclynguillou">, #<Hashie::Mash full_name="Babak Khonsari" id="13375526" profile_picture="http://images.ak.instagram.com/profiles/profile_13375526_75sq_1327765170.jpg" username="babakinvan">]> link="http://instagram.com/p/dQIzjrgO4B/" location=#<Hashie::Mash id=435175 latitude=49.287972484 longitude=-123.140604313 name="Tanpopo Japanese Restaurant"> tags=[] type="image" user=#<Hashie::Mash bio="" full_name="carloscanizares" id="11415058" profile_picture="http://images.ak.instagram.com/profiles/profile_11415058_75sq_1374507072.jpg" username="carloscanizares" website=""> users_in_photo=[#<Hashie::Mash position=#<Hashie::Mash x=0.555555582 y=0.594771266> user=#<Hashie::Mash full_name="Jaclyn" id="272696774" profile_picture="http://images.ak.instagram.com/profiles/profile_272696774_75sq_1378444788.jpg" username="jaclynguillou">>]>
