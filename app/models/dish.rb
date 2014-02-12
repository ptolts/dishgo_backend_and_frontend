#encoding: UTF-8

class Dish
  include Mongoid::Document
  store_in collection: "Dish", database: "osm"
  field :name, type: String
  field :description, type: String
  field :price, type: Float
  field :position, type: Integer
  # belongs_to :subsection, index: true
  belongs_to :section, index: true 
  belongs_to :restaurant 
  has_and_belongs_to_many :image, inverse_of: nil
  has_many :options, :class_name => 'Option'
  has_one :sizes, :class_name => 'Option', inverse_of: :dish_size
  default_scope where(:name.nin => ["", nil])

  def load_data_from_json dish, request_restaurant

    self.name = dish["name"]
    self.description = dish["description"]
    self.price = dish["price"].to_f

    options = dish["options"].collect do |option|
      # Load Option Object, or create a new one.
      if Option.where(:_id => option["id"]).exists?
        option_object = Option.find(option["id"])
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

    if dish["sizes"]
      sizes_object = dish["sizes_object"]
      if Option.where(:_id => sizes_object["id"]).exists?
        option_object = Option.find(sizes_object["id"])
        if option_object.restaurant != request_restaurant
          Rails.logger.warn "Sizes Option Permission Error: #{option_object.restaurant.to_json} != #{request_restaurant.to_json}"
          return false
        end        
      else
        option_object = Option.create
        option_object.restaurant = request_restaurant
        option_object.save
      end
      if !option_object.load_data_from_json(sizes_object,request_restaurant)
        return false
      end  

      option_object.save
      self.sizes = option_object                  
    else
      self.sizes = nil
    end

    self.options = options
    self.save
  end  
end