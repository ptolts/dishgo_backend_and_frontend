#encoding: UTF-8

class Dish
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "Dish", database: "dishgo"
  field :name, type: String
  field :description, type: String
  field :price, type: Float
  field :position, type: Integer
  field :published, type: Boolean
  # belongs_to :subsection, index: true
  belongs_to :restaurant, index: true

  has_and_belongs_to_many :image, inverse_of: nil, index: true
  has_and_belongs_to_many :draft_image, class_name: "Images", inverse_of: nil, index: true

  belongs_to :section, class_name: "Section", index: true, inverse_of: :draft_dishes
  belongs_to :draft_section, class_name: "Section", index: true, inverse_of: :draft_dishes

  has_many :options, :class_name => 'Option', inverse_of: :dish
  has_many :draft_options, :class_name => 'Option', inverse_of: :draft_dish

  has_one :sizes, :class_name => 'Option', inverse_of: :dish_which_uses_this_as_size_options
  has_one :draft_sizes, :class_name => 'Option', inverse_of: :draft_dish_which_uses_this_as_size_options

  default_scope ->{ where(:name.nin => ["", nil]) }

  index({ _id:1 }, { unique: true, name:"id_index" })

#   def load_data_from_json dish, request_restaurant

#     Rails.logger.warn "---\n---\nWorking on Dish[#{dish['id']}]\n---\n#{dish.to_s}\n---\n"

#     self.name = dish["name"]
#     self.description = dish["description"]
#     self.price = dish["price"].to_f

#     if dish["sizes"]
#       sizes_object = dish["sizes_object"]
#       if option_object = Option.where(:_id => sizes_object["id"]).first and option_object
#         Rails.logger.warn "---\nFound Sizes Object [#{sizes_object["id"]}]\n---\n"

#         # If it was null, theres probably been a mistake.
#         if option_object.restaurant.nil?
#           option_object.restaurant = request_restaurant
#         end

#         if option_object.restaurant != request_restaurant
#           Rails.logger.warn "Sizes Option Permission Error: #{option_object.restaurant.to_json} != #{request_restaurant.to_json}"
#           return false
#         end        
#       else
#         Rails.logger.warn "---\nCouldnt find Sizes_Object, creating new one.\n---\n"
#         option_object = Option.create
#         option_object.published = false
#         option_object.dish_which_uses_this_as_size_options = self
#         option_object.restaurant = request_restaurant
#         option_object.save
#       end

#       if !option_object.load_data_from_json(sizes_object,request_restaurant)
#         return false
#       end  

#       option_object.save
#       # Rails.logger.warn "--\nFUCK\n--\n#{option_object.to_json}\n--\n#{self.sizes.to_json}\n---\n---\n#{Option.new.to_json}\n---\n#{self.class}\n---"
#       # self.sizes = option_object                  
#     else
#       Rails.logger.warn "---\nKilling Dish Sizes_Object\n---\n"
#       self.sizes = nil
#     end    

#     options = dish["options"].collect do |option|
#       # Load Option Object, or create a new one.
#       if option_object = Option.where(:_id => option["id"]).first and option_object

#         # If it was null, theres probably been a mistake.
#         if option_object.restaurant.nil?
#           option_object.restaurant = request_restaurant
#         end

#         if option_object.restaurant != request_restaurant
#           Rails.logger.warn "Option Permission Error: #{option_object.restaurant.to_json} != #{request_restaurant.to_json}"
#           return false
#         end        
#       else
#         option_object = Option.create
#         option_object.published = false
#         option_object.restaurant = request_restaurant
#         option_object.save
#       end  

#       if !option_object.load_data_from_json(option,request_restaurant)
#         return false
#       end      
#       next option_object
#     end

#     images = dish["images"].collect do |image|
#       next if image["id"].blank?
#       img = Image.find(image["id"])
#       self.image << img
#     end    


#     self.options = options
#     Rails.logger.info "--\nSaving Dish [#{self.name}]\n--"
#     self.save
#   end  
  def load_data_from_json dish, request_restaurant

    draft = {}

    if dish["sizes"]
      sizes_object = dish["sizes_object"]
      if option_object = Option.where(:_id => sizes_object["id"]).first and option_object
        # If it was null, theres probably been a mistake.
        if option_object.restaurant.nil?
          option_object.restaurant = request_restaurant
        end

        if option_object.restaurant != request_restaurant
          return false
        end        
      else
        option_object = Option.create
        option_object.published = false
        option_object.draft_dish_which_uses_this_as_size_options = self
        option_object.restaurant = request_restaurant
        option_object.save
      end

      if !option_object.load_data_from_json(sizes_object,request_restaurant)
        return false
      end  

      option_object.save
      # Rails.logger.warn "--\nFUCK\n--\n#{option_object.to_json}\n--\n#{self.sizes.to_json}\n---\n---\n#{Option.new.to_json}\n---\n#{self.class}\n---"
      # self.sizes = option_object                  
    else
      self.draft_sizes = nil
    end    

    options = dish["options"].collect do |option|
      # Load Option Object, or create a new one.
      if option_object = Option.where(:_id => option["id"]).first and option_object

        # If it was null, theres probably been a mistake.
        if option_object.restaurant.nil?
          option_object.restaurant = request_restaurant
        end

        if option_object.restaurant != request_restaurant
          return false
        end        
      else
        option_object = Option.create
        option_object.published = false
        option_object.restaurant = request_restaurant
        option_object.save
      end  

      if !option_object.load_data_from_json(option,request_restaurant)
        return false
      end      
      next option_object
    end

    images = dish["images"].collect do |image|
      next if image["id"].blank?
      img = Image.find(image["id"])
      self.draft_image << img
    end    

    draft[:name] = dish["name"]
    draft[:description] = dish["description"]
    draft[:price] = dish["price"].to_f

    self.draft = draft
    self.draft_options = options
    self.save
  end  

  def custom_to_hash_draft
    dish_hash = self.as_document
    dish_hash["sizes"] = self.draft_sizes.custom_to_hash if self.draft_sizes
    dish_hash["options"] = self.draft_options.collect do |option|
      next option.custom_to_hash_draft
    end
    dish_hash["image"] = self.draft_image.collect do |image|
      img_hash = image.custom_to_hash
      next img_hash
    end
    return dish_hash
  end  

end
