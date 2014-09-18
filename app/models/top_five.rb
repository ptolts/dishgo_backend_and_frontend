#encoding: UTF-8

class TopFive
	include Mongoid::Document
	include Mongoid::Timestamps

	store_in collection: "top_five", database: "dishgo"

	field :name, localize: true
	field :description, localize: true
	field :beautiful_url, type: String

	has_and_belongs_to_many :dish, class_name: "Dish", inverse_of: nil
	has_many :dishcoins, class_name: "Dishcoin", inverse_of: :top_five
	has_many :prizes, class_name: "Prize", inverse_of: :top_five
	has_many :individual_prizes, class_name: "IndividualPrize", inverse_of: :top_five
	belongs_to :user

	before_save :beautify_url

	def number_of_dishes
		return 4
	end

	def serializable_hash options = {}
		hash = super()
		hash[:id] = self.id
		if options[:export_localized]
			hash[:name] = self.name_translations
			hash[:description] = self.description_translations
			Rails.logger.warn "LOADING DISH ---------"
			hash[:dishes] = self.dish.top_five.collect{|e| e.serializable_hash({export_localized:true, include_reviews:options[:include_reviews]})}
			hash[:prizes] = self.prizes.collect{|e| e.serializable_hash({export_localized:true})}
		end    
		return hash
	end

	def best_pic
		pic = self.dish.top_five.sort{|e| e.rating}.first.img_src_orig
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

