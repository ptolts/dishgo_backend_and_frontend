#encoding: UTF-8

class IndividualOption
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "IndividualOption", database: "dishgo"
	field :name, type: String
	field :price, type: Float
	field :published, type: Boolean	

	field :size_prices, type: Array
	field :draft_size_prices, type: Array

	field :size_ind_opt_id, type: String
	field :position, type: Integer
	field :price_according_to_size, type: Boolean

	field :draft, type: Hash

	belongs_to :options, index: true, :class_name => 'Option', index: true, inverse_of: :individual_option
	belongs_to :draft_options, index: true, :class_name => 'Option', index: true, inverse_of: :draft_individual_option

	has_one :icon
	has_one :draft_icon, class_name: "Icon"

	belongs_to :restaurant, index: true
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
			self.draft_icon = img
		end

		draft[:name] = individual_option["name"]
		draft[:price] = individual_option["price"].to_f
		draft[:price_according_to_size] = individual_option["price_according_to_size"].to_bool
		self.draft = draft
		self.save
	end 

	def publish_menu
		self.name = self.draft["name"]
		self.price = self.draft["price"]
		self.size_prices = self.draft_size_prices
		self.price_according_to_size = self.draft["price_according_to_size"]
		self.icon = self.draft_icon
		self.save
	end	

end