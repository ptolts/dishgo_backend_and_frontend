#encoding: UTF-8

class IndividualOption
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "IndividualOption", database: "dishgo"
	field :name, type: String
	field :price, type: Float
	field :published, type: Boolean	
	field :size_prices, type: Array
	field :size_ind_opt_id, type: String
	field :position, type: Integer
	field :price_according_to_size, type: Boolean

	belongs_to :options, index: true, :class_name => 'Option', index: true, inverse_of: :individual_option
	belongs_to :draft_options, index: true, :class_name => 'Option', index: true, inverse_of: :draft_individual_option

	has_one :icon
	has_one :draft_icon, class_name: "Icon"

	belongs_to :restaurant, index: true
	default_scope -> {asc(:created_at)}
	index({ _id:1 }, { unique: true, name:"id_index" })


	# def load_data_from_json individual_option, request_restaurant

	# 	# Rails.logger.warn "--\n"
	# 	# Rails.logger.warn JSON.pretty_generate(individual_option)
	# 	# Rails.logger.warn "--\n"

	# 	self.name = individual_option["name"]
	# 	self.price = individual_option["price"].to_f
	# 	self.price_according_to_size = individual_option["price_according_to_size"].to_bool
	# 	self.restaurant = request_restaurant

	# 	if individual_option["size_prices"]
	# 		self.size_prices = individual_option["size_prices"]
	# 	end

	# 	images = individual_option["images"].collect do |image|
	# 		Rails.logger.warn "--\nLoading Image [#{image["id"]}]\n--"
	# 		next if image["id"].blank?
	# 		img = Icon.find(image["id"])
	# 		Rails.logger.warn "--\nSetting Image [#{img.to_json}]\n--"
	# 		next if self.icon == img
	# 		self.icon = img
	# 	end

	# 	self.save
	# end 

	def load_data_from_json individual_option, request_restaurant

		# Rails.logger.warn "--\n"
		# Rails.logger.warn JSON.pretty_generate(individual_option)
		# Rails.logger.warn "--\n"

		self.name = individual_option["name"]
		self.price = individual_option["price"].to_f
		self.price_according_to_size = individual_option["price_according_to_size"].to_bool
		self.restaurant = request_restaurant

		if individual_option["size_prices"]
			self.size_prices = individual_option["size_prices"]
		end

		images = individual_option["images"].collect do |image|
			Rails.logger.warn "--\nLoading Image [#{image["id"]}]\n--"
			next if image["id"].blank?
			img = Icon.find(image["id"])
			Rails.logger.warn "--\nSetting Image [#{img.to_json}]\n--"
			next if self.icon == img
			self.icon = img
		end

		self.save
	end 

end