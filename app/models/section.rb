#encoding: UTF-8

class Section
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "Section", database: "osm"
	field :name, type: String
	field :position, type: Integer
	belongs_to :restaurant, index: true
	has_many :dishes, class_name: "Dish"
	default_scope -> {asc(:created_at)}
	index({ _id:1 }, { unique: true, name:"id_index" })

	def load_data_from_json section, request_restaurant

		self.name = section["name"]

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
	        end  

	        if !dish_object.load_data_from_json(dish,request_restaurant)
	        	return false
	        end

	        next dish_object
	    end

	    self.dishes = dishes
	    self.save
	end
end

