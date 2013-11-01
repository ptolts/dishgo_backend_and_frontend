class Sources
  include Mongoid::Document
  store_in collection: "sources", database: "osm"
  belongs_to :restaurant
  field :images, type: Array
  # default_scope where(source: "Foursquare")
end
