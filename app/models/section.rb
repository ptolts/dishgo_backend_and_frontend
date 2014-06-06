#encoding: UTF-8

class Section
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "Section", database: "dishgo"
	field :name, localize: true
	field :position, type: Integer
	field :draft_position, type: Integer
	field :draft, type: Hash, default: {}
	field :published, type: Boolean

	belongs_to :restaurant, class_name: "Restaurant", inverse_of: :section, index: true
	belongs_to :odesk, index: true

	belongs_to :draft_restaurant, class_name: "Restaurant", inverse_of: :draft_menu, index: true
	belongs_to :published_restaurant, class_name: "Restaurant", inverse_of: :published_menu, index: true

	belongs_to :odesk_menu, class_name: "Odesk", inverse_of: :sections, index: true

	has_many :dishes, class_name: "Dish", inverse_of: :section
	has_many :draft_dishes, class_name: "Dish", inverse_of: :draft_section

  	scope :draft, -> {asc(:draft_position)} 	
	scope :pub, -> {asc(:position)}

	index({ _id:1 }, { unique: true, name:"id_index" })

	# accepts_nested_attributes_for :draft_dishes, :dishes

	def publish_menu
		self.name_translations = self.draft["name"]
		self.position = self.draft_position
		self.dishes = self.draft_dishes
		self.dishes.each do |dish|
			dish.publish_menu
		end
		self.save
	end

	def reset_draft_menu
		draft = {}
		draft[:name] = self.name_translations
		draft[:position] = self.position
		self.draft_position = self.position
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
		draft[:position] = section["position"].to_i
		self.draft_position = section["position"].to_i

		# Rails.logger.warn "[#{self.name}] -> #{self.draft_position}"

		dishes = section["dishes"].collect do |dish|
	        # Load Dish Object, or create a new one.
	        if dish_object = Dish.where(:_id => dish["id"]).first and dish_object
				if dish_object.restaurant_id != request_restaurant.id
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

	def odesk_load_data_from_json section, odesk_request
		# Rails.logger.warn "Sections\n---------"
		draft = {}
		draft[:name] = section["name"]
		draft[:position] = section["position"].to_i
		self.draft_position = section["position"].to_i
		# Rails.logger.warn "[#{self.name}] -> #{self.draft_position}"
		dishes = section["dishes"].collect do |dish|
	        # Load Dish Object, or create a new one.
	        if dish_object = Dish.where(:_id => dish["id"]).first and dish_object
				if dish_object.odesk_id != odesk_request.id
          			Rails.logger.warn "Dish Permission Error: #{dish_object.odesk.to_json} != #{odesk_request.to_json}"
					return false
				end	        	
	        else
	        	dish_object = Dish.create
	        	dish_object.odesk_menu = odesk_request
	        	dish_object.published = false
	        end  
	        if !dish_object.odesk_load_data_from_json(dish,odesk_request)
	        	return false
	        end
	        next dish_object
	    end
	    self.draft = draft
	    self.draft_dishes = dishes
		# Rails.logger.warn "End Sections\n---------"
	    self.save
	end		
end

