#encoding: UTF-8

class Subsection
  include Mongoid::Document
  store_in collection: "Subsection", database: "osm"
  field :name, type: String
  field :position, type: Integer
  belongs_to :section, index: true
  has_many :dish
end

