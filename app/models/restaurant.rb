#encoding: utf-8

class Restaurant
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "restaurants", database: "dishgo"
  field :lat, type: Float
  field :lon, type: Float
  field :subdomain, type: String
  field :host, type: String
  field :preview_token, type: String
  field :locs, type: Array
  field :menu, type: Hash
  # field :images, type: Array
  field :name, type: String
  field :multi_name, localize: true
  field :city, type: String
  field :email, type: String
  field :email_addresses, type: Array
  field :address_line_1, type: String
  field :address_line_2, type: String
  field :province, type: String
  field :postal_code, type: String
  field :phone, type: String
  field :website, type: String
  field :facebook, type: String
  field :facebook_page_id, type: String
  field :foursquare, type: String
  field :twitter, type: String
  field :urbanspoon, type: String
  field :instagram, type: String
  field :languages, type: Array, default: ['en','fr']
  field :default_language, type: String
  field :category, type: Array
  field :listed, type: Boolean, default: false
  field :show_hours, type: Boolean, default: true
  field :show_map, type: Boolean, default: true
  field :show_menu, type: Boolean, default: true
  field :show_gallery, type: Boolean, default: false
  field :show_app_install, type: Boolean, default: false

  field :does_delivery, type: Boolean, default: false

  field :rating, type: Float

  field :hours, type: Hash 

  belongs_to :font, class_name: "Font", index: true
  has_many :global_images, class_name: "GlobalImage", inverse_of: :restaurant
  has_one :logo, class_name: "GlobalImage", inverse_of: :restaurant_logo, validate: false
  has_many :menu_images, class_name: "GlobalImage", inverse_of: :restaurant_menu_images

  field :logo_settings, type: Hash 

  field :website_settings, type: Hash

  has_many :sources, :class_name => "Sources"
  has_many :image, :class_name => "Image", inverse_of: :restaurant, validate: false
  has_many :icons, :class_name => "Icon", inverse_of: :restaurant
  has_many :gallery_images, :class_name => "Image", inverse_of: :restaurant_gallery
  has_many :website_images, :class_name => "WysiwygImage", inverse_of: :restaurant


  has_many :pages, :class_name => "Page", inverse_of: :restaurant

  has_many :prizes, :class_name => "Prize", inverse_of: :restaurant

  has_many :section, :class_name => "Section", inverse_of: :restaurant
  has_many :dishes, :class_name => "Dish", inverse_of: :restaurant
  has_many :options, :class_name => "DishOption", inverse_of: :restaurant
  has_many :individual_options, :class_name => "IndividualOption", inverse_of: :restaurant

  # has_many :draft_menu, :class_name => "Section", inverse_of: :draft_restaurant
  # has_many :published_menu, :class_name => "Section", inverse_of: :published_restaurant

  has_many :menus, :class_name => "Menu", inverse_of: :restaurant

  has_many :menu_files, :class_name => "MenuFiles", inverse_of: :restaurant

  has_many :orders, :class_name => "Order"
  belongs_to :user, :class_name => "User", index: true, inverse_of: :owns_restaurants

  has_one :odesk, :class_name => "Odesk", inverse_of: :restaurant, validate: false
  has_one :cache, :class_name => "Cache", inverse_of: :restaurant, validate: false

  has_many :ratings, :class_name => "Rating", inverse_of: :restaurant

  has_many :page_views, :class_name => "PageView", inverse_of: :restaurant
  has_many :page_views_hourly, :class_name => "PageViewHour", inverse_of: :restaurant
  has_many :page_views_daily, :class_name => "PageViewDay", inverse_of: :restaurant

  belongs_to :design, index: true

  accepts_nested_attributes_for :image, :allow_destroy => false

  index({ name: 1 }, { name: "name_index" })
  index({ _id:1 }, { unique: true, name:"id_index" })
  index({ locs: "2dsphere" }, { name:"location_index"})
  index({ subdomain: 1}, {name: "subdomain_index"})
  index({ host: 1}, {name: "host_index"})
  index({ facebook_page_id: 1}, {name: "facebook_page_id_index"})
  index({ preview_token: 1}, {name: "preview_token_index"})

  scope :has_menu, -> { any_in(:_id => includes(:section).select{ |w| w.section.size > 0 }.map{ |r| r.id }) }

  def by_loc loc=nil
    if loc
      cords = [loc[1],loc[0]]
    else
      cords = [-74.155815,45.458972]
    end
    return Restaurant.where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => cords }, "$maxDistance" => 50000}}, listed: true)
  end

  def dish_images
    resto = Restaurant.where(:name=>/cun/i).first
    images = resto.image.reject{|e| e.rejected}
    sections = resto.section
    sub = sections.collect{|r| r.subsection}.flatten
    dishes = sub.collect{|r| r.dish}.flatten
    dishes.each_with_index do |x,i|
      x.image = []
      if Random.rand(2) == 1
        num = Random.rand(images.size)
        # puts "making image [#{num}] -> #{images[num].local_file}"
        x.image << images[num]
      else
        # puts "no image"
      end
      x.save(:validate=>false)      
    end
    nil    
  end

  def copy_menu_from_restaurant restaurant
    self.languages = restaurant.languages
    self.does_delivery = restaurant.does_delivery
    self.category = restaurant.category
    self.hours = restaurant.hours
    restaurant.menus.each do |menu|
      menu_dup = menu.dup
      menu_dup.restaurant_id = self.id
      menu_dup.save      
      menu.published_menu.pub.each do |section|
        section_dup = section.dup
        section_dup.restaurant_id = self.id
        section_dup.published_menu_id = menu_dup.id        
        section_dup.save
        section.dishes.each do |dish|
          dish_dup = dish.dup
          dish_dup.restaurant_id = self.id
          dish_dup.section_id = section_dup.id
          dish_dup.save
          dish.image.each do |image|
            image_dup = image.dup
            image_dup.restaurant_id = self.id
            image_dup.dish_id = dish_dup.id
            image_dup.save
          end
          id_match = {}
          if dish.sizes
            sizes_dup = dish.sizes.dup
            sizes_dup.restaurant_id = self.id
            sizes_dup.dish_which_uses_this_as_size_options_id = dish_dup.id
            sizes_dup.save            
            dish.sizes.individual_options.each do |ind_opt|
              ind_opt_dup = ind_opt.dup
              ind_opt_dup.restaurant_id = self.id
              ind_opt_dup.options_id = sizes_dup.id
              ind_opt_dup.save
              id_match[ind_opt.id.to_s] = ind_opt_dup.id.to_s
            end
          end
          dish.options.each do |option|
            option_dup = option.dup
            option_dup.restaurant_id = self.id
            option_dup.dish_id = dish_dup.id
            option_dup.save            
            option.individual_options.each do |ind_opt|
              ind_opt_dup = ind_opt.dup
              ind_opt_dup.restaurant_id = self.id
              ind_opt_dup.options_id = option_dup.id
              # Set size_id to point to new size object ids.
              ind_opt_dup.size_prices.each do |size_price|
                size_price['size_id'] = id_match[size_price['size_id']]
              end
              ind_opt_dup.save
            end
          end  
        end
      end
      menu_dup.reload    
      menu_dup.reset_draft_menu
    end
    self.save
    self.reload
    self.publish_menu
  end

  # def copy_section_from_restaurant section

  #   section_dup = section.dup
  #   section_dup.restaurant = self
  #   section_dup.dishes = section.dishes.collect do |dish|
  #     dish_dup = dish.dup
  #     dish_dup.restaurant = self
  #     dish_dup.image = dish.image.collect do |image|
  #       image_dup = image.dup
  #       image_dup.restaurant = self
  #       image_dup.save
  #       next image_dup
  #     end
  #     id_match = {}
  #     if dish.sizes
  #       sizes_dup = dish.sizes.dup
  #       sizes_dup.restaurant = self
  #       sizes_dup.individual_options = dish.sizes.individual_options.collect do |ind_opt|
  #         ind_opt_dup = ind_opt.dup
  #         ind_opt_dup.restaurant = self
  #         ind_opt_dup.save
  #         id_match[ind_opt.id.to_s] = ind_opt_dup.id.to_s
  #         next ind_opt_dup
  #       end
  #       dish_dup.sizes = sizes_dup
  #     end       
  #     dish_dup.options = dish.options.collect do |option|
  #       option_dup = option.dup
  #       option_dup.restaurant = self
  #       option_dup.individual_options = option.individual_options.collect do |ind_opt|
  #         ind_opt_dup = ind_opt.dup
  #         ind_opt_dup.restaurant = self
  #         # Set size_id to point to new size object ids.
  #         ind_opt_dup.size_prices.each do |size_price|
  #           size_price['size_id'] = id_match[size_price['size_id']]
  #         end
  #         ind_opt_dup.save
  #         next ind_opt_dup
  #       end
  #       option_dup.save
  #       next option_dup
  #     end     
  #     dish_dup.save 
  #     next dish_dup
  #   end
  #   section_dup.save

  #   self.published_menu << section_dup

  #   self.draft_menu = self.published_menu
  #   self.draft_menu.each do |draft_section|
  #     draft_section.reset_draft_menu
  #   end    

  #   self.save
  # end

  def menu_to_json
    icon_list = self.icons.collect{|e| e.individual_option_id}   
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
    return Oj.dump(menu)
  end

  def draft_menu_to_json
      menu = self.draft_menu.unscoped.draft.collect do |section|
        hash = section.as_document
        hash[:id] = section.id
        hash.merge!(section.draft)
        hash["dishes"] = section.draft_dishes.unscoped.draft.collect do |dish|
          dish.custom_to_hash_draft 
        end
        next hash
      end
    return Oj.dump(menu)
  end  

  def enough_info?
    enough = true
    enough = false if self.address_line_1.blank?
    enough = false if self.phone.blank?
    enough = false if self.name.blank? or self.name == "New Restaurant"
    return enough
  end

  def calculate_rating
    rating_count = ratings.count
    return 0 if rating_count == 0
    rating_total = 0
    ratings.each do |rate|
      rating_total += rate.rating
    end
    rating = (rating_total.to_f / rating_count.to_f).round_half
  end

  def serializable_hash options = {}
    hash = super options
    if self.logo
      hash[:logo] = self.logo.as_document
    end
    hash["multi_name"] = self.multi_name_translations
    return hash
  end

  def as_document options = {}
    hash = super()
    if self.logo
      hash["logo"] = self.logo.as_json
    end
    if self.pages and !options[:pages]
      hash["pages"] = self.pages.as_json
    end
    if self.gallery_images and !options[:pages]
      hash["gallery_images"] = self.gallery_images.as_json
    end
    if self.image and options[:include_images]
      hash["image"] = self.image.profile_images.limit(options[:include_images]).as_json
    end  
    if options[:prizes]
      hash["prizes"] = self.prizes.count
    end         
    hash["multi_name"] = self.multi_name_translations
    return hash
  end

  #JSON GENERATORS
  def onlinesite_json
    return self.menus.pub.collect{|e| e.menu_json }.as_json.to_json
  end

  def api_menu_to_json
    default_menu = self.menus.def.first
    sections = []
    sections = default_menu.published_menu.pub if default_menu
    other_sections = self.menus.not_def.collect do |more_sections|
      next more_sections.published_menu.pub
    end
    section_ids = [sections, other_sections].flatten.compact.collect{|e| e.id}    
    menu_hash = self.languages.inject({}) do |res,lang|
      sections = Section.find(section_ids).sort_by{|m| section_ids.index(m.id) }
      menu = sections.collect do |section|
        hash = section.as_document
        hash[:id] = section.id
        hash["name"] = section.name_translations[lang]
        hash["dishes"] = section.dishes.pub.collect do |dish|
          dish.api_custom_to_hash(lang)
        end
        next hash
      end
      res[lang] = Oj.dump(menu)
      next res
    end
    return menu_hash
  end  

  #long running publish menu
  def publish_menu
    CacheJson.new.delay.publish_menu(self.id)
  end  

  def cache_job
    CacheJson.new.delay.rebuild_cache(self.id)
  end

end



