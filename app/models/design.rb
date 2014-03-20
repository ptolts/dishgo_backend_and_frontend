class Design
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "design", database: "dishgo"

  field :css, type: String
  field :menu_css, type: String
  field :name, type: String
  field :images, type: Hash
  field :carousel, type: Boolean

  has_many :restaurant
  has_many :global_images, class_name: "GlobalImage"
  index({ _id:1 }, { unique: true, name:"id_index" })
end
