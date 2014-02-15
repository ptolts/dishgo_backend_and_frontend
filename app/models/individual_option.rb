#encoding: UTF-8

class IndividualOption
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "IndividualOption", database: "osm"
	field :name, type: String
	field :price, type: Float
	field :size_prices, type: Array
	field :size_ind_opt_id, type: String
	field :position, type: Integer
	belongs_to :options, index: true, :class_name => 'Option'
	has_one :icon
	belongs_to :restaurant
	default_scope -> {asc(:created_at)}
	def load_data_from_json individual_option, request_restaurant
		self.name = individual_option["name"]
		self.price = individual_option["price"].to_f
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

	def test_issue
		ind_opt = IndividualOption.create
		icon = Icon.create

		ind_opt.icon = icon
		ind_opt.save
		puts ind_opt.icon.to_json

		ind_opt.icon = icon
		ind_opt.save

		puts ind_opt.icon.to_json
	end
end