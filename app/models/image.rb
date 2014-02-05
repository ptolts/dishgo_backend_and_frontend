#encoding: UTF-8

class Image
  include Mongoid::Document
  store_in collection: "image", database: "osm"
  field :local_file, type: String
  field :original_url, type: String
  field :tags, type: Array
  field :original_json, type: String
  field :description, type: String
  field :likes, type: Integer
  field :source, type: String
  field :position, type: Integer
  field :rejected, type: Boolean

  field :text_found, type: String
  field :local_file_face, type: String

  belongs_to :restaurant, index: true
  # belongs_to :dish, index: true
end
