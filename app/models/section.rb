#encoding: UTF-8

class Section
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "Section", database: "dishgo"
	field :name, type: String
	field :position, type: Integer
	field :draft, type: Hash
	field :published, type: Boolean

	belongs_to :restaurant, class_name: "Restaurant", inverse_of: :section, index: true

	belongs_to :draft_restaurant, class_name: "Restaurant", inverse_of: :draft_menu, index: true
	belongs_to :published_restaurant, class_name: "Restaurant", inverse_of: :published_menu, index: true

	has_many :dishes, class_name: "Dish", inverse_of: :section
	has_many :draft_dishes, class_name: "Dish", inverse_of: :draft_section

	default_scope -> {asc(:created_at)}
	index({ _id:1 }, { unique: true, name:"id_index" })

	def publish_menu
		self.name = self.draft["name"]
		self.dishes = self.draft_dishes
		self.dishes.each do |dish|
			dish.publish_menu
		end
		self.save
	end

	def reset_draft_menu
		draft = {}
		draft[:name] = self.name
		self.draft = draft
		self.draft_dishes = self.dishes
		self.dishes.each do |dish|
			dish.reset_draft_menu
		end
		self.save
	end	

	def load_data_from_json section, request_restaurant

		draft = {}
		draft[:name] = section["name"]

		dishes = section["dishes"].collect do |dish|
	        # Load Dish Object, or create a new one.
	        if dish_object = Dish.where(:_id => dish["id"]).first and dish_object
				if dish_object.restaurant != request_restaurant
          			Rails.logger.warn "Dish Permission Error: #{dish_object.restaurant.to_json} != #{request_restaurant.to_json}"
					return false
				end	        	
	        else
	        	dish_object = Dish.create
	        	dish_object.restaurant = request_restaurant
	        	dish_object.published = false
	        end  

	        if !dish_object.load_data_from_json(dish,request_restaurant)
	        	return false
	        end

	        next dish_object
	    end

	    self.draft = draft
	    self.draft_dishes = dishes
	    self.save
	end	
end

