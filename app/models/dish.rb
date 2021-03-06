#encoding: UTF-8

class Dish
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "Dish", database: "dishgo"
  field :name, localize: true
  field :description, localize: true
  field :price, type: Float
  field :position, type: Integer
  field :draft_position, type: Integer
  field :published, type: Boolean
  field :has_multiple_sizes, type: Boolean
  field :draft, type: Hash

  field :vegetarian, type: Boolean
  field :spicey, type: Boolean
  field :nuts, type: Boolean


  # For dish search, lets totally denormalize stuff
  field :search_terms, type: String
  field :top_image, type: String
  field :restaurant_name, type: String

  field :rating, type: Integer, default: 0
  field :contest_rating, type: Float, default: 0.0
  # belongs_to :subsection, index: true
  belongs_to :restaurant, index: true
  belongs_to :odesk, index: true

  has_many :ratings, :class_name => 'Rating', inverse_of: :dish
  has_many :dish_views, :class_name => 'DishView', inverse_of: :dish

  has_and_belongs_to_many :image, inverse_of: nil, index: true
  has_and_belongs_to_many :draft_image, class_name: "Image", inverse_of: nil, index: true

  belongs_to :section, class_name: "Section", index: true, inverse_of: :draft_dishes
  belongs_to :draft_section, class_name: "Section", index: true, inverse_of: :draft_dishes

  has_many :options, :class_name => 'DishOption', inverse_of: :dish
  has_many :draft_options, :class_name => 'DishOption', inverse_of: :draft_dish

  has_one :sizes, :class_name => 'DishOption', inverse_of: :dish_which_uses_this_as_size_options, validate: false
  has_one :draft_sizes, :class_name => 'DishOption', inverse_of: :draft_dish_which_uses_this_as_size_options, validate: false

  # default_scope ->{ where(:name.nin => ["", nil]) }
  scope :draft, -> {asc(:draft_position)}   
  scope :pub, -> {asc(:position)}  
  scope :top_five, -> {desc(:contest_rating)}  
  scope :dish_is_active, -> { ne(search_terms:nil).desc(:rating) }  

  index({ _id:1 }, { unique: true, name:"id_index" })
  index({ search_terms:1 }, { name:"search_index" })

  # accepts_nested_attributes_for :options, :draft_options, :sizes, :draft_sizes
  def set_search_terms
    if relevent_dish
      self.search_terms = self.name_translations.collect do |key,value|
        next value
      end.join(" ")
      if self.restaurant
        self.restaurant_name = self.restaurant.name
      end
      if img = self.image.first
        self.top_image = img.img_url_medium
      end
    else
      self.search_terms = nil
    end
    save
  end

  def load_data_from_json dish, request_restaurant
    draft = {}
    sizes_object = dish["sizes_object"]
    if size_option_object = DishOption.where(:_id => sizes_object["id"]).first and size_option_object
      # If it was null, theres probably been a mistake.
      if size_option_object.restaurant_id.blank?
        size_option_object.restaurant = request_restaurant
      end

      if size_option_object.restaurant_id != request_restaurant.id
        Rails.logger.warn "Bailing out\n------------"
        return false
      end     
      # size_option_object.draft_dish_which_uses_this_as_size_options = self 
    else
      size_option_object = DishOption.create
      size_option_object.published = false
      # size_option_object.draft_dish_which_uses_this_as_size_options = self
      size_option_object.restaurant = request_restaurant
      size_option_object.save
    end

    if !size_option_object.load_data_from_json(sizes_object,request_restaurant)
      Rails.logger.warn "Bailing out\n------------"
      return false
    end  

    size_option_object.save
    self.draft_sizes = size_option_object unless self.draft_sizes == size_option_object

    options = dish["options"].collect do |option|
      # Load Option Object, or create a new one.
      if option_object = DishOption.where(:_id => option["id"]).first and option_object

        # If it was null, theres probably been a mistake.
        if option_object.restaurant_id.blank?
          option_object.restaurant = request_restaurant
        end

        if option_object.restaurant_id != request_restaurant.id
          Rails.logger.warn "Bailing out\n------------"
          return false
        end        
      else
        option_object = DishOption.create
        option_object.published = false
        option_object.restaurant = request_restaurant
        option_object.save
      end  

      if !option_object.load_data_from_json(option,request_restaurant)
        Rails.logger.warn "Bailing out\n------------"        
        return false
      end      
      next option_object
    end

    self.draft_image = []

    images = dish["images"].collect do |image|
      next if image["id"].blank?
      img = Image.find(image["id"])
      self.draft_image << img
    end    

    draft[:name] = dish["name"]
    draft[:position] = dish["position"].to_i
    self.draft_position = dish["position"].to_i
    draft[:description] = dish["description"]
    draft[:price] = dish["price"].to_f

    if dish["sizes"]
      draft[:has_multiple_sizes] = true
    else
      draft[:has_multiple_sizes] = false
    end 

    self.draft = draft
    self.draft_options = options 
    self.save

  end  

  def recalculate_rating
    total = 0
    self.ratings.each do |rating|
      total += rating.rating.to_f
    end
    total = total / self.ratings.size
    self.contest_rating = total
    self.rating = total.round
    self.save
  end

  def odesk_load_data_from_json dish, odesk_request
    # Rails.logger.warn "Dishes\n---------"
    draft = {}
    sizes_object = dish["sizes_object"]
    if size_option_object = DishOption.where(:_id => sizes_object["id"]).first and size_option_object
      # If it was null, theres probably been a mistake.
      if size_option_object.odesk.nil?
        size_option_object.odesk = odesk_request
      end
      if size_option_object.odesk_id != odesk_request.id
        return false
      end     
      # size_option_object.draft_dish_which_uses_this_as_size_options = self
    else
      size_option_object = DishOption.create
      size_option_object.published = false
      # size_option_object.draft_dish_which_uses_this_as_size_options = self
      size_option_object.odesk = odesk_request
      size_option_object.save
    end
    if !size_option_object.odesk_load_data_from_json(sizes_object,odesk_request)
      return false
    end  
    
    size_option_object.save
    self.draft_sizes = size_option_object unless self.draft_sizes == size_option_object

    options = dish["options"].collect do |option|
      # Load Option Object, or create a new one.
      if option_object = DishOption.where(:_id => option["id"]).first and option_object
        # If it was null, theres probably been a mistake.
        if option_object.odesk.nil?
          option_object.odesk = odesk_request
        end
        if option_object.odesk_id != odesk_request.id
          return false
        end        
      else
        option_object = DishOption.create
        option_object.published = false
        option_object.odesk = odesk_request
        option_object.save
      end  
      if !option_object.odesk_load_data_from_json(option,odesk_request)
        return false
      end      
      next option_object
    end
    self.draft_image = []
    images = dish["images"].collect do |image|
      next if image["id"].blank?
      img = Image.find(image["id"])
      self.draft_image << img
    end    
    draft[:name] = dish["name"]
    draft[:position] = dish["position"].to_i
    self.draft_position = dish["position"].to_i
    draft[:description] = dish["description"]
    draft[:price] = dish["price"].to_f
    if dish["sizes"]
      draft[:has_multiple_sizes] = true
    else
      draft[:has_multiple_sizes] = false
    end 
    self.draft = draft
    self.draft_options = options
    # Rails.logger.warn "End Dish\n---------"
    self.save
  end

  def img_src
    img = self.image.first
    if img 
      return img.img_url_medium
    end
    return ""
  end

  def img_src_orig
    img = self.image.first
    if img 
      return img.img_url_original
    end
    return ""
  end  

  def publish_menu
    self.name_translations = self.draft["name"]
    self.description_translations = self.draft["description"]
    self.price = self.draft["price"]
    self.position = self.draft_position
    self.has_multiple_sizes = self.draft["has_multiple_sizes"]
    self.options = self.draft_options
    self.image = self.draft_image
    self.sizes = self.draft_sizes unless self.sizes == self.draft_sizes
    self.sizes.publish_menu if self.sizes
    self.options.each do |option|
      option.publish_menu
    end
    self.save
  end 

  def reset_draft_menu
    draft = {}
    draft["name"] = self.name_translations
    draft["position"] = self.position
    self.draft_position = self.position
    draft["description"] = self.description_translations
    draft["price"] = self.price
    draft["has_multiple_sizes"] = self.has_multiple_sizes
    self.draft = draft
    self.draft_options = self.options
    self.draft_image = self.image
    self.draft_sizes = self.sizes unless self.sizes == self.draft_sizes
    self.draft_sizes.reset_draft_menu if self.draft_sizes
    self.draft_options.each do |option|
      option.reset_draft_menu
    end
    self.save
  end     

  def custom_to_hash_draft 
    dish_hash = self.as_document
    dish_hash[:id] = self.id
    dish_hash.merge!(self.draft)
    dish_hash["position"] = self.draft_position
    dish_hash["sizes"] = self.draft_sizes.custom_to_hash_draft if self.draft_sizes
    dish_hash["options"] = self.draft_options.collect do |option|
      next option.custom_to_hash_draft 
    end
    dish_hash["image"] = self.draft_image.collect do |image|
      img_hash = image.serializable_hash({})
      next img_hash
    end
    return dish_hash
  end  

  def custom_to_hash icon_list = []
    dish_hash = self.as_document
    dish_hash[:id] = self.id
    dish_hash["sizes"] = (self.sizes.custom_to_hash icon_list) if self.sizes
    dish_hash["options"] = self.options.collect do |option|
      next option.custom_to_hash icon_list
    end
    dish_hash["image"] = self.image.collect do |image|
      img_hash = image.custom_to_hash
      next img_hash
    end
    return dish_hash
  end 

  def serializable_hash options = {}
    hash = super()
    if options[:export_localized]
      hash[:name] = self.name_translations
      hash[:description] = self.description_translations
    end
    if user = options[:include_reviews] 
      hash[:ratingObject] = Rating.where(dish_id:self.id,user_id:user.id).first
    end
    if options[:include_quality_reviews] 
      # Load up ratings to display. Make sure they arent blank.
      ratings_hash = Rating.where(dish_id: self.id,rating: 5).ne(review:"").limit(3)
      if ratings_hash.size < 3
        ratings_hash += Rating.where(dish_id: self.id,:rating.gte => 4).ne(review:"").not_in(id:ratings_hash.collect{|e| e.id}).limit(3-ratings_hash.length)
      end
      ratings_hash.each do |e| 
        next unless ["Type your review here!","","Tapez votre commentaire ici!"].include?(e.review.to_s.strip)
        e.review = "No comment."
      end
      hash[:ratingObjects] = ratings_hash
    end    
    return hash
  end  

  def api_custom_to_hash lang
    dish_hash = self.as_document
    dish_hash[:id] = self.id
    dish_hash["name"] = self.name_translations[lang]
    dish_hash["description"] = self.description_translations[lang]
    dish_hash["sizes"] = self.sizes.api_custom_to_hash(lang) if self.sizes
    dish_hash["options"] = self.options.collect do |option|
      next option.api_custom_to_hash(lang)
    end
    dish_hash["image"] = self.image.collect do |image|
      img_hash = image.custom_to_hash
      next img_hash
    end
    return dish_hash
  end        

  def self.missing_connection
    Dish.each do |e|
      e.image.each do |i|
        i.dish = e
        i.save
      end
      e.draft_image.each do |i|
        i.dish = e
        i.save
      end
    end
  end

  def relevent_dish
    if self.section_id
      if sec = self.section and sec.published_menu_id and pub_menu = sec.published_menu
        if pub_menu.restaurant_id == self.restaurant_id
          return true
        end
      end
    end
    return false  
  end
end
