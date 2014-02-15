#encoding: UTF-8

class Dish
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "Dish", database: "osm"
  field :name, type: String
  field :description, type: String
  field :price, type: Float
  field :position, type: Integer
  # belongs_to :subsection, index: true
  belongs_to :section, index: true 
  belongs_to :restaurant, index: true
  has_and_belongs_to_many :image, inverse_of: nil, index: true
  has_many :options, :class_name => 'Option', inverse_of: :dish, index: true
  has_one :sizes, :class_name => 'Option', inverse_of: :dish_which_uses_this_as_size_options, index: true
  default_scope ->{ where(:name.nin => ["", nil]) }

  def load_data_from_json dish, request_restaurant

    Rails.logger.warn "---\n---\nWorking on Dish[#{dish['id']}]\n---\n#{dish.to_s}\n---\n"

    self.name = dish["name"]
    self.description = dish["description"]
    self.price = dish["price"].to_f

    if dish["sizes"]
      sizes_object = dish["sizes_object"]
      if Option.where(:_id => sizes_object["id"]).exists?
        Rails.logger.warn "---\nFound Sizes Object [#{sizes_object["id"]}]\n---\n"
        option_object = Option.find(sizes_object["id"])

        # If it was null, theres probably been a mistake.
        if option_object.restaurant.nil?
          option_object.restaurant = request_restaurant
        end

        if option_object.restaurant != request_restaurant
          Rails.logger.warn "Sizes Option Permission Error: #{option_object.restaurant.to_json} != #{request_restaurant.to_json}"
          return false
        end        
      else
        Rails.logger.warn "---\nCouldnt find Sizes_Object, creating new one.\n---\n"
        option_object = Option.create
        option_object.dish_which_uses_this_as_size_options = self
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
      Rails.logger.warn "---\nKilling Dish Sizes_Object\n---\n"
      self.sizes = nil
    end    

    options = dish["options"].collect do |option|
      # Load Option Object, or create a new one.
      if Option.where(:_id => option["id"]).exists?
        option_object = Option.find(option["id"])


        # If it was null, theres probably been a mistake.
        if option_object.restaurant.nil?
          option_object.restaurant = request_restaurant
        end

        if option_object.restaurant != request_restaurant
          Rails.logger.warn "Option Permission Error: #{option_object.restaurant.to_json} != #{request_restaurant.to_json}"
          return false
        end        
      else
        option_object = Option.create
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
      self.image << img
    end    


    self.options = options
    Rails.logger.info "--\nSaving Dish [#{self.name}]\n--"
    self.save
  end  
end
