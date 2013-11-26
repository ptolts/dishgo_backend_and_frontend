#encoding: UTF-8

class IndividualOption
  include Mongoid::Document
  store_in collection: "IndividualOption", database: "osm"
  field :name, type: String
  field :price, type: Float
  field :position, type: Integer
  belongs_to :options, index: true, :class_name => 'Options'
  has_one :icon
end