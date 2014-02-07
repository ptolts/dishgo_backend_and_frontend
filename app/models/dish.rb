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
  has_and_belongs_to_many :image, inverse_of: nil
  has_many :options, :class_name => 'Options'
  has_one :sizes, :class_name => 'Options', inverse_of: :dish_size
  default_scope where(:name.nin => ["", nil])
end