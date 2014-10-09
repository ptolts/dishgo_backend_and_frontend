#encoding: UTF-8

class TopFive
	include Mongoid::Document
	include Mongoid::Timestamps

	store_in collection: "top_five", database: "dishgo"

	field :name, localize: true
	field :description, localize: true
	field :beautiful_url, type: String
	field :end_date, type: DateTime
	field :active, type: Boolean, default: false

	has_and_belongs_to_many :dish, class_name: "Dish", inverse_of: nil
	has_and_belongs_to_many :users, class_name: "User", inverse_of: nil
	has_many :dishcoins, class_name: "Dishcoin", inverse_of: :top_five
	has_many :prizes, class_name: "Prize", inverse_of: :top_five
	has_many :individual_prizes, class_name: "IndividualPrize", inverse_of: :top_five
	belongs_to :user

	before_save :beautify_url

	scope :is_active, -> { where(active: true) }	

	def number_of_dishes
		return 4
	end

	def ordered_dishes
		# Order it according to result, or according to our set list. Fuck Blackstrap.
		if end_date and end_date <= DateTime.now
			return self.dish.top_five
		else		
			return self.dish.sort_by{|e| dish_ids.index(e.id) }
		end
	end

	def reward_prizes
		prizes.each do |prize|
			skip_these_users = []
			dishcoins.each do |dishcoin|
				next if !dishcoin.rating
				if dishcoin.rating.restaurant == prize.restaurant
					skip_these_users << dishcoin.user.id.to_s
				end
			end
			prize.individual_prizes.remaining.each do |ind_pri|
				dcs = dishcoins.not_in(user_id:skip_these_users).ne(user_id:nil)
				if dcs.length > 0
					dc = dcs[SecureRandom.random_number(dcs.length)-1]
					ind_pri.user = dc.user
					users << dc.user
					ind_pri.save
					skip_these_users << dc.user.id.to_s
				end
			end
		end
		save
	end

	def only_best_rating
		user_hash = {}
		dishcoins.ne(rating_id:nil).each do |d|
			user_hash[d.user_id] ||= []
			next unless d.rating
			user_hash[d.user_id] << d.rating
		end
		user_hash.each do |k,v|
			puts "[#{k.to_s}]"
			v.sort_by{|r| -r.rating }.each do |r|
				puts "\t#{r.rating}"
				if r.rating <= 3
					r.invalid_rating = true
					r.save
				end	
			end
		end
		dish.each do |d|
			d.recalculate_rating
		end
		dish.each do |d|
			puts "#{d.name} => #{d.contest_rating} / #{d.rating} / total rating: #{d.ratings.count}"
		end		
		nil
	end

	def serializable_hash options = {}
		hash = super()
		hash[:id] = self.id
		hash[:finished] = self.end_date < DateTime.now if self.end_date
		if options[:export_localized]
			hash[:name] = self.name_translations
			hash[:description] = self.description_translations
			hash[:dishes] = self.ordered_dishes.collect{|e| e.serializable_hash({export_localized:true, include_reviews:options[:include_reviews], include_quality_reviews: hash[:finished]})}
			hash[:prizes] = self.prizes.top_five.collect{|e| e.serializable_hash({export_localized:true})}
			# # If there are no prizes, then this isnt a contest, so it never has to be "finished"
			# if hash[:prizes].empty?
			# 	hash[:finished] = false
			# end
			if hash[:finished]
				hash[:winners] = self.users.collect{|e| e.nickname}
			end
		end    
		return hash
	end

	def best_pic
		pic = self.dish.top_five.find_all{|e| !e.img_src_orig.blank?}.first.img_src_orig
		if pic
			return pic
		else
			return "https://d5ca3b0520fac45026ad-6caa6fe89e7dac3eaf12230f0985b957.ssl.cf5.rackcdn.com/facebook_share.png"
		end
	end

	def beautify_url
		return if self.beautiful_url.to_s.length > 0
		string = []
	    begin
	    	beauty = self.name.split(" ").join("_").downcase + string.join("")
	      	string << (65 + rand(26)).chr
	    end while TopFive.where(beautiful_url:beauty).count > 0
	    self.beautiful_url = beauty
	end
end

