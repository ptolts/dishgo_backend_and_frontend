#encoding: UTF-8

class Dish
  include Mongoid::Document
  store_in collection: "Dish", database: "osm"
  field :name, type: String
  field :description, type: String
  field :price, type: Float
  field :position, type: Integer
  belongs_to :subsection, index: true
  has_many :image
  has_many :options, :class_name => 'Options'
end