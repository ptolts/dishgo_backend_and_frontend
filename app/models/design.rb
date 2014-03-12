class Design
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "design", database: "dishgo"

  field :css, type: String
  field :name, type: String

  has_many :restaurant, index: true
  index({ _id:1 }, { unique: true, name:"id_index" })
end
