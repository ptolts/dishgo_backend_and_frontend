#encoding: UTF-8

class Options
  include Mongoid::Document
  store_in collection: "Options", database: "osm"
  field :name, type: String
  field :type, type: String
  field :position, type: Integer
  belongs_to :dish_size, class_name: "Dish", inverse_of: :sizes
  belongs_to :dish, inverse_of: :options
  has_many :individual_option
end

