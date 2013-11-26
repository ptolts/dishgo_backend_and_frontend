#encoding: UTF-8

class Icon
  include Mongoid::Document
  store_in collection: "Icon", database: "osm"
  field :url, type: String
  belongs_to :individual_option, index: true
end

