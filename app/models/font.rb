class Font
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "font", database: "dishgo"

  field :name, type: String
  field :css, type: String
  field :link, type: String

  has_many :restaurant

  index({ _id:1 }, { unique: true, name:"id_index" })
end
