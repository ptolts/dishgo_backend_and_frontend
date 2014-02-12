#encoding: UTF-8

class Option
  include Mongoid::Document
  store_in collection: "Options", database: "osm"
  field :name, type: String
  field :type, type: String
  field :max_selections, type: Integer
  field :min_selections, type: Integer
  field :position, type: Integer
  belongs_to :dish_size, class_name: "Dish", inverse_of: :sizes
  belongs_to :dish, inverse_of: :options
  belongs_to :restaurant
  has_many :individual_options, class_name: "IndividualOption"

	def load_data_from_json option, request_restaurant

		self.name = option["name"]
		self.type = option["type"]
		self.max_selections = option["max_selections"]
		self.min_selections = option["min_selections"]

		#Load or Create the individual options for this option.
		individual_options = option["individual_options"].collect do |individual_option|
			if IndividualOption.where(:_id => individual_option["id"]).exists?
			  individual_option_object = IndividualOption.find(individual_option["id"])
			  # If someone has tried to load options from another restaurant, something fishy is going on.
			  if individual_option_object.restaurant != request_restaurant
			  	return false
			  end
			else
			  individual_option_object = IndividualOption.create
			  individual_option_object.restaurant = request_restaurant
			end

			if !individual_option_object.load_data_from_json(individual_option,request_restaurant)
				return false
			end

			next individual_option_object
		end

		self.individual_options = individual_options
		self.save
	end  
end

