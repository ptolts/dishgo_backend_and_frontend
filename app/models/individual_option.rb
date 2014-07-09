#encoding: UTF-8

class IndividualOption
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "IndividualOption", database: "dishgo"
	field :name, localize: true
	field :price, type: Float
	field :published, type: Boolean	

	field :size_prices, type: Array
	field :draft_size_prices, type: Array

	field :size_ind_opt_id, type: String
	field :position, type: Integer
	field :price_according_to_size, type: Boolean, default: false

	field :draft, type: Hash

	belongs_to :options, index: true, :class_name => 'DishOption', index: true, inverse_of: :individual_option
	belongs_to :draft_options, index: true, :class_name => 'DishOption', index: true, inverse_of: :draft_individual_option

	has_one :icon, class_name: "Icon", inverse_of: :individual_option, validate: false
	has_one :draft_icon, class_name: "Icon", inverse_of: :draft_individual_option, validate: false

	belongs_to :restaurant, index: true
	belongs_to :odesk, index: true

	default_scope -> {asc(:created_at)}
	index({ _id:1 }, { unique: true, name:"id_index" })


	def load_data_from_json individual_option, request_restaurant

		draft = {}

		if individual_option["size_prices"]
			self.draft_size_prices = individual_option["size_prices"]
		end

		icon = individual_option["icon"]

		if icon and !icon["id"].blank?
			img = Icon.find(icon["id"])
			self.draft_icon = img unless self.draft_icon == img
		end

		draft[:name] = individual_option["name"]
		draft[:price] = individual_option["price"].to_f
		draft[:price_according_to_size] = individual_option["price_according_to_size"].to_bool
		self.draft = draft
		self.save
	end 


	def odesk_load_data_from_json individual_option, odesk_request
		# Rails.logger.warn "Individual Options\n---------"
		draft = {}
		if individual_option["size_prices"]
			self.draft_size_prices = individual_option["size_prices"]
		end
		icon = individual_option["icon"]
		if icon and !icon["id"].blank?
			img = Icon.find(icon["id"])
			self.draft_icon = img unless self.draft_icon == img
		end
		draft[:name] = individual_option["name"]
		draft[:price] = individual_option["price"].to_f
		draft[:price_according_to_size] = individual_option["price_according_to_size"].to_bool
		self.draft = draft
		# Rails.logger.warn "End Ind_Opts\n---------"
		self.save
	end 	

	def publish_menu
		self.name_translations = self.draft["name"]
		self.price = self.draft["price"]
		self.size_prices = self.draft_size_prices
		self.price_according_to_size = self.draft["price_according_to_size"]
		self.icon = self.draft_icon
		self.save
	end	

	def reset_draft_menu
		draft = {}
		draft["name"] = self.name_translations
		draft["price"] = self.price
		draft["price_according_to_size"] = self.price_according_to_size
		self.draft = draft
		self.draft_size_prices = self.size_prices
		self.draft_icon = self.icon
		self.save
	end	

	def api_as_document
		Rails.logger.warn "ID:  #{self.id}"
		hash = self.as_document
		hash["size_prices"] = hash["size_prices"].collect do |s|
			s["id"] = self.id.to_s + s["size_id"].to_s
			next s
		end if self.price_according_to_size
		return hash
	end	

end