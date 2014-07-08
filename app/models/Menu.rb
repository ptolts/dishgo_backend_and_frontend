#encoding: UTF-8

class Menu
	include Mongoid::Document
	include Mongoid::Timestamps
	store_in collection: "Menu", database: "dishgo"
	field :name, localize: true
	field :description, localize: true
	field :position, type: Integer
	field :menu_link, type: Boolean
	field :draft_position, type: Integer
	field :draft, type: Hash, default: {}
	field :published, type: Boolean

	belongs_to :restaurant, class_name: "Restaurant", inverse_of: :menus, index: true

	has_many :draft_menu, :class_name => "Section", inverse_of: :menu_draft
	has_many :published_menu, :class_name => "Section", inverse_of: :published_menu

  	scope :draft, -> {asc(:draft_position)} 	
	scope :pub, -> {asc(:position)}

	index({ _id:1 }, { unique: true, name:"id_index" })

	def edit_menu_json
		hash = self.as_document
		hash[:_id] = self.id
		hash[:id] = self.id
		hash.merge!(self.draft)
		hash[:menu] = draft_menu_to_json
		return hash
	end

	def menu_json
		hash = self.as_document
		hash[:_id] = self.id
		hash[:id] = self.id
		hash[:menu] = menu_to_json
		return hash
	end	

	def menu_to_json
		icon_list = self.restaurant.icons.collect{|e| e.individual_option_id}   
		menu_to_spit_out = self.published_menu.pub
		if menu_to_spit_out.empty?
			menu_to_spit_out = Restaurant.where(name:/tuckshop/i).first.published_menu.pub
		end
		menu = menu_to_spit_out.collect do |section|
			hash = section.as_document
			hash[:id] = section.id
			hash["dishes"] = section.dishes.pub.collect do |dish|
				dish.custom_to_hash icon_list
			end
			next hash
		end
		return menu
	end	

	def draft_menu_to_json
		menu = self.draft_menu.unscoped.draft.collect do |section|
			hash = section.as_document
			hash[:id] = section.id
			hash[:_id] = section.id
			hash.merge!(section.draft)
			hash["dishes"] = section.draft_dishes.unscoped.draft.collect do |dish|
				dish.custom_to_hash_draft 
			end
			next hash
		end
		return menu
	end 

	def migrate
		Restaurant.includes(:draft_menu).where(name:/piazza rom/i).each do |restaurant|
			# next if restaurant.menus.count > 0
			# next if restaurant.published_menu.empty?
			# puts restaurant.name
			restaurant.menus.destroy_all
			menu = Menu.create
			menu.name_translations = {'en'=>'Menu','fr'=>'La Carte'}
			menu.restaurant = restaurant
			menu.published_menu = restaurant.published_menu
			menu.draft_menu = restaurant.draft_menu
			menu.save
		end
	end
end

