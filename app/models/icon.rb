#encoding: UTF-8

class Icon
  include Mongoid::Document
  include Mongoid::Paperclip
  store_in collection: "Icon", database: "osm"
  field :url, type: String
  belongs_to :individual_option, index: true
  belongs_to :restaurant

end

