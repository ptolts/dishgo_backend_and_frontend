#encoding: UTF-8

class IndividualOption
	include Mongoid::Document
	store_in collection: "IndividualOption", database: "osm"
	field :name, type: String
	field :price, type: Float
	field :position, type: Integer
	belongs_to :options, index: true, :class_name => 'Option'
	has_one :icon
	belongs_to :restaurant

	def load_data_from_json individual_option, request_restaurant
		self.name = individual_option["name"]
		self.price = individual_option["price"].to_f
		self.restaurant = request_restaurant
		self.save
	end  
end