#encoding: UTF-8

class TopFive
	include Mongoid::Document
	include Mongoid::Timestamps

	store_in collection: "top_five", database: "dishgo"

	field :name, localize: true
	field :description, localize: true
	field :beautiful_url, type: String

	has_and_belongs_to_many :dish, class_name: "Dish", inverse_of: nil
	belongs_to :user

	def number_of_dishes
		return 4
	end

	def serializable_hash options = {}
		hash = super()
		hash[:id] = self.id
		if options[:export_localized]
			hash[:name] = self.name_translations
			hash[:description] = self.description_translations
			hash[:dishes] = self.dish.collect{|e| e.serializable_hash({export_localized:true, include_reviews:options[:include_reviews]})}
		end    
		return hash
	end
end

