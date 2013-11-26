#encoding: UTF-8

class Options
  include Mongoid::Document
  store_in collection: "Options", database: "osm"
  field :name, type: String
  field :type, type: String
  field :position, type: Integer
  belongs_to :dish
  has_many :individual_option
end

