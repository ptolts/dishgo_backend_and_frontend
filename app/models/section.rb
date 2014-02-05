#encoding: UTF-8

class Section
  include Mongoid::Document
  store_in collection: "Section", database: "osm"
  field :name, type: String
  field :position, type: Integer
  belongs_to :restaurant, index: true
  has_many :dish
end

