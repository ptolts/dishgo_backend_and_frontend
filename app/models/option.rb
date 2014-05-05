#encoding: UTF-8

class Option
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "Options", database: "dishgo"
	field :name, localize: true
	field :type, type: String
	field :max_selections, type: Integer
	field :published, type: Boolean	
	field :min_selections, type: Integer
	field :advanced_options, type: Boolean
	field :position, type: Integer
	field :extra_cost, type: Boolean

	field :draft, type: Hash

	# belongs_to :dish_size, class_name: "Dish", inverse_of: :sizes
	belongs_to :dish, class_name: "Dish", inverse_of: :options, index: true
	belongs_to :draft_dish, class_name: "Dish", inverse_of: :draft_options, index: true

	belongs_to :dish_which_uses_this_as_size_options, class_name: "Dish", inverse_of: :sizes, index: true
	belongs_to :draft_dish_which_uses_this_as_size_options, class_name: "Dish", inverse_of: :draft_sizes, index: true

	belongs_to :restaurant, index: true

	has_many :individual_options, class_name: "IndividualOption", inverse_of: :options
	has_many :draft_individual_options, class_name: "IndividualOption", inverse_of: :draft_options

	index({ _id:1 }, { unique: true, name:"id_index" })


	def load_data_from_json option, request_restaurant

		draft = {}
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
				individual_option_object.published = false
				individual_option_object.restaurant = request_restaurant
			end

			if !individual_option_object.load_data_from_json(individual_option,request_restaurant)
				return false
			end

			next individual_option_object
		end

		draft[:name] = option["name"]
		draft[:type] = option["type"]
		draft[:advanced] = option["advanced"]
		draft[:max_selections] = option["max_selections"]
		draft[:min_selections] = option["min_selections"]
		draft[:extra_cost] = option["extra_cost"]

		self.draft = draft
		self.draft_individual_options = individual_options
		self.save
	end	

	def publish_menu
		self.name_translations = self.draft["name"]
		self.type = self.draft["type"]
		self.advanced = self.draft["advanced"]
		self.max_selections = self.draft["max_selections"]
		self.min_selections = self.draft["min_selections"]
		self.extra_cost = self.draft["extra_cost"]
		self.individual_options = self.draft_individual_options
		self.individual_options.each do |individual_option|
			individual_option.publish_menu
		end
		self.save
	end	

	def reset_draft_menu
		draft = {}
		draft[:name] = self.name_translations
		draft[:type] = self.type
		draft[:advanced] = self.advanced
		draft[:max_selections] = self.max_selections
		draft[:min_selections] = self.min_selections
		draft[:extra_cost] = self.extra_cost
		self.draft = draft
		self.draft_individual_options = self.individual_options
		self.draft_individual_options.each do |individual_option|
			individual_option.reset_draft_menu
		end
		self.save		
	end

	def custom_to_hash
		option_hash = self.as_document
		option_hash[:id] = self.id
		option_hash["individual_options"] = self.individual_options.collect do |ind_opt|
			ind_opt_hash = ind_opt.as_document
			ind_opt_hash[:id] = ind_opt.id
			ind_opt_hash["icon"] = ind_opt.icon.serializable_hash({}) if ind_opt.icon
			next ind_opt_hash
		end
		return option_hash
	end

	def custom_to_hash_draft
		option_hash = self.as_document
		option_hash[:id] = self.id
		option_hash.merge!(self.draft)
		option_hash["individual_options"] = self.draft_individual_options.collect do |ind_opt|
			ind_opt_hash = ind_opt.as_document
			ind_opt_hash[:id] = ind_opt.id
			ind_opt_hash.merge!(ind_opt.draft)
			ind_opt["size_prices"] = ind_opt.draft_size_prices
			ind_opt_hash["icon"] = ind_opt.draft_icon.serializable_hash({}) if ind_opt.icon
			next ind_opt_hash
		end
		return option_hash
	end	
end

