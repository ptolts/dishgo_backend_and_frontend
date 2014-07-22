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
	field :default_menu, type: Boolean, default: false

	belongs_to :restaurant, class_name: "Restaurant", inverse_of: :menus, index: true
	belongs_to :odesk, class_name: "Odesk", inverse_of: :menus, index: true

	has_many :draft_menu, :class_name => "Section", inverse_of: :menu_draft
	has_many :published_menu, :class_name => "Section", inverse_of: :published_menu

  	scope :draft, -> {asc(:draft_position)} 	
	scope :pub, -> {asc(:position)}
	scope :def, -> { where( default_menu:true ).asc(:position) }

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

	def reset_draft_menu
		draft = {}
		draft[:name] = self.name_translations
		draft[:description] = self.description_translations
		draft[:position] = self.position
		self.draft_position = self.position
		self.draft = draft
		self.draft_menu = self.published_menu
		self.draft_menu.each do |section|
			section.reset_draft_menu
		end
		self.save
	end		

	def menu_to_json
		# icon_list = self.restaurant.icons.collect{|e| e.individual_option_id}   
		icon_list = []  
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
		Restaurant.includes(:draft_menu,:published_menu).has_menu.each do |restaurant|
			# next if restaurant.menus.count > 0
			# next if restaurant.published_menu.empty?
			# puts restaurant.name
			restaurant.menus.destroy_all
			menu_list = []
			restaurant.draft_menu.each do |section|
				if section.menu_link
					menu = Menu.create
					menu.name_translations = section.name_translations
					menu.restaurant = restaurant
					menu.published_menu << section
					menu.draft_menu << section
					menu_list << menu
				end
			end
			published_menu = restaurant.published_menu.to_a.delete_if{|e| e.menu_link}
			draft_menu = restaurant.draft_menu.to_a.delete_if{|e| e.menu_link}
			menu = Menu.create
			menu.default_menu = true
			menu.position = 0
			menu.name_translations = {'en'=>'Menu','fr'=>'La Carte'}
			menu.restaurant = restaurant
			menu.published_menu = published_menu
			menu.draft_menu = draft_menu
			menu.save
			menu_list.each_with_index do |q,index|
				q.position = index + 1
				q.save
			end
		end
		Cache.destroy_all
	end
end

