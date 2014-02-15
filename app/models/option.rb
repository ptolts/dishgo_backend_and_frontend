#encoding: UTF-8

class Option
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "Options", database: "osm"
	field :name, type: String
	field :type, type: String
	field :max_selections, type: Integer
	field :min_selections, type: Integer
	field :position, type: Integer
  # belongs_to :dish_size, class_name: "Dish", inverse_of: :sizes
  belongs_to :dish, class_name: "Dish", inverse_of: :options, index: true
  belongs_to :dish_which_uses_this_as_size_options, class_name: "Dish", inverse_of: :sizes, index: true
  belongs_to :restaurant, index: true
  has_many :individual_options, class_name: "IndividualOption"
  index({ _id:1 }, { unique: true, name:"id_index" })

  def load_data_from_json option, request_restaurant
  	Rails.logger.warn "---\n---\nWorking on Option[#{option['id']}]\n---\n#{option.to_s}\n---\n"
  	self.name = option["name"]
  	self.type = option["type"]
  	self.max_selections = option["max_selections"]
  	self.min_selections = option["min_selections"]

		#Load or Create the individual options for this option.
		individual_options = option["individual_options"].collect.with_index do |individual_option,index|
			if individual_option_object = IndividualOption.where(:_id => individual_option["id"]).first and individual_option_object
				Rails.logger.warn "---\nLoading IndividualOption[#{individual_option["name"]}]\n---"
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

