class Design
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "design", database: "dishgo"

  field :css, type: String
  field :menu_css, type: String
  field :fonts, type: String
  field :name, type: String
  field :images, type: Hash
  field :carousel, type: Boolean
  field :template_location, type: String

  has_many :restaurant
  has_many :global_images, class_name: "GlobalImage"
  index({ _id:1 }, { unique: true, name:"id_index" })

  def template_base_css
    File.read("#{self.template_location}/base.css")
  end

  def template_menu_css
    File.read("#{self.template_location}/menu.css")
  end  
end
