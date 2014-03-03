class Sources
  include Mongoid::Document
  store_in collection: "sources", database: "dishgo"
  belongs_to :restaurant, index: true
  field :images, type: Array
  field :source, type: String
  field :remote_id, type: String
  # default_scope where(source: "Foursquare")
end
